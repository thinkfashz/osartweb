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
            className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
        >
            {/* Background Accent */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-zinc-50 group-hover:bg-${color}/5 transition-colors`} />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tighter italic">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl bg-zinc-50 text-zinc-950 group-hover:bg-zinc-950 group-hover:text-white transition-all`}>
                    <Icon size={20} />
                </div>
            </div>

            {(trend || description) && (
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
                        </span>
                    )}
                    {description && (
                        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                            {description}
                        </span>
                    )}
                </div>
            )}
        </motion.div>
    );
};
