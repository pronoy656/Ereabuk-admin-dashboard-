"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, DollarSign, User, FileText, AlignLeft, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useAuth } from '@/context/AuthContext';

interface SessionSidebarProps {
  consultationDetails?: {
    topic?: string;
    context?: string;
    notes?: string;
    clientName?: string;
    clientRole?: string;
    clientImage?: string | null;
    clientInitials?: string;
  } | null;
  sendTranscript?: (text: string, speaker: string) => void;
}

export default function SessionSidebar({ consultationDetails, sendTranscript }: SessionSidebarProps = {}) {
  const { user } = useAuth();
  const [durationSec, setDurationSec] = useState(0);
  const [transcript, setTranscript] = useState<{ speaker: string, text: string }[]>([
    { speaker: "System", text: "Session started. Recording and transcription enabled." }
  ]);
  const [language, setLanguage] = useState('en-US');
  
  const details = consultationDetails || {
    topic: "Property Law Consultation",
    context: "Reviewing commercial lease agreement structure.",
    notes: "Client is extremely concerned about early termination clauses.",
    clientName: "David Smith",
    clientRole: "Client",
    clientImage: null,
    clientInitials: "D"
  };
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const handleTranscriptChange = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) {
      setTranscript(prev => [...prev, { speaker: "You", text }]);
      if (sendTranscript) {
        sendTranscript(text, user?.name || "Consultant");
      }
    }
  }, [sendTranscript, user?.name]);

  const {
    isListening,
    isSupported,
    error,
    interimTranscript,
    startListening,
    stopListening
  } = useSpeechRecognition({ language, onTranscriptChange: handleTranscriptChange });

  // Billing & Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setDurationSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Mock Earnings calculation ($1 per minute)
  const earnings = (durationSec / 60) * 1.0;

  // Cleanup transcription on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Auto-start local microphone transcription
  useEffect(() => {
    if (isSupported && !isListening) {
      startListening();
    }
  }, [isSupported, isListening, startListening]);

  // Listen for remote client transcription events from Agora DataStream / Web Audio API / VAD
  useEffect(() => {
    const handleRemoteTranscription = (e: any) => {
      if (e.detail?.text) {
        setTranscript(prev => [...prev, { speaker: e.detail.speaker || "Client", text: e.detail.text }]);
      }
    };
    window.addEventListener('agora-realtime-transcription', handleRemoteTranscription);
    return () => {
      window.removeEventListener('agora-realtime-transcription', handleRemoteTranscription);
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);


  return (
    <div className="w-full lg:w-[450px] shrink-0 bg-white border-l border-slate-100 flex flex-col h-full z-10 overflow-hidden shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
       
       {/* 1. Profile Panel */}
       <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden shrink-0 shadow-inner">
             {details.clientImage ? (
               <img src={details.clientImage} alt={details.clientName} className="w-full h-full object-cover" />
             ) : (
               details.clientInitials
             )}
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-900">{details.clientName}</h2>
             <span className="text-[13px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
               {details.clientRole}
             </span>
           </div>
         </div>
       </div>

       {/* 4. Live Metrics panel (Placed high for visibility) */}
       <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 bg-white">
         <div className="p-4 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
               <Clock className="w-3.5 h-3.5" /> Duration
            </div>
            <div className="text-2xl font-black text-slate-800 font-mono tracking-tight">
               {formatTime(durationSec)}
            </div>
         </div>
         <div className="p-4 flex flex-col items-center justify-center text-center gap-1">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
               <DollarSign className="w-3.5 h-3.5" /> Earnings
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono tracking-tight">
               ${earnings.toFixed(2)}
            </div>
         </div>
       </div>

       <div className="flex flex-col flex-1 overflow-hidden">
         
         {/* 2. Session Context details (Not scrollable) */}
         <div className="p-5 sm:p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
            
            {/* Unified Card Wrapper */}
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-5 relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2.5">
                   <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                     <FileText className="w-3.5 h-3.5 text-blue-600" /> 
                   </div>
                   Session Overview
                </h3>
              </div>

              <div className="space-y-5">
                 {/* Subject & Context Grouping */}
                 <div>
                   <h4 className="text-[15px] font-bold text-slate-800 tracking-tight mb-1">
                     {details.topic}
                   </h4>
                   <p className="text-[13px] leading-relaxed text-slate-500">
                     {details.context}
                   </p>
                 </div>

                 {/* Private Notes embedded within the card */}
                 <div className="bg-[#FFF8F3] border border-orange-100/50 rounded-xl p-3.5 flex gap-3">
                   <div className="shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-orange-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                   </div>
                   <div className="flex-1">
                     <h5 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">Private Note</h5>
                     <p className="text-[12.5px] text-orange-900 leading-relaxed font-medium">
                       {details.notes}
                     </p>
                   </div>
                 </div>
              </div>
            </div>

         </div>

         {/* 3. Live Transcript Array (Isolated Scrolling) */}
         <div className="flex flex-col h-full flex-1 overflow-hidden relative">
            <div className="px-6 py-4 flex items-center justify-between shrink-0 bg-white border-b border-slate-50 z-10 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                 <AlignLeft className="w-4 h-4 text-blue-500" /> Live Transcript
              </h3>
              
              <div className="flex items-center gap-2">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-[11px] font-medium border border-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-2 py-1.5 bg-white text-slate-700 cursor-pointer outline-none"
                >
                  <option value="en-US">English (US)</option>
                  <option value="bn-BD">Bengali (BD)</option>
                </select>

                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isListening 
                      ? "bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 relative" 
                      : "bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-500 border border-slate-200 hover:border-blue-200"
                  }`}
                  title={isListening ? "Stop listening" : "Start listening"}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-75"></span>
                  )}
                  {isListening ? <Mic className="w-4 h-4 relative z-10" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Scrollable messages container */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              {!isSupported && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2 shrink-0">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.</p>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700 flex items-start gap-2 shrink-0">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="flex-1 space-y-4 pb-4">
                {transcript.map((line, idx) => (
                  <div key={idx} className={`flex flex-col ${line.speaker === "You" ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">{line.speaker}</span>
                    <div className={`
                      max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed relative
                      ${line.speaker === "You" 
                        ? "bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-500/20" 
                        : line.speaker === "System" 
                        ? "bg-slate-100 text-slate-500 rounded-xl self-center text-center italic text-xs w-full max-w-full"
                        : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"}
                    `}>
                      {line.text}
                    </div>
                  </div>
                ))}
                
                {/* Interim Result */}
                {interimTranscript && (
                  <div className="flex flex-col items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">You (Speaking...)</span>
                    <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed relative bg-blue-500/80 text-white rounded-tr-sm shadow-md italic">
                      {interimTranscript}
                      <span className="inline-flex ml-1 gap-0.5">
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    </div>
                  </div>
                )}
                
                <div ref={transcriptEndRef} />
              </div>
            </div>
         </div>

       </div>
    </div>
  );
}
