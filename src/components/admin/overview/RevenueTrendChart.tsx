"use client";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { MoreHorizontal } from "lucide-react";

const chartData = [
  { month: "Jan", revenue: 2500 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 7500 },
  { month: "May", revenue: 9800 },
  { month: "Jun", revenue: 5000 },
  { month: "Jul", revenue: 4200 },
  { month: "Aug", revenue: 4500 },
  { month: "Sep", revenue: 4800 },
  { month: "Oct", revenue: 4200 },
  { month: "Nov", revenue: 4000 },
  { month: "Dec", revenue: 4500 },
];

export function RevenueTrendChart() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
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
        <div className="h-[400px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `€${value}`}
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                dx={-10}
                ticks={[0, 2500, 5000, 7500, 10000]}
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
        </div>
      </div>
    </div>
  );
}
