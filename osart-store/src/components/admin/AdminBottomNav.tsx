"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Inicio', icon: LayoutDashboard, path: '/admin' },
    { name: 'Productos', icon: Package, path: '/admin/products' },
    { name: 'Stock', icon: TrendingUp, path: '/admin/stock' },
    { name: 'Menú', icon: MoreHorizontal, path: '#menu', isMenuIndicator: true },
];

export default function AdminBottomNav({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-safe pt-2 bg-[#0d0d1a] border-t border-violet-500/10">
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

            <nav className="flex items-center justify-around h-16 w-full max-w-sm mx-auto relative pb-safe">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path && !item.isMenuIndicator;

                    if (item.isMenuIndicator) {
                        return (
                            <button
                                key={item.name}
                                onClick={onMenuClick}
                                className="flex flex-col items-center justify-center w-full h-full gap-1 text-zinc-500 hover:text-violet-300 transition-colors group relative"
                            >
                                <item.icon size={20} className="group-active:scale-95 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative group ${
                                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <item.icon size={20} className={`transition-transform duration-300 ${isActive ? '-translate-y-1 text-violet-400' : 'group-active:scale-95'}`} />

                            <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                                isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                            }`}>
                                {item.name}
                            </span>

                            {/* Active Dot Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
