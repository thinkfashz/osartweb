'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, HelpCircle, Store, Percent } from 'lucide-react';

export const TopUtilityBar = () => {
    return (
        <div className="bg-[#111118] border-b border-white/5 py-1.5 px-4 hidden md:block">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link
                        href="/vende"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <Store size={12} className="group-hover:text-violet-400 transition-colors" />
                        Vende en OSART
                    </Link>
                    <Link
                        href="/seguimiento"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <Truck size={12} className="group-hover:text-violet-400 transition-colors" />
                        Seguimiento
                    </Link>
                    <Link
                        href="/ayuda"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <HelpCircle size={12} className="group-hover:text-violet-400 transition-colors" />
                        Ayuda
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <Percent size={10} className="text-violet-400" />
                        <span className="text-[9px] uppercase font-bold tracking-tighter text-violet-400">
                            Partner Rewards
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
