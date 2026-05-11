"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    Icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    loading?: boolean;
}

export function StatCard({
    label,
    value,
    Icon,
    iconBgColor,
    iconColor,
    loading = false,
}: StatCardProps) {
    return (
        <div className="group bg-white rounded-[24px] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div className="space-y-4 w-full">
                    <p className="text-[15px] font-medium text-slate-400 tracking-tight">
                        {label}
                    </p>
                    {loading ? (
                        <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg" />
                    ) : (
                        <p className="text-[36px] font-bold text-slate-900 tracking-tight leading-none">
                            {value}
                        </p>
                    )}
                </div>
                <div
                    className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0",
                        loading ? "bg-slate-50" : iconBgColor
                    )}
                >
                    {loading ? (
                        <div className="h-6 w-6 bg-slate-200 animate-pulse rounded-full" />
                    ) : (
                        <Icon className={cn("h-6 w-6", iconColor)} />
                    )}
                </div>
            </div>
        </div>
    );
}
