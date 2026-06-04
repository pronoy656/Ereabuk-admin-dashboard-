"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  HeadphonesIcon,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/axios";

interface SupportInfo {
  _id: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supportInfo, setSupportInfo] = useState<SupportInfo | null>(null);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");



  // Fetch existing support info on mount
  const fetchSupportInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/customer-support");
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setSupportInfo(data);
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
      }
    } catch (error: any) {
      // 404 or no data means no support info exists yet — that's fine, user will create it
      if (error.response?.status !== 404) {
        console.error("Failed to fetch support info:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupportInfo();
  }, [fetchSupportInfo]);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (value: string) => {
    if (!value.trim()) return "Phone number is required";
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value.replace(/[\s\-()]/g, "")))
      return "Please enter a valid phone number (e.g. +1234567890)";
    return "";
  };

  const handleSave = async () => {
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phoneNumber);
    setEmailError(emailErr);
    setPhoneError(phoneErr);
    if (emailErr || phoneErr) return;

    setIsSaving(true);
    setIsSaved(false);
    try {
      const response = await api.post("/customer-support/create-update", {
        email,
        phoneNumber,
      });

      if (response.data.success) {
        setSupportInfo(response.data.data);
        setIsSaved(true);
        toast.success(
          response.data.message ||
          "Customer support information updated successfully"
        );
        setTimeout(() => setIsSaved(false), 4000);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to save support information. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (supportInfo) {
      setEmail(supportInfo.email);
      setPhoneNumber(supportInfo.phoneNumber);
    } else {
      setEmail("");
      setPhoneNumber("");
    }
    setEmailError("");
    setPhoneError("");
    setIsSaved(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p className="font-medium">Loading support information...</p>
      </div>
    );
  }

  return (
    <div className="py-10 animate-in fade-in duration-500 space-y-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Customer Support
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage the support contact information shown to users.
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl">
          <HeadphonesIcon className="w-7 h-7 text-blue-600" />
        </div>
      </div>



      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 font-medium leading-relaxed">
          This information will be displayed to users when they need to contact
          support. Make sure the details are accurate and up to date.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-6 md:p-8">
          <CardTitle className="text-xl font-bold text-slate-800">
            Contact Information
          </CardTitle>
          <CardDescription>
            Update the email and phone number for customer support.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Email Field */}
          <div className="space-y-3">
            <Label
              htmlFor="supportEmail"
              className="text-sm font-bold text-slate-700"
            >
              Support Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                id="supportEmail"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(validateEmail(e.target.value));
                }}
                placeholder="support@example.com"
                className={`h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all font-semibold text-slate-800 ${emailError
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/10"
                    : "focus:ring-blue-500/20"
                  }`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-rose-500 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-3">
            <Label
              htmlFor="supportPhone"
              className="text-sm font-bold text-slate-700"
            >
              Support Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                id="supportPhone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (phoneError) setPhoneError(validatePhone(e.target.value));
                }}
                placeholder="+1234567890"
                className={`h-14 pl-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all font-semibold text-slate-800 ${phoneError
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/10"
                    : "focus:ring-blue-500/20"
                  }`}
              />
            </div>
            {phoneError && (
              <p className="text-sm text-rose-500 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {phoneError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              {isSaved && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Support info saved successfully</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={isSaving}
                className="px-6 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold transition-all"
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-60"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Info Preview Card */}
      {supportInfo && (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="border-b border-slate-50 p-6 md:p-8">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Current Active Support Info
            </CardTitle>
            <CardDescription>
              This is what users will see when reaching out for help.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-sm font-bold text-slate-800 break-all">
                    {supportInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {supportInfo.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
