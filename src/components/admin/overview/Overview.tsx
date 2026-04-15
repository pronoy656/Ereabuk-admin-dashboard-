"use client";
import React from "react";
import { Users, Euro, Activity, CreditCard } from "lucide-react";
import { StatCard } from "./StatCard";
import { RevenueTrendChart } from "./RevenueTrendChart";

export default function Overview() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-10">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-bold text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-[16px] text-slate-400 font-medium tracking-tight">
          Real-time metrics and platform performance
        </p>
      </div>

      {/* Row 1: Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard
          label="Total Revenue"
          value="€124,500"
          Icon={Euro}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Avg Calling Time"
          value="42.65"
          Icon={Activity}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          label="Total Users"
          value="12,450"
          Icon={Users}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="New Registrations"
          value="84"
          Icon={CreditCard}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
        />
      </div>

      {/* Row 2: Revenue Trend Chart */}
      <div className="w-full">
        <RevenueTrendChart />
      </div>
    </div>
  );
}
