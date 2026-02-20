"use client";

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';
import AdminCatalogTable from '@/components/admin/catalog/AdminCatalogTable';
import { LayoutGrid, List, Plus, Search, SlidersHorizontal, Cpu, Box } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
        <div className="space-y-10 pb-20">
            {/* Premium Header Section */}
            <div className="relative group">
                <div className="bg-slate-950 p-10 lg:p-14 rounded-[3.5rem] overflow-hidden relative shadow-2xl shadow-slate-950/20 border border-white/5">
                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                                <Box size={14} className="text-blue-400" />
                                Base de Datos de Hardware
                            </div>
                            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">
                                Catálogo <span className="text-slate-400 italic">Técnico</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-lg leading-relaxed uppercase tracking-tight opacity-70 max-w-xl">
                                Registro centralizado de unidades operativas y matriz de despliegue global del ecosistema OSART.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                                <button
                                    onClick={() => setView('table')}
                                    className={cn(
                                        "p-3 rounded-xl transition-all flex items-center gap-2",
                                        view === 'table' ? 'bg-white text-slate-950 shadow-lg scale-105' : 'text-white/40 hover:text-white'
                                    )}
                                >
                                    <List size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Tabla</span>
                                </button>
                                <button
                                    onClick={() => setView('grid')}
                                    className={cn(
                                        "p-3 rounded-xl transition-all flex items-center gap-2",
                                        view === 'grid' ? 'bg-white text-slate-950 shadow-lg scale-105' : 'text-white/40 hover:text-white'
                                    )}
                                >
                                    <LayoutGrid size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Malla</span>
                                </button>
                            </div>

                            <Link
                                href="/admin/products/new"
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black uppercase italic tracking-widest text-xs shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <Plus size={20} />
                                <span>Enrolar Unidad</span>
                            </Link>
                        </div>
                    </div>

                    {/* Industrial background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="BUSCAR EN EL REGISTRO GLOBAL..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-950 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-950 hover:bg-white hover:border-slate-200 transition-all">
                        <SlidersHorizontal size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filtros Avanzados</span>
                    </button>
                    <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden md:block" />
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unidades Activas</p>
                        <p className="text-lg font-black text-slate-900 italic tracking-tighter leading-none">{filtered.length}</p>
                    </div>
                </div>
            </div>

            {/* Catalog Visualization */}
            <AdminCatalogTable products={filtered} view={view} />
        </div>
    );
}
