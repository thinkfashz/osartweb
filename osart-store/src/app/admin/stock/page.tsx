"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ADMIN_PRODUCTS, UPDATE_STOCK, STOCK_MOVEMENTS, STOCK_UPDATED } from '@/lib/graphql/stockQueries';
import StockKpis from '@/components/admin/stock/StockKpis';
import StockTable from '@/components/admin/stock/StockTable';
import StockMovementsTable from '@/components/admin/stock/StockMovementsTable';
import LowStockPanel from '@/components/admin/stock/LowStockPanel';
import AdjustStockModal from '@/components/admin/stock/AdjustStockModal';
import { RefreshCcw, Search, Package, History, Activity, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { GlowButton } from '@/components/ui/GlowButton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/admin/ui/PageTransition';

export default function StockPage() {
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'inventory' | 'movements'>('inventory');

    const { data, loading, refetch, subscribeToMore } = useQuery<any>(ADMIN_PRODUCTS, {
        fetchPolicy: 'cache-and-network'
    });
    const { data: moveData, loading: moveLoading, refetch: refetchMovements } = useQuery<any>(STOCK_MOVEMENTS);

    const [updateStock, { loading: isUpdating }] = useMutation(UPDATE_STOCK, {
        onCompleted: () => {
            toast.success('Sincronización de inventario exitosa');
            setIsAdjustModalOpen(false);
            refetch();
            refetchMovements();
        },
        onError: (err) => {
            toast.error(`Error de protocolo: ${err.message}`);
        }
    });

    // Real-time subscription integration
    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: STOCK_UPDATED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const updatedStock = subscriptionData.data.stockUpdated;

                // Show technical notification for real-time change
                toast.info(`Actualización de Stock: ${updatedStock.productId}`, {
                    description: `Nuevo balance: ${updatedStock.stock} unidades`,
                    icon: <Zap size={14} className="text-blue-500" />
                });

                // Trigger refetch for data consistency or manually update cache
                refetch();
                return prev;
            }
        });
        return () => unsubscribe();
    }, [subscribeToMore, refetch]);

    if (loading && !data) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="h-12 w-80 bg-slate-200 rounded-2xl animate-pulse" />
                        <div className="h-4 w-[500px] bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2.5rem] animate-pulse" />)}
                </div>
                <TableSkeleton rows={10} />
            </div>
        );
    }

    const products = data?.productsConnection?.edges?.map((e: any) => e.node) || [];
    const filtered = products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    const movements = moveData?.adminStockMovements || [];

    const stats = {
        totalStock: products.reduce((acc: number, p: any) => acc + p.stock, 0),
        totalSkus: products.length,
        lowStockCount: products.filter((p: any) => p.isLowStock || p.outOfStock).length
    };

    const handleOpenAdjust = (product: any) => {
        setSelectedProduct(product);
        setIsAdjustModalOpen(true);
    };

    const handleExecuteAdjustment = (formData: any) => {
        updateStock({
            variables: { input: formData }
        });
    };

    return (
        <PageTransition>
            <div className="space-y-6 md:space-y-12 pb-20 relative">

                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-2 shadow-xl shadow-slate-950/20">
                                <Activity size={10} className="animate-pulse" />
                                Live Feed
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                <Database size={10} />
                                Logística Pro v4.0
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                            Unidad de Stock
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xl leading-relaxed">
                            Gestión de activos críticos para la red de hardware OSART.
                            Monitoreo forense de inventario y optimización de flujo entrante.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 shadow-inner w-full sm:w-auto">
                            <button
                                onClick={() => setViewMode('inventory')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    viewMode === 'inventory' ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Package size={14} />
                                <span className="hidden xs:inline">Dashboard</span>
                            </button>
                            <button
                                onClick={() => setViewMode('movements')}
                                className={cn(
                                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    viewMode === 'movements' ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <History size={14} />
                                <span className="hidden xs:inline">Auditoría</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Search Terminal */}
                            <div className="relative flex-1 sm:w-64 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="BUSCAR..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-slate-950 transition-all text-slate-950 placeholder:text-slate-300 shadow-sm"
                                />
                            </div>

                            <button
                                onClick={() => refetch()}
                                className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-300 hover:text-slate-950 hover:border-slate-950 transition-all active:scale-95 shadow-sm touch-target"
                            >
                                <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8 md:space-y-12">
                        <StockKpis stats={stats} />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm"
                        >
                            <div className="overflow-x-auto custom-scrollbar">
                                {viewMode === 'inventory' ? (
                                    <StockTable products={filtered} onAdjust={handleOpenAdjust} />
                                ) : (
                                    <StockMovementsTable movements={movements} isLoading={moveLoading} />
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

                {/* Modals */}
                <AdjustStockModal
                    isOpen={isAdjustModalOpen}
                    onClose={() => setIsAdjustModalOpen(false)}
                    onSave={handleExecuteAdjustment}
                    product={selectedProduct}
                    isLoading={isUpdating}
                />
            </div>
        </PageTransition>
    );
}
