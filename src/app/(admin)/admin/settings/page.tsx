"use client";

import React, { useState, useRef } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(""); // Mock empty

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your administrator account details.</p>
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-6 md:p-8">
          <CardTitle className="text-xl font-bold text-slate-800">Administrator Details</CardTitle>
          <CardDescription>Update your photo and personal information.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group cursor-pointer" onClick={triggerFileUpload}>
              <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback className="text-xl bg-blue-50 text-blue-600 font-bold">SA</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-6 w-6" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfileImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Button variant="outline" size="sm" className="rounded-xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all" onClick={triggerFileUpload}>
                Change Photo
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Form Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name</Label>
                <Input id="firstName" defaultValue="Super" className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name</Label>
                <Input id="lastName" defaultValue="Admin" className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium" />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Footer Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {isSaved && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Settings saved successfully</span>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" className="px-6 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold transition-all">Cancel</Button>
              <Button 
                className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
