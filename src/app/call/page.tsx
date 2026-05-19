"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoWorkspace from '@/components/call/VideoWorkspace';
import SessionSidebar from '@/components/call/SessionSidebar';
import { useRealTimeCall } from '@/hooks/useRealTimeCall';
import api from '@/lib/axios';

function CallPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('consultationId');

  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    token: string;
    channelName: string;
    appId: string;
  } | null>(null);

  const [consultationDetails, setConsultationDetails] = useState<{
    topic: string;
    context: string;
    notes: string;
    clientName: string;
    clientRole: string;
    clientImage: string | null;
    clientInitials: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!consultationId) {
      setError("No consultation ID provided.");
      setIsLoading(false);
      return;
    }

    const initializeSession = async () => {
      try {
        setIsLoading(true);
        let sessionId: string | null = null;
        let resData: any = null;

        // Step 1: Create session or Fetch existing if duplicate
        try {
          const createRes = await api.post('/video-session', { consultationId });
          console.log("Create session response:", createRes.data);
          resData = createRes.data?.data || createRes.data;
          sessionId = resData?.sessionId || resData?.id || resData?._id || resData?.session?.sessionId || resData?.session?.id || resData?.session?._id;
        } catch (createErr: any) {
          const errMsg = createErr.response?.data?.message || createErr.message || "";
          console.warn("Create session failed (checking for existing session):", errMsg);
          
          // Fallback: If session already exists (E11000 duplicate key), fetch active sessions
          if (errMsg.includes('E11000') || errMsg.includes('duplicate') || createErr.response?.status === 400 || createErr.response?.status === 409 || createErr.response?.status === 500) {
            const listRes = await api.get('/video-session');
            console.log("List sessions response (fallback):", listRes.data);
            const sessions = listRes.data?.data || listRes.data;
            if (Array.isArray(sessions)) {
              const existing = sessions.find((s: any) => 
                s.consultation === consultationId || 
                s.consultation?._id === consultationId || 
                s.consultationId === consultationId
              );
              if (existing) {
                console.log("Found existing video session:", existing);
                resData = existing;
                sessionId = existing.sessionId || existing.id || existing._id;
              }
            }
          }
          
          if (!sessionId) {
            throw createErr; // Re-throw original error if fallback didn't find it
          }
        }

        if (!sessionId) {
          throw new Error(`Could not extract sessionId for consultation: ${consultationId}`);
        }

        // Step 2: Join session to start billing
        const joinRes = await api.post('/video-session/join', { sessionId });
        console.log("Join session response:", joinRes.data);
        
        const joinData = joinRes.data?.data || joinRes.data;
        const token = joinData?.token || resData?.token || joinData?.session?.token;
        const channelName = joinData?.channelName || resData?.channelName || joinData?.session?.channelName;
        const appId = joinData?.appId || resData?.appId || joinData?.session?.appId;

        setSessionData({
          sessionId,
          token,
          channelName,
          appId: appId || process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
        });

        // Step 3: Fetch real consultation details (Notes, Client Name, Topic)
        try {
          const bookingsRes = await api.get('/consultation/my-bookings');
          const allBookings = bookingsRes.data?.data || bookingsRes.data;
          if (Array.isArray(allBookings)) {
            const currentBooking = allBookings.find((b: any) => b._id === consultationId || b.id === consultationId);
            if (currentBooking) {
              const clientName = currentBooking.user?.name || currentBooking.name || "Client User";
              const clientImage = currentBooking.user?.image || currentBooking.user?.avatar || currentBooking.image || null;
              const initials = clientName.charAt(0).toUpperCase();
              
              setConsultationDetails({
                topic: (currentBooking.bookingType || "Consultation").toUpperCase() + " BOOKING",
                context: currentBooking.notes ? `Consultation scheduled for ${currentBooking.bookingType} request.` : "Reviewing consultation details and client requirements.",
                notes: currentBooking.notes || "No additional private notes provided by the client.",
                clientName: clientName,
                clientRole: "Client",
                clientImage: clientImage,
                clientInitials: initials
              });
            }
          }
        } catch (bookingErr) {
          console.warn("Failed to fetch booking details for sidebar:", bookingErr);
        }
      } catch (err: any) {
        console.error("Error initializing session:", err);
        setError(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to initialize video session.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [consultationId]);

  const {
    joined,
    localVideoTrack,
    remoteUsers,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    leaveCall,
    mediaError
  } = useRealTimeCall({
    appId: sessionData?.appId || "",
    channel: sessionData?.channelName || "",
    token: sessionData?.token || null,
    uid: null
  });

  const firstRemoteUser = Object.values(remoteUsers)[0];

  const handleEndCall = async () => {
    if (sessionData?.sessionId) {
      try {
        await api.post('/video-session/end', { sessionId: sessionData.sessionId });
      } catch (error) {
        console.error("Failed to end session gracefully:", error);
      }
    }
    if (consultationId) {
      try {
        await api.patch(`/consultation/status/${consultationId}`, { status: 'completed' });
      } catch (statusErr) {
        console.error("Failed to update consultation status to completed:", statusErr);
      }
    }
    leaveCall();
    // Redirect back to dashboard safely
    router.back();
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
           <p>Initializing secure session...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    const isEnded = error?.toLowerCase().includes('ended');
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white p-4 select-none">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center gap-5 text-center max-w-md w-full shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-2 font-bold text-3xl shadow-inner ${isEnded ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
             {isEnded ? "🔒" : "!"}
           </div>
           <h2 className="text-2xl font-bold text-white tracking-wide">
             {isEnded ? "Session Closed" : "Session Error"}
           </h2>
           <p className="text-slate-300 text-sm leading-relaxed mb-4">
             {isEnded 
               ? "This consultation session has already been completed and closed. You cannot rejoin an ended session."
               : (error || "Failed to initialize secure video session.")
             }
           </p>
           <button 
             onClick={() => router.back()}
             className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 text-white cursor-pointer"
           >
             Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

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
        mediaError={mediaError}
      />

      {/* 📊 Right Section (Context & Transcription) */}
      <SessionSidebar consultationDetails={consultationDetails} />

    </div>
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <CallPageContent />
    </Suspense>
  );
}
