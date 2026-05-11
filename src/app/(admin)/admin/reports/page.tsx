"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, FileText, Download, ExternalLink, User, Calendar, Clock, Link as LinkIcon, Image as ImageIcon, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Report {
    _id: string;
    consultation: {
        _id: string;
        bookingType: string;
        date: string;
        status: string;
    };
    user: {
        _id: string;
        name: string;
        image: string;
    };
    consultant: {
        _id: string;
        name: string;
        image: string;
    };
    conversation: string;
    duration: number;
    images: string[];
    links: string[];
    pdfUrl: string;
    createdAt: string;
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get("/report");
                if (response.data.success) {
                    setReports(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
                toast.error("Failed to load reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => 
        report.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.consultant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailsOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Consultation Reports</h1>
                    <p className="text-slate-500 mt-1">Review and manage finalized consultation reports and PDFs.</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search by user or consultant..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-white border-slate-100 shadow-sm focus:ring-blue-500/10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading reports...</p>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-center p-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <FileText className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No reports found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or check back later for new consultations.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredReports.map((report) => (
                        <Card key={report._id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all group flex flex-col h-full">
                            <CardContent className="p-5 flex flex-col h-full space-y-4">
                                {/* Compact Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            <div className="h-10 w-10 rounded-xl border-2 border-white bg-blue-50 flex items-center justify-center shadow-sm overflow-hidden ring-1 ring-slate-100">
                                                {report.user.image ? <img src={report.user.image} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-blue-500" />}
                                            </div>
                                            <div className="h-10 w-10 rounded-xl border-2 border-white bg-emerald-50 flex items-center justify-center shadow-sm overflow-hidden relative z-10 ring-1 ring-slate-100">
                                                {report.consultant.image ? <img src={report.consultant.image} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-emerald-500" />}
                                            </div>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">{report.user.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium truncate">w/ {report.consultant.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Meta Stats */}
                                <div className="flex items-center gap-3 py-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold bg-slate-50 px-2 py-1 rounded-md">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </div>
                                    {report.duration !== undefined && (
                                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-md">
                                            <Timer className="w-3 h-3" />
                                            {report.duration}m
                                        </div>
                                    )}
                                </div>

                                {/* Links Section */}
                                {report.links && report.links.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                                        {report.links.slice(0, 2).map((link, idx) => (
                                            <a 
                                                key={idx} 
                                                href={link.startsWith('http') ? link : `https://${link}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-white text-slate-500 text-[10px] font-bold rounded-md border border-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all"
                                            >
                                                <ExternalLink className="w-2.5 h-2.5" />
                                                L{idx + 1}
                                            </a>
                                        ))}
                                        {report.links.length > 2 && (
                                            <span className="text-[9px] font-bold text-slate-300 self-center">
                                                +{report.links.length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto pt-4 flex items-center justify-end gap-2 border-t border-slate-50">
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 px-2.5 text-[11px] font-bold transition-all"
                                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${report.pdfUrl}`, '_blank')}
                                    >
                                        <Download className="w-3.5 h-3.5 mr-1" />
                                        PDF
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => handleViewDetails(report)}
                                        className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white h-8 px-3 text-[11px] font-bold  shadow-sm"
                                    >
                                        Details
                                        <Eye className="w-3.5 h-3.5 ml-1.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            Report Details
                        </DialogTitle>
                    </DialogHeader>
                    
                    {selectedReport && (
                        <div className="p-8 pt-4 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* User & Consultant Info */}
                            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedReport.user.image ? <img src={selectedReport.user.image} alt="" /> : <User className="w-5 h-5 text-slate-400" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{selectedReport.user.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultant</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                            {selectedReport.consultant.image ? <img src={selectedReport.consultant.image} alt="" /> : <User className="w-5 h-5 text-slate-400" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{selectedReport.consultant.name}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedReport.duration !== undefined && (
                                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Session Duration</p>
                                    <div className="flex items-center gap-2 text-blue-700 font-bold">
                                        <Timer className="w-4 h-4" />
                                        {selectedReport.duration} minutes
                                    </div>
                                </div>
                            )}

                            {/* Links Section - Full Width */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 text-blue-600">
                                    <LinkIcon className="w-4 h-4" />
                                    Resources & Links
                                </h4>
                                <div className="space-y-2">
                                    {selectedReport.links && selectedReport.links.length > 0 ? selectedReport.links.map((link, idx) => (
                                        <a 
                                            key={idx} 
                                            href={link.startsWith('http') ? link : `https://${link}`} 
                                            target="_blank" 
                                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all"
                                        >
                                            <span className="text-xs font-medium text-slate-600 truncate max-w-[200px]">{link}</span>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500" />
                                        </a>
                                    )) : (
                                        <p className="text-xs text-slate-400 italic">No links attached.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
                        <Button 
                            variant="outline" 
                            className="rounded-xl font-bold text-slate-500 border-slate-200"
                            onClick={() => setIsDetailsOpen(false)}
                        >
                            Close Details
                        </Button>
                        <Button 
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 border-none"
                            onClick={() => selectedReport && window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${selectedReport.pdfUrl}`, '_blank')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
