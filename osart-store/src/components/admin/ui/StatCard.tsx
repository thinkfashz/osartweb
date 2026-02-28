"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    description?: string;
    color?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, description, color = "electric-blue" }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-white/5 rounded-2xl p-4 md:p-6 shadow-sm hover:border-electric-blue/30 transition-all relative overflow-hidden group flex flex-col justify-between min-h-[140px]"
        >
            {/* Background Accent */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-electric-blue/5 transition-colors`} />

            <div className="flex items-start justify-between relative z-10 gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1 truncate">
                        {title}
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter italic truncate">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 text-electric-blue group-hover:bg-electric-blue group-hover:text-black transition-all`}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2 relative z-10">
                {trend && (
                    <span className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
                    </span>
                )}
                {description && (
                    <span className="text-[8px] md:text-[10px] font-medium text-zinc-400 uppercase tracking-wider truncate">
                        {description}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
