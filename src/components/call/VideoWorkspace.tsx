"use client";

import React, { useEffect, useRef } from 'react';
import { ICameraVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { Mic, MicOff, VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

interface VideoWorkspaceProps {
  localVideoTrack: ICameraVideoTrack | null;
  remoteVideoTrack: IRemoteVideoTrack | undefined;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  leaveCall: () => void;
  joined: boolean;
  mediaError?: string | null;
  hasRemoteUserJoined: boolean;
}

export default function VideoWorkspace({
  localVideoTrack,
  remoteVideoTrack,
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  leaveCall,
  joined,
  mediaError,
  hasRemoteUserJoined
}: VideoWorkspaceProps) {
  
  // Containers for rendering Agora feeds
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // Bind Local Track
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack]);

  // Bind Remote Track
  useEffect(() => {
    if (remoteVideoTrack && remoteVideoRef.current) {
      remoteVideoTrack.play(remoteVideoRef.current);
    }
    return () => {
      remoteVideoTrack?.stop();
    };
  }, [remoteVideoTrack]);

  return (
    <div className="flex-1 bg-slate-900 relative flex flex-col items-center justify-center min-h-[50vh] lg:min-h-screen border-r border-slate-800 shrink-0">
      
      {/* Media Device Error Banner */}
      {mediaError && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-red-500/90 text-white px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border border-red-400 flex items-center gap-3 max-w-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 font-bold text-base">
            !
          </div>
          <p className="text-xs font-semibold leading-relaxed">{mediaError}</p>
        </div>
      )}

      {/* Remote Video Container (Main) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8">
        {!joined ? (
           <div className="text-slate-400 font-medium text-lg animate-pulse flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
             Connecting...
           </div>
        ) : !hasRemoteUserJoined ? (
           <div className="text-slate-400 font-medium flex flex-col items-center gap-3">
             <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
               <VideoOff className="w-8 h-8 text-slate-500" />
             </div>
             Waiting for others to join...
           </div>
        ) : !remoteVideoTrack ? (
           <div className="text-slate-400 font-medium flex flex-col items-center gap-4 text-center max-w-sm animate-in fade-in zoom-in-95 duration-300">
             <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-700/65 flex items-center justify-center shadow-2xl relative">
               <VideoOff className="w-10 h-10 text-slate-400" />
               <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Connected" />
             </div>
             <div>
               <p className="text-slate-200 font-bold text-lg leading-snug">
                 Participant has turned off their camera
               </p>
               <p className="text-slate-500 text-xs mt-1">
                 You can still communicate via voice chat
               </p>
             </div>
           </div>
        ) : (
           <div ref={remoteVideoRef} className="w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl relative">
              {/* Optional UI overlay for remote user */}
              <div className="absolute bottom-6 left-6 z-10 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md text-white text-sm font-semibold">
                Client (Mobile)
              </div>
           </div>
        )}
      </div>

      {/* Local Video Container (PIP) */}
      <div className="absolute top-8 right-8 w-48 aspect-[3/4] bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50 z-20">
         {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
               <VideoOff className="w-8 h-8 text-slate-500" />
            </div>
         ) : (
            <div ref={localVideoRef} className="w-full h-full object-cover"></div>
         )}
         <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold backdrop-blur-md">
           You
         </div>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-full border border-white/20 z-30 shadow-2xl">
         <button 
           onClick={toggleMute}
           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-700/80 text-white hover:bg-slate-600'}`}
         >
           {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
         </button>

         <button 
           onClick={toggleVideo}
           className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-700/80 text-white hover:bg-slate-600'}`}
         >
           {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
         </button>

         <button 
           onClick={leaveCall}
           className="w-16 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-transform active:scale-95 px-6"
         >
           <PhoneOff className="w-5 h-5" />
         </button>
      </div>

    </div>
  );
}
