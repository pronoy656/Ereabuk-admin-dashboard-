"use client";

import React from "react";
import { MedicationsTable } from "@/components/tables/MedicationsTable";
import { InterchangesTable } from "@/components/tables/InterchangesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FormularyPage() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Formulary Management</h1>
                <p className="text-slate-500 mt-1 font-medium text-lg">
                    Manage medications, therapeutic interchanges, and facility-specific rules
                </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
                <Tabs defaultValue="medications" className="w-full">
                    <div className="px-6 pt-2">
                        <TabsList>
                            <TabsTrigger value="medications">Medications</TabsTrigger>
                            <TabsTrigger value="interchanges">Therapeutic Interchanges</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 pt-0">
                        <TabsContent value="medications">
                            <MedicationsTable />
                        </TabsContent>
                        <TabsContent value="interchanges">
                            <InterchangesTable />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
