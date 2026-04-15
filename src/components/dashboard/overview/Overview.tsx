"use client";
import React from "react";
import { Users, Building2, UserRound, FileVideo, Clock, TrendingUp, DollarSign, Target } from "lucide-react";
import { StatCard } from "./StatCard";
import { CostSavingsChart } from "./CostSavingsChart";
import { AcceptanceRateChart } from "./AcceptanceRateChart";
import { RecentActivity } from "./RecentActivity";

export default function Overview() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Monitor system activity and key performance indicators
        </p>
      </div>

      {/* Row 1: Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Users"
          value="1,247"
          trend="+12%"
          Icon={Users}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatCard
          label="Active Facilities"
          value="48"
          trend="+3%"
          Icon={Building2}
          iconBgColor="bg-[#00A3A3]/10"
          iconColor="text-[#00A3A3]"
        />
        <StatCard
          label="Active Patients"
          value="3,842"
          trend="+8%"
          Icon={UserRound}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-500"
        />
      </div>

      {/* Row 2: Performance Stat Cards (From Image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Cost Savings"
          value="$157K"
          trend="+18%"
          description="Last 6 months"
          Icon={DollarSign}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Acceptance Rate"
          value="91%"
          trend="+3%"
          description="Current month"
          Icon={Target}
          iconBgColor="bg-blue-600/10"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Interchanges Made"
          value="2,847"
          trend="+12%"
          description="Last 6 months"
          Icon={TrendingUp}
          iconBgColor="bg-orange-500/10"
          iconColor="text-orange-600"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostSavingsChart />
        <AcceptanceRateChart />
      </div>

      {/* Row 3: Secondary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Formulary Changes"
          value="127"
          trend="This month"
          Icon={FileVideo}
          iconBgColor="bg-indigo-500/10"
          iconColor="text-indigo-500"
        />
        <StatCard
          label="Avg. Time Savings"
          value="4.2 hrs"
          trend="Per reconciliation"
          Icon={Clock}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-500"
        />
        <StatCard
          label="Acceptance Rate"
          value="91%"
          trend="+3% from last month"
          Icon={TrendingUp}
          iconBgColor="bg-violet-500/10"
          iconColor="text-violet-500"
        />
      </div>

      {/* Row 4: Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </div>
  );
}
