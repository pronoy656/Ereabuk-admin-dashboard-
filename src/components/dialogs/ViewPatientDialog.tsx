"use client";

import React from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ViewPatientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: {
        name: string;
        mrn: string;
        admissionDate: string;
        ageGender: string;
        facility: string;
        status: string;
        lastUpdated: string;
        notes?: string;
        dob?: string;
    } | null;
}

export function ViewPatientDialog({ open, onOpenChange, patient }: ViewPatientDialogProps) {
    if (!patient) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">Patient Details</DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Name</Label>
                            <p className="text-slate-800 font-bold">{patient.name}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRN / ID</Label>
                            <p className="text-slate-800 font-medium">{patient.mrn}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admission Date</Label>
                            <p className="text-slate-800 font-medium">{patient.admissionDate}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age / Gender</Label>
                            <p className="text-slate-800 font-medium">{patient.ageGender}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facility</Label>
                            <p className="text-slate-800 font-medium">{patient.facility}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</Label>
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${patient.status === "Active" ? "bg-emerald-50 text-emerald-500" : "bg-slate-800 text-slate-300"
                                    }`}>
                                    {patient.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</Label>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {patient.notes || "No additional notes available for this patient."}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            className="h-12 px-8 bg-[#002D54] hover:bg-[#002D54]/90 rounded-xl text-white font-bold transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
