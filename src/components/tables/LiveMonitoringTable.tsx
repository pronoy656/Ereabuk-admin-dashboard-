"use client";

import React, { useState, useEffect } from 'react';
import { Search, Activity, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Session {
  id: string;
  consultant: string;
  customer: string;
  cost: string;
  startedAt: string;
  status: string;
}


export default function LiveMonitoringTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActiveConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/active-consultations");
      if (response.data.success) {
        // Mapping backend session data if necessary, assuming similar structure for now
        // If the backend returns different field names, we would map them here
        setSessions(response.data.data.sessions || []);
        setActiveCount(response.data.data.count || 0);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch live monitoring data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveConsultations();
    // Optional: Refresh every 30 seconds for live monitoring
    const interval = setInterval(fetchActiveConsultations, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter(session =>
    session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Live Monitoring
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Monitor active consultations and platform load
          </p>
        </div>

        <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-red-100 shadow-sm shadow-red-100/50">
          <Activity className="w-4 h-4" />
          {activeCount} Active Sessions
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* Card Header & Search */}
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-100">
          <h2 className="text-[17px] font-bold text-slate-900 whitespace-nowrap">Active Consultations</h2>
          <div className="relative w-full max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search active sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full bg-[#FAFAFA] border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-100"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full min-h-[300px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">SESSION ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CONSULTANT</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CURRENT COST</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">STARTED AT</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">SESSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-20 text-center">
                     <div className="flex flex-col items-center justify-center gap-2">
                       <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                       <p className="text-sm text-slate-500 font-medium">Loading live data...</p>
                     </div>
                   </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    No active sessions found.
                  </td>
                </tr>
              ) : filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-semibold text-slate-500">{session.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-bold text-slate-800">{session.consultant}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-medium text-slate-500">{session.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-bold text-slate-800">{session.cost}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-medium text-slate-500">
                       {session.startedAt ? new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold tracking-wide border",
                        session.status.toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {session.status.toLowerCase() === "active" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                      )}
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
