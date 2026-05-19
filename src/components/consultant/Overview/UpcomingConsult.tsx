"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import api from '@/lib/axios';
import { format } from 'date-fns';

export default function UpcomingConsult() {
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const response = await api.get('/consultation/my-bookings');
                const allData = response.data?.data || response.data;
                if (Array.isArray(allData)) {
                    // Filter only confirmed/accepted/completed consultations
                    const confirmed = allData.filter((b: any) => 
                        b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'accepted' || b.status?.toLowerCase() === 'completed'
                    );
                    setUpcoming(confirmed);
                }
            } catch (err) {
                console.error("Failed to fetch upcoming consultations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcoming();

        // Interval to keep it live-updating every 15 seconds without page refresh
        const interval = setInterval(fetchUpcoming, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Upcoming Consultations</h3>
                </div>
                <Link
                    href="/consultant/requests"
                    className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:text-blue-600 hover:underline underline-offset-4 transition-all"
                >
                    View Requests <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading upcoming consultations...</p>
                </div>
            ) : upcoming.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-base">No Upcoming Consultations</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                            When you accept consultation requests from the Requests page, they will instantly appear here.
                        </p>
                    </div>
                    <Link href="/consultant/requests" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
                        Check Incoming Requests <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {upcoming.map((item: any) => {
                        const clientName = item.user?.name || item.name || "Client User";
                        const clientImage = item.user?.image || item.user?.avatar || item.image || null;
                        const initial = clientName.charAt(0).toUpperCase();
                        
                        let timeDisplay = "Instant Call";
                        if (item.bookingType?.toLowerCase() === "scheduled" || item.bookingType?.toLowerCase() === "schedule") {
                            timeDisplay = `${item.startTime || ""} - ${item.endTime || ""}, ${item.date ? format(new Date(item.date), 'MMM dd') : ""}`;
                        } else if (item.bookingType?.toLowerCase() === "callback") {
                            timeDisplay = item.preferredWindow || "Callback Window";
                        }

                        return (
                            <div key={item._id || item.id} className="bg-[#FAFAFA] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border border-slate-100 transition-colors hover:bg-slate-50 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-white shadow-sm overflow-hidden">
                                        {clientImage ? (
                                            <img src={clientImage} alt={clientName} className="w-full h-full object-cover" />
                                        ) : (
                                            initial
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-[15px]">{clientName}</h4>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-slate-500 text-[13px] font-medium capitalize">
                                                {item.bookingType || "Consultation"} Booking
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col xl:items-end gap-3 xl:gap-1.5 w-full xl:w-auto">
                                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60 self-start xl:self-end text-sm">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {timeDisplay}
                                    </div>
                                    <div className="flex items-center justify-between xl:justify-end gap-6 w-full mt-1 xl:mt-3">
                                        {item.status?.toLowerCase() === 'completed' ? (
                                            <span className="text-emerald-600 text-[12px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center flex-1 xl:flex-none shadow-sm">
                                                ✓ Completed
                                            </span>
                                        ) : (
                                            <>
                                                <span className="text-orange-500 text-[11px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded text-center">
                                                    Confirmed
                                                </span>
                                                <Link href={`/call?consultationId=${item._id || item.id}`} className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 text-center flex-1 xl:flex-none inline-block">
                                                    Join Call
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
