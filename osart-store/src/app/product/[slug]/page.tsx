'use client';

import React, { useMemo } from 'react';
import { ChevronRight, Loader2, RefreshCcw, Home, Share2, Activity } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/graphql/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedCarousel } from '@/components/product/RelatedCarousel';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useShop';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const { refetch: refetchGlobalCart } = useCart();

    // Dynamic hook that respects Admin "Demo Mode" vs "Database" settings
    const { data, loading, error, mutate: retry } = useProducts();

    const product = useMemo(() => {
        if (!data?.products) return null;
        return data.products.find(p => p.slug === slug) as unknown as Product;
    }, [data?.products, slug]);

    const related = useMemo(() => {
        if (!data?.products || !product) return [];
        return data.products.filter(p => p.id !== product.id).slice(0, 10) as unknown as Product[];
    }, [data?.products, product]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Loader2 className="animate-spin text-sky-500" size={48} />
                    <div className="absolute inset-0 bg-sky-500/20 blur-xl animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Protocolo de Enlace Activo</p>
                    <p className="text-[8px] font-mono text-zinc-500 animate-pulse uppercase">Descargando parámetros de hardware...</p>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20">
                <RefreshCcw size={48} />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">
                Error de Sincronización
            </h2>
            <p className="text-zinc-500 max-w-sm mb-10 font-bold uppercase text-[10px] tracking-widest">
                No se pudo establecer conexión con el componente especificado. El registro podría estar corrupto o fuera de rango.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => retry()}
                    className="px-8 py-4 bg-white text-black font-black uppercase italic tracking-widest hover:bg-sky-500 hover:text-white transition-all rounded-xl"
                >
                    Reintentar Protocolo
                </button>
                <Link
                    href="/catalog"
                    className="px-8 py-4 border border-white/10 text-white rounded-xl font-black uppercase italic tracking-widest hover:bg-white/5 transition-all"
                >
                    Volver al Catálogo Central
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 pt-20 md:pt-28 pb-20 overflow-hidden relative">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sky-500/5 blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/5 blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                {/* Header / Breadcrumbs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-16">
                    <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                        <Link href="/" className="hover:text-sky-500 flex items-center gap-1 transition-colors">
                            <Home size={10} />
                            RAIZ
                        </Link>
                        <ChevronRight size={10} />
                        <Link href="/catalog" className="hover:text-sky-500 transition-colors">INVENTARIO</Link>
                        <ChevronRight size={10} />
                        <span className="text-sky-500/80 italic">{product.name}</span>
                    </nav>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex flex-col items-start sm:items-end order-2 sm:order-1">
                            <div className="text-[10px] font-black uppercase text-white/90">ID_REF: {(product.id.slice(0, 10)).toUpperCase()}</div>
                            <div className="flex items-center gap-1.5 text-[8px] font-mono text-emerald-500 uppercase tracking-tighter">
                                <Activity size={8} />
                                <span>Canal de datos seguro</span>
                            </div>
                        </div>
                        <button className="p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-white hover:border-white/20 transition-all order-1 sm:order-2">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
 
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] xl:grid-cols-[1.5fr,1fr] gap-10 md:gap-24 items-start text-readability">
                    {/* Left: Gallery Stage */}
                    <div className="space-y-12">
                        <ProductGallery images={product.images || []} />

                        <div className="hidden lg:block">
                            <ProductTabs product={product} />
                        </div>
                    </div>

                    {/* Right: Operational Panel */}
                    <div className="sticky top-32 space-y-12">
                        <PurchasePanel product={product} />

                        {/* Mobile Tabs */}
                        <div className="lg:hidden">
                            <ProductTabs product={product} />
                        </div>
                    </div>
                </div>

                {/* Related Systems Section */}
                {related.length > 0 && (
                    <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 md:mb-12">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Sistemas Compatibles</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Componentes Relacionados</h2>
                            </div>
                            <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors group">
                                VER TODO <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <RelatedCarousel
                            products={related}
                            onAddToCart={() => refetchGlobalCart()}
                        />
                    </div>
                )}
            </div>

            {/* Bottom Guard Line */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/10 to-transparent" />
        </div>
    );
}
