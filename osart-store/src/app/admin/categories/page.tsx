'use client';

import React from 'react';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';
import { Layers, Plus, Search, RefreshCcw, Tag } from 'lucide-react';
import { GlowButton } from '@/components/admin/ui/GlowButton';

export default function CategoriesPage() {
    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                            <Layers size={14} />
                            Jerarquía de Catálogo
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-950">Categorías</h1>
                    </div>

                    <GlowButton className="py-4 px-8 h-14 text-[10px] rounded-2xl">
                        <Plus size={16} className="mr-3" />
                        NUEVA CATEGORÍA
                    </GlowButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Categorías Total"
                        value="12"
                        icon={Layers}
                        description="Segmentos de Hardware"
                    />
                    <StatCard
                        title="Más Activa"
                        value="Drones"
                        icon={Tag}
                        description="Por volumen de ventas"
                    />
                </div>

                <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[400px]">
                    <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300">
                        <Layers size={32} />
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-950 mb-2">Módulo en Desarrollo</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                            El sistema de gestión de jerarquías está bajo mantenimiento técnico.
                            Use el panel de Catalog para edición rápida.
                        </p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
