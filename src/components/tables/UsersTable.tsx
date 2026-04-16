"use client";
import React, { useState, useMemo } from "react";
import { Search, Eye, Trash2, Plus, Pencil, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Consultant" | "Customer";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  joinDate: string;
  initials: string;
}

const initialMockData: User[] = [
  { id: "1", name: "Dr. Sarah Miller", email: "sarah.miller@example.com", role: "Consultant", status: "PENDING", joinDate: "2026-04-01", initials: "SM" },
  { id: "2", name: "James Wilson", email: "james.w@example.com", role: "Customer", status: "ACTIVE", joinDate: "2026-03-28", initials: "JW" },
  { id: "3", name: "Atty. Robert Chen", email: "rchen@legal.com", role: "Consultant", status: "ACTIVE", joinDate: "2026-01-15", initials: "RC" },
  { id: "4", name: "Elena Rodriguez", email: "elena.r@example.com", role: "Customer", status: "SUSPENDED", joinDate: "2025-11-02", initials: "ER" },
  { id: "5", name: "Michael Chang", email: "mchang@advisor.net", role: "Consultant", status: "ACTIVE", joinDate: "2026-02-14", initials: "MC" },
  { id: "6", name: "Sophie Laurent", email: "sophie.l@example.com", role: "Customer", status: "ACTIVE", joinDate: "2026-03-30", initials: "SL" },
  { id: "7", name: "Dr. Liam Peters", email: "liam.p@example.com", role: "Consultant", status: "ACTIVE", joinDate: "2026-04-10", initials: "LP" },
  { id: "8", name: "Emma Watson", email: "emma.w@example.com", role: "Customer", status: "PENDING", joinDate: "2026-04-12", initials: "EW" },
  { id: "9", name: "Tech Advisor Ali", email: "ali.tech@example.com", role: "Consultant", status: "ACTIVE", joinDate: "2026-01-20", initials: "AA" },
  { id: "10", name: "Noah Brown", email: "noah.b@example.com", role: "Customer", status: "ACTIVE", joinDate: "2026-02-05", initials: "NB" },
  { id: "11", name: "Dr. Olivia Smith", email: "olivia.s@example.com", role: "Consultant", status: "SUSPENDED", joinDate: "2025-09-17", initials: "OS" },
  { id: "12", name: "William Davis", email: "william.d@example.com", role: "Customer", status: "ACTIVE", joinDate: "2026-03-01", initials: "WD" },
  { id: "13", name: "Legal Pro Kim", email: "kim.l@example.com", role: "Consultant", status: "ACTIVE", joinDate: "2026-02-28", initials: "LK" },
  { id: "14", name: "Lucas Taylor", email: "lucas.t@example.com", role: "Customer", status: "ACTIVE", joinDate: "2026-03-15", initials: "LT" },
  { id: "15", name: "Mia Anderson", email: "mia.a@example.com", role: "Customer", status: "PENDING", joinDate: "2026-04-16", initials: "MA" },
];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>(initialMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All Users" | "Customers" | "Consultants">("All Users");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Selected user for row actions
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Deriving table data based on filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filter by tab
      if (activeTab === "Customers" && user.role !== "Customer") return false;
      if (activeTab === "Consultants" && user.role !== "Consultant") return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [users, activeTab, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Change page handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Handlers for actions
  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setIsDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  // Counting dynamic stats for tabs
  const consultantCount = users.filter(u => u.role === "Consultant").length;
  const customerCount = users.filter(u => u.role === "Customer").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Manage customers, consultants, and their statuses
          </p>
        </div>

        {/* Add Consultation Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95">
              Add Consultation
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add Consultation</DialogTitle>
              <DialogDescription>Add a new consultant or customer to the system.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Profile Picture</label>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                     <Plus className="w-6 h-6" />
                   </div>
                   <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Upload Image</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input placeholder="John Doe" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input placeholder="john@example.com" type="email" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <Input placeholder="+1 (555) 000-0000" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Professional Details</label>
                  <Input placeholder="E.g. Certified Accountant" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Specialization</label>
                  <Input placeholder="Tax Consulting" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Sub-speciality</label>
                  <Input placeholder="Corporate Tax" className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Years of Experience</label>
                  <Input placeholder="10" type="number" className="bg-slate-50" />
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-sm font-semibold text-slate-700">Bio/About</label>
                <textarea 
                  className="w-full h-24 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="Brief description about the consultant..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="bg-[#FE6D2C] hover:bg-[#E85D20] text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-[#FE6D2C]/20 transition-transform active:scale-95"
                >
                  Save Consultation
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Tabs inside Card */}
        <div className="flex items-center gap-6 px-6 pt-5 border-b border-slate-100">
          <button 
            className={`pb-4 text-[15px] font-bold ${activeTab === "All Users" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("All Users")}
          >
            All Users
          </button>
          <button 
            className={`pb-4 text-[15px] font-bold flex items-center gap-2 ${activeTab === "Customers" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("Customers")}
          >
            Customers
            <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${activeTab === "Customers" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{customerCount}</span>
          </button>
          <button 
            className={`pb-4 text-[15px] font-bold flex items-center gap-2 ${activeTab === "Consultants" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("Consultants")}
          >
            Consultants
            <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${activeTab === "Consultants" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>{consultantCount}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-white border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-100"
                />
            </div>
        </div>

        <div className="overflow-x-auto w-full min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">USER</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ROLE</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">JOIN DATE</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold border border-blue-100">
                        {user.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-slate-800">{user.name}</span>
                        <span className="text-[13px] text-slate-400 font-medium">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                       {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wide",
                        user.status === "ACTIVE" && "bg-emerald-100 text-emerald-600",
                        user.status === "PENDING" && "bg-yellow-100 text-yellow-600",
                        user.status === "SUSPENDED" && "bg-red-100 text-red-500"
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-slate-500 font-medium">{user.joinDate}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                       <button 
                         onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}
                         className="p-1 hover:bg-blue-50 rounded-md hover:text-blue-500 transition-colors"
                         aria-label="View User"
                       >
                          <Eye className="w-4 h-4 text-blue-500" />
                       </button>
                       <button 
                         onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                         className="p-1 hover:bg-orange-50 rounded-md hover:text-orange-500 transition-colors"
                         aria-label="Edit User"
                       >
                          <Pencil className="w-4 h-4 text-orange-500" />
                       </button>
                       <button 
                         onClick={() => { setSelectedUser(user); setIsDeleteOpen(true); }}
                         className="p-1 hover:bg-red-50 rounded-md hover:text-red-500 transition-colors"
                         aria-label="Delete User"
                       >
                          <Trash2 className="w-4 h-4 text-red-500" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        {totalPages > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[13px] text-slate-500 font-medium">
              Showing <strong className="text-slate-700">{startIndex + 1}</strong> to <strong className="text-slate-700">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</strong> of <strong className="text-slate-700">{filteredUsers.length}</strong> results
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[13px] font-bold text-slate-500 border border-transparent rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "h-8 w-8 min-w-[32px] flex items-center justify-center text-[13px] font-bold rounded-lg transition-colors",
                      currentPage === pageNum 
                        ? "text-white bg-[#FE6D2C]" 
                        : "text-slate-600 border border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[13px] font-bold text-slate-500 border border-transparent rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Action Dialogs --- */}

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
                  {selectedUser.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Role</p>
                  <p className="font-semibold text-slate-800">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                  <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide",
                      selectedUser.status === "ACTIVE" && "bg-emerald-100 text-emerald-600",
                      selectedUser.status === "PENDING" && "bg-yellow-100 text-yellow-600",
                      selectedUser.status === "SUSPENDED" && "bg-red-100 text-red-500"
                    )}>
                      {selectedUser.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">User ID</p>
                  <p className="font-semibold text-slate-800 text-sm">USR-{selectedUser.id.padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Joined Date</p>
                  <p className="font-semibold text-slate-800 text-sm">{selectedUser.joinDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button 
              onClick={() => setIsViewOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors w-full"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
            <DialogDescription>Update the details for {selectedUser?.name}.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <Input defaultValue={selectedUser?.name} className="bg-slate-50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <Input defaultValue={selectedUser?.email} type="email" className="bg-slate-50" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                   <option value="Consultant" selected={selectedUser?.role === "Consultant"}>Consultant</option>
                   <option value="Customer" selected={selectedUser?.role === "Customer"}>Customer</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                   <option value="ACTIVE" selected={selectedUser?.status === "ACTIVE"}>Active</option>
                   <option value="PENDING" selected={selectedUser?.status === "PENDING"}>Pending</option>
                   <option value="SUSPENDED" selected={selectedUser?.status === "SUSPENDED"}>Suspended</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-blue-600/20 transition-transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
               <AlertCircle className="w-5 h-5" />
               Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone and will permanently remove this user from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm shadow-red-500/20 transition-colors"
            >
              Delete User
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
