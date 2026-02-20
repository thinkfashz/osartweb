'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Search,
    Plus,
    RefreshCcw,
    Package,
    Tag,
    Layers,
    Filter,
    ArrowUpRight,
    Search as SearchIcon
} from 'lucide-react';
import { ADMIN_PRODUCTS } from '@/lib/graphql/stockQueries';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';
import { GlowButton } from '@/components/admin/ui/GlowButton';
import { toast } from 'sonner';
import { DataTable } from '@/components/admin/ui/DataTable';

export default function ProductsPage() {
    const { data, loading, refetch } = useQuery<any>(ADMIN_PRODUCTS);
    const [search, setSearch] = useState('');

    const products = data?.productsConnection?.edges?.map((e: any) => e.node) || [];
    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            header: 'PRODUCTO',
            accessorKey: 'name',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 font-bold text-xs">
                        {row.original.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-black text-zinc-950 uppercase italic tracking-tighter text-sm">{row.original.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">{row.original.sku}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'CATEGORÍA',
            accessorKey: 'category.name',
            cell: ({ row }: any) => (
                <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {row.original.category?.name || 'SIN ASIGNAR'}
                </span>
            )
        },
        {
            header: 'INVENTARIO',
            accessorKey: 'stock',
            cell: ({ row }: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.original.outOfStock ? 'bg-red-500' : row.original.isLowStock ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                    <span className="font-mono font-bold text-zinc-950">{row.original.stock}</span>
                </div>
            )
        },
        {
            header: 'ESTADO',
            accessorKey: 'status',
            cell: ({ row }: any) => (
                <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    row.original.outOfStock
                        ? "bg-red-50 text-red-600 border-red-100"
                        : row.original.isLowStock
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                    {row.original.outOfStock ? 'Sin Stock' : row.original.isLowStock ? 'Stock Bajo' : 'Disponible'}
                </div>
            )
        }
    ];

    return (
        <PageTransition>
            <div className="space-y-10 pb-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Unidades"
                        value={products.length}
                        icon={Package}
                        description="SKUs registrados"
                    />
                    <StatCard
                        title="Stock Crítico"
                        value={products.filter((p: any) => p.isLowStock).length}
                        icon={Layers}
                        color="orange-500"
                        description="Requiere reposición"
                    />
                    <StatCard
                        title="Categorías"
                        value="..."
                        icon={Tag}
                        description="Segmentos activos"
                    />
                    <StatCard
                        title="Market Health"
                        value="98.2%"
                        icon={ArrowUpRight}
                        description="Sincronización total"
                    />
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1 group">
                            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-950 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="IDENTIFICAR SKU O PRODUCTO..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white border border-zinc-100 rounded-3xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-zinc-950 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950 hover:bg-white transition-all shadow-sm"
                        >
                            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="h-10 w-[1px] bg-zinc-100 mx-2" />
                        <GlowButton
                            onClick={() => toast.info('Protocolo de Creación no implementado')}
                            className="py-4 px-8 h-14 text-[10px] rounded-2xl"
                        >
                            <Plus size={16} className="mr-3" />
                            NUEVO PRODUCTO
                        </GlowButton>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <DataTable
                        data={filteredProducts}
                        columns={columns}
                        loading={loading}
                    />
                </div>
            </div>
        </PageTransition>
    );
}

// Helper function for class merging (already available via cn but here for safety if missing)
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
