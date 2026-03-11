'use client';

import React, { useState } from 'react';
import {
    Package,
    ChevronRight,
    Calendar,
    CreditCard,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    ExternalLink,
    Search,
    ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrders } from '@/hooks/useShop';
import { useCart } from '@/hooks/useCart';
import { PageTransition } from '@/components/admin/ui/PageTransition';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STATUS_CONFIG = {
    pending: { label: 'PENDIENTE', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    processing: { label: 'PROCESANDO', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    shipped: { label: 'EN CAMINO', icon: Truck, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    delivered: { label: 'ENTREGADO', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    cancelled: { label: 'CANCELADO', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
};

function Activity({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

const OrderCard = ({ order }: { order: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const StatusIcon = status.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all duration-500 shadow-2xl"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)] pointer-events-none" />

            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-lg", status.bg, status.border)}>
                            <StatusIcon className={cn("relative z-10", status.color)} size={24} />
                            <div className={cn("absolute inset-0 blur-lg opacity-20 rounded-2xl", status.bg)} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">ID_ORDEN: {order.id}</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">
                                Envío {status.label}
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Transacción</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter">
                                ${order.total.toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all",
                                isExpanded && "rotate-90 bg-sky-500/10 border-sky-500/20 text-sky-500"
                            )}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-8 mt-8 border-t border-white/5 space-y-8">
                                {/* Items List */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] pl-1">Documentación de Carga</h4>
                                    <div className="grid gap-3">
                                        {order.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/[0.03] hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden border border-white/5">
                                                        {item.product?.image_url ? (
                                                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                                <Package size={18} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-white uppercase tracking-tighter">{item.product?.name || 'Producto Desconocido'}</p>
                                                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                                                            Cant: {item.quantity} · ${item.unit_price.toLocaleString()} c/u
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-white/80 italic tracking-tighter">
                                                    ${(item.quantity * item.unit_price).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logistics Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <Truck size={16} />
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Coordenadas de Entrega</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 leading-relaxed font-medium uppercase tracking-wide">
                                            {order.shipping_address || 'Dirección no especificada en el manifiesto'}
                                        </p>
                                    </div>
                                    <div className="p-6 bg-zinc-950/50 border border-white/5 rounded-3xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <CreditCard size={16} />
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Estado Transaccional</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                order.payment_status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            )}>
                                                {order.payment_status === 'paid' ? 'LIQUIDADO' : 'FALLIDO'}
                                            </span>
                                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocolo SSL/TLS Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default function OrdersPage() {
    const { items: cartItems } = useCart();
    // Assuming we can get user ID or we are in Demo mode
    const { data, loading, error, mutate } = useOrders();
    const orders = data?.orders || [];

    return (
        <PageTransition>
            <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-5 relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-sky-500/5 blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-blue-600/5 blur-[100px] -z-10" />

                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                                <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Historial de Protocolos</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Mis Órdenes
                            </h1>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
                                Registro centralizado de adquisiciones de hardware.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[100px] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-sky-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 relative z-10">Total Envíos</span>
                                <span className="text-2xl font-black text-white italic tracking-tighter relative z-10">{orders.length}</span>
                            </div>
                            <button
                                onClick={() => mutate()}
                                className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all active:scale-95 shadow-lg"
                            >
                                <RefreshCcw className={cn("transition-transform duration-1000", loading && "animate-spin")} size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Orders List / Empty State */}
                    <div className="space-y-6">
                        {loading && orders.length === 0 ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white/2 border border-white/5 rounded-[2rem] animate-pulse" />
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-24 flex flex-col items-center text-center space-y-8 bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-[3rem]"
                            >
                                <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-800 border border-white/5">
                                    <ShoppingBag size={48} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sin actividad registrada</h2>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                        No hemos detectado protocolos de compra asociados a tu firma digital. Explora nuestro catálogo de hardware industrial.
                                    </p>
                                </div>
                                <Link
                                    href="/catalog"
                                    className="px-10 py-5 bg-white text-black font-black uppercase italic tracking-[0.2em] text-[11px] rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] active:scale-95"
                                >
                                    Iniciar Adquisición
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order, i) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}

function RefreshCcw({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}
