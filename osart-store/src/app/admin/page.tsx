"use client";

import React, { useState, useEffect, useCallback } from 'react';
import SalesCharts from '@/components/admin/sales/SalesCharts';
import {
    Activity,
    Box,
    Bell,
    Zap,
    ArrowUpRight,
    Terminal,
    BarChart3,
    Radio,
    RefreshCcw,
    Sparkles
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatCardSkeleton } from '@/components/admin/ui/Skeleton';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { ProductAnimator } from '@/components/admin/ui/ProductAnimator';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SupabaseStatusPanel } from '@/components/admin/connectivity/SupabaseStatusPanel';

export default function AdminPage() {
    const [summary, setSummary] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, pRes] = await Promise.all([
                fetch('/api/orders?summary=true'),
                fetch('/api/products?admin=true')
            ]);
            const sData = await sRes.json();
            const pData = await pRes.json();
            setSummary(sData);
            setProducts(pData.products || []);
        } catch {
            toast.error('Error al sincronizar el panel de control');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const lowStock = products.filter((p: any) => p.isLowStock || p.outOfStock);
    const stockStats = {
        totalStock: products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0),
        lowStockCount: lowStock.length,
        totalSkus: products.length
    };

    return (
        <PageTransition>
            <div className="space-y-10 pb-10">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 p-8 md:p-10 rounded-[3rem] border border-violet-500/20 shadow-2xl shadow-violet-500/10 flex flex-col justify-between relative overflow-hidden bg-[#0d0d1a]"
                    >
                        {/* Decorative gradient blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                                Panel de <span className="text-violet-400">Control</span>
                            </h2>
                            <p className="text-zinc-400 font-medium max-w-md leading-relaxed">
                                Bienvenido a la terminal táctica de OSART. Todos los sistemas operativos están operando bajo protocolos de alta eficiencia.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-8 relative z-10">
                            <button className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-violet-500/30 hover:bg-violet-500 hover:scale-105 transition-all active:scale-95">
                                Generar Informe
                            </button>
                            <Link href="/admin/settings" className="px-8 py-4 bg-[#111118] border border-violet-500/20 text-zinc-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500/10 hover:border-violet-500/40 transition-all">
                                Ajustes
                            </Link>
                        </div>
                    </motion.div>

                    {/* Supabase Realtime Monitor */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[350px]"
                    >
                        <SupabaseStatusPanel />
                    </motion.div>
                </div>

                {/* System Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {loading ? (
                        <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
                    ) : (<>
                        <StatCard
                            title="Revenue Total"
                            value={`$${(summary?.totalRevenue || 0).toLocaleString('es-CL')}`}
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
                    </>)}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2">
                        <section className="bg-[#0d0d1a] border border-violet-500/10 rounded-[3rem] p-8 shadow-xl relative overflow-hidden h-full">
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                                        <Activity size={16} className="text-violet-500 shrink-0" />
                                        Métricas de Rendimiento
                                    </h3>
                                    <p className="text-xl font-bold mt-1 text-white">Actividad Comercial OSART</p>
                                </div>
                                <button
                                    onClick={fetchDashboardData}
                                    className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 hover:text-violet-300 hover:bg-violet-500/20 transition-all shadow-sm"
                                >
                                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="h-[320px] relative z-10">
                                <SalesCharts data={summary} />
                            </div>
                        </section>
                    </div>

                    {/* Low Stock Alerts & Product Animator */}
                    <div className="space-y-8">
                        {/* Animated Product Showcase */}
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-2 px-2">
                                <Sparkles size={16} className="text-violet-500 shrink-0" />
                                Showcase Animado
                            </h3>
                            <ProductAnimator
                                imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                                productName="Air Max Premium"
                                price="$124.990"
                            />
                        </section>

                        <section className="bg-[#0d0d1a] text-white rounded-[3rem] p-8 border border-violet-500/20 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/60 to-[#0d0d1a] pointer-events-none rounded-[3rem]" />
                            <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Radio size={200} className="text-violet-400 animate-pulse" />
                            </div>

                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-violet-300 mb-8 flex items-center gap-3 relative z-10">
                                <Terminal size={18} className="shrink-0" />
                                Protocolos de Inventario
                            </h3>

                            <div className="space-y-4 relative z-10">
                                {loading ? (
                                    <div className="space-y-3">
                                        <div className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                                        <div className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                                    </div>
                                ) : lowStock.length > 0 ? (
                                    lowStock.slice(0, 3).map((p: any) => (
                                        <div key={p.id} className="bg-violet-500/5 backdrop-blur-md border border-violet-500/10 rounded-[1.5rem] p-5 flex items-center justify-between group/item hover:bg-violet-500/10 transition-all">
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-white uppercase tracking-tighter truncate">{p.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                                    <p className="text-[10px] text-violet-200 font-bold uppercase tracking-widest">{p.stock} UNIDADES</p>
                                                </div>
                                            </div>
                                            <div className="p-2 bg-red-500/20 text-red-100 rounded-lg">
                                                <Zap size={14} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-violet-500/5 border border-violet-500/10 rounded-[2rem]">
                                        <p className="text-xs font-bold text-violet-300 uppercase tracking-[0.2em]">Sistemas Estables</p>
                                    </div>
                                )}

                                <Link
                                    href="/admin/stock"
                                    className="flex items-center justify-center gap-3 w-full py-5 mt-4 bg-violet-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-violet-500 transition-all active:scale-[0.98] shadow-2xl shadow-violet-500/20"
                                >
                                    ABRIR CONSOLA TOTAL
                                    <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
