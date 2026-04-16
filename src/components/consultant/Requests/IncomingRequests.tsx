"use client";

import React, { useState, useEffect } from 'react';
import { Video, Calendar, PhoneCall, User, Clock, Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RequestData {
  id: string;
  tabType: "Instant" | "Schedule" | "Callback";
  name: string;
  requestType: string;
  time: string;
  scheduledAt?: number; // timestamp for countdown
  notes: string;
  status: "pending" | "accepted";
}

// Ensure mock timestamps generate relative to the immediate time of runtime
const currentTs = Date.now();

const initialRequests: RequestData[] = [
  {
    id: "REQ-001",
    tabType: "Instant",
    name: "David Smith",
    requestType: "Quick Advice",
    time: "Right Now",
    scheduledAt: currentTs, // Ready immediately
    notes: "Urgent question regarding property law.",
    status: "pending"
  },
  {
    id: "REQ-002",
    tabType: "Instant",
    name: "Sarah Jenkins",
    requestType: "Tax Consultation",
    time: "Right Now",
    scheduledAt: currentTs,
    notes: "Need immediate assistance filing an extension.",
    status: "pending"
  },
  {
    id: "REQ-003",
    tabType: "Schedule",
    name: "Michael Chang",
    requestType: "Contract Review",
    time: "In 15 seconds", // Giving a fast scenario to test the live transition to 'Join Call'
    scheduledAt: currentTs + 15 * 1000, 
    notes: "Reviewing vendor agreement for new startup.",
    status: "pending"
  },
  {
    id: "REQ-004",
    tabType: "Schedule",
    name: "Elena Rodriguez",
    requestType: "General Legal",
    time: "In 3 minutes", // Short minutes delay
    scheduledAt: currentTs + 3 * 60 * 1000,
    notes: "Discussing LLC formation.",
    status: "pending"
  },
  {
    id: "REQ-005",
    tabType: "Schedule",
    name: "Amanda Lee",
    requestType: "Immigration",
    time: "In 2 hours", // Hours delay
    scheduledAt: currentTs + 2 * 60 * 60 * 1000,
    notes: "Visa renewal process questions.",
    status: "pending"
  },
  {
    id: "REQ-006",
    tabType: "Schedule",
    name: "Robert Black",
    requestType: "Real Estate",
    time: "In 3 days", // Days delay
    scheduledAt: currentTs + 3 * 24 * 60 * 60 * 1000,
    notes: "Closing document evaluation.",
    status: "pending"
  },
  {
    id: "REQ-007",
    tabType: "Callback",
    name: "Jessica Alba",
    requestType: "Follow-up",
    time: "As soon as possible",
    scheduledAt: currentTs,
    notes: "Missed your previous call, please ring back.",
    status: "pending"
  }
];

// Helper Component to handle independent Live Countdowns and State Transitions for accepted requests
const AcceptedActionState = ({ req }: { req: RequestData }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Only schedule interval logic if it's a future scheduled event
    if (req.tabType !== "Schedule" || !req.scheduledAt || req.scheduledAt <= now) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // Evaluate every second to handle the UI transition smoothly

    return () => clearInterval(interval);
  }, [req, now]);

  // If it's a schedule and the time hasn't arrived
  if (req.tabType === "Schedule" && req.scheduledAt && req.scheduledAt > now) {
    const diffMs = req.scheduledAt - now;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let displayMsg = "";
    if (diffDay > 0) {
      displayMsg = `Join in ${diffDay} day${diffDay > 1 ? 's' : ''}`;
    } else if (diffHour > 0) {
      displayMsg = `Join in ${diffHour} hour${diffHour > 1 ? 's' : ''}`;
    } else if (diffMin > 0) {
      displayMsg = `Join in ${diffMin} min${diffMin > 1 ? 's' : ''}`;
    } else {
      displayMsg = `Join in ${diffSec} sec${diffSec !== 1 ? 's' : ''}`;
    }

    return (
      <button
        disabled
        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-500 px-8 py-2.5 rounded-xl text-sm font-bold opacity-80 cursor-not-allowed animate-in zoom-in duration-300"
      >
        <Clock className="w-4 h-4" /> {displayMsg}
      </button>
    );
  }

  // Once the time arrives (or if it's an Instant/Callback default)
  return (
    <button
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 animate-in zoom-in duration-300"
    >
      {req.tabType === "Callback" ? <PhoneCall className="w-4 h-4" /> : <Video className="w-4 h-4" />} 
      {req.tabType === "Callback" ? "Call Now" : "Join Call"}
    </button>
  );
};


export default function IncomingRequests() {
  const [requests, setRequests] = useState<RequestData[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<"Instant" | "Schedule" | "Callback">("Instant");

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" } : r));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const instantCount = requests.filter(r => r.tabType === "Instant" && r.status === "pending").length;
  const scheduleCount = requests.filter(r => r.tabType === "Schedule" && r.status === "pending").length;
  const callbackCount = requests.filter(r => r.tabType === "Callback" && r.status === "pending").length;

  const currentRequests = requests.filter(r => r.tabType === activeTab);

  return (
    <div className="w-full mx-auto space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Requests</h1>
        <p className="text-slate-500 mt-1 font-medium text-[15px]">
          Manage your consultation requests and bookings.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Custom Tabs Navigation */}
        <div className="flex flex-col sm:flex-row border-b border-slate-100 px-2 sm:px-6">
          <button
            onClick={() => setActiveTab("Instant")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors",
              activeTab === "Instant"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <Video className="w-4 h-4" />
            Instant Requests
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "Instant" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {instantCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Schedule")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors",
              activeTab === "Schedule"
                ? "text-blue-500 border-blue-500"
                : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <Calendar className="w-4 h-4" />
            Schedule Bookings
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "Schedule" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {scheduleCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Callback")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-[14px] font-bold border-b-2 transition-colors",
              activeTab === "Callback"
               ? "text-blue-500 border-blue-500"
               : "text-slate-500 hover:text-slate-700 border-transparent"
            )}
          >
            <PhoneCall className="w-4 h-4" />
            Callback Requests
            <span className={cn(
              "text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold",
              activeTab === "Callback" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            )}>
              {callbackCount}
            </span>
          </button>
        </div>

        {/* Requests List */}
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[400px]">
          {currentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No pending requests in this category.</p>
            </div>
          ) : (
            currentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side details */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{req.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {req.requestType}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {req.time}
                      </div>
                    </div>
                    <div className="inline-flex max-w-lg mt-1">
                      <p className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[13px] text-slate-600">
                        <strong className="text-slate-800">Notes: </strong>{req.notes}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-row md:flex-col gap-3 shrink-0 self-start md:self-center w-full md:w-auto">
                  {req.status === "accepted" ? (
                      <AcceptedActionState req={req} />
                    ) : (
                      <>
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                   )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
