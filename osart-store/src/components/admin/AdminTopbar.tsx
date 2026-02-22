"use client";

import React from 'react';
import { Bell, Search, User, Zap, Menu } from 'lucide-react';

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-4 md:px-8 flex items-center z-40 sticky top-0 safe-area-pt">
            {/* Mobile Menu Trigger */}
            <button
                onClick={onMenuClick}
                className="p-2 mr-2 text-zinc-500 hover:bg-zinc-50 rounded-xl lg:hidden active:scale-95 transition-transform touch-target interactive-focus"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Breadcrumbs Placeholder (Contextual) */}
            <div className="flex-1 lg:flex-none">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="hidden sm:inline">OSART</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-zinc-900">ADMIN</span>
                </div>
            </div>

            {/* Search Bar - Hidden on small mobile, expandable/icon on tablet */}
            <div className="relative w-full max-w-md mx-6 hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                    type="text"
                    placeholder="Escanear sistema..."
                    className="w-full bg-zinc-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-zinc-950 transition-all outline-none"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                <button className="p-2.5 rounded-2xl bg-zinc-50 text-zinc-500 hover:bg-zinc-100 transition-colors relative touch-target interactive-focus">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
                </button>

                <div className="h-8 w-[1px] bg-zinc-100 mx-1 sm:mx-2" />

                <div className="flex items-center gap-2 md:gap-3 pl-1 group cursor-pointer touch-target interactive-focus">
                    <div className="flex flex-col items-end hidden lg:flex">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Eduardo AR.</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Fleet Admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-transparent group-hover:border-zinc-950 transition-all flex items-center justify-center shrink-0 shadow-sm">
                        <User size={20} className="text-zinc-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
