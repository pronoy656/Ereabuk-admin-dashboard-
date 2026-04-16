"use client";

import { useState, useEffect, useRef } from 'react';
import type { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';

export interface UseRealTimeCallProps {
  appId: string;
  channel: string;
  token: string | null;
  uid?: string | number | null;
}

export function useRealTimeCall({ appId, channel, token, uid = null }: UseRealTimeCallProps) {
  const [joined, setJoined] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  
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
      
      const AgoraMod = await import('agora-rtc-sdk-ng');
      AgoraRTC = AgoraMod.default;

      if (!clientRef.current) {
         clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      }

      const client = clientRef.current!;

      // Handle remote users joining/publishing
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
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
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (!mounted) return;
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
        if (!mounted) return;
        setRemoteUsers(prev => {
           const updated = { ...prev };
           delete updated[user.uid];
           return updated;
        });
      });

      try {
        // Strict Mode connection safety check + Mock Backend Bypass Check
        const isMockId = appId === "YOUR_AGORA_APP_ID";
        
        if (!isMockId && client.connectionState === 'DISCONNECTED') {
            await client.join(appId, channel, token, uid);
        }
        
        if (!mounted) return;
        
        // Setup local tracks safely maintaining refs (Works completely offline!)
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
        
        // Ensure not attempting to publish if already published or running locally offline
        if (!isMockId) {
           const publishPayload = [];
           if (localAudioRef.current) publishPayload.push(localAudioRef.current);
           if (localVideoRef.current) publishPayload.push(localVideoRef.current);
           await client.publish(publishPayload);
        }

        if (mounted) setJoined(true);
      } catch (err) {
        // Protect against strict-double mount aborts
        console.warn("Agora connection cycle error:", err);
      }
    };

    if (appId) {
      // De-bounce initial load to survive React 18 simultaneous Unmount/Mount
      setTimeout(() => {
        if (mounted) initCall();
      }, 50);
    }

    return () => {
      mounted = false;
      const cleanup = async () => {
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
  }, [appId, channel]); // Ignore track deps to avoid rebuild loops

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
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    leaveCall
  };
}
