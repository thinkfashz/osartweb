"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    TrendingUp,
    ShoppingBag,
    Truck,
    Box,
    Zap,
    ShieldAlert,
    Cpu,
    Globe,
    Database,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    RefreshCcw,
    ZapOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonitoringCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: string; positive: boolean };
    status: 'optimal' | 'warning' | 'critical' | 'processing';
    index: number;
    prefix?: string;
}

const MonitoringCard = ({ title, value, description, icon: Icon, trend, status, index, prefix }: MonitoringCardProps) => {
    const statusColors = {
        optimal: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        warning: "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
        critical: "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
        processing: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse"
    };

    const textColors = {
        optimal: "text-emerald-600",
        warning: "text-orange-600",
        critical: "text-rose-600",
        processing: "text-blue-600"
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative bg-white border border-slate-100 p-8 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
        >
            {/* Technical Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{title}</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            {prefix && <span className="text-xl md:text-2xl font-black text-slate-300 italic">{prefix}</span>}
                            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tighter italic uppercase underline decoration-slate-100 decoration-8 underline-offset-8">
                                {value}
                            </span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                        <Icon size={24} />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {description}
                    </p>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest",
                            trend.positive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                        )}>
                            {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {trend.value}
                        </div>
                    )}
                </div>
            </div>

            {/* Industrial Bottom Bar */}
            <div className={cn("absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700",
                status === 'optimal' ? 'bg-emerald-500' :
                    status === 'warning' ? 'bg-orange-500' :
                        status === 'critical' ? 'bg-rose-500' : 'bg-blue-500'
            )} />
        </motion.div>
    );
};

export default function PowerHubMonitoring({ summary, stockStats }: { summary: any, stockStats: any }) {
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => (prev + 1) % 100);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
        }).format(val || 0);

    return (
        <div className="space-y-10">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-4 bg-slate-950 py-3 px-6 rounded-3xl border border-white/5 shadow-2xl">
                        <Activity className="text-blue-400 animate-pulse" size={18} />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Operational Pulse</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${pulse}%` }}
                                        className="h-full bg-blue-400"
                                    />
                                </div>
                                <span className="text-[9px] font-mono text-blue-400 font-bold tracking-tighter">STABLE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all group">
                        <RefreshCcw size={16} className="text-slate-400 group-hover:rotate-180 transition-transform duration-1000" />
                        <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest italic">Sync Environment</span>
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 animate-bounce">
                        <Zap size={20} />
                    </div>
                </div>
            </div>

            {/* Monitoring Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                <MonitoringCard
                    index={0}
                    title="Revenue Terminal"
                    value={summary?.totalRevenue || 0}
                    prefix="$"
                    description="Total gross throughput accumulated (30d)"
                    icon={TrendingUp}
                    status="optimal"
                    trend={{ value: "+14.2%", positive: true }}
                />
                <MonitoringCard
                    index={1}
                    title="Order Ingestion"
                    value={summary?.totalOrders || 0}
                    description="Active transaction nodes in processing"
                    icon={ShoppingBag}
                    status="processing"
                    trend={{ value: "Live", positive: true }}
                />
                <MonitoringCard
                    index={2}
                    title="Logistic Vectors"
                    value={Math.floor((summary?.totalOrders || 0) * 0.85)}
                    description="Verified units currently in delivery fleet"
                    icon={Truck}
                    status="warning"
                    trend={{ value: "Fleet: 85%", positive: true }}
                />
                <MonitoringCard
                    index={3}
                    title="Inventory Integrity"
                    value={stockStats?.totalStock || 0}
                    description="Total physical SKU units in primary vault"
                    icon={Box}
                    status={stockStats?.lowStockCount > 0 ? "critical" : "optimal"}
                    trend={stockStats?.lowStockCount > 0 ? { value: `${stockStats.lowStockCount} Critical`, positive: false } : { value: "Stable", positive: true }}
                />
            </div>

            {/* Live Data Feed Overlay (Minimalist) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                <div className="lg:col-span-2 bg-slate-950 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-8">
                        <Cpu className="text-blue-500/20 animate-spin-slow" size={120} />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">Analytics Stream</span>
                            <div className="flex-1 h-[1px] bg-white/5" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Avg. Ticket</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(summary?.avgOrderValue)}</span>
                            </div>
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Node Uptime</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter">99.98%</span>
                            </div>
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Processing</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter">0.4s</span>
                            </div>
                            <div className="space-y-2">
                                <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Integrity</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter text-emerald-400">OK</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-between shadow-sm group">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Truck className="text-slate-950" size={20} />
                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em]">Fleet Deployment</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">Active logistical corridors mapped in real-time.</p>
                    </div>

                    <div className="space-y-4 my-8">
                        {[
                            { id: 'LDX-1', p: 80, s: 'Transit' },
                            { id: 'LDX-2', p: 45, s: 'Loading' },
                            { id: 'LDX-3', p: 95, s: 'Delivered' }
                        ].map((node, i) => (
                            <div key={node.id} className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <span className="text-[9px] font-black text-slate-950 uppercase italic tracking-widest">{node.id}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{node.s}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${node.p}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                        className={cn("h-full", node.p > 90 ? "bg-emerald-500" : "bg-slate-950")}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-950 group/more transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover/more:text-white group-hover/more:translate-x-1 transition-all">Launch Logistics Command</span>
                        <Globe size={14} className="text-slate-200 group-hover/more:text-blue-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
