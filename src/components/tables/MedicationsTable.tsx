"use client";

import React, { useState } from "react";
import { Search, ChevronsUpDown, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddMedicationDialog } from "@/components/dialogs/AddMedicationDialog";
import { ViewMedicationDialog } from "@/components/dialogs/ViewMedicationDialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { cn } from "@/lib/utils";

interface Medication {
    id: string;
    name: string;
    brand: string;
    genericName: string;
    strengthForm: string;
    status: "Preferred" | "Non-Preferred";
}

const initialData: Medication[] = [
    {
        id: "1",
        name: "Lisinopril",
        brand: "ACE Inhibitor",
        genericName: "Lisinopril",
        strengthForm: "10mg Tablet",
        status: "Preferred",
    },
    {
        id: "2",
        name: "Norvasc",
        brand: "Calcium Channel Blocker",
        genericName: "Amlodipine",
        strengthForm: "5mg Tablet",
        status: "Non-Preferred",
    },
    {
        id: "3",
        name: "Metformin",
        brand: "Antidiabetic",
        genericName: "Metformin",
        strengthForm: "500mg Tablet",
        status: "Preferred",
    },
    {
        id: "4",
        name: "Lipitor",
        brand: "Statin",
        genericName: "Atorvastatin",
        strengthForm: "20mg Tablet",
        status: "Non-Preferred",
    },
    {
        id: "5",
        name: "Levothyroxine",
        brand: "Thyroid Hormone",
        genericName: "Levothyroxine",
        strengthForm: "50mcg Tablet",
        status: "Preferred",
    },
];

export function MedicationsTable() {
    const [medications, setMedications] = useState<Medication[]>(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = medications.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleView = (med: Medication) => {
        setSelectedMed(med);
        setIsViewDialogOpen(true);
    };

    const handleEdit = (med: Medication) => {
        setSelectedMed(med);
        setDialogMode("edit");
        setIsAddDialogOpen(true);
    };

    const handleDelete = (med: Medication) => {
        setSelectedMed(med);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setMedications(medications.filter((m) => m.id !== selectedMed?.id));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search medications..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-12 h-12 bg-white border-slate-200 rounded-xl text-slate-800 focus-visible:ring-1 focus-visible:ring-blue-100"
                    />
                </div>
                <Button
                    onClick={() => {
                        setDialogMode("add");
                        setSelectedMed(null);
                        setIsAddDialogOpen(true);
                    }}
                    className="h-12 px-6 bg-[#002B54] hover:bg-[#002B54]/90 rounded-xl text-white font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                    <Plus className="h-5 w-5" />
                    Add Medication
                </Button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[480px] flex flex-col justify-between">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        DRUG NAME (BRAND) <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        GENERIC NAME <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        STRENGTH / FORM <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        PREFERRED STATUS <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedData.map((med) => (
                                <tr key={med.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{med.name}</div>
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">{med.brand}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {med.genericName}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {med.strengthForm}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold",
                                                med.status === "Preferred"
                                                    ? "bg-emerald-50 text-emerald-500"
                                                    : "bg-red-50 text-red-500"
                                            )}
                                        >
                                            {med.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(med)}
                                                className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(med)}
                                                className="h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(med)}
                                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination section */}
                <div className="px-6 py-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-sm text-slate-500 font-medium">
                        Showing {filteredData.length > 0 ? startIndex + 1 : 0} of {filteredData.length} records
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            className="px-5 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "h-10 w-10 flex items-center justify-center text-sm font-bold rounded-xl transition-colors",
                                    currentPage === page
                                        ? "text-white bg-[#001D3D]"
                                        : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            className="px-5 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <AddMedicationDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                mode={dialogMode}
                initialData={selectedMed}
            />

            <ViewMedicationDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                medication={selectedMed}
            />

            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                itemName={selectedMed?.name}
            />
        </div>
    );
}
