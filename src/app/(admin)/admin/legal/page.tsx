"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Shield, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/axios";
import { format } from "date-fns";

interface Term {
  id: string;
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function LegalManagementPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/terms");
      if (response.data.success) {
        setTerms(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch terms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post("/terms", { title, content });
      if (response.data.success) {
        toast.success("Terms & Conditions created successfully");
        setIsDialogOpen(false);
        setTitle("");
        setContent("");
        fetchTerms(); // Refresh the list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create terms");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const response = await api.delete(`/terms/${deleteId}`);
      if (response.data.success) {
        toast.success("Term deleted successfully");
        setDeleteId(null);
        fetchTerms(); // Refresh the list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete term");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-10 animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Legal Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your platform's Terms and Conditions.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Add terms and condition
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-8 border-none shadow-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                Add New Term
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Privacy and Data Usage"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500/20 transition-all font-semibold text-slate-800"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Content</label>
                <Textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the legal content here..."
                  className="min-h-[200px] rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-blue-500/20 transition-all font-medium p-6 resize-none text-slate-600"
                />
              </div>

              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg gap-3 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 mt-4"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Term"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
              <p className="font-medium">Loading terms...</p>
            </div>
          ) : terms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No terms found</h3>
              <p className="text-slate-500 font-medium max-w-sm">You haven't added any terms and conditions yet. Click the button above to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="py-5 font-bold text-slate-600 rounded-tl-3xl pl-8">Title</TableHead>
                  <TableHead className="py-5 font-bold text-slate-600 w-[45%]">Content snippet</TableHead>
                  <TableHead className="py-5 font-bold text-slate-600">Created At</TableHead>
                  <TableHead className="py-5 font-bold text-slate-600 text-right rounded-tr-3xl pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term) => (
                  <TableRow key={term._id} className="border-slate-100 transition-colors hover:bg-slate-50/50 group">
                    <TableCell className="py-5 pl-8 font-bold text-slate-800 align-top">
                      {term.title}
                    </TableCell>
                    <TableCell className="py-5 align-top">
                      <p className="text-slate-500 font-medium line-clamp-2 text-[14px] leading-relaxed">
                        {term.content}
                      </p>
                    </TableCell>
                    <TableCell className="py-5 text-slate-500 font-medium align-top">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {term.createdAt ? format(new Date(term.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-right pr-8 align-top">
                      <Button
                        variant="ghost"
                        onClick={() => setDeleteId(term._id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all h-10 w-10 p-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-slate-800 text-center">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
              <Trash2 className="w-8 h-8" />
            </div>
            <p className="text-slate-500 text-center font-medium max-w-[280px]">
              Are you sure you want to delete this term? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 mt-8">
            <Button
              variant="ghost"
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-2xl h-12 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Term"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
