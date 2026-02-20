'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Settings2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlowButton } from '@/components/ui/GlowButton';

interface AdjustStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { productId: string; qty: number; type: 'in' | 'out' | 'adjust'; reason: string }) => void;
    product: any;
    isLoading?: boolean;
}

const AdjustStockModal = ({
    isOpen,
    onClose,
    onSave,
    product,
    isLoading = false
}: AdjustStockModalProps) => {
    const [qty, setQty] = useState(1);
    const [type, setType] = useState<'in' | 'out' | 'adjust'>('in');
    const [reason, setReason] = useState('');

    const handleSave = () => {
        onSave({
            productId: product.id,
            qty,
            type,
            reason: reason || `Ajuste manual: ${type.toUpperCase()} ${qty} unidades`
        });
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <div className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                        <Settings2 size={14} />
                                        Módulo de Ajuste Técnico
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
                                        Inventario: {product.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        SKU: {product.sku || 'N/A'} • STOCK ACTUAL: {product.stock}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Adjustment Type Selector */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'in', label: 'Entrada', icon: Plus, color: 'emerald' },
                                    { id: 'out', label: 'Salida', icon: Minus, color: 'rose' },
                                    { id: 'adjust', label: 'Setear', icon: Settings2, color: 'blue' },
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setType(opt.id as any)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                                            type === opt.id
                                                ? `bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-950/20`
                                                : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-100"
                                        )}
                                    >
                                        <opt.icon size={20} className={cn(
                                            type === opt.id ? "text-white" : `text-${opt.color}-500 group-hover:scale-110 transition-transform`
                                        )} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Quantity Input */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Cantidad de Unidades</label>
                                <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <input
                                        type="number"
                                        value={qty}
                                        onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                                        className="flex-1 bg-transparent text-center text-3xl font-black text-slate-900 outline-none"
                                    />
                                    <button
                                        onClick={() => setQty(qty + 1)}
                                        className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Reason Input */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Motivo del Ajuste</label>
                                <textarea
                                    placeholder="EJ: REABASTECIMIENTO TRIMESTRAL / CORRECCIÓN DE DAÑO..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-[10px] font-bold uppercase tracking-widest min-h-[100px] outline-none focus:ring-2 ring-slate-900/5 transition-all text-slate-900 placeholder:text-slate-300"
                                />
                            </div>

                            {/* Footer Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-8 py-5 rounded-2xl bg-slate-50 text-slate-900 font-black uppercase italic tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                                >
                                    Abortar
                                </button>
                                <GlowButton
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? 'EN PROCESO...' : 'EJECUTAR CAMBIO'}
                                </GlowButton>
                            </div>
                        </div>

                        {/* Safety Indicator */}
                        <div className="bg-slate-950 p-4 flex items-center justify-center gap-3">
                            <ShieldCheck size={16} className="text-emerald-500" />
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">
                                AUTENTICACIÓN DE ADMINISTRADOR VERIFICADA
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdjustStockModal;
