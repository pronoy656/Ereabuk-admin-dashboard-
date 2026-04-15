"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
}

export function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    itemName,
}: DeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <DialogHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-xl font-bold text-slate-800">{title}</DialogTitle>
                    <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-600 leading-relaxed">
                                {description}
                                {itemName && (
                                    <span className="block mt-2 font-bold text-slate-800 italic">
                                        "{itemName}"
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold transition-colors shadow-lg shadow-red-200"
                            onClick={() => {
                                onConfirm();
                                onOpenChange(false);
                            }}
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
