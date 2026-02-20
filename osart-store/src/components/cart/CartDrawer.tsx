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
                        {/* Header */}
                        <div className="p-6 border-b border-[#27272a] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-cyan-400 w-5 h-5" />
                                <h2 className="text-lg font-bold tracking-tight uppercase font-mono">Tu Carrito</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-[#27272a] rounded-full transition-colors">
                                <X className="w-5 h-5 text-zinc-400" />
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
                                                <div className="flex items-center border border-zinc-800 rounded">
                                                    <button
                                                        onClick={() => addToCart(item.product, -1)}
                                                        className="p-1 hover:bg-zinc-800 text-zinc-400"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 text-xs font-mono font-bold text-zinc-200">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item.product, 1)}
                                                        className="p-1 hover:bg-zinc-800 text-zinc-400"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold font-mono text-cyan-400">
                                                    ${(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-[#27272a] bg-zinc-900/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 text-sm uppercase tracking-widest font-mono">Subtotal</span>
                                    <span className="text-xl font-bold font-mono text-white">
                                        ${subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                    * Envío calculado en el checkout. Impuestos incluidos.
                                </p>
                                <Link
                                    href="/checkout"
                                    onClick={onClose}
                                    className="block w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black text-center font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] active:scale-[0.98]"
                                >
                                    Pagar Ahora <ArrowRight className="inline ml-2 w-5 h-5" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
