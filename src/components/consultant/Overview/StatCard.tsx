import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function StatCard() {
  return (
    <div className="bg-[#FAFAFA] rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 w-full relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
      {/* Decorative gradient blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/80 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Total Sessions</span>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
        </div>
      </div>
      <div className="space-y-1 relative z-10">
        <h2 className="text-5xl leading-none font-bold text-[#006FC9] tracking-tight">
          124
        </h2>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <p className="text-emerald-600 text-[13px] font-bold uppercase tracking-wide">
            Active
          </p>
        </div>
      </div>
    </div>
  );
}