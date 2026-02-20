'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragTransitionEnd' | 'onLayoutAnimationStart' | 'onLayoutAnimationComplete' | 'style'> {
    variant?: 'cyan' | 'green' | 'pink' | 'primary';
    glow?: boolean;
}

const variants = {
    cyan: 'from-cyan-500 to-blue-600 shadow-cyan-500/50',
    green: 'from-emerald-500 to-teal-600 shadow-emerald-500/50',
    pink: 'from-fuchsia-500 to-rose-600 shadow-fuchsia-500/50',
    primary: 'from-emerald-600 to-teal-700 shadow-emerald-600/50',
};

export function GlowButton({
    children,
    className,
    variant = 'primary',
    glow = true,
    ...props
}: GlowButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-white transition-all overflow-hidden group",
                "bg-gradient-to-br",
                variants[variant],
                glow && "shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20" />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            {glow && (
                <div className={cn(
                    "absolute -inset-4 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity -z-10 bg-gradient-to-br",
                    variants[variant]
                )} />
            )}
        </motion.button>
    );
}
