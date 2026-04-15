"use client";

import React, { useState } from "react";
import { Search, ChevronsUpDown, Plus, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddPatientDialog } from "@/components/dialogs/AddPatientDialog";
import { ViewPatientDialog } from "@/components/dialogs/ViewPatientDialog";
import { cn } from "@/lib/utils";

interface Patient {
    id: string;
    mrn: string;
    name: string;
    admissionDate: string;
    ageGender: string;
    facility: string;
    status: "Active" | "Archived";
    lastUpdated: string;
    notes?: string;
}

const initialData: Patient[] = [
    {
        id: "1",
        mrn: "MRN-45678",
        name: "Margaret Thompson",
        admissionDate: "Jan 28, 2026",
        ageGender: "78 / Female",
        facility: "St. Mary's Hospital",
        status: "Active",
        lastUpdated: "2 hours ago",
        notes: "Patient is recovering well. Monitoring blood pressure daily. No signs of infection at surgical site.",
    },
    {
        id: "2",
        mrn: "MRN-45679",
        name: "Robert Williams",
        admissionDate: "Feb 1, 2026",
        ageGender: "65 / Male",
        facility: "Comfort Care Hospice",
        status: "Active",
        lastUpdated: "1 day ago",
        notes: "On palliative care plan. Pain management is the priority. Patient is comfortable today.",
    },
    {
        id: "3",
        mrn: "MRN-45680",
        name: "Elizabeth Brown",
        admissionDate: "Jan 15, 2026",
        ageGender: "82 / Female",
        facility: "Greenwood LTC",
        status: "Active",
        lastUpdated: "3 hours ago",
        notes: "Needs assistance with mobility. Diet adjusted to soft foods. Family visited yesterday.",
    },
    {
        id: "4",
        mrn: "MRN-45681",
        name: "James Davis",
        admissionDate: "Feb 5, 2026",
        ageGender: "71 / Male",
        facility: "Memorial Medical",
        status: "Active",
        lastUpdated: "5 hours ago",
        notes: "Admitted for respiratory issues. Responding well to antibiotics. Stable condition.",
    },
    {
        id: "5",
        mrn: "MRN-45682",
        name: "Patricia Miller",
        admissionDate: "Jan 10, 2026",
        ageGender: "68 / Female",
        facility: "St. Mary's Hospital",
        status: "Archived",
        lastUpdated: "1 week ago",
        notes: "Discharged from hospital. Follow-up scheduled for next month. Home health care arranged.",
    },
];

export default function PatientsTable() {
    const [patients, setPatients] = useState<Patient[]>(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredPatients = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

    const handleViewPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Patient Management</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage patient records across all facilities
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="h-11 px-6 bg-[#002B54] hover:bg-[#002B54]/90 rounded-xl text-white font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Patient
                </Button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-12 h-12 bg-white border-slate-200 rounded-xl text-slate-800 focus-visible:ring-1 focus-visible:ring-blue-100"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        PATIENT NAME <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        ADMISSION DATE <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        AGE / GENDER <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        FACILITY <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                                        STATUS <ChevronsUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{patient.name}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-widest font-medium mt-0.5">ID: {patient.mrn}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {patient.admissionDate}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {patient.ageGender}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {patient.facility}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold",
                                                patient.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-500"
                                                    : "bg-slate-800 text-slate-300"
                                            )}
                                        >
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewPatient(patient)}
                                            className="h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination section */}
                <div className="px-6 py-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-sm text-slate-500 font-medium">
                        Showing {filteredPatients.length > 0 ? startIndex + 1 : 0} of {filteredPatients.length} users
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

            {/* Add Patient Dialog */}
            <AddPatientDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
            />

            {/* View Patient Dialog */}
            <ViewPatientDialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                patient={selectedPatient}
            />
        </div>
    );
}
