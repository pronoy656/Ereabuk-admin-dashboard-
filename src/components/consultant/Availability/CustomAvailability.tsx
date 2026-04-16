"use client";

import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { TimeSlot } from './AvailabilityManagement';

interface CustomAvailabilityProps {
  availabilityData: Record<string, TimeSlot[]>;
}

export default function CustomAvailability({ availabilityData }: CustomAvailabilityProps) {
  // Extract and sort dates
  const dates = Object.keys(availabilityData)
    .filter(key => availabilityData[key].length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="animate-in fade-in duration-300">
      
      {dates.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Custom Availability</h3>
          <p className="text-slate-500 text-[14px] max-w-sm">
            To view entries here, select specific dates and configure time slots inside the <strong className="text-slate-700">Recurring Hours</strong> tab. Details will automatically surface here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <CalendarIcon className="w-5 h-5 text-blue-500" />
             Read-Only View over customized dates
          </h3>

          <div className="space-y-4">
            {dates.map((dateStr) => {
              const d = new Date(dateStr);
              const slots = availabilityData[dateStr];
              
              return (
                <div key={dateStr} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 bg-[#FAFAFA] border border-slate-100 rounded-xl p-5">
                  <div className="w-48 shrink-0 flex flex-col">
                    <span className="font-bold text-slate-800">
                      {d.toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-3">
                    {slots.map((slot, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-700 font-semibold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.start} - {slot.end}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
    </div>
  );
}
