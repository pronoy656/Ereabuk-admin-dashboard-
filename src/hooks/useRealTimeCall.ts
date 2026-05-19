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
  const [mediaError, setMediaError] = useState<string | null>(null);
  
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

      // Listen for Agora DataStream / WebSocket live transcription messages from mobile app
      client.on('stream-message', (uid, payload) => {
        try {
          const textDecoder = new TextDecoder();
          const decoded = textDecoder.decode(payload);
          const data = JSON.parse(decoded);
          if (data.text && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('agora-realtime-transcription', {
              detail: { speaker: data.speaker || `Client (${uid})`, text: data.text }
            }));
          }
        } catch (e) {
          console.warn("Failed to decode stream message:", e);
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

        if (!appId || !channel || !token) {
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
    leaveCall,
    mediaError
  };
}
