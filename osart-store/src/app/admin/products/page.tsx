'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    WifiOff,
    Search,
    Plus,
    RefreshCcw,
    Package,
    Tag,
    Layers,
    Filter,
    ArrowUpRight,
    Search as SearchIcon,
    X,
    Database,
    CheckCircle2,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { StatCard } from '@/components/admin/ui/StatCard';
import { StatCardSkeleton, TableSkeleton } from '@/components/admin/ui/Skeleton';
import { GlowButton } from '@/components/admin/ui/GlowButton';
import { toast } from 'sonner';
import ProductImage from '@/components/admin/ProductImage';
import { DataTable } from '@/components/admin/ui/DataTable';
import { AdminProduct } from '@/types/admin';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useShop';

export default function ProductsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
    const [debouncedSearch, setDebouncedSearch] = React.useState('');

    // Debounce: only update debouncedSearch 300ms after user stops typing
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Consuming our robust SWR hook
    const {
        data,
        loading: initialLoading,
        isValidating,
        error,
        dataSource,
        mutate
    } = useProducts({ name: debouncedSearch });

    // We consider it "loading" strictly if there's no data and it's doing the intial fetch
    const loading = initialLoading && !data?.products?.length;
    const products = data?.products || [];

    // Optional user feedback on background sync
    React.useEffect(() => {
        if (!initialLoading && !isValidating && dataSource === 'network') {
            // Optional: you can show a tiny non-intrusive toast that data was updated from server
            // toast.success('Catálogo sincronizado', { duration: 1500, style: { fontSize: '10px' } });
        }
        if (error && dataSource === 'cache') {
            toast.error('Sin conexión. Mostrando versión offline.', { duration: 3000 });
        }
    }, [isValidating, dataSource, error, initialLoading]);

    const filteredProducts = products;

    const columns = [
        {
            header: 'PRODUCTO',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: AdminProduct } }) => (
                <div className="flex items-center gap-3 min-w-[200px]">
                    <ProductImage
                        src={row.original.image_url || (row.original.images && row.original.images[0]?.url) || ''}
                        alt={row.original.name}
                        size="md"
                    />
                    <div className="min-w-0">
                        <p className="font-black text-zinc-950 uppercase italic tracking-tighter text-sm truncate">{row.original.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">{row.original.sku}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'CATEGORÍA',
            accessorKey: 'category.name',
            cell: ({ row }: { row: { original: AdminProduct } }) => (
                <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                    {row.original.category?.name || 'SIN ASIGNAR'}
                </span>
            )
        },
        {
            header: 'INVENTARIO',
            accessorKey: 'stock',
            cell: ({ row }: { row: { original: AdminProduct } }) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${row.original.outOfStock ? 'bg-red-500' : row.original.isLowStock ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                    <span className="font-mono font-bold text-zinc-950">{row.original.stock}</span>
                </div>
            )
        },
        {
            header: 'ESTADO',
            accessorKey: 'status',
            cell: ({ row }: { row: { original: AdminProduct } }) => (
                <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap",
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
            <div className="space-y-6 md:space-y-10 pb-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {loading && products.length === 0 ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-4 flex-1 w-full xl:max-w-2xl">
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

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full xl:w-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={mutate}
                                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950 hover:bg-white transition-all shadow-sm touch-target"
                            >
                                <RefreshCcw size={20} className={isValidating ? 'animate-spin' : ''} />
                            </button>
                            <div className="h-10 w-[1px] bg-zinc-100 mx-1 hidden sm:block" />
                        </div>
                        <GlowButton
                            onClick={() => router.push('/admin/products/new')}
                            className="py-4 px-6 md:px-8 h-14 text-[10px] rounded-2xl flex-1 sm:flex-none"
                        >
                            <Plus size={16} className="mr-2 md:mr-3" />
                            NUEVO PRODUCTO
                        </GlowButton>
                    </div>
                </div>

                {loading && products.length === 0 ? (
                    <TableSkeleton rows={6} />
                ) : (
                    <DataTable
                        data={filteredProducts}
                        columns={columns}
                        loading={loading && products.length > 0}
                        onRowClick={(product) => setSelectedProduct(product)}
                    />
                )}
            </div>

            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 transition-all"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white shadow-2xl border-l border-zinc-100 flex flex-col"
                        >
                            <div className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 relative">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-emerald-500 to-transparent" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
                                        <Package size={12} /> Detalles de Entidad
                                    </p>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-950 truncate max-w-[300px] md:max-w-md">
                                        {selectedProduct.name}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-3 bg-white rounded-full border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-95"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-zinc-50 rounded-2xl border border-zinc-100 overflow-hidden shadow-inner">
                                        {(selectedProduct.image_url || selectedProduct.images?.[0]?.url) ? (
                                            <img
                                                src={selectedProduct.image_url || selectedProduct.images?.[0]?.url}
                                                alt={selectedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <Package size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Identificador SKU</p>
                                            <p className="font-mono text-sm font-bold text-zinc-800">{selectedProduct.sku}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Categoría</p>
                                            <span className="inline-block mt-1 px-3 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-black uppercase tracking-widest">
                                                {selectedProduct.category?.name || 'No Asignada'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Precio Unitario</p>
                                        <p className="text-xl font-mono text-zinc-950">${selectedProduct.price?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Nivel de Stock</p>
                                        <p className={cn(
                                            "text-xl font-mono",
                                            selectedProduct.outOfStock ? "text-red-500" : selectedProduct.isLowStock ? "text-orange-500" : "text-emerald-500"
                                        )}>
                                            {selectedProduct.stock || 0}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950 mb-3 border-b border-zinc-100 pb-2">Descripción del Sistema</p>
                                    <p className="text-sm text-zinc-600 leading-relaxed">
                                        {selectedProduct.description || 'Sin parámetros de descripción. El registro no contiene detalles técnicos en el bloque de almacenamiento principal.'}
                                    </p>
                                </div>
                            </div>

                            {/* Connection Status Bar */}
                            <div className="border-t border-zinc-100 bg-zinc-950 p-4 shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {dataSource === 'live' ? (
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center relative">
                                                <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                                                <Database size={14} />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center relative">
                                                <WifiOff size={14} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                                Sistema Base de Datos
                                            </p>
                                            <p className={cn(
                                                "text-[11px] font-black uppercase tracking-widest",
                                                dataSource === 'live' ? "text-emerald-400" : "text-orange-400"
                                            )}>
                                                {dataSource === 'live' ? 'ONLINE (Sincronizado)' : 'OFFLINE (Modo Caché)'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Origen Transaccional</p>
                                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                            {dataSource === 'live' ? (
                                                <CheckCircle2 size={10} className="text-blue-500" />
                                            ) : (
                                                <Activity size={10} className="text-zinc-500" />
                                            )}
                                            <p className="text-[10px] font-mono font-bold text-zinc-300">
                                                {dataSource === 'live' ? '/api/products' : 'localStorage'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
