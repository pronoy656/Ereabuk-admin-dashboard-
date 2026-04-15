"use client";

import React, { useState } from "react";
import { Search, ChevronsUpDown, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddInterchangeDialog } from "@/components/dialogs/AddInterchangeDialog";
import { ViewInterchangeDialog } from "@/components/dialogs/ViewInterchangeDialog";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { cn } from "@/lib/utils";

interface Interchange {
    id: string;
    currentDrug: string;
    alternative: string;
    costSavings: string;
    rationale: string;
}

const initialData: Interchange[] = [
    {
        id: "1",
        currentDrug: "Norvasc 5mg",
        alternative: "Amlodipine 5mg (1:1)",
        costSavings: "$240/year",
        rationale: "Generic equivalent",
    },
    {
        id: "2",
        currentDrug: "Lipitor 20mg",
        alternative: "Atorvastatin 20mg (1:1)",
        costSavings: "$360/year",
        rationale: "Generic equivalent",
    },
    {
        id: "3",
        currentDrug: "Plavix 75mg",
        alternative: "Clopidogrel 75mg (1:1)",
        costSavings: "$420/year",
        rationale: "Generic equivalent",
    },
];

export function InterchangesTable() {
    const [interchanges, setInterchanges] = useState<Interchange[]>(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedInter, setSelectedInter] = useState<Interchange | null>(null);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = interchanges.filter(
        (i) =>
            i.currentDrug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.alternative.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleView = (inter: Interchange) => {
        setSelectedInter(inter);
        setIsViewDialogOpen(true);
    };

    const handleEdit = (inter: Interchange) => {
        setSelectedInter(inter);
        setDialogMode("edit");
        setIsAddDialogOpen(true);
    };

    const handleDelete = (inter: Interchange) => {
        setSelectedInter(inter);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setInterchanges(interchanges.filter((i) => i.id !== selectedInter?.id));
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search interchanges..."
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
                        setSelectedInter(null);
                        setIsAddDialogOpen(true);
                    }}
                    className="h-12 px-6 bg-[#002B54] hover:bg-[#002B54]/90 rounded-xl text-white font-bold flex items-center gap-2 transition-colors shrink-0"
                >
                    <Plus className="h-5 w-5" />
                    Add Interchange
                </Button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[480px] flex flex-col justify-between">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        CURRENT DRUG <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        ALTERNATIVE <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        COST SAVINGS <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        RATIONALE <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedData.map((inter) => (
                                <tr key={inter.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 text-sm font-bold text-slate-800">
                                        {inter.currentDrug}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {inter.alternative}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-[#006FC9]">
                                        {inter.costSavings}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                        {inter.rationale}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(inter)}
                                                className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(inter)}
                                                className="h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(inter)}
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
                        {/* Same pagination logic as MedicationsTable */}
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

            <AddInterchangeDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                mode={dialogMode}
                initialData={selectedInter}
            />

            <ViewInterchangeDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                interchange={selectedInter}
            />

            <DeleteDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                itemName={selectedInter?.currentDrug}
            />
        </div>
    );
}
