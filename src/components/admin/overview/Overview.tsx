import React, { useState, useEffect } from "react";
import { Users, Euro, Activity, CreditCard, Loader2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { RevenueTrendChart } from "./RevenueTrendChart";
import api from "@/lib/axios";
import { toast } from "sonner";

interface SummaryData {
  totalRevenue: number;
  todayConsultationTime: number;
  totalUsers: number;
  newRegistrations: {
    count: number;
    month: string;
  }[];
}

export default function Overview() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard-summary");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const latestRegistrations = data?.newRegistrations?.[data.newRegistrations.length - 1]?.count || 0;

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
          value={loading ? "..." : `€${data?.totalRevenue || 0}`}
          Icon={Euro}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          loading={loading}
        />
        <StatCard
          label="Today's Consultation"
          value={loading ? "..." : `${data?.todayConsultationTime || 0}m`}
          Icon={Activity}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
          loading={loading}
        />
        <StatCard
          label="Total Users"
          value={loading ? "..." : (data?.totalUsers || 0).toLocaleString()}
          Icon={Users}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          loading={loading}
        />
        <StatCard
          label="New Registrations (this month)"
          value={loading ? "..." : latestRegistrations.toString()}
          Icon={CreditCard}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
          loading={loading}
        />
      </div>

      {/* Row 2: Revenue Trend Chart */}
      <div className="w-full">
        <RevenueTrendChart />
      </div>
    </div>
  );
}
