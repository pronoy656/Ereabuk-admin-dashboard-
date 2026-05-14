"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Calendar, PhoneCall, User, Clock, Check, X, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RequestData {
  id: string;
  tabType: "Instant" | "Schedule" | "Callback";
  name: string;
  image?: string;
  requestType: string;
  time: string;
  scheduledAt?: number; // timestamp for countdown
  notes: string;
  status: "pending" | "accepted" | string;
}


// Helper Component to handle independent Live Countdowns and State Transitions for accepted requests
const AcceptedActionState = ({ req }: { req: RequestData }) => {
  const [now, setNow] = useState(Date.now());
  const router = useRouter();

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
      onClick={() => router.push('/call')}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-emerald-500/20 transition-transform active:scale-95 animate-in zoom-in duration-300"
    >
      {req.tabType === "Callback" ? <PhoneCall className="w-4 h-4" /> : <Video className="w-4 h-4" />} 
      {req.tabType === "Callback" ? "Call Now" : "Join Call"}
    </button>
  );
};


export default function IncomingRequests() {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Instant" | "Schedule" | "Callback">("Instant");
  const [counts, setCounts] = useState({ Instant: 0, Schedule: 0, Callback: 0 });

  const fetchAllCounts = async () => {
    try {
      const response = await api.get("/consultation/my-bookings");
      if (response.data.success) {
        const allData = response.data.data;
        setCounts({
          Instant: allData.filter((r: any) => r.bookingType === "instant" && r.status === "pending").length,
          Schedule: allData.filter((r: any) => r.bookingType === "scheduled" && r.status === "pending").length,
          Callback: allData.filter((r: any) => r.bookingType === "callback" && r.status === "pending").length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch counts", error);
    }
  };

  const fetchRequests = async (type: string) => {
    try {
      setLoading(true);
      const bookingTypeMap: any = {
        Instant: "instant",
        Schedule: "scheduled",
        Callback: "callback"
      };
      
      const response = await api.get("/consultation/my-bookings", {
        params: { bookingType: bookingTypeMap[type] }
      });

      if (response.data.success) {
        const mappedData = response.data.data.map((item: any) => {
          let timeDisplay = "Instant";
          let scheduledAt = new Date(item.createdAt).getTime();

          if (item.bookingType === "scheduled") {
            timeDisplay = `${item.startTime} - ${item.endTime}, ${format(new Date(item.date), 'MMM dd, yyyy')}`;
            if (item.date && item.startTime) {
              const datePart = item.date.split('T')[0];
              scheduledAt = new Date(`${datePart}T${item.startTime}:00`).getTime();
            }
          } else if (item.bookingType === "callback") {
            timeDisplay = item.preferredWindow || "Today";
          }

          return {
            id: item._id,
            tabType: type,
            name: item.user?.name || "Guest User",
            image: item.user?.image || item.user?.avatar,
            requestType: item.bookingType.charAt(0).toUpperCase() + item.bookingType.slice(1),
            time: timeDisplay,
            scheduledAt,
            notes: item.notes || "No additional notes.",
            status: item.status, // Keeping backend status
          };
        });
        setRequests(mappedData);
        
        // Update the count for the active tab specifically
        setCounts(prev => ({
           ...prev,
           [type]: mappedData.filter((r: any) => r.status === "pending").length
        }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const [processing, setProcessing] = useState<{ id: string, type: 'accept' | 'reject' } | null>(null);

  const handleStatusUpdate = async (id: string, status: string, type: 'accept' | 'reject') => {
    try {
      setProcessing({ id, type });
      const response = await api.patch(`/consultation/status/${id}`, { status });
      if (response.data.success) {
        toast.success(`Booking ${status} successfully!`);
        // Update local state
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        // Refresh counts to stay in sync
        fetchAllCounts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to update booking status`);
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchAllCounts();
  }, []);

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const handleAccept = async (id: string) => {
    await handleStatusUpdate(id, "accepted", "accept");
  };

  const handleReject = async (id: string) => {
    await handleStatusUpdate(id, "rejected", "reject");
    // Remove from local list after successful rejection so it disappears from incoming
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const instantCount = counts.Instant;
  const scheduleCount = counts.Schedule;
  const callbackCount = counts.Callback;

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
        <div className="p-4 sm:p-6 space-y-4 bg-[#FAFAFA] min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
               <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
               <p className="text-slate-500 font-medium">Fetching requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">No pending requests in this category.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side details */}
                <div className="flex gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                    {req.image ? (
                      <img src={req.image} alt={req.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
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
                          disabled={processing?.id === req.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 disabled:opacity-70"
                        >
                          {processing?.id === req.id && processing?.type === 'accept' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )} 
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={processing?.id === req.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-8 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-70"
                        >
                          {processing?.id === req.id && processing?.type === 'reject' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )} 
                          Reject
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
