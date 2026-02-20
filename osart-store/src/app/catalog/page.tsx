'use client';

import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, Loader2, X, LayoutGrid, Terminal, Activity } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts, useCategories } from '@/hooks/useShop';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CatalogPage = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const { data: catData, loading: catLoading } = useCategories();
    const { data: prodData, loading: prodLoading } = useProducts({
        name: search || undefined,
        categoryId: selectedCategory || undefined
    });

    const categories = (catData as any)?.categories || [];
    const products = (prodData as any)?.products || [];

    const FilterContent = () => (
        <div className="space-y-10">
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-4 bg-electric-blue" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                        Categorización de Sistemas
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
                                "text-xs w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group",
                                !selectedCategory
                                    ? "bg-electric-blue/10 border-electric-blue/30 text-electric-blue font-black"
                                    : "bg-zinc-900/50 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                            )}
                        >
                            <span>TODOS LOS COMPONENTES</span>
                            <div className={cn("w-1.5 h-1.5 rounded-full", !selectedCategory ? "bg-electric-blue animate-pulse" : "bg-zinc-700")} />
                        </button>
                    </li>
                    {catLoading ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-electric-blue/40" size={20} /></div>
                    ) : categories.map((cat: any) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setIsMobileFiltersOpen(false);
                                }}
                                className={cn(
                                    "text-xs w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between group",
                                    selectedCategory === cat.id
                                        ? "bg-electric-blue/10 border-electric-blue/30 text-electric-blue font-black"
                                        : "bg-zinc-900/50 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                                )}
                            >
                                <span className="uppercase">{cat.name}</span>
                                <div className={cn("w-1.5 h-1.5 rounded-full", selectedCategory === cat.id ? "bg-electric-blue animate-pulse" : "bg-zinc-700")} />
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-4 bg-electric-blue" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                        Filtros de Desempeño
                    </h3>
                </div>
                <div className="space-y-3">
                    {['En Stock', 'Ofertas', 'Nuevos Arribos'].map(filter => (
                        <label key={filter} className="flex items-center justify-between px-4 py-3 bg-zinc-900/30 border border-white/5 rounded-lg cursor-pointer group hover:border-white/20 transition-all">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-white transition-colors">{filter}</span>
                            <div className="w-4 h-4 border border-white/20 rounded-sm group-hover:border-electric-blue transition-colors relative">
                                <div className="absolute inset-0.5 bg-electric-blue scale-0 group-hover:scale-75 transition-transform" />
                            </div>
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <div className="bg-zinc-950 min-h-screen text-white pb-20">
            {/* Console Header - Mobile/Desktop */}
            <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 px-5 py-4 lg:py-6">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 lg:gap-8 flex-1">
                        <div className="hidden lg:flex flex-col">
                            <h1 className="text-sm font-black uppercase italic tracking-tighter text-white">
                                Nucleo de Inventario
                            </h1>
                            <div className="flex items-center gap-2 text-[8px] font-mono text-electric-blue uppercase">
                                <Activity size={8} />
                                <span>Sincronización en tiempo real activa</span>
                            </div>
                        </div>

                        {/* Search Console */}
                        <div className="relative flex-1 max-w-xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <input
                                type="text"
                                placeholder="ESCANEAR COMPONENTE..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-2.5 pl-9 pr-4 text-[10px] font-mono focus:border-electric-blue/40 focus:ring-1 focus:ring-electric-blue/10 outline-none transition-all placeholder:text-zinc-700 tracking-widest"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="lg:hidden p-2.5 bg-zinc-900 border border-white/5 rounded-lg text-electric-blue hover:bg-zinc-800 transition-all"
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                        <div className="hidden sm:flex flex-col items-end">
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                Unidades: <span className="text-white italic">{products.length}</span>
                            </div>
                            <div className="text-[8px] font-mono text-emerald-500 uppercase tracking-tighter">
                                Latencia: 14ms
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 pt-8 lg:pt-12">
                <div className="flex gap-10">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-[calc(100vh-160px)]">
                        <FilterContent />
                    </aside>

                    {/* Main Grid Area */}
                    <main className="flex-grow">
                        {prodLoading ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-6">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-electric-blue" size={48} />
                                    <div className="absolute inset-0 bg-electric-blue/20 blur-xl animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Iniciando protocolo de sincronización</p>
                                    <p className="text-[8px] font-mono text-zinc-500 animate-pulse uppercase">Cargando base de datos de hardware...</p>
                                </div>
                            </div>
                        ) : products.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6"
                            >
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 border border-white/5 border-dashed rounded-3xl bg-zinc-900/20">
                                <Terminal className="text-zinc-800 mb-6" size={48} />
                                <h3 className="text-sm font-black uppercase tracking-tighter italic text-zinc-400 mb-2">No se detectaron componentes</h3>
                                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Ajuste los parámetros de búsqueda o filtros de sistema.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-80 max-w-[90%] bg-zinc-950 border-l border-white/10 p-8 z-[60] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <Filter size={18} className="text-electric-blue" />
                                    <h2 className="text-sm font-black uppercase italic tracking-tighter text-white">Panel de Filtros</h2>
                                </div>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <FilterContent />
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-electric-blue text-background font-black text-xs uppercase italic tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                                >
                                    Aplicar Configuración
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
