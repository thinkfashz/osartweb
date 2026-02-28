'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, subtotal, addToCart, loading } = useCart();

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#18181b] border-l border-[#27272a] shadow-2xl z-[101] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-electric-blue w-5 h-5" />
                                <h2 className="text-lg font-bold tracking-tight uppercase font-mono italic">Protocolo_Carga</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <p className="text-zinc-500 font-medium">Tu carrito está vacío</p>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-bold uppercase tracking-wider transition-all"
                                    >
                                        Explorar Repuestos
                                    </button>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item.id || item.productId} className="flex gap-4 group">
                                        <div className="relative w-24 h-24 bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex-shrink-0">
                                            {item.product.mainImage ? (
                                                <Image
                                                    src={item.product.mainImage}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-xs text-zinc-500 mt-1 uppercase font-mono tracking-tighter">
                                                    ID: {item.product.id.slice(0, 8)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-white/5 rounded-lg bg-zinc-900/50">
                                                    <button
                                                        onClick={() => addToCart(item.product, -1)}
                                                        className="p-1 hover:text-white text-zinc-600 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 text-xs font-mono font-black text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item.product, 1)}
                                                        className="p-1 hover:text-white text-zinc-600 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-black font-mono text-electric-blue italic">
                                                    ${((item.product?.price || 0) * (item.quantity || 0)).toLocaleString('es-CL')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/5 bg-zinc-900/30 space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 text-xs font-black uppercase tracking-[.3em]">Subtotal_Neto</span>
                                    <span className="text-2xl font-black italic tracking-tighter text-white">
                                        ${(subtotal || 0).toLocaleString('es-CL')}
                                    </span>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/5 rounded-lg">
                                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter leading-relaxed">
                                        * Logística de última milla calculada en terminal de pago. Protocolo de impuestos incluido.
                                    </p>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="relative group block w-full py-5 bg-electric-blue text-black text-center font-black uppercase italic tracking-[.3em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Ejecutar Transacción <ArrowRight size={18} />
                                    </span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
