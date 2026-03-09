"use client";

import React from 'react';
import { Bell, Search, User, Zap, Menu } from 'lucide-react';

export default function AdminTopbar({ onMenuClick, userEmail }: { onMenuClick: () => void; userEmail?: string }) {
    const displayName = userEmail ? userEmail.split('@')[0].toUpperCase() : 'ADMIN';
    return (
        <header className="h-20 bg-white/40 dark:bg-black/20 backdrop-blur-2xl px-6 md:px-10 flex items-center z-40 sticky top-0 border-b border-zinc-200/50 dark:border-zinc-800/50">
            {/* Mobile Menu Trigger (Only show on tablet now, BottomNav handles mobile) */}
            <button
                onClick={onMenuClick}
                className="p-2 mr-2 text-zinc-500 hover:bg-zinc-50 rounded-xl hidden md:block lg:hidden active:scale-95 transition-transform touch-target interactive-focus"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Breadcrumbs Placeholder (Contextual) */}
            <div className="flex-1 lg:flex-none">
                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span className="hidden sm:inline hover:text-sky-600 transition-colors cursor-pointer">SISTEMA</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="text-zinc-900 dark:text-white">DASHBOARD</span>
                </div>
            </div>

            {/* Search Bar - Hidden on small mobile, expandable/icon on tablet */}
            <div className="relative w-full max-w-lg mx-10 hidden lg:block">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Terminal de búsqueda..."
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl py-3.5 pl-16 pr-6 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none shadow-sm"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-6 ml-auto">
                <button className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-sky-600 hover:border-sky-500 transition-all relative shadow-sm group">
                    <Bell size={22} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-600 border-2 border-white dark:border-black group-hover:scale-110 transition-transform" />
                </button>

                <div className="h-10 w-[1.5px] bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block" />

                <div className="flex items-center gap-4 pl-2 group cursor-pointer transition-all">
                    <div className="flex flex-col items-end hidden lg:flex">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white leading-none mb-1">{displayName}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">ONLINE</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-[1.25rem] bg-sky-500 shadow-lg shadow-sky-500/30 overflow-hidden border-2 border-transparent group-hover:border-sky-400 group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
