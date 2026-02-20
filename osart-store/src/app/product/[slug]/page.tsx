'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ChevronRight, ArrowLeft, Loader2, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GET_PRODUCT_BY_SLUG, GET_PRODUCTS } from '@/lib/graphql/queries';
import { ADD_TO_CART } from '@/lib/graphql/mutations';
import { Product } from '@/lib/graphql/types';
import { ProductGallery } from '@/components/product/ProductGallery';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedCarousel } from '@/components/product/RelatedCarousel';
import { Toast, ToastType } from '@/components/ui/Toast';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const { refetch: refetchGlobalCart } = useCart();

    useEffect(() => {
        console.log('[ProductDetail] Sincronizando con slug:', slug);
    }, [slug]);

    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    // 1. Fetch Product
    const { data, loading, error, refetch } = useQuery<{ productBySlug: Product }>(GET_PRODUCT_BY_SLUG, {
        variables: { slug },
        skip: !slug,
    });

    useEffect(() => {
        if (data) console.log('[ProductDetail] Datos recibidos:', data);
        if (error) console.error('[ProductDetail] Error de conexión GraphQL:', JSON.stringify(error, null, 2));
    }, [data, error]);

    // 2. Add to Cart Mutation
    const [addToCartMutation, { loading: addingToCart }] = useMutation(ADD_TO_CART);

    // 3. Related Products
    const { data: relatedData } = useQuery<{ products: Product[] }>(GET_PRODUCTS, {
        variables: {
            filter: {
                limit: 10
            }
        },
        skip: !data?.productBySlug
    });

    const product = data?.productBySlug || null;

    const related = (relatedData?.products ?? [])
        .filter((p: Product) => p.id !== product?.id);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const handleAddToCart = async (quantity: number) => {
        if (!product) return;
        try {
            await addToCartMutation({
                variables: {
                    input: {
                        productId: product.id,
                        quantity
                    }
                }
            });
            showToast('Componente añadido con éxito al inventario', 'success');
            refetchGlobalCart();
        } catch (err: any) {
            console.error(err);
            if (err.message.includes('stock')) {
                showToast(`Error: ${err.message}`, 'error');
            } else {
                showToast('Error de conexión con la infraestructura central', 'error');
            }
        }
    };

    const handleAddRelatedToCart = async (p: any) => {
        try {
            await addToCartMutation({
                variables: {
                    input: {
                        productId: p.id,
                        quantity: 1
                    }
                }
            });
            showToast('Componente añadido con éxito al inventario', 'success');
            refetchGlobalCart();
        } catch (err: any) {
            console.error(err);
            showToast('Error de conexión con la infraestructura central', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div className="aspect-square bg-white rounded-[3rem] animate-pulse border border-slate-200" />
                    <div className="space-y-8 py-10">
                        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                        <div className="h-16 w-full bg-slate-200 rounded animate-pulse" />
                        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
                        <div className="h-40 w-full bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-8">
                <RefreshCcw size={48} />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
                Error de Enlace de Datos
            </h2>
            <p className="text-slate-500 max-w-sm mb-10 font-bold">
                No pudimos sincronizar con el componente solicitado. Es posible que el ID sea inválido o la conexión haya fallado.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => refetch()}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-800 transition-all"
                >
                    Reintentar Sincronización
                </button>
                <Link
                    href="/catalog"
                    className="px-8 py-4 border-2 border-slate-200 text-slate-900 rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-50 transition-all"
                >
                    Volver al Catálogo
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
                        <Home size={12} />
                        Terminal
                    </Link>
                    <ChevronRight size={12} />
                    <Link href="/catalog" className="hover:text-emerald-600">Catálogo</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-300">Infraestructura</span>
                    <ChevronRight size={12} />
                    <span className="text-emerald-600 truncate max-w-[150px]">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-20 xl:gap-32 items-start">
                    <ProductGallery images={product.images || []} />
                    <PurchasePanel
                        product={product}
                        onAddToCart={handleAddToCart}
                        isAdding={addingToCart}
                    />
                </div>

                <div className="mt-32">
                    <ProductTabs product={product} />
                </div>
            </div>

            <div className="mt-32 border-t border-slate-200 bg-white">
                <RelatedCarousel
                    products={related}
                    onAddToCart={handleAddRelatedToCart}
                />
            </div>

            <Toast
                {...toast}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
