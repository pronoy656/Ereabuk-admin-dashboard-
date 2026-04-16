"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import { TimeSlot } from './AvailabilityManagement';

interface RecurringHoursProps {
  availabilityData: Record<string, TimeSlot[]>;
  setAvailabilityData: React.Dispatch<React.SetStateAction<Record<string, TimeSlot[]>>>;
}

export default function RecurringHours({ availabilityData, setAvailabilityData }: RecurringHoursProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Simple calendar math
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasHours = (day: number) => {
    const key = getDateKey(day);
    return availabilityData[key] && availabilityData[key].length > 0;
  };

  const selectedDateKey = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` 
    : '';

  const slots = selectedDate ? (availabilityData[selectedDateKey] || []) : [];

  const handleAddSlot = () => {
    if (!selectedDateKey) return;
    setAvailabilityData(prev => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), { start: "09:00", end: "17:00" }]
    }));
  };

  const handleUpdateSlot = (index: number, field: 'start' | 'end', value: string) => {
    if (!selectedDateKey) return;
    setAvailabilityData(prev => {
      const daySlots = [...(prev[selectedDateKey] || [])];
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...prev, [selectedDateKey]: daySlots };
    });
  };

  const handleRemoveSlot = (index: number) => {
    if (!selectedDateKey) return;
    setAvailabilityData(prev => {
      const daySlots = [...(prev[selectedDateKey] || [])];
      daySlots.splice(index, 1);
      return { ...prev, [selectedDateKey]: daySlots };
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
      
      {/* Calendar View */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="border border-slate-100 rounded-2xl shadow-sm bg-white p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 text-[17px]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const selected = isSelected(day);
              const custom = hasHours(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl text-[14px] font-medium transition-all
                    ${selected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'hover:bg-slate-50 text-slate-700'}
                    ${isToday(day) && !selected ? 'border border-blue-500 text-blue-600 font-bold' : ''}
                  `}
                >
                  {day}
                  {custom && !selected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                  {custom && selected && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel for Selected Date */}
      <div className="flex-1 flex flex-col">
        {selectedDate ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <p className="text-slate-500 text-sm mb-8">
              Configure your specific availability for this date.
            </p>

            <div className="space-y-4">
               {slots.length > 0 ? slots.map((slot, idx) => (
                 <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 flex-1">
                      <input 
                        type="time" 
                        value={slot.start}
                        onChange={(e) => handleUpdateSlot(idx, 'start', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all w-32 text-center"
                      />
                      <span className="text-slate-400 font-medium">-</span>
                      <input 
                        type="time" 
                        value={slot.end}
                        onChange={(e) => handleUpdateSlot(idx, 'end', e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all w-32 text-center"
                      />
                    </div>
                    <button 
                      onClick={() => handleRemoveSlot(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               )) : (
                 <div className="text-center py-6">
                   <p className="text-slate-500 font-medium text-[15px]">You are currently unavailable on this date.</p>
                 </div>
               )}

               <button 
                 onClick={handleAddSlot}
                 className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-sm hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
               >
                 <Plus className="w-4 h-4" /> {slots.length === 0 ? 'Add Time Slot' : 'Add Another Time Slot'}
               </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-slate-100 flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Select Date</h3>
            <p className="text-slate-500 text-[14px] max-w-sm">
              Select specific dates on the calendar to configure availability.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
