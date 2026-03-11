'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, Loader2, X, LayoutGrid, Terminal, Activity, Wifi, Cpu, Gauge, Package, Zap } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts, useCategories } from '@/hooks/useShop';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CatalogPage = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [latency, setLatency] = useState(14);
    const [isSearching, setIsSearching] = useState(false);

    const { data: catData, loading: catLoading } = useCategories();
    const { data: prodData, loading: prodLoading } = useProducts({
        name: search || undefined,
        categoryId: selectedCategory || undefined
    });

    const categories = (catData as any)?.categories || [];
    const products = (prodData as any)?.products || [];

    // Simulate latency shifts for industrial feel
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * (22 - 12 + 1)) + 12);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Handle search input with "IsSearching" state for visual feedback
    useEffect(() => {
        if (search) {
            setIsSearching(true);
            const timeout = setTimeout(() => setIsSearching(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [search]);

    const FilterContent = () => (
        <div className="space-y-10">
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full shadow-[0_0_8px_rgba(14,165,233,1)]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">
                        Categorías
                    </h3>
                </div>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setIsMobileFiltersOpen(false);
                            }}
                            className={cn(
                                "text-[10px] w-full text-left px-5 py-4 border transition-all flex items-center justify-between group rounded-[1.25rem]",
                                !selectedCategory
                                    ? "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 font-black shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]"
                                    : "bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-sky-500/20 hover:text-sky-500"
                            )}
                        >
                            <span className="tracking-widest capitalize">Todos los Productos</span>
                            <div className={cn("w-1.5 h-1.5 rounded-fullTransition-all", !selectedCategory ? "bg-sky-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-800")} />
                        </button>
                    </li>
                    {catLoading ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-sky-500/40" size={16} /></div>
                    ) : categories.map((cat: any) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setIsMobileFiltersOpen(false);
                                }}
                                className={cn(
                                    "text-[10px] w-full text-left px-5 py-4 border transition-all flex items-center justify-between group rounded-[1.25rem]",
                                    selectedCategory === cat.id
                                        ? "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 font-black shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]"
                                        : "bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-sky-500/20 hover:text-sky-500"
                                )}
                            >
                                <span className="uppercase tracking-widest">{cat.name}</span>
                                <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === cat.id ? "bg-sky-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-800")} />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="pt-8 border-t border-zinc-200 dark:border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white/60">
                        Parámetros Técnicos
                    </h3>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'DISPONIBILIDAD', icon: Package, count: 'STOCK' },
                        { label: 'OFERTAS', icon: Zap, count: '% OFF' },
                        { label: 'NOVEDADES', icon: Activity, count: 'NEW' }
                    ].map(filter => (
                        <label key={filter.label} className="flex flex-col gap-2 p-5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl cursor-pointer group hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <filter.icon size={12} className="text-zinc-400 group-hover:text-sky-500 transition-colors" />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{filter.label}</span>
                                </div>
                                <div className="w-4 h-4 border border-zinc-300 dark:border-white/10 rounded-md flex items-center justify-center group-hover:border-sky-500/50 transition-colors">
                                    <div className="w-2 h-2 bg-sky-500 scale-0 group-hover:scale-100 transition-transform rounded-[2px]" />
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* System Stats Sidebar Widget */}
            <section className="pt-8 border-t border-zinc-200 dark:border-white/5">
                <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Gauge size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500/80 uppercase tracking-widest">Optimización de Carga</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-bold text-zinc-500">
                            <span>RECURSOS</span>
                            <span>84%</span>
                        </div>
                        <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[84%]" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-white pb-20 selection:bg-sky-500/30">
            {/* Top Console Bar */}
            <div className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 py-4 lg:py-8 px-5">
                <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">

                    <div className="flex items-center gap-6 flex-1">
                        <div className="hidden xl:flex flex-col">
                            <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none mb-1">
                                CATÁLOGO
                            </h1>
                            <div className="flex items-center gap-2 text-[9px] font-black text-sky-500 uppercase tracking-widest">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                </span>
                                SCANNER ACTIVO
                            </div>
                        </div>

                        {/* High-Precision Search Box */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                {isSearching ? (
                                    <Loader2 className="animate-spin text-sky-500" size={14} />
                                ) : (
                                    <Search className="text-zinc-400 group-focus-within:text-sky-500 transition-colors" size={14} />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="BUSCAR REPUESTO O COMPONENTE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold focus:bg-white dark:focus:bg-zinc-900 focus:border-sky-500/30 focus:ring-4 focus:ring-sky-500/5 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-800 tracking-widest uppercase"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-zinc-200 dark:border-white/5 pt-4 lg:pt-0">
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-start lg:items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Unidades</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{products.length}</span>
                            </div>
                            <div className="flex flex-col items-start lg:items-end min-w-[100px]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado</span>
                                <div className="flex items-center gap-2">
                                    <div className="text-xl font-black text-emerald-500 tracking-tighter">Online</div>
                                    <Wifi size={14} className="text-emerald-500/50" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white active:scale-95 transition-all shadow-sm"
                        >
                            <SlidersHorizontal size={14} className="text-sky-500" />
                            FILTROS
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 mt-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Industrial Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-40 h-[calc(100vh-180px)] overflow-y-auto no-scrollbar pb-10">
                        <div className="pr-4">
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Hardware Grid Area */}
                    <main className="flex-grow">
                        <AnimatePresence mode="wait">
                            {prodLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-40 gap-8"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-8 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-all duration-1000 animate-pulse" />
                                        <Loader2 className="animate-spin text-sky-500 relative" size={48} strokeWidth={1.5} />
                                    </div>
                                    <div className="text-center space-y-3">
                                        <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-2">Sincronizando Catálogo</p>
                                        <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <span>SPOOLING</span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                            <span>FETCH_ASSETS</span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                            <span>GRID_INIT</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : products.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6 lg:gap-10"
                                >
                                    {products.map((product: any) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-40 bg-zinc-50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[40px]"
                                >
                                    <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-800 mb-8 border border-zinc-200 dark:border-white/5 shadow-sm">
                                        <Search size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter text-zinc-400 dark:text-zinc-500 mb-2">Sin Resultados</h3>
                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-700 uppercase tracking-widest max-w-[300px] text-center">No encontramos componentes con esos parámetros.</p>
                                    <button
                                        onClick={() => { setSearch(''); setSelectedCategory(null); }}
                                        className="mt-10 text-[10px] font-black uppercase tracking-widest text-sky-500 border-b-2 border-sky-500/30 pb-1 hover:border-sky-500 transition-all"
                                    >
                                        RESETEAR BÚSQUEDA
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Mobile Terminal Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 h-[85vh] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 p-8 z-[60] overflow-y-auto rounded-t-[40px] shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">FILTROS</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">Ajustar parámetros de búsqueda</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-12 h-12 flex items-center justify-center bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl active:scale-90 transition-transform shadow-sm"
                                >
                                    <X size={24} className="text-zinc-900 dark:text-white" />
                                </button>
                            </div>

                            <div className="space-y-12">
                                <FilterContent />
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-sky-500 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                                >
                                    APLICAR FILTROS
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CatalogPage;
