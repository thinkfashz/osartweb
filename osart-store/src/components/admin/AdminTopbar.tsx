"use client";

import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

export default function AdminTopbar({ onMenuClick, userEmail }: { onMenuClick: () => void; userEmail?: string }) {
    const displayName = userEmail ? userEmail.split('@')[0].toUpperCase() : 'ADMIN';
    return (
        <header className="h-20 bg-[#0d0d1a]/90 backdrop-blur-xl px-6 md:px-10 flex items-center z-40 sticky top-0 border-b border-violet-500/10">
            {/* Mobile Menu Trigger (Only show on tablet now, BottomNav handles mobile) */}
            <button
                onClick={onMenuClick}
                className="p-2 mr-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-xl hidden md:block lg:hidden active:scale-95 transition-all touch-target interactive-focus"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Breadcrumbs Placeholder (Contextual) */}
            <div className="flex-1 lg:flex-none">
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span className="hidden sm:inline hover:text-violet-400 transition-colors cursor-pointer">SISTEMA</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-white">DASHBOARD</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg mx-10 hidden lg:block">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    type="text"
                    placeholder="Terminal de búsqueda..."
                    className="w-full bg-[#111118] border border-violet-500/20 rounded-3xl py-3.5 pl-16 pr-6 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/50 transition-all outline-none text-zinc-300 placeholder:text-zinc-600"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-6 ml-auto">
                <button className="p-3.5 rounded-2xl bg-[#111118] border border-violet-500/20 text-zinc-500 hover:text-violet-400 hover:border-violet-500/40 transition-all relative shadow-sm group">
                    <Bell size={22} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#0d0d1a] group-hover:scale-110 transition-transform" />
                </button>

                <div className="h-10 w-[1.5px] bg-violet-500/10 mx-2 hidden sm:block" />

                <div className="flex items-center gap-4 pl-2 group cursor-pointer transition-all">
                    <div className="flex flex-col items-end hidden lg:flex">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white leading-none mb-1">{displayName}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">ONLINE</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-[1.25rem] bg-violet-600 shadow-lg shadow-violet-500/30 overflow-hidden border-2 border-transparent group-hover:border-violet-400 group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
