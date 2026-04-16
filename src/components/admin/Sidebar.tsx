"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const items = [
  {
    group: "Main Menu", links: [
      { href: "/admin/overview", label: "Overview", Icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", Icon: Users },
      { href: "/admin/live-monitoring", label: "Live Monitoring", Icon: Activity },
      { href: "/admin/payments", label: "Payments", Icon: CreditCard },
    ]
  },
  {
    group: "Preferences", links: [
      { href: "/admin/settings", label: "Settings", Icon: Settings },
      { href: "/admin/help", label: "Help & Support", Icon: HelpCircle },
    ]
  }
];

export default function Sidebar({ active }: { active?: string }) {
  const pathname = usePathname();
  const current = active ?? pathname ?? "";

  return (
    <aside className="h-screen w-64 bg-white text-slate-600 border-r border-slate-100 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 w-full">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-px -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">Fixpair</span>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-1 ml-0.5">Admin</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto">
        {items.map((group) => (
          <div key={group.group} className="space-y-3">
            <h4 className="px-4 text-[11px] font-bold mb-4  text-slate-400 uppercase tracking-[0.15em]">
              {group.group}
            </h4>
            <nav className="space-y-1">
              {group.links.map((item) => {
                const isActive = current === item.href || current.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-95"
                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    )}
                  >
                    <item.Icon className={cn(
                      "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[24px] group border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-600/20">
              SA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[100px]">Super Admin</p>
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
          </div>
          <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group/logout">
            <LogOut className="w-5 h-5 transition-transform group-hover/logout:-translate-x-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
