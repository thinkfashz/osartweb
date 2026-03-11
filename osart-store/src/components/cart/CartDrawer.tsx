'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, subtotal, itemCount, updateQuantity, removeFromCart, loading } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-zinc-950 border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                                    <ShoppingBag className="text-sky-500 w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">Protocolo_Carga</h2>
                                    <p className="text-[10px] text-sky-500/70 font-bold uppercase tracking-widest leading-none mt-1">
                                        LVL:01_QTY:{itemCount}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5 text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center relative z-10">
                                            <Package className="w-10 h-10 text-zinc-700" />
                                        </div>
                                        <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-full" />
                                    </div>
                                    <h3 className="text-zinc-100 font-black uppercase italic tracking-tighter text-xl mb-2">Almacén Vacío</h3>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8 max-w-[200px] leading-relaxed">
                                        No se han detectado registros de componentes en la sesión actual.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 border border-white/10 hover:bg-white/5 text-zinc-300 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-xl"
                                    >
                                        Explorar Catálogo
                                    </button>
                                </div>
                            ) : (
                                items.map((item: any, index: number) => {
                                    const imageUrl = item.product?.imageUrl || item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder-product.png';
                                    return (
                                        <motion.div 
                                            key={item.id || item.productId} 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex gap-5 group relative"
                                        >
                                            <div className="relative w-20 h-20 bg-black border border-white/10 rounded-lg overflow-hidden flex-shrink-0 group-hover:border-sky-500/30 transition-colors shadow-2xl">
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h3 className="text-xs font-black text-zinc-100 group-hover:text-sky-400 transition-colors uppercase italic tracking-tighter leading-tight line-clamp-1">
                                                            {item.product.name}
                                                        </h3>
                                                        <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold tracking-[0.15em]">
                                                            ID: {item.productId.slice(0, 8)} | COMP
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeFromCart(item.productId)}
                                                        className="text-zinc-700 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center bg-black/40 border border-white/5 rounded-md p-0.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="p-1 hover:text-white text-zinc-600 transition-colors disabled:opacity-0"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-2 text-[10px] font-black font-mono text-zinc-200">
                                                            {item.quantity.toString().padStart(2, '0')}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="p-1 hover:text-white text-zinc-600 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs font-black font-mono text-sky-500">
                                                        ${((item.product?.price || 0) * (item.quantity || 0)).toLocaleString('es-CL')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-zinc-950 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[.2em]">Subtotal</span>
                                        <span className="text-2xl font-black italic tracking-tighter text-white">
                                            <span className="text-sky-500 text-sm align-top mr-1">$</span>
                                            {(subtotal || 0).toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-zinc-600 text-[9px] uppercase font-bold tracking-widest">
                                        <span>Logística</span>
                                        <span className="font-mono">Calculado al cierre</span>
                                    </div>
                                </div>

                                <Link
                                    href="/cart"
                                    onClick={onClose}
                                    className="group relative block w-full py-4 bg-sky-500 rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] active:scale-[0.98]"
                                >
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                                    <span className="relative z-10 flex items-center justify-center gap-2 text-black font-black uppercase italic tracking-[0.1em] text-sm">
                                        Finalizar Pedido <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>

                                <button 
                                    onClick={onClose}
                                    className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
                                >
                                    Continuar explorando
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
