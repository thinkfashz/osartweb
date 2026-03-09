"use client";

import React from 'react';
import { Player } from '@remotion/player';
import { ShowcaseComposition } from '@/remotion/ProductShowcase/ShowcaseComposition';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2 } from 'lucide-react';

interface ProductAnimatorProps {
    imageUrl: string;
    productName: string;
    price: string;
}

export const ProductAnimator: React.FC<ProductAnimatorProps> = ({
    imageUrl,
    productName,
    price
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-black border border-white/5 shadow-2xl group"
        >
            <Player
                component={ShowcaseComposition}
                durationInFrames={150}
                compositionWidth={1080}
                compositionHeight={1080}
                fps={30}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls={false}
                loop
                autoPlay
                inputProps={{
                    imageUrl,
                    productName,
                    price
                }}
            />

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles size={14} className="text-sky-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Remotion Live</span>
            </div>

            <button className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20">
                <Maximize2 size={16} />
            </button>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
        </motion.div>
    );
};
