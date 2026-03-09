'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, Zap, Clock, Package } from 'lucide-react';

export const OfferLinks = () => {
    const links = [
        { label: 'Solo Hoy', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Ofertas Flash', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'Liquidación', icon: Tag, color: 'text-red-400', bg: 'bg-red-400/10' },
        { label: 'Llega Hoy', icon: Truck, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Outlet', icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];

    return (
        <div className="w-full bg-zinc-900/30 border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
                {links.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.label}
                            href={`/promos/${link.label.toLowerCase().replace(' ', '-')}`}
                            className="flex items-center gap-2 group whitespace-nowrap"
                        >
                            <div className={`p-1.5 rounded-lg ${link.bg} border border-white/5 group-hover:scale-110 transition-transform`}>
                                <Icon size={14} className={link.color} />
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// Internal Truck icon for the link
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
