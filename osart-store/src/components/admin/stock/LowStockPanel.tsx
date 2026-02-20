'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, ShieldAlert, ShoppingCart, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LowStockPanelProps {
    products: any[];
    onAdjust: (p: any) => void;
}

const LowStockPanel = ({ products, onAdjust }: LowStockPanelProps) => {
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 5);
    const outOfStockItems = products.filter(p => p.stock <= 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-slate-950 rounded-full animate-pulse" />
                    Alertas de Sistema
                </h3>
                <Activity size={14} className="text-slate-300" />
            </div>

            <div className="space-y-6">
                {/* Out of Stock Section */}
                <AnimatePresence>
                    {outOfStockItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-rose-50 rounded-[2.5rem] border border-rose-100 p-8 space-y-6 shadow-xl shadow-rose-900/5 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/30 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700" />

                            <div className="flex items-center gap-3 text-rose-600">
                                <ShieldAlert size={20} className="animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stock Crítico Agotado</span>
                            </div>

                            <div className="space-y-4">
                                {outOfStockItems.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-rose-100/50 hover:shadow-lg transition-all">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-tight text-rose-900 leading-none mb-1.5">{p.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest font-mono">SKU: {p.sku || 'SERIAL-X'}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onAdjust(p)}
                                            className="p-3 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-900 hover:scale-110 transition-all active:scale-95"
                                        >
                                            <ShoppingCart size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Low Stock Section */}
                <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 space-y-6 shadow-xl shadow-slate-900/[0.02] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/20 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Zap size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reabastecimiento Necesario</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-300">{lowStockItems.length}</span>
                    </div>

                    <div className="space-y-4">
                        {lowStockItems.length > 0 ? lowStockItems.map((p) => (
                            <div key={p.id} className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50 hover:border-blue-200 transition-all group/item">
                                <div className="flex items-center gap-4">
                                    <div className="text-xl font-black text-blue-600 font-mono italic underline decoration-blue-100 underline-offset-4">{p.stock}</div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-900 leading-none mb-1.5">{p.name}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Umbral de Seguridad</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onAdjust(p)}
                                    className="p-3 border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all group-hover/item:scale-110"
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        )) : (
                            <div className="py-12 flex flex-col items-center justify-center gap-4 opacity-30">
                                <Activity size={32} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Niveles de Flota Estables</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowStockPanel;
