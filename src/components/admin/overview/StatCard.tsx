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
}

export function StatCard({
    label,
    value,
    Icon,
    iconBgColor,
    iconColor,
}: StatCardProps) {
    return (
        <div className="group bg-white rounded-[24px] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <p className="text-[15px] font-medium text-slate-400 tracking-tight">
                        {label}
                    </p>
                    <p className="text-[36px] font-bold text-slate-900 tracking-tight leading-none">
                        {value}
                    </p>
                </div>
                <div
                    className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                        iconBgColor
                    )}
                >
                    <Icon className={cn("h-6 w-6", iconColor)} />
                </div>
            </div>
        </div>
    );
}
