"use client";

import React, { useState, useEffect, useCallback } from 'react';
import StockKpis from '@/components/admin/stock/StockKpis';
import StockTable from '@/components/admin/stock/StockTable';
import StockMovementsTable from '@/components/admin/stock/StockMovementsTable';
import LowStockPanel from '@/components/admin/stock/LowStockPanel';
import AdjustStockModal from '@/components/admin/stock/AdjustStockModal';
import { RefreshCcw, Search, Package, History, Activity, Database } from 'lucide-react';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/admin/ui/PageTransition';

export default function StockPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'inventory' | 'movements'>('inventory');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const fetchStockData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?admin=true&search=${debouncedSearch}`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch {
            toast.error('Falla en la red de inventario');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchStockData();
    }, [fetchStockData]);

    // Open the adjust modal for a product
    const handleOpenAdjust = (product: any) => {
        setSelectedProduct(product);
        setIsAdjustModalOpen(true);
    };

    // Execute the stock adjustment via REST API
    const handleExecuteAdjustment = async (formData: {
        productId: string;
        qty: number;
        type: 'in' | 'out' | 'adjust';
        reason: string;
    }) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/products/${formData.productId}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qty: formData.qty,
                    type: formData.type,
                    reason: formData.reason,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(`Error de protocolo: ${err.error || 'Ajuste fallido'}`);
                return;
            }

            const result = await res.json();
            toast.success(
                `✓ Stock actualizado: ${result.previousStock} → ${result.newStock} unidades`
            );
            setIsAdjustModalOpen(false);
            setSelectedProduct(null);
            // Refresh product list to reflect new stock
            fetchStockData();
        } catch {
            toast.error('Error de conexión en el módulo de inventario');
        } finally {
            setIsUpdating(false);
        }
    };

    const stats = {
        totalStock: products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0),
        totalSkus: products.length,
        lowStockCount: products.filter((p: any) => p.isLowStock || p.outOfStock).length,
    };

    if (loading && products.length === 0) {
        return (
            <div className="space-y-12 p-4 md:p-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="h-10 w-72 bg-slate-200 rounded-2xl animate-pulse" />
                        <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2rem] animate-pulse" />)}
                </div>
                <TableSkeleton rows={8} />
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-12 pb-20 relative">

                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2">
                                <Activity size={10} className="animate-pulse" />
                                Live Feed
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Database size={10} />
                                Logística Pro v4.0
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100 tracking-tighter uppercase italic leading-none">
                            Unidad de Stock
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.15em] text-[10px] max-w-xl leading-relaxed">
                            Gestión de activos críticos para la red de hardware OSART.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        {/* View Switcher */}
                        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 w-full sm:w-auto">
                            <button
                                onClick={() => setViewMode('inventory')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    viewMode === 'inventory' ? "bg-white text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <Package size={14} />
                                <span>Dashboard</span>
                            </button>
                            <button
                                onClick={() => setViewMode('movements')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    viewMode === 'movements' ? "bg-white text-zinc-950 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                <History size={14} />
                                <span>Auditoría</span>
                            </button>
                        </div>

                        {/* Search + Refresh */}
                        <div className="flex items-center gap-3 flex-1 sm:flex-none">
                            <div className="relative flex-1 sm:w-56 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all text-white placeholder:text-zinc-600"
                                />
                            </div>
                            <button
                                onClick={fetchStockData}
                                title="Refrescar inventario"
                                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all active:scale-95 shrink-0"
                            >
                                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6 md:space-y-8">
                        <StockKpis stats={stats} />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden"
                        >
                            <div className="overflow-x-auto">
                                {viewMode === 'inventory' ? (
                                    <StockTable products={products} onAdjust={handleOpenAdjust} />
                                ) : (
                                    <StockMovementsTable movements={[]} isLoading={false} />
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Alert Panel */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="lg:sticky lg:top-24">
                            <LowStockPanel products={products} onAdjust={handleOpenAdjust} />
                        </div>
                    </div>
                </div>

                {/* Adjust Stock Modal */}
                <AdjustStockModal
                    isOpen={isAdjustModalOpen}
                    onClose={() => {
                        setIsAdjustModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onSave={handleExecuteAdjustment}
                    product={selectedProduct}
                    isLoading={isUpdating}
                />
            </div>
        </PageTransition>
    );
}
