"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_SALES_SUMMARY } from '@/lib/graphql/adminQueries';
import { ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';
import SalesKpis from '@/components/admin/sales/SalesKpis';
import SalesCharts from '@/components/admin/sales/SalesCharts';
import {
    Activity,
    Box,
    Users,
    Zap,
    ChevronRight,
    Clock,
    ArrowUpRight,
    Cpu,
    ShieldCheck,
    Terminal,
    Bell,
    Globe,
    Server,
    Database,
    Layers,
    ExternalLink,
    RefreshCcw,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const { data: salesData, loading: salesLoading } = useQuery<any>(ADMIN_SALES_SUMMARY, {
        variables: { dateRange: '30d' }
    });
    const { data: stockData, loading: stockLoading } = useQuery<any>(ADMIN_PRODUCTS);

    if (salesLoading || stockLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
                <div className="relative">
                    <div className="w-16 h-16 border-[3px] border-slate-100 border-t-slate-950 rounded-full animate-spin" />
                    <Cpu className="absolute inset-0 m-auto text-slate-950 animate-pulse" size={24} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-slate-900 tracking-[0.2em] uppercase mb-1">Nexus Hub: Initializing</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Estableciendo enlace de alta fidelidad...</p>
                </div>
            </div>
        );
    }

    const summary = salesData?.adminSalesSummary;
    const products = stockData?.productsConnection?.edges?.map((e: any) => e.node) || [];
    const lowStock = products.filter((p: any) => p.isLowStock || p.outOfStock);

    return (
        <div className="space-y-12 pb-20">
            {/* Technical Background Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Hero Section - Nexus Hub Pro */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group bg-slate-950 p-12 lg:p-20 rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-950/40 border border-white/5"
            >
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-16">
                    <div className="space-y-8 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.25em] backdrop-blur-md">
                                <Cpu size={14} className="text-blue-400 animate-pulse" />
                                Environment: PRO_VERIFIED
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                        </div>

                        <div>
                            <h1 className="text-7xl font-black text-white tracking-tighter leading-none mb-4 italic italic">
                                NEXUS HUB <span className="text-slate-500">PRO</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-xl leading-relaxed uppercase tracking-tight opacity-90 max-w-xl">
                                Command & Control Center. High-precision operational oversight of current global throughput and technical assets.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all">
                                <Server size={18} className="text-blue-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Latency Spectrum</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">0.08ms Stability</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-3xl border border-white/10 group/item hover:bg-white/10 transition-all">
                                <ShieldCheck size={18} className="text-emerald-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">SSL Node: Static</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Encrypt v4.2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 min-w-[360px]">
                        {/* Live Telemetry Card */}
                        <div className="p-10 bg-white/5 rounded-[3rem] backdrop-blur-2xl border border-white/10 relative overflow-hidden group/card shadow-3xl transition-all hover:bg-white/10">
                            <div className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover/card:scale-125 transition-transform duration-1000 rotate-12">
                                <Database size={200} />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Globe size={14} className="text-blue-400" />
                                    Global Pulse
                                </span>
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Active Link</span>
                            </div>

                            <div className="relative">
                                <div className="text-7xl font-black text-white tracking-widest mb-1 tabular-nums animate-pulse">99.9</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-1 bg-blue-400 rounded-full" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Uptime Reliability</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/admin/sales" className="group/btn flex items-center justify-between p-8 bg-white rounded-[3rem] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5">
                            <div className="space-y-1">
                                <span className="block font-black text-slate-950 uppercase tracking-[0.2em] text-sm italic group-hover/btn:translate-x-1 transition-transform">Revenue Terminal</span>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Analytics v1.0</span>
                            </div>
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white transition-all group-hover/btn:rotate-12 group-hover/btn:scale-110 shadow-xl shadow-slate-900/20">
                                <ChevronRight size={32} />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
            </motion.div>

            {/* Industrial Data Visualization Section */}
            <div className="space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-[2px] bg-slate-950" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Operational Metrics</h2>
                        </div>
                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">Live Throughput Index</h3>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm group">
                        <RefreshCcw size={16} className="text-slate-400 group-hover:rotate-180 transition-transform duration-700" />
                        <div className="h-4 w-[1px] bg-slate-100" />
                        <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest">Last Sync: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="space-y-12">
                    <SalesKpis summary={summary} />
                    <SalesCharts data={summary} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Critical System Overrides (Low Stock) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-950 tracking-tighter text-3xl uppercase italic flex items-center gap-4">
                                <Bell className="text-rose-600 animate-bounce" size={28} />
                                System Overrides
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Critical Stock Exhaustion Protocols</p>
                        </div>
                    </div>

                    <div className="space-y-5 flex-1 relative z-10">
                        {lowStock.length === 0 ? (
                            <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-6 py-12">
                                <div className="w-24 h-24 rounded-[3rem] bg-slate-950 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={40} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-950 uppercase italic tracking-tighter mb-1">Fleet Operational</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All modules sync within parameters</p>
                                </div>
                            </div>
                        ) : (
                            lowStock.slice(0, 5).map((p: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center justify-between p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-slate-400 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group/item"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all group-hover/item:scale-110 group-hover/item:rotate-6 shadow-sm font-black text-white",
                                            p.outOfStock ? "bg-rose-950" : "bg-orange-400"
                                        )}>
                                            <Box size={22} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-md font-black text-slate-950 uppercase italic tracking-tighter">{p.name}</p>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", p.outOfStock ? "bg-rose-500" : "bg-orange-500")} />
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-[0.15em]",
                                                    p.outOfStock ? "text-rose-600" : "text-orange-600"
                                                )}>
                                                    {p.outOfStock ? 'Depleted Unit' : `Remaining Units: ${p.stock}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/admin/stock" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-950 hover:border-slate-950 transition-all group-hover/item:bg-slate-950 group-hover/item:text-white">
                                        <ChevronRight size={20} />
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Technical Operation Logs - Nexus Ledger */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-950 tracking-tighter text-3xl uppercase italic flex items-center gap-4">
                                <Terminal className="text-slate-400" size={28} />
                                Nexus Ledger
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Global Transactional & Admin Trace</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-950 transition-colors cursor-pointer">
                            <MoreVertical size={20} />
                        </div>
                    </div>

                    <div className="space-y-1 flex-1 relative z-10">
                        <ActivityItem index={0} text="Full DB Synchronization Successful" time="00:02:45" type="sync" detail="Enlace Alpha-1" />
                        <ActivityItem index={1} text="Terminal Scan initiated by ADM-01" time="00:15:20" type="user" detail="Terminal 09-X" />
                        <ActivityItem index={2} text="Stock Exhaustion Protocol Triggered" time="01:10:05" type="alert" detail="Product Unit: XP-9" />
                        <ActivityItem index={3} text="Security Integrity Verification Check" time="04:30:12" type="system" detail="Version 3.2.1" />
                        <ActivityItem index={4} text="Client Expansion: Segment-A Node Added" time="06:45:00" type="user" detail="Verification: OK" />
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-50 relative z-10">
                        <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-[0.3em] transition-all">
                            Export System Archive
                            <ExternalLink size={14} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const ActivityItem = ({ index, text, time, type, detail }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex gap-8 group/log py-4 hover:bg-slate-50/50 rounded-3xl px-4 transition-all -mx-4"
    >
        <div className="flex flex-col items-center">
            <div className={cn(
                "w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all z-10 group-hover/log:scale-110 group-hover/log:rotate-3 shadow-sm font-black",
                type === 'sync' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    type === 'alert' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        type === 'user' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            'bg-slate-950 border-slate-800 text-white'
            )}>
                {type === 'sync' && <Zap size={18} />}
                {type === 'alert' && <Bell size={18} />}
                {type === 'user' && <Users size={18} />}
                {type === 'system' && <Layers size={18} />}
            </div>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-0.5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-950 uppercase italic tracking-tighter leading-tight group-hover/log:translate-x-1 transition-transform">{text}</p>
                <span className="text-[9px] font-black text-slate-300 font-mono tracking-tighter group-hover/log:text-slate-500 transition-colors mb-2">T+{time}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{detail}</span>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Verified</span>
            </div>
        </div>
    </motion.div>
);
