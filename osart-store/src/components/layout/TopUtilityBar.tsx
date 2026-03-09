'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, HelpCircle, Store, Percent } from 'lucide-react';

export const TopUtilityBar = () => {
    return (
        <div className="bg-zinc-950 border-b border-white/5 py-1.5 px-4 hidden md:block">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link
                        href="/vende"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <Store size={12} className="group-hover:text-blue-400" />
                        Vende en OSART
                    </Link>
                    <Link
                        href="/seguimiento"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <Truck size={12} className="group-hover:text-blue-400" />
                        Seguimiento
                    </Link>
                    <Link
                        href="/ayuda"
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                        <HelpCircle size={12} className="group-hover:text-blue-400" />
                        Ayuda
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <Percent size={10} className="text-blue-400" />
                        <span className="text-[9px] uppercase font-bold tracking-tighter text-blue-400">
                            Partner Rewards
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
