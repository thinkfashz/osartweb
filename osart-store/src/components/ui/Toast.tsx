'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={20} />,
        error: <XCircle className="text-rose-500" size={20} />,
        info: <AlertCircle className="text-blue-500" size={20} />,
    };

    const backgrounds = {
        success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
        error: 'bg-rose-50 border-rose-100 text-rose-900',
        info: 'bg-blue-50 border-blue-100 text-blue-900',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className={cn(
                        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] min-w-[320px] max-w-md",
                        "px-6 py-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-center gap-4",
                        backgrounds[type]
                    )}
                >
                    {icons[type]}
                    <p className="flex-1 text-sm font-bold">{message}</p>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
