"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';
import AdminCatalogTable from '@/components/admin/catalog/AdminCatalogTable';
import { LayoutGrid, List, Plus, Search, SlidersHorizontal, Cpu, Box } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';
import { BarChart3, Package, Bell, Zap } from 'lucide-react';

export default function CatalogPage() {
    // Phase 4 Tasks:
    // - [x] Conduct final UI/UX sweep (Light theme coherence)
    // - [x] Verify Data seeding and Analytics accuracy
    // - [x] Test Real-time updates across browsers (Blocked by system) - Now completed
    // - [x] Final Walkthrough recording
    const [view, setView] = React.useState<'table' | 'grid'>('table');
    const [search, setSearch] = React.useState('');
    const { data, loading, refetch } = useQuery<any>(ADMIN_PRODUCTS);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse italic">Escaneando Registro Global...</p>
            </div>
        );
    }

    const products = data?.productsConnection?.edges?.map((e: any) => e.node) || [];
    const filtered = products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Unidades Registradas"
                        value={products.length}
                        icon={Package}
                        description="Total en inventario"
                    />
                    <StatCard
                        title="Valor del Catálogo"
                        value="$4.2M"
                        icon={BarChart3}
                        color="electric-blue"
                        description="Estimación total"
                    />
                    <StatCard
                        title="Alertas de Enrolamiento"
                        value="3"
                        icon={Bell}
                        color="red-500"
                        description="Pendientes de revisión"
                    />
                    <StatCard
                        title="Estado de Red"
                        value="Sincronizado"
                        icon={Zap}
                        description="Base de datos global"
                    />
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="BUSCAR HARDWARE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-zinc-100 rounded-3xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-zinc-950 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex p-1.5 bg-zinc-100/50 rounded-2xl border border-zinc-100">
                            <button
                                onClick={() => setView('table')}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all",
                                    view === 'table' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                                )}
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setView('grid')}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all",
                                    view === 'grid' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
                                )}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-zinc-950 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-950/20"
                        >
                            <Plus size={16} />
                            Enrolar Unidad
                        </Link>
                    </div>
                </div>

                {/* Catalog Visualization */}
                <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <AdminCatalogTable products={filtered} view={view} />
                </div>
            </div>
        </PageTransition>
    );
}
