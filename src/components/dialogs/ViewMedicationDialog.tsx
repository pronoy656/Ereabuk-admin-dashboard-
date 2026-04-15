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

interface ViewMedicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    medication: {
        name: string;
        brand: string;
        genericName: string;
        strengthForm: string;
        status: string;
    } | null;
}

export function ViewMedicationDialog({ open, onOpenChange, medication }: ViewMedicationDialogProps) {
    if (!medication) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">Medication Details</DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-6">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drug Name (Brand)</Label>
                        <div className="flex flex-col">
                            <span className="text-slate-800 font-bold text-lg">{medication.name}</span>
                            <span className="text-slate-500 font-medium text-sm">{medication.brand}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generic Name</Label>
                            <p className="text-slate-800 font-medium">{medication.genericName}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strength / Form</Label>
                            <p className="text-slate-800 font-medium">{medication.strengthForm}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Status</Label>
                        <div>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${medication.status === "Preferred" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
                                }`}>
                                {medication.status}
                            </span>
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
