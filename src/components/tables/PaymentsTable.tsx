"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Transaction {
    _id: string;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    createdAt: string;
    user: { name: string } | null;
    consultant: { name: string } | null;
    consultation: { duration: number } | null;
}

interface PaginationData {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
}

export default function PaymentsTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/transactions", {
                params: {
                    page: currentPage,
                    limit: 10,
                    searchTerm: searchQuery
                }
            });
            if (response.data.success) {
                setTransactions(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, searchQuery]);

    const handlePageChange = (page: number) => {
        if (pagination && page >= 1 && page <= pagination.totalPage) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Table Header & Search */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-8 border-b border-slate-100">
                <h2 className="text-[20px] font-bold text-slate-900 whitespace-nowrap">All Customer Transactions</h2>
                <div className="flex items-center gap-4 w-full max-w-md ml-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by Transaction ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-11 w-full bg-[#FAFAFA] border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-100"
                        />
                    </div>
                    <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-all active:scale-95 whitespace-nowrap">
                        Process Bulk Payout
                    </button>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto w-full min-h-[400px]">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="bg-[#FAFAFA] border-b border-slate-100">
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">TRANSACTION DETAILS</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CUSTOMER</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CONSULTANT</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">DURATION</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">AMOUNT RECEIVED</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                        <p className="text-sm text-slate-500 font-medium">Loading transactions...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-8 py-12 text-center text-slate-500 text-sm font-medium">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : transactions.map((tx) => (
                            <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-slate-800 uppercase">{tx.transactionId}</span>
                                        <span className="text-[12px] text-slate-400 font-medium mt-0.5">
                                            {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[14px] font-bold text-slate-800">{tx.user?.name || "N/A"}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[14px] font-medium text-slate-500">{tx.consultant?.name || "N/A"}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[14px] font-medium text-slate-500">
                                        {tx.consultation?.duration ? `${tx.consultation.duration} min` : "N/A"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-[15px] font-black text-blue-600">
                                        €{tx.amount.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border",
                                            tx.status === "captured"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : tx.status === "pending"
                                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                                : "bg-rose-50 text-rose-600 border-rose-100"
                                        )}
                                    >
                                        {tx.status === "captured" ? "COMPLETED" : tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPage > 1 && (
                <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[13px] text-slate-500 font-medium">
                        Showing <strong className="text-slate-800">{(pagination.page - 1) * pagination.limit + 1}</strong> to <strong className="text-slate-800">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong className="text-slate-800">{pagination.total}</strong> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={cn(
                                    "w-9 h-9 rounded-xl text-sm font-bold transition-all",
                                    currentPage === p
                                        ? "bg-[#FE6D2C] text-white shadow-sm shadow-[#FE6D2C]/20"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPage}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}