"use client";

import { Eye, Send, Paperclip, Link as LinkIcon, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import React, { useState, useRef, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [attachments, setAttachments] = useState<{ name: string; size: string; file: File }[]>([]);
    const [resources, setResources] = useState<{ name: string; type: string }[]>([]);
    const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
    const [newResourceName, setNewResourceName] = useState("");
    const [consultationId, setConsultationId] = useState("");
    const [reportTitle, setReportTitle] = useState("");
    const [conversation, setConversation] = useState("");
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            setAttachments([...attachments, { name: file.name, size: `${sizeInMB} MB`, file }]);
        }
    };

    const addResource = () => {
        if (newResourceName) {
            setResources([...resources, { name: newResourceName, type: newResourceName.includes("http") ? "link" : "pdf" }]);
            setNewResourceName("");
            setIsResourceDialogOpen(false);
        }
    };

    const handleFinalize = async () => {
        if (!consultationId) {
            toast.error("Please select a consultation.");
            return;
        }

        setSending(true);
        try {
            // In a real scenario, we might need to upload images to a storage service first
            // and get URLs, but for now we follow the user's requested body structure.
            const payload = {
                consultationId,
                conversation: `${reportTitle}\n\n${conversation}`,
                links: resources.filter(r => r.type === "link").map(r => r.name),
                images: [] // images logic would go here if backend supports direct upload or URLs
            };

            console.log("Sending report payload:", payload);
            const response = await api.post("/report", payload);
            
            if (response.data.success) {
                toast.success("Consultation report finalized successfully!");
                // Optionally redirect or clear form
                setTimeout(() => {
                    router.push('/consultant/overview');
                }, 2000);
            }
        } catch (error: any) {
            console.error("Error finalizing report:", error);
            toast.error(error.response?.data?.message || "Failed to finalize report.");
        } finally {
            setSending(false);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const removeResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Report</h1>
                    <p className="text-slate-500 mt-1">Document your session and share insights with the client.</p>
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                    {/* Top Selects Section */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-sm font-medium text-slate-700">Consultation ID</Label>
                            <Input 
                                id="consultationId"
                                className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-blue-500/20"
                                value={consultationId}
                                onChange={(e) => setConsultationId(e.target.value)}
                                placeholder="Enter consultation ID..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="template" className="text-sm font-medium text-slate-700">Template</Label>
                            <Select defaultValue="tax-summary">
                                <SelectTrigger id="template" className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:ring-blue-500/20">
                                    <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200">
                                    <SelectItem value="tax-summary">Tax consultant summary</SelectItem>
                                    <SelectItem value="investment-plan">Investment Strategy</SelectItem>
                                    <SelectItem value="quarterly-audit">Quarterly Audit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Main Editor and Sidebar */}
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Editor Section */}
                        <div className="flex-1 p-6 md:p-8 space-y-6">
                            <div className="space-y-4">
                                <Input 
                                    className="text-2xl font-bold border-none p-0 focus-visible:ring-0 placeholder:text-slate-300 h-auto"
                                    placeholder="Report Title..."
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                />
                                <div className="space-y-4 text-slate-600 leading-relaxed font-sans">
                                    <Textarea 
                                        className="min-h-[400px] text-lg border-none p-0 focus-visible:ring-0 resize-none placeholder:text-slate-300"
                                        placeholder="Start typing your report here..."
                                        value={conversation}
                                        onChange={(e) => setConversation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Section */}
                        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-50 p-6 md:p-8 space-y-8 bg-slate-50/30">
                            {/* Attachments */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                                    <Paperclip className="h-4 w-4 text-slate-500" />
                                    <span>Attachments</span>
                                </div>
                                <div 
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-white hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                    />
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <Paperclip className="h-5 w-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-blue-600">Click to upload</p>
                                        <p className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                                
                                {/* Dynamic Attachments List */}
                                <div className="space-y-2">
                                    {attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <Paperclip className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                                                    <p className="text-[10px] text-slate-400">{file.size}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeAttachment(idx)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                                    <LinkIcon className="h-4 w-4 text-slate-500" />
                                    <span>Resources</span>
                                </div>
                                <div className="space-y-3">
                                    {resources.map((resource, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-blue-200 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-lg flex items-center justify-center",
                                                    resource.type === "pdf" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                                                )}>
                                                    {resource.type === "pdf" ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 truncate">{resource.name}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeResource(idx);
                                                }}
                                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <Button 
                                        variant="ghost" 
                                        className="w-full justify-center bg-transparent border border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl h-10 text-xs font-medium"
                                        onClick={() => setIsResourceDialogOpen(true)}
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-2" />
                                        Add Link or File
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Resource Dialog */}
            <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-slate-50">
                        <DialogTitle className="text-xl font-bold text-slate-900">Add Resource</DialogTitle>
                    </DialogHeader>
                    <div className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resourceName" className="text-sm font-semibold text-slate-700">Name / URL</Label>
                            <Input 
                                id="resourceName" 
                                placeholder="Enter link or filename (e.g. guide.pdf)" 
                                value={newResourceName}
                                onChange={(e) => setNewResourceName(e.target.value)}
                                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10"
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-slate-50/50 border-t border-slate-50 gap-3">
                        <Button variant="ghost" onClick={() => setIsResourceDialogOpen(false)} className="rounded-xl font-bold text-slate-400">Cancel</Button>
                        <Button onClick={addResource} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-600/20">Add Resource</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bottom Actions Footer */}
            <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100">
                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                </Button>
                <Button 
                    onClick={handleFinalize}
                    disabled={sending}
                    className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 transition-all font-semibold border-none disabled:opacity-50"
                >
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Sending..." : "Finalize & Send"}
                </Button>
            </div>
        </div>
    );
}
