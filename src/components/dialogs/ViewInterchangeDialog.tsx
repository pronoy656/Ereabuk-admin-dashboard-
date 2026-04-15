"use client";

import React from "react";
import { X, TrendingDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ViewInterchangeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    interchange: {
        currentDrug: string;
        alternative: string;
        costSavings: string;
        rationale: string;
    } | null;
}

export function ViewInterchangeDialog({ open, onOpenChange, interchange }: ViewInterchangeDialogProps) {
    if (!interchange) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">Interchange Details</DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Drug</Label>
                            <p className="text-slate-800 font-bold">{interchange.currentDrug}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alternative</Label>
                            <p className="text-slate-800 font-bold text-[#00A3A3]">{interchange.alternative}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost Savings</Label>
                        <div className="flex items-center gap-2 text-[#006FC9] font-bold text-lg">
                            <TrendingDown className="h-5 w-5" />
                            {interchange.costSavings}
                        </div>
                    </div>

                    <div className="space-y-1 pt-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Rationale</Label>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {interchange.rationale}
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
