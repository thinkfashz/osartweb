'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, Zap, Clock, Package } from 'lucide-react';

export const OfferLinks = () => {
    const links = [
        { label: 'Solo Hoy', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20' },
        { label: 'Ofertas Flash', icon: Clock, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-500/20' },
        { label: 'Liquidación', icon: Tag, color: 'text-violet-300', bg: 'bg-violet-300/10', border: 'border-violet-400/20' },
        { label: 'Llega Hoy', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/20' },
        { label: 'Outlet', icon: Package, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    ];

    return (
        <div className="w-full bg-[#0d0d14] border-y border-violet-500/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.label}
                            href={`/promos/${link.label.toLowerCase().replace(' ', '-')}`}
                            className="flex items-center gap-2 group whitespace-nowrap"
                        >
                            <div className={`p-1.5 rounded-lg ${link.bg} border ${link.border} group-hover:scale-110 transition-transform`}>
                                <Icon size={14} className={link.color} />
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-500 group-hover:text-violet-300 transition-colors">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// Internal Truck icon
const Truck = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);
