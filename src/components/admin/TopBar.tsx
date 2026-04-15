"use client";
import { Input } from "@/components/ui/input";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 h-16">
      <div className="text-slate-400 text-sm font-medium">
        Admin Portal
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 text-right hover:bg-slate-50 p-1.5 rounded-lg transition-colors outline-none cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-slate-700">Super Admin</div>
                <div className="text-[10px] text-slate-400">admin@4sightrx.com</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-[#00A3A3] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SA
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

