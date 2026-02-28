"use client";

import React from 'react';
import SalesCharts from '@/components/admin/sales/SalesCharts';
import {
    Activity,
    Box,
    Users,
    Zap,
    ArrowUpRight,
    Terminal,
    Bell,
    Layers,
    BarChart3,
    Radio,
    RefreshCcw
} from 'lucide-react';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatCardSkeleton } from '@/components/admin/ui/Skeleton';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminPage() {
    const [summary, setSummary] = React.useState<any>(null);
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchDashboardData = React.useCallback(async () => {
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

    React.useEffect(() => {
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
            <div className="space-y-6 md:space-y-10 px-4 md:px-0 mx-auto max-w-[100vw] overflow-hidden">

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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        <section className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                            <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                    <Activity size={16} className="text-electric-blue shrink-0" />
                                    Curva de Rendimiento Operativo
                                </h3>
                                <button
                                    onClick={fetchDashboardData}
                                    className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="h-[200px] md:h-[280px] -mx-4 md:mx-0 relative z-10">
                                <SalesCharts data={summary} />
                            </div>
                        </section>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="space-y-6">
                        <section className="bg-zinc-950 text-white rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Radio size={120} className="text-electric-blue animate-pulse" />
                            </div>
                            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2 relative z-10">
                                <Terminal size={14} className="shrink-0" />
                                Protocolos de Stock
                            </h3>
                            <div className="space-y-3 relative z-10">
                                {loading ? (
                                    <>
                                        <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                                        <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                                        <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                                    </>
                                ) : lowStock.length > 0 ? (
                                    lowStock.slice(0, 4).map((p: any) => (
                                        <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
                                            <div className="min-w-0 flex-1 mr-4">
                                                <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{p.name}</p>
                                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">NIVEL: {p.stock} UNIDADES</p>
                                            </div>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shrink-0",
                                                p.outOfStock ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                                            )} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-white/5 border border-white/5 rounded-2xl">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sistemas Estables</p>
                                    </div>
                                )}

                                <Link
                                    href="/admin/stock"
                                    className="flex items-center justify-center gap-2 w-full py-4 mt-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-black/20"
                                >
                                    Abrir Consola de Stock
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
