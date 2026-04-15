"use client";
import React, { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Blocked";
  lastLogin: string;
  isActive: boolean;
  initials: string;
}

const initialData: User[] = [
  { id: "1", name: "Dr. Emily Chen", email: "emily.chen@stmarys.com", status: "Active", lastLogin: "2 hours ago", isActive: true, initials: "DEC" },
  { id: "2", name: "PharmD Sarah Johnson", email: "sarah.j@comfort.com", status: "Active", lastLogin: "5 hours ago", isActive: true, initials: "PSJ" },
  { id: "3", name: "Nurse Mike Peterson", email: "mike.p@greenwood.com", status: "Active", lastLogin: "1 day ago", isActive: true, initials: "NMP" },
  { id: "4", name: "Dr. Robert Lee", email: "robert.lee@memorial.com", status: "Active", lastLogin: "3 hours ago", isActive: true, initials: "DRL" },
  { id: "5", name: "Admin User", email: "admin@4sightrx.com", status: "Active", lastLogin: "1 hour ago", isActive: true, initials: "AU" },
  { id: "6", name: "Dr. Linda Martinez", email: "linda.m@stmarys.com", status: "Blocked", lastLogin: "2 weeks ago", isActive: false, initials: "DLM" },
  { id: "7", name: "PharmD John Davis", email: "john.d@comfort.com", status: "Active", lastLogin: "12 hours ago", isActive: true, initials: "PJD" },
  { id: "8", name: "Physician Asst. Sarah Wilson", email: "s.wilson@stmarys.com", status: "Active", lastLogin: "4 hours ago", isActive: true, initials: "SW" },
  { id: "9", name: "Nurse Amy Wilson", email: "amy.w@greenwood.com", status: "Active", lastLogin: "6 hours ago", isActive: true, initials: "NAW" },
  { id: "10", name: "Dr. William Smith", email: "w.smith@memorial.com", status: "Active", lastLogin: "10 mins ago", isActive: true, initials: "WS" },
  { id: "11", name: "Pharmacy Tech Ben White", email: "b.white@comfort.com", status: "Blocked", lastLogin: "1 month ago", isActive: false, initials: "BW" },
  { id: "12", name: "Clinical Director Jane Doe", email: "j.doe@4sightrx.com", status: "Active", lastLogin: "Just now", isActive: true, initials: "JD" },
  { id: "13", name: "Dr. Kevin Brown", email: "k.brown@stmarys.com", status: "Active", lastLogin: "45 mins ago", isActive: true, initials: "KB" },
  { id: "14", name: "Nurse Jessica Tailor", email: "j.tailor@greenwood.com", status: "Active", lastLogin: "3 hours ago", isActive: true, initials: "JT" },
  { id: "15", name: "Admin Asst. Chris Evans", email: "c.evans@memorial.com", status: "Active", lastLogin: "1 day ago", isActive: true, initials: "CE" },
  { id: "16", name: "Dr. Rachel Green", email: "r.green@stmarys.com", status: "Active", lastLogin: "2 hours ago", isActive: true, initials: "RG" },
];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleToggle = (id: string, checked: boolean) => {
    console.log(`User ${id} toggle state: ${checked}`);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: checked } : u))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Manage users, roles, and permissions across all facilities
        </p>
      </div>

      {/* Search box card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-12 h-12 bg-white border-slate-200 rounded-xl text-slate-800 focus-visible:ring-1 focus-visible:ring-blue-100"
          />
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    NAME <ChevronsUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    NAME <ChevronsUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    STATUS <ChevronsUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    LAST LOGIN <ChevronsUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold",
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-500"
                          : "bg-red-50 text-red-400"
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={(checked) => handleToggle(user.id, checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        <div className="px-6 py-6 border-t border-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 text-sm font-bold text-blue-800 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    ? "text-white bg-[#002D54]"
                    : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 text-sm font-bold text-blue-800 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
