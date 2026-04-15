"use client";
import React from "react";
import {
    UserPlus,
    FileText,
    UserCheck,
    CheckCircle2,
    Settings,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
    {
        id: 1,
        title: "New user added",
        description: "Dr. Emily Chen • St. Mary's Hospital",
        time: "5 min ago",
        Icon: UserPlus,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 2,
        title: "Formulary updated",
        description: "PharmD Sarah Johnson • Comfort Care Hospice",
        time: "12 min ago",
        Icon: FileText,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        id: 3,
        title: "Patient added",
        description: "Nurse Mike Peterson • Greenwood LTC",
        time: "23 min ago",
        Icon: UserCheck,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: 4,
        title: "Interchange approved",
        description: "Dr. Robert Lee • Memorial Medical",
        time: "1 hour ago",
        Icon: CheckCircle2,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
    },
    {
        id: 5,
        title: "Facility configuration changed",
        description: "Admin Team • All Facilities",
        time: "2 hours ago",
        Icon: Settings,
        iconBg: "bg-slate-900",
        iconColor: "text-white",
    },
];

export function RecentActivity() {
    return (
        <Card className="bg-white border-slate-100 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-800" />
                    <CardTitle className="text-lg font-bold text-slate-800">
                        Recent Activity
                    </CardTitle>
                </div>
                <button className="text-[#00A3A3] text-sm font-semibold hover:underline">
                    View All
                </button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", activity.iconBg)}>
                                    <activity.Icon className={cn("h-5 w-5", activity.iconColor)} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                                    <p className="text-xs text-slate-400">{activity.description}</p>
                                </div>
                            </div>
                            <div className="text-xs text-slate-400 whitespace-nowrap">
                                {activity.time}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
