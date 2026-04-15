"use client";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="relative hidden md:flex flex-col justify-end p-12 overflow-hidden">
        <Image
          src="/auth-hero.png"
          alt="Healthcare professionals collaborating"
          priority
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002D54]/90 via-[#002D54]/40 to-transparent" />

        {/* Text Content over Image */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Advancing Patient Care Through Precision Data
          </h1>
          <p className="text-lg text-blue-50/80 leading-relaxed font-medium">
            Join thousands of specialized healthcare professionals using 4sightRX
            to streamline clinical decision-making and improve patient outcomes.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[500px] flex flex-col items-center text-center">
          {/* Logo Section */}
          <div className="mb-12">
            <Image
              src="/logo2.png"
              alt="4sightRX Logo"
              width={240}
              height={60}
              className="object-contain"
              priority
            />
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
