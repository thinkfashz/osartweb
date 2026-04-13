"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function LogoAnimado({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Outer glow */}
                <motion.div
                    className="absolute -inset-1 bg-violet-500/20 blur-lg rounded-full -z-10"
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
                        fill="#8b5cf6"
                        fillOpacity="0.2"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                    />
                    <text
                        x="16"
                        y="20"
                        textAnchor="middle"
                        fill="#8b5cf6"
                        fontSize="12"
                        fontWeight="900"
                        fontFamily="system-ui"
                    >
                        O
                    </text>
                </svg>
            </motion.div>

            {!collapsed && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <span className="font-black text-xl tracking-tighter text-white uppercase leading-none">
                        OSART
                    </span>
                    <span className="text-[9px] font-bold text-violet-400/70 uppercase tracking-[0.3em] mt-0.5">
                        ADMIN
                    </span>
                </motion.div>
            )}
        </div>
    );
}
