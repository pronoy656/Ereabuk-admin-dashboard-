"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecurringHours from './RecurringHours';
import CustomAvailability from './CustomAvailability';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface TimeSlot {
  start: string;
  end: string;
}

export default function AvailabilityManagement() {
  const [availabilityData, setAvailabilityData] = useState<Record<string, TimeSlot[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all availability on mount
  useEffect(() => {
    const fetchAllAvailability = async () => {
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        const response = await api.get(`/consultation/available-slots/${userId}`);
        if (response.data.success) {
          const fetchedData: Record<string, TimeSlot[]> = {};
          
          response.data.data.forEach((slot: any) => {
            const dateKey = slot.date.split('T')[0];
            if (!fetchedData[dateKey]) {
              fetchedData[dateKey] = [];
            }
            fetchedData[dateKey].push({
              start: slot.startTime,
              end: slot.endTime
            });
          });
          
          setAvailabilityData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching initial availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAvailability();
  }, [user?._id, user?.id]);

  // Handle Save Changes
  const handleSave = async () => {
    console.log("handleSave function triggered");
    setSaving(true);
    try {
      console.log("Current availabilityData state:", availabilityData);
      // Format data for backend
      const slots: any[] = [];
      Object.entries(availabilityData).forEach(([date, daySlots]) => {
        daySlots.forEach(slot => {
          slots.push({
            date: date,
            startTime: slot.start,
            endTime: slot.end
          });
        });
      });

      console.log("Saving slots payload:", { slots });

      const response = await api.post('/consultation/availability', { slots });
      console.log("Save Response:", response.data);
      toast.success("Availability updated successfully!");
    } catch (error: any) {
      console.error("Error saving availability:", error);
      console.error("Error response data:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save availability.");
    } finally {
      setSaving(false);
    }
  };

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
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] pt-2 overflow-hidden flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Loading availability...</p>
          </div>
        ) : (
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
                {/* Save Button only for Recurring Hours tab */}
                <div className="flex justify-end pt-8 border-t border-slate-100 mt-8">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="m-0 focus-visible:outline-none focus:outline-none">
                <CustomAvailability
                  availabilityData={availabilityData}
                />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
