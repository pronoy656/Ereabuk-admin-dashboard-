"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserRound,
  FileSpreadsheet,
  BarChart3,
  LogOut,
  ChevronLeft,
  LucideIcon,
} from "lucide-react";

type IconType = LucideIcon;

const items: Array<{
  href: string;
  label: string;
  Icon: IconType;
}> = [
    { href: "/overview", label: "Overview", Icon: LayoutDashboard },
    { href: "/users", label: "Users", Icon: Users },
    // { href: "/facilities", label: "Facilities / Agencies", Icon: Building2 },
    { href: "/patients", label: "Patients", Icon: UserRound },
    { href: "/formularies", label: "Formularies", Icon: FileSpreadsheet },
    // { href: "/analytics", label: "Analytics", Icon: BarChart3 },
  ];

export default function Sidebar({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname ?? "";
  return (
    <aside className="h-screen w-64 bg-white text-slate-600 border-r border-slate-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6 pb-2">
        <div className="flex items-center w-full min-h-[60px]">
          <Image
            src="/logo.png"
            alt="4sightRX Logo"
            width={400}
            height={120}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 px-0 py-4 space-y-1">
        {items.map((item) => {
          const isActive = current === item.href || current.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm transition-colors relative",
                isActive
                  ? "bg-blue-50 text-[#006FC9] font-medium"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#006FC9]" />
              )}
              <item.Icon className={cn("h-5 w-5", isActive ? "text-[#006FC9]" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
