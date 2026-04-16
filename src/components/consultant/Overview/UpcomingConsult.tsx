import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock } from 'lucide-react';

export default function UpcomingConsult() {
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
                    href="/consultant/consultations"
                    className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:text-blue-600 hover:underline underline-offset-4 transition-all"
                >
                    View Calendar <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-4">
                {/* Consultation Item 1 */}
                <div className="bg-[#FAFAFA] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border border-slate-100 transition-colors hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-white shadow-sm">
                            M
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-[15px]">Marcus Schmidt</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-slate-500 text-[13px] font-medium">Tax Consultation</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col xl:items-end gap-3 xl:gap-1.5 w-full xl:w-auto">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60 self-start xl:self-end text-sm">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            14:00 - 14:45
                        </div>
                        <div className="flex items-center justify-between xl:justify-end gap-6 w-full mt-3 xl:mt-3">
                            <span className="text-orange-500 text-[11px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded text-center">
                                Starting soon
                            </span>
                            <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 text-center flex-1 xl:flex-none">
                                Join Call
                            </button>
                        </div>
                    </div>
                </div>

                {/* Consultation Item 2 */}
                <div className="bg-[#FAFAFA] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border border-slate-100 transition-colors hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-white shadow-sm">
                            E
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-[15px]">Elena Rossi</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-slate-500 text-[13px] font-medium">Legal Advice</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col xl:items-end gap-3 xl:gap-1.5 w-full xl:w-auto">
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60 self-start xl:self-end text-sm">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            14:00 - 14:45
                        </div>
                        <div className="flex items-center justify-between xl:justify-end gap-6 w-full mt-1 xl:mt-3">
                            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-center">
                                Upcoming
                            </span>
                            <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 text-center flex-1 xl:flex-none">
                                Join Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
