"use client";

import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Target, Activity, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KpiProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
    subLabel?: string;
    index: number;
}

const KpiCard = ({ title, value, change, trend, icon: Icon, subLabel, index }: KpiProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
    >
        {/* Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-slate-100 transition-colors duration-500" />

        <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">{title}</h3>
                </div>
                <p className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">{value}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-950 text-white shadow-xl shadow-slate-900/10 transition-transform group-hover:scale-110 group-hover:rotate-6",
                )}>
                    <Icon size={20} />
                </div>
                <div className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                    trend === 'up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                )}>
                    {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {change}
                </div>
            </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subLabel || "System verified"}</span>
            <Layers size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
        </div>

        {/* Industrial Detail Overlay */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-slate-950 group-hover:w-full transition-all duration-700" />
    </motion.div>
);

export default function SalesKpis({ summary }: { summary: any }) {
    const formatPrice = (val: number) =>
        new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(val || 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
                index={0}
                title="Revenue Throughput"
                value={formatPrice(summary?.totalRevenue)}
                change="+12.5%"
                trend="up"
                icon={DollarSign}
                subLabel="Alpha-1 Protocol"
            />
            <KpiCard
                index={1}
                title="Operations Count"
                value={String(summary?.totalOrders || 0)}
                change="+8.2%"
                trend="up"
                icon={ShoppingBag}
                subLabel="Live Processing"
            />
            <KpiCard
                index={2}
                title="Average Ticket"
                value={formatPrice(summary?.avgOrderValue)}
                change="-2.1%"
                trend="down"
                icon={Target}
                subLabel="Value Index"
            />
            <KpiCard
                index={3}
                title="Efficiency Ratio"
                value="98.4%"
                change="+0.5%"
                trend="up"
                icon={Activity}
                subLabel="Stability Index"
            />
        </div>
    );
}
