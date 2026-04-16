import React from 'react';
import StatCard from '@/components/consultant/Overview/StatCard';
import UpcomingConsult from '@/components/consultant/Overview/UpcomingConsult';
import RecentFeedback from '@/components/consultant/Overview/RecentFeedback';

export default function ConsultantOverviewPage() {
  return (
    <div className=" w-full mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <header className="space-y-1 mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#006FC9] tracking-tight">
          Welcome back, Dr. Jenkins
        </h1>
        <p className="text-slate-500 text-[14px] font-medium max-w-2xl">
          Here's what's happening with your practice today.
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* Left/Main Column - spans 8 columns on large screens */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          <UpcomingConsult />
          <RecentFeedback />
        </div>

        {/* Right/Sidebar Column - spans 4 columns on large screens */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 min-h-full">
          <StatCard />

        </div>

      </div>
    </div>
  );
}
