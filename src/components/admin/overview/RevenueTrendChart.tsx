"use client";

import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface RevenueData {
  month: string;
  revenue: number;
}

export function RevenueTrendChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchRevenueTrend = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/revenue-trend");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch revenue trend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRevenueTrend();
  }, []);

  if (!mounted) return <div className="h-[520px] bg-white rounded-[24px] shadow-sm animate-pulse" />;

  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex flex-row items-center justify-between p-10 pb-2">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Revenue Trend</h3>
        <button className="text-slate-300 hover:text-slate-500 transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>
      <div className="px-10 pb-10 pt-6">
        <div className="h-[400px] w-full min-h-[300px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
               <p className="text-sm text-slate-400 font-medium">Loading trend data...</p>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#f1f5f9" 
              />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                dy={10}
                tickFormatter={(val) => val.substring(0, 3)}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `€${value}`}
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px'
                }}
                formatter={(value: any) => [`€${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1000}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
