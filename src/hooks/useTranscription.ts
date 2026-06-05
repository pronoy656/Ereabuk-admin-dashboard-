"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

export interface TranscriptLine {
  speaker: string;
  text: string;
  source?: 'local' | 'stt' | 'relay' | 'history' | 'system';
}

interface UseTranscriptionProps {
  consultationId: string | null;
  sessionId: string | null;
  enabled?: boolean;
  onAutoEnd?: () => void;
}

/**
 * Derive the Socket.io server URL from the REST API base URL.
 * e.g. "http://10.10.7.106:5000/api/v1" → "http://10.10.7.106:5000"
 */
function getSocketUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://10.10.7.106:5000/api/v1';
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return 'http://10.10.7.106:5000';
  }
}

export function useTranscription({
  consultationId,
  sessionId,
  enabled = true,
  onAutoEnd,
}: UseTranscriptionProps) {
  // ── state ──────────────────────────────────────────────────────────
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([
    {
      speaker: 'System',
      text: 'Session started. Recording and transcription enabled.',
      source: 'system',
    },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [sttActive, setSttActive] = useState(false);
  const [clientInterim, setClientInterim] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const processedRef = useRef<Set<string>>(new Set());

  // ── Socket.io connection ───────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !consultationId) return;

    const token = Cookies.get('accessToken');
    if (!token) {
      console.warn('🔌 No auth token – skipping socket connection');
      return;
    }

    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to socket at:', socketUrl);

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌✅ Socket connected for live transcription, id:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('🔌⚠️ Socket connection error:', err.message);
    });

    // ── Agora STT: transcript:new ──────────────────────────────────
    socket.on(
      'transcript:new',
      (data: {
        consultationId: string;
        speakerUid: number;
        speakerRole: string;
        text: string;
        isFinal: boolean;
        timestamp: string;
      }) => {
        console.log('📝 STT transcript received:', data);

        // Only process transcripts for THIS consultation
        if (data.consultationId !== consultationId) return;

        // Skip consultant's own voice – local speech‑rec handles it
        if (data.speakerUid === 2001) return;

        // Non‑final → show as "Client typing…" indicator
        if (!data.isFinal) {
          setClientInterim(data.text);
          return;
        }

        // Deduplicate
        const key = `stt-${data.timestamp}-${data.text.substring(0, 40)}`;
        if (processedRef.current.has(key)) return;
        processedRef.current.add(key);

        setSttActive(true);
        setClientInterim(''); // clear interim

        if (data.text.trim()) {
          setTranscripts((prev) => [
            ...prev,
            { speaker: 'Client', text: data.text, source: 'stt' },
          ]);
        }
      },
    );

    // ── Peer relay: receive-speech ─────────────────────────────────
    socket.on(
      'receive-speech',
      (data: { speaker: string; text: string; sessionId: string }) => {
        console.log('📥 Received speech relay:', data);

        if (data.text?.trim()) {
          setTranscripts((prev) => [
            ...prev,
            { speaker: data.speaker || 'Client', text: data.text, source: 'relay' },
          ]);
        }
      },
    );

    // ── System auto-end ────────────────────────────────────────────
    socket.on('consultation-auto-ended', () => {
      console.log('⏹️ Consultation auto-ended by system');
      setTranscripts((prev) => [
        ...prev,
        {
          speaker: 'System',
          text: 'Session ended automatically by the system.',
          source: 'system',
        },
      ]);
      if (onAutoEnd) {
        onAutoEnd();
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [consultationId, enabled]);

  // ── Fetch transcript history on mount ──────────────────────────────
  useEffect(() => {
    if (!consultationId || !enabled) return;

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/transcription/${consultationId}/history`);
        const history = res.data?.data || res.data || [];

        if (Array.isArray(history) && history.length > 0) {
          const historyLines: TranscriptLine[] = history
            .filter((item: any) => item.isFinal && item.text?.trim())
            .map((item: any) => ({
              speaker: item.speakerUid === 2001 ? 'You' : 'Client',
              text: item.text,
              source: 'history' as const,
            }));

          if (historyLines.length > 0) {
            setTranscripts((prev) => {
              const systemMsgs = prev.filter((t) => t.source === 'system');
              return [...systemMsgs, ...historyLines];
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch transcript history:', err);
      }
    };

    fetchHistory();
  }, [consultationId, enabled]);

  // ── Send local speech to the other party via socket relay ──────────
  const sendSpeech = useCallback(
    (text: string) => {
      const socket = socketRef.current;
      if (!socket?.connected || !sessionId) {
        console.warn('📤 Cannot send speech: socket not connected or no sessionId');
        return;
      }
      socket.emit('send-speech', { sessionId, text });
      console.log('📤 Sent speech relay via socket:', text.substring(0, 50));
    },
    [sessionId],
  );

  // ── Add a transcript line from a local source ──────────────────────
  const addLocalTranscript = useCallback((speaker: string, text: string) => {
    setTranscripts((prev) => [
      ...prev,
      { speaker, text, source: 'local' },
    ]);
  }, []);

  return {
    transcripts,
    isConnected,
    sttActive,
    clientInterim,
    sendSpeech,
    addLocalTranscript,
  };
}
