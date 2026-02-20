'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
}

export function GlowButton({ children, className, ...props }: GlowButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative overflow-hidden bg-zinc-950 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-zinc-950/40 transition-all py-4 px-8",
                className
            )}
            {...props}
        >
            {/* Animated Glow Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            {/* Inner Glow */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
