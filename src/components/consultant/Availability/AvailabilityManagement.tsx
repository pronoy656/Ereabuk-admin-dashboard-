"use client";

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecurringHours from './RecurringHours';
import CustomAvailability from './CustomAvailability'; // Added this to trigger TS refresh

export interface TimeSlot {
  start: string;
  end: string;
}

export default function AvailabilityManagement() {
  const [availabilityData, setAvailabilityData] = useState<Record<string, TimeSlot[]>>({});

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Availability Management</h1>
          <p className="text-slate-500 text-[15px]">Set your working hours and manage your calendar.</p>
        </div>
      </div>

      {/* Main Tabs Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] pt-2 overflow-hidden flex flex-col">
        <Tabs defaultValue="recurring" className="w-full flex-1">
          <div className="px-6">
            <TabsList className="flex w-full border-b border-slate-100 p-0 h-auto bg-transparent rounded-none gap-0">
              <TabsTrigger
                value="recurring"
                className="flex-1 py-4 text-[13px] font-bold transition-none rounded-none border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-400 hover:text-slate-700"
              >
                Recurring Hours
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex-1 py-4 text-[13px] font-bold transition-none rounded-none border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-400 hover:text-slate-700"
              >
                Custom Availability (Date Specific)
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="recurring" className="m-0 focus-visible:outline-none focus:outline-none">
              <RecurringHours
                availabilityData={availabilityData}
                setAvailabilityData={setAvailabilityData}
              />
            </TabsContent>

            <TabsContent value="custom" className="m-0 focus-visible:outline-none focus:outline-none">
              <CustomAvailability
                availabilityData={availabilityData}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer / Save Button */}
      <div className="flex justify-end pt-2">
        <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95">
          Save Changes
        </button>
      </div>

    </div>
  );
}
