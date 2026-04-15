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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddMedicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    mode: "add" | "edit";
}

export function AddMedicationDialog({ open, onOpenChange, initialData, mode }: AddMedicationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        {mode === "add" ? "Add Medication" : "Edit Medication"}
                    </DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-600">Medication Name*</Label>
                        <Input
                            placeholder="Start typing medication name..."
                            defaultValue={initialData?.name}
                            className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Form*</Label>
                            <Select defaultValue={initialData?.form || "Capsule"}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Select form" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="Capsule">Capsule</SelectItem>
                                    <SelectItem value="Liquid">Liquid</SelectItem>
                                    <SelectItem value="Injection">Injection</SelectItem>
                                    <SelectItem value="Cream">Cream</SelectItem>
                                    <SelectItem value="Patch">Patch</SelectItem>
                                    <SelectItem value="Inhaler">Inhaler</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Strength*</Label>
                            <Input
                                placeholder="e.g., 10mg"
                                defaultValue={initialData?.strength}
                                className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Dose*</Label>
                            <Input
                                placeholder="Dose"
                                defaultValue={initialData?.dose}
                                className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Route*</Label>
                            <Select defaultValue={initialData?.route || "Oral (PO)"}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Select route" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Oral (PO)">Oral (PO)</SelectItem>
                                    <SelectItem value="Sublingual (SL)">Sublingual (SL)</SelectItem>
                                    <SelectItem value="Intravenous (IV)">Intravenous (IV)</SelectItem>
                                    <SelectItem value="Intramuscular (IM)">Intramuscular (IM)</SelectItem>
                                    <SelectItem value="Subcutaneous (SC)">Subcutaneous (SC)</SelectItem>
                                    <SelectItem value="Topical">Topical</SelectItem>
                                    <SelectItem value="Inhaled">Inhaled</SelectItem>
                                    <SelectItem value="Rectal (PR)">Rectal (PR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Frequency*</Label>
                            <Select defaultValue={initialData?.frequency || "Once daily (QD)"}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-200">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Once daily (QD)">Once daily (QD)</SelectItem>
                                    <SelectItem value="Twice daily (BID)">Twice daily (BID)</SelectItem>
                                    <SelectItem value="Three times daily (TID)">Three times daily (TID)</SelectItem>
                                    <SelectItem value="4 Times daily (QID)">4 Times daily (QID)</SelectItem>
                                    <SelectItem value="Every 4 hours (Q4H)">Every 4 hours (Q4H)</SelectItem>
                                    <SelectItem value="Every 8 hours (Q8H)">Every 8 hours (Q8H)</SelectItem>
                                    <SelectItem value="As needed (PRN)">As needed (PRN)</SelectItem>
                                    <SelectItem value="Once weekly">Once weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Duration</Label>
                            <Input
                                placeholder="e.g., 7 days, ongoing"
                                defaultValue={initialData?.duration}
                                className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-[#002D54] hover:bg-[#002D54]/90 rounded-xl text-white font-bold transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            Save Medication
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
