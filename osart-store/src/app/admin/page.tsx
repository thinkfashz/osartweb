"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_SALES_SUMMARY } from '@/lib/graphql/adminQueries';
import { ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';
import PowerHubMonitoring from '@/components/admin/PowerHubMonitoring';
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
    Database,
    Layers,
    ExternalLink,
    RefreshCcw,
    MoreVertical,
    Lock,
    Settings,
    Radio,
    BarChart3
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AdminPage() {
    const { data: salesData, loading: salesLoading } = useQuery<any>(ADMIN_SALES_SUMMARY, {
        variables: { dateRange: '30d' }
    });
    const { data: stockData, loading: stockLoading } = useQuery<any>(ADMIN_PRODUCTS);

    if (salesLoading || stockLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
                <div className="relative">
                    <div className="w-24 h-24 border-[4px] border-slate-100 border-t-slate-950 rounded-[2.5rem] animate-spin" />
                    <Cpu className="absolute inset-0 m-auto text-slate-950 animate-pulse" size={32} />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-slate-900 tracking-[0.4em] uppercase mb-2">Power Hub: Booting</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing neural operational link...</p>
                </div>
            </div>
        );
    }

    const summary = salesData?.adminSalesSummary;
    const products = stockData?.productsConnection?.edges?.map((e: any) => e.node) || [];
    const lowStock = products.filter((p: any) => p.isLowStock || p.outOfStock);

    // Calculate stock stats
    const stockStats = {
        totalStock: products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0),
        lowStockCount: lowStock.length,
        totalSkus: products.length
    };

    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                {/* System Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Revenue Total"
                        value={`$${summary?.totalRevenue?.toLocaleString() || '0'}`}
                        icon={BarChart3}
                        trend={{ value: 12.5, isUp: true }}
                        description="Últimos 30 días"
                    />
                    <StatCard
                        title="Ordenes Activas"
                        value={summary?.totalOrders || 0}
                        icon={Box}
                        description="Procesadas hoy"
                    />
                    <StatCard
                        title="Alertas de Stock"
                        value={stockStats.lowStockCount}
                        icon={Bell}
                        color="red-500"
                        description="Unidades bajo el mínimo"
                    />
                    <StatCard
                        title="Estado del Enlace"
                        value="Nominal"
                        icon={Zap}
                        description="PH-AX1 Conectado"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white border border-zinc-100 rounded-3xl p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 mb-8 flex items-center gap-3">
                                <Activity size={16} className="text-electric-blue" />
                                Curva de Rendimiento Operativo
                            </h3>
                            <div className="h-[300px]">
                                <SalesCharts data={summary} />
                            </div>
                        </section>
                    </div>

                    {/* Stock Overrides */}
                    <div className="space-y-6">
                        <section className="bg-zinc-950 text-white rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Radio size={120} className="text-blue-500 animate-pulse" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3 relative z-10">
                                <Terminal size={14} />
                                Protocolos de Stock
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {lowStock.slice(0, 3).map((p: any) => (
                                    <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{p.name}</p>
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Q:{p.stock}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${p.outOfStock ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                                    </div>
                                ))}
                                <Link
                                    href="/admin/stock"
                                    className="block w-full text-center py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors"
                                >
                                    Abrir Consola de Stock
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageTransition>
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
