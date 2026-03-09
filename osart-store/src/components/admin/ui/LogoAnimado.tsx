"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function LogoAnimado({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <motion.div
                className="relative w-12 h-12 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Orbital Rings */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 rounded-xl border border-primary/40"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />

                {/* Main Icon Container */}
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                    <ShieldCheck className="text-white relative z-10" size={20} />

                    {/* Inner Pulse */}
                    <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ opacity: [0, 0.2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Outer Glow */}
                <motion.div
                    className="absolute -inset-1 bg-primary/20 blur-lg rounded-full -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </motion.div>

            {!collapsed && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <span className="font-black text-2xl tracking-tighter text-foreground uppercase italic leading-none flex items-center">
                        OSART
                        <span className="text-primary ml-1 not-italic font-medium text-lg">PRO</span>
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">
                        Sistemas de Control
                    </span>
                </motion.div>
            )}
        </div>
    );
}
