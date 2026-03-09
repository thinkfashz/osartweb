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

export const StatCard = ({ title, value, icon: Icon, trend, description, color = "sky-500" }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="saas-glass dark:saas-glass-dark border border-white/40 dark:border-zinc-800/50 rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-sky-500/5 relative overflow-hidden group flex flex-col justify-between min-h-[180px]"
        >
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-sky-500/10 blur-[50px] group-hover:bg-sky-500/20 transition-all duration-500" />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2 font-mono">
                        {title}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                        {value}
                    </h3>
                </div>
                <div className="p-4 rounded-3xl bg-sky-500 shadow-lg shadow-sky-500/30 text-white transform group-hover:rotate-12 transition-transform duration-500">
                    <Icon size={24} />
                </div>
            </div>

            <div className="mt-8 pt-4 flex items-center gap-3 relative z-10 border-t border-zinc-200/50 dark:border-zinc-800/30">
                {trend && (
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                        {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
                {description && (
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        {description}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
