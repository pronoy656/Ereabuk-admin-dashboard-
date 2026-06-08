"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import api from '@/lib/axios';

export interface UseRealTimeCallProps {
  appId: string;
  channel: string;
  token: string | null;
  uid?: string | number | null;
  consultationId?: string | null;
}

export function useRealTimeCall({ appId, channel, token, uid = null, consultationId = null }: UseRealTimeCallProps) {
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');

  // Track remote users
  const [remoteUsers, setRemoteUsers] = useState<Record<string, { video?: IRemoteVideoTrack, audio?: IRemoteAudioTrack }>>({});

  // Mute states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Use refs for stable cleanup closures in Strict Mode
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);

  useEffect(() => {
    let mounted = true;
    let AgoraRTC: any;

    const initCall = async () => {
      // Avoid starting the pipeline if unmounted or already connected
      if (!mounted) return;

      // Native browser media check requested by USER for debugging
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            console.log("✅ CAMERA/MIC WORKING");
            console.log(stream);
          })
          .catch(err => {
            console.log("❌ ERROR OCCURRED:", err.name, err.message);
          });
      } else {
        console.log("❌ ERROR OCCURRED: navigator.mediaDevices is undefined (likely non-secure HTTP context)");
      }

      const AgoraMod = await import('agora-rtc-sdk-ng');
      AgoraRTC = AgoraMod.default;

      if (!clientRef.current) {
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      }

      const client = clientRef.current!;

      // Handle connection state changes
      client.on('connection-state-change', (curState, revState, reason) => {
        console.log(
          `%c🌐 AGORA CONNECTION STATE CHANGED: ${revState} -> ${curState} (Reason: ${reason || 'N/A'})`,
          'color: #ffffff; background: #8B5CF6; font-weight: bold; font-size: 13px; padding: 4px; border-radius: 4px;'
        );
        if (mounted) setConnectionState(curState);
      });

      // Handle remote users joining/publishing
      client.on('user-joined', (user) => {
        console.log(
          `%c🟢 AGORA USER-JOINED: User ${user.uid} has entered the channel`,
          'color: #ffffff; background: #10B981; font-weight: bold; font-size: 14px; padding: 4px; border-radius: 4px;'
        );
        
        if (user.uid.toString() === '9001') {
          console.log("%c🤖 STT BOT DETECTED: Agora STT Service is now active in this channel.", "color: #ffffff; background: #7C3AED; font-weight: bold; padding: 4px; border-radius: 4px;");
        }

        if (!mounted) return;
        setRemoteUsers(prev => ({
          ...prev,
          [user.uid]: prev[user.uid] || {}
        }));
      });

      client.on('user-published', async (user, mediaType) => {
        console.log(
          `%c📡 AGORA USER-PUBLISHED: User ${user.uid} published [${mediaType}]`,
          'color: #ffffff; background: #3B82F6; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;'
        );
        await client.subscribe(user, mediaType);
        console.log(
          `%c✅ AGORA SUBSCRIBED: Subscribed to ${user.uid}'s [${mediaType}] track successfully`,
          'color: #ffffff; background: #059669; font-weight: bold; font-size: 13px; padding: 3px; border-radius: 4px;'
        );

        if (!mounted) return;

        setRemoteUsers(prev => ({
          ...prev,
          [user.uid]: {
            ...prev[user.uid],
            video: mediaType === 'video' ? user.videoTrack : prev[user.uid]?.video,
            audio: mediaType === 'audio' ? user.audioTrack : prev[user.uid]?.audio,
          }
        }));

        if (mediaType === 'audio') {
          console.log(`%c🎤 AUDIO TRACK FOUND: Playing remote audio track for user ${user.uid}...`, 'color: #ffffff; background: #D97706; padding: 2px; border-radius: 2px;');
          user.audioTrack?.play();
        } else if (mediaType === 'video') {
          console.log(`%c🎥 VIDEO TRACK FOUND: Remote video track loaded for user ${user.uid}.`, 'color: #ffffff; background: #2563EB; padding: 2px; border-radius: 2px;');
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        console.log(
          `%c📡 AGORA USER-UNPUBLISHED: User ${user.uid} stopped publishing [${mediaType}]`,
          'color: #1F2937; background: #F3F4F6; font-weight: bold; font-size: 12px; padding: 3px; border-radius: 4px;'
        );
        if (!mounted) return;
        if (mediaType === 'audio' && typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        setRemoteUsers(prev => {
          const updated = { ...prev };
          if (updated[user.uid]) {
            if (mediaType === 'video') delete updated[user.uid].video;
            if (mediaType === 'audio') delete updated[user.uid].audio;
          }
          return updated;
        });
      });

      client.on('user-left', (user) => {
        console.log(
          `%c🔴 AGORA USER-LEFT: User ${user.uid} has left the channel`,
          'color: #ffffff; background: #EF4444; font-weight: bold; font-size: 14px; padding: 4px; border-radius: 4px;'
        );
        if (!mounted) return;
        if (typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        setRemoteUsers(prev => {
          const updated = { ...prev };
          delete updated[user.uid];
          return updated;
        });
      });

      // Listen for Agora DataStream / WebSocket live transcription messages from Agora STT bot
       client.on('stream-message', async (uid, payload) => {
         console.log(`📥 Received stream message from UID: ${uid}`);
         
         // 1. Only process if it's from the STT bot (UID 9001)
         if (uid.toString() !== '9001') {
           console.log(`ℹ️ Ignoring stream message from non-STT source (UID: ${uid})`);
           return;
         }

         try {
           const textDecoder = new TextDecoder('utf-8');
           const decoded = textDecoder.decode(payload);
           console.log("📥 STT BOT RAW PAYLOAD:", decoded);
           
           const result = JSON.parse(decoded);
           console.log("📥 STT BOT PARSED JSON:", result);
          
          // result structure: { uid, text, isFinal, timestamp }
          // where result.uid is the speaker's UID (1001 or 2001)

          if (consultationId && result.text) {
            // Forward to the backend so it can persist + fan out via Socket.IO
            api.post(`/transcription/${consultationId}/ingest`, {
              uid: result.uid,        // 1001 (client) or 2001 (consultant)
              text: result.text,
              isFinal: result.isFinal,
              timestamp: result.timestamp,
            }).catch(err => {
              console.error('Failed to relay transcript chunk:', err);
            });

            // Dispatch local event for immediate (optimistic) UI if needed
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('agora-realtime-transcription', {
                detail: { 
                  speaker: result.uid === 2001 ? "You" : "Client", 
                  text: result.text,
                  isFinal: result.isFinal,
                  timestamp: result.timestamp
                }
              }));
            }
          }
        } catch (e) {
          console.warn("❌ Failed to decode/parse STT stream message:", e);
        }
      });

      try {
        // Native stream check requested by USER to verify camera/mic access before Agora joins
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          console.log("✅ STREAM GOT:", stream);
        } catch (err: any) {
          console.log("❌ CAMERA ERROR:", err?.name, err?.message);
        }

        if (!appId || !channel) {
          console.warn("Agora connection aborted: Missing required credentials.", { appId, channel, token });
          return;
        }

        if (client.connectionState === 'DISCONNECTED') {
          await client.join(appId, channel, token, uid);
        }

        if (!mounted) return;

        // Setup local tracks safely maintaining refs (Works completely offline!)
        try {

          if (!localAudioRef.current) {
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            localAudioRef.current = audioTrack;
            setLocalAudioTrack(audioTrack);
          }

          if (!localVideoRef.current) {
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            localVideoRef.current = videoTrack;
            setLocalVideoTrack(videoTrack);
          }
          setMediaError(null);
        } catch (mediaErr: any) {
          console.error("Media Device Error:", mediaErr);
          let errorMsg = "Could not access camera or microphone. Please ensure permissions are granted.";
          if (typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            errorMsg = "Camera/Microphone access is blocked by your browser because you are accessing via HTTP on a non-localhost IP. Please access via http://localhost:3000 or use HTTPS.";
          } else if (mediaErr.name === 'NotAllowedError' || mediaErr.name === 'PermissionDeniedError') {
            errorMsg = "Camera or Microphone permission was denied by your browser. Please click the site settings icon in the URL bar and allow access.";
          } else if (mediaErr.name === 'NotFoundError' || mediaErr.name === 'DeviceNotFoundError') {
            errorMsg = "No camera or microphone device found on your system. Please plug in a device and retry.";
          } else if (mediaErr.name === 'NotReadableError' || mediaErr.name === 'TrackStartError') {
            errorMsg = "Your camera or microphone is currently busy or being used by another application (e.g., Zoom, Teams). Please close other apps and retry.";
          }
          setMediaError(errorMsg);
        }

        // Ensure not attempting to publish if already published or running locally offline
        const publishPayload = [];
        if (localAudioRef.current) publishPayload.push(localAudioRef.current);
        if (localVideoRef.current) publishPayload.push(localVideoRef.current);

        if (publishPayload.length > 0) {
          await client.publish(publishPayload);
        }

        if (mounted) setJoined(true);
      } catch (err) {
        // Protect against strict-double mount aborts
        console.warn("Agora connection cycle error:", err);
      }
    };

    // Always run initCall so native camera/mic checks execute immediately
    setTimeout(() => {
      if (mounted) initCall();
    }, 50);

    return () => {
      mounted = false;
      const cleanup = async () => {
        if (typeof window !== 'undefined' && (window as any)._remoteVadInterval) {
          clearInterval((window as any)._remoteVadInterval);
        }
        if (localAudioRef.current) {
          localAudioRef.current.stop();
          localAudioRef.current.close();
          localAudioRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.stop();
          localVideoRef.current.close();
          localVideoRef.current = null;
        }
        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          if (clientRef.current.connectionState !== 'DISCONNECTED') {
            try { await clientRef.current.leave(); } catch (e) { /* ignore */ }
          }
        }
      };
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, channel, token, uid, consultationId]); // Ignore track deps to avoid rebuild loops

  // Periodic audit and debug logs
  useEffect(() => {
    const interval = setInterval(() => {
      const client = clientRef.current;
      if (!client) return;

      const remoteUsersArray = client.remoteUsers;
      console.log(`%c🕒 [PERIODIC AUDIT] AppID: ${appId} | Channel: ${channel} | My UID: ${uid} | Connection: ${client.connectionState} | Remote Users: ${remoteUsersArray.length}`, 'color: #6B7280; font-size: 11px;');

      if (remoteUsersArray.length === 0) {
        console.log("%cℹ️ No remote users detected in Agora channel yet.", "color: #9CA3AF; font-style: italic; font-size: 10px;");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [appId, channel, uid]); // Added dependencies to fix stale closure in logs

  const toggleMute = async () => {
    if (localAudioTrack) {
      try {
        await localAudioTrack.setMuted(!isMuted);
        setIsMuted(prev => !prev);
      } catch (e) {
        console.error("Failed to toggle mute", e);
      }
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      try {
        await localVideoTrack.setMuted(!isVideoOff);
        setIsVideoOff(prev => !prev);
      } catch (e) {
        console.error("Failed to toggle video", e);
      }
    }
  };

  const sendTranscript = useCallback(async (text: string, speaker: string = "Consultant") => {
    const client = clientRef.current as any;
    if (!client || client.connectionState !== 'CONNECTED') {
      console.warn("Cannot send transcript: Agora client is not connected.");
      return;
    }
    try {
      const payload = JSON.stringify({ speaker, text });
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);

      await client.sendStreamMessage(data);
      console.log("Sent transcription stream message:", { speaker, text });
    } catch (err) {
      console.warn("Failed to send transcription stream message:", err);
    }
  }, []);

  const leaveCall = async () => {
    if (localAudioRef.current) {
      localAudioRef.current.stop();
      localAudioRef.current.close();
    }
    if (localVideoRef.current) {
      localVideoRef.current.stop();
      localVideoRef.current.close();
    }
    if (clientRef.current) {
      try { await clientRef.current.leave(); } catch (e) { /* ignore */ }
    }
    setJoined(false);
  };

  return {
    joined,
    connectionState,
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    leaveCall,
    mediaError,
    sendTranscript
  };
}
