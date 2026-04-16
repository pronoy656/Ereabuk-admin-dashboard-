"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import VideoWorkspace from '@/components/call/VideoWorkspace';
import SessionSidebar from '@/components/call/SessionSidebar';
import { useRealTimeCall } from '@/hooks/useRealTimeCall';

export default function CallPage() {
  const router = useRouter();

  // MOCKED PARAMS for Prototype
  const MOCK_AGORA_APP_ID = "YOUR_AGORA_APP_ID"; // Replace later with API or env variables.
  const MOCK_CHANNEL = "test_channel";

  const {
    joined,
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    leaveCall
  } = useRealTimeCall({
    appId: MOCK_AGORA_APP_ID,
    channel: MOCK_CHANNEL,
    token: null, // As requested for development mode
    uid: null
  });

  // Extract the first remote user video track theoretically playing just to demonstrate 1x1 UX in the workspace
  const firstRemoteUser = Object.values(remoteUsers)[0];

  const handleEndCall = () => {
    leaveCall();
    // Redirect back to dashboard safely
    router.back();
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col md:flex-row bg-slate-50 animate-in fade-in duration-500">
      
      {/* 🎥 Left Section (Video) */}
      <VideoWorkspace 
        localVideoTrack={localVideoTrack}
        remoteVideoTrack={firstRemoteUser?.video}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        leaveCall={handleEndCall}
        joined={joined}
      />

      {/* 📊 Right Section (Context & Transcription) */}
      <SessionSidebar />

    </div>
  );
}
