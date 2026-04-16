"use client";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type AuthLayoutShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export default function AuthLayoutShell({
  children,
}: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white text-black">
      {/* Left Side: Hero Image and Text */}
      <div className="relative hidden md:flex flex-col p-12 lg:p-16 overflow-hidden">
        <Image
          src="/hero_building.png"
          alt="Office Background"
          priority
          fill
          className="object-cover"
        />
        {/* Dual Gradient Overlay matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#9B4527]/95 via-[#633945]/85 to-[#0E3D73]/95 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C55F37]/90 via-[#8F5558]/80 to-[#12589E]/90" />

        {/* Center Logo Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20">
           <div className="flex flex-col items-center gap-2">
             {/* Abstract CSS Fixpair 'F' Icon */}
             <div className="relative w-24 h-28 drop-shadow-2xl mb-2 opacity-95">
                <div className="absolute top-0 right-0 w-[80px] h-[32px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-r-full rounded-bl-3xl rounded-tl-xl z-10 shadow-sm" />
                <div className="absolute top-[16px] left-[10px] w-[32px] h-[80px] bg-gradient-to-b from-blue-700 to-blue-800 rounded-b-full rounded-tl-xl rounded-tr-md shadow-md" />
                <div className="absolute top-[52px] left-[20px] w-[50px] h-[32px] bg-gradient-to-r from-blue-600 to-blue-500 rounded-r-full rounded-bl-full z-0" />
             </div>
             
             {/* fixpair Text Block */}
             <div className="flex items-baseline text-[64px] font-bold tracking-[-0.03em] drop-shadow-md">
               <span className="text-[#0a1a3a]">fix</span>
               <span className="text-[#1d58d8]">pa</span>
               <span className="text-[#25b5ea]">ir</span>
             </div>
           </div>
        </div>

        {/* Text Content at bottom left */}
        <div className="relative z-10 w-full mb-4">
          <h1 className="text-[32px] lg:text-[40px] font-bold text-white mb-10 leading-[1.1] tracking-tight">
            Join Germany's leading <br />
            consultation marketplace.
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-orange-400 stroke-[2.5]" />
              <span className="text-white font-medium text-[15px] tracking-wide">Set your own hourly rates</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-orange-400 stroke-[2.5]" />
              <span className="text-white font-medium text-[15px] tracking-wide">Access thousands of potential clients</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-orange-400 stroke-[2.5]" />
              <span className="text-white font-medium text-[15px] tracking-wide">Handle scheduling and billing in one place</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[500px] flex flex-col items-center text-center">
          {/* Right Panel Logo Section */}
          <div className="mb-12 flex justify-center">
             <div className="flex items-baseline text-[42px] font-bold tracking-[-0.03em]">
               <span className="text-slate-900">fix</span>
               <span className="text-blue-600">pa</span>
               <span className="text-cyan-500">ir</span>
             </div>
          </div>

          {/* Form Content */}
          <div className="w-full text-left text-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
