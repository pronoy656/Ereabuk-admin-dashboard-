"use client";

import React, { useState, useEffect } from "react";
import { Download, Info, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";
import PaymentsTable from "@/components/tables/PaymentsTable";
import api from "@/lib/axios";

export default function PaymentsPage() {
    const [summary, setSummary] = useState({
        grossRevenue: 0,
        totalLifetimeRevenue: 0,
        currentMonthRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                setLoading(true);
                // Fetching both summary endpoints in parallel
                const [dashboardRes, revenueRes] = await Promise.all([
                    api.get("/admin/dashboard-summary"),
                    api.get("/admin/revenue-summary")
                ]);

                setSummary({
                    grossRevenue: dashboardRes.data.data.totalRevenue || 0,
                    totalLifetimeRevenue: revenueRes.data.data.totalLifetimeRevenue || 0,
                    currentMonthRevenue: revenueRes.data.data.currentMonthRevenue || 0
                });
            } catch (error) {
                console.error("Failed to fetch financial summary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummaryData();
    }, []);

    return (
        <div className="w-full space-y-8 pb-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Payments & Financial Control</h1>
                    <p className="text-[15px] text-slate-500 font-medium mt-1">
                        Admin controls all customer payments and employee payouts
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                    Export Financials
                </button>
            </div>

            {/* Financial Flow Notice */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-[15px] font-bold text-blue-900">Financial Flow Notice</h4>
                    <p className="text-[14px] text-blue-700 leading-relaxed font-medium">
                        All customer payments are deposited directly into the Admin/Owner bank account. Consultants (Employees) do not have direct access to customer funds. You must manually process their payouts here based on their commission rates.
                    </p>
                </div>
            </div>

            {/* Summary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gross Revenue Card */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="space-y-3 relative z-10">
                        <p className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue (Customer Payments)</p>
                        <h2 className="text-[42px] font-black text-slate-900 leading-none tracking-tight">
                            {loading ? "..." : `€${summary.grossRevenue.toLocaleString()}`}
                        </h2>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[14px]">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>All held by Admin</span>
                        </div>
                    </div>
                </div>

                {/* Total Lifetime Revenue Card */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="space-y-3 relative z-10">
                        <p className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Total Lifetime Revenue</p>
                        <h2 className="text-[42px] font-black text-[#FE6D2C] leading-none tracking-tight">
                            {loading ? "..." : `€${summary.totalLifetimeRevenue.toLocaleString()}`}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[14px]">
                             <ShieldCheck className="w-4 h-4" />
                             <span>All-time platform earnings</span>
                        </div>
                    </div>
                </div>

                {/* Current Month Revenue Card */}
                <div className="bg-white p-8 rounded-[24px] border border-l-[6px] border-l-amber-500 border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="space-y-3 relative z-10">
                        <p className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">Current Month Revenue</p>
                        <h2 className="text-[42px] font-black text-amber-500 leading-none tracking-tight">
                            {loading ? "..." : `€${summary.currentMonthRevenue.toLocaleString()}`}
                        </h2>
                        <div className="flex items-center gap-2 text-amber-600 font-bold text-[14px]">
                             <Clock className="w-4 h-4" />
                             <span>Revenue for this month</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table Section */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                <PaymentsTable />
            </div>
        </div>
    );
}