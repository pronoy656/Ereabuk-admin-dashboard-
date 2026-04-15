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
import { Textarea } from "@/components/ui/textarea";

interface AddInterchangeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: any;
    mode: "add" | "edit";
}

export function AddInterchangeDialog({ open, onOpenChange, initialData, mode }: AddInterchangeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        {mode === "add" ? "Add Therapeutic Interchange" : "Edit Therapeutic Interchange"}
                    </DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-600">Current Drug</Label>
                        <Input
                            placeholder="e.g., Norvasc 5mg"
                            defaultValue={initialData?.currentDrug}
                            className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-600">Alternative Drug</Label>
                        <Input
                            placeholder="e.g., Amlodipine 5mg"
                            defaultValue={initialData?.alternativeDrug}
                            className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Dosage Equivalence</Label>
                            <Input
                                placeholder="e.g., 1:1"
                                defaultValue={initialData?.equivalence}
                                className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-600">Cost Savings (Annual)</Label>
                            <Input
                                placeholder="$240"
                                defaultValue={initialData?.savings}
                                className="h-11 border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-600">Rationale</Label>
                        <Textarea
                            placeholder="Explain the clinical rationale for this interchange..."
                            defaultValue={initialData?.rationale}
                            className="min-h-[120px] border-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-100 resize-none"
                        />
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
                            {mode === "add" ? "Add Interchange" : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
