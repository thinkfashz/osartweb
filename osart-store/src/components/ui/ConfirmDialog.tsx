'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false
}: ConfirmDialogProps) => {
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
                        className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                    variant === 'danger' ? "bg-red-50 text-red-600" :
                                        variant === 'warning' ? "bg-orange-50 text-orange-600" :
                                            "bg-blue-50 text-blue-600"
                                )}>
                                    <AlertTriangle size={24} />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                                    {title}
                                </h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    {description}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 text-slate-900 font-black uppercase italic tracking-widest text-[10px] hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={cn(
                                        "flex-1 px-6 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-50",
                                        variant === 'danger' ? "bg-red-600 text-white shadow-lg shadow-red-600/20" :
                                            variant === 'warning' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" :
                                                "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                                    )}
                                >
                                    {isLoading ? 'Procesando...' : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
