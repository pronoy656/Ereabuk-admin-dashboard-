"use client";
import React from "react";
import { 
  Bell, 
  LogOut, 
  ChevronDown, 
  User, 
  Settings, 
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-10 py-4 border-b border-slate-100 bg-white sticky top-0 z-10 h-20">
      <div className="flex items-center gap-8">
        <div className="text-slate-900 text-lg font-bold tracking-tight">
          Consultant <span className="text-emerald-600">Portal</span>
        </div>
        
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-2xl text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 rounded-2xl transition-all outline-none border border-transparent hover:border-slate-100 group cursor-pointer lg:min-w-[180px]">
              <div className="hidden lg:block text-right">
                <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Dr. Sarah Smith</div>
                <div className="text-[11px] text-slate-400 font-medium">sarah.s@consultant.com</div>
              </div>
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
                  SS
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-64 p-2 mt-2 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-slate-100">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Information</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm font-bold">
                    SS
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Dr. Sarah Smith</p>
                    <p className="text-[11px] text-slate-400">Senior Consultant</p>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 group transition-all">
                <User className="w-4 h-4 text-slate-400 group-focus:text-emerald-600" />
                <span className="font-medium">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 group transition-all">
                <Settings className="w-4 h-4 text-slate-400 group-focus:text-emerald-600" />
                <span className="font-medium">Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            
            <div className="p-1">
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 group transition-all">
                <div className="p-1.5 bg-rose-50 rounded-lg group-focus:bg-rose-100">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-bold">Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

