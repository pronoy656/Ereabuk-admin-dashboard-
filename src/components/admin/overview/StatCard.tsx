"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    Icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    description?: string;
}

export function StatCard({
    label,
    value,
    trend,
    Icon,
    iconBgColor,
    iconColor,
    description,
}: StatCardProps) {
    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <div
                            className={cn(
                                "h-12 w-12 rounded-lg flex items-center justify-center shadow-sm",
                                iconBgColor
                            )}
                        >
                            <Icon className={cn("h-6 w-6", iconColor)} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-400 capitalize">
                                {label}
                            </p>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">
                                {value}
                            </p>
                            {description && (
                                <p className="text-xs text-slate-400 font-medium">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {trend && (
                        <div className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                            {trend}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
