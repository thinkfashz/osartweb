"use client";

import React from 'react';
import { Bell, Search, User, Zap } from 'lucide-react';

export default function AdminTopbar() {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-8 flex items-center justify-between z-40 sticky top-0">
            {/* Search Bar */}
            <div className="relative w-96 hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Search technical data, units or clients..."
                    className="w-full bg-zinc-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-zinc-950 transition-all outline-none"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2.5 rounded-2xl bg-zinc-50 text-zinc-500 hover:bg-zinc-100 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
                </button>

                <div className="h-8 w-[1px] bg-zinc-100 mx-2" />

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-bold text-zinc-950">Eduardo AR.</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">Fleet Admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 overflow-hidden border-2 border-transparent group-hover:border-zinc-950 transition-all flex items-center justify-center">
                        <User size={20} className="text-zinc-400" />
                    </div>
                </div>

                <div className="p-1 pl-2">
                    <div className="bg-electric-blue/10 rounded-2xl p-1 pr-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-electric-blue flex items-center justify-center shadow-lg shadow-electric-blue/20">
                            <Zap size={16} className="text-zinc-950 fill-zinc-950" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-electric-blue-deep leading-none">System<br />Online</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
