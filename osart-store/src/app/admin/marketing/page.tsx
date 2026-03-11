'use client';

import React, { useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Player } from '@remotion/player';
import { ProductComposition } from '@/remotion/ProductComposition';
import { motion } from 'framer-motion';
import { 
    Video, 
    Share2, 
    Download, 
    Play, 
    Layers, 
    Settings2,
    Sparkles,
    Trash2
} from 'lucide-react';

export default function MarketingPage() {
    const [productName, setProductName] = useState('Pantalla iPhone 15 Pro');
    const [price, setPrice] = useState('$129.990');
    const [image, setImage] = useState('https://img.freepik.com/free-photo/view-display-parts-smartphones-tablets_23-2150171249.jpg');

    return (
        <AdminShell>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full">
                            <Sparkles size={12} className="text-sky-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">Motor de Renderizado</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                            MARKETING <span className="text-sky-500 italic">STUDIO</span>
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="saas-glass-dark p-8 rounded-[2rem] space-y-8">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                <Settings2 size={18} className="text-sky-500" />
                                <h3 className="font-black uppercase tracking-widest text-xs text-white">Configuración del Video</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nombre del Producto</label>
                                    <input 
                                        type="text" 
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Precio de Oferta</label>
                                    <input 
                                        type="text" 
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">URL de Imagen</label>
                                    <input 
                                        type="text" 
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/5">
                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-sky-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20">
                                    <Video size={16} /> Renderizar MP4
                                </button>
                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 text-white/50 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                                    <Share2 size={16} /> Compartir Demo
                                </button>
                            </div>
                        </div>

                        {/* Presets Card */}
                        <div className="saas-glass-dark p-8 rounded-[2rem]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                <Layers size={14} /> Presets de Animación
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-sky-500 text-center">
                                    SaaS Reveal
                                </button>
                                <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center hover:border-white/10 transition-all">
                                    Flash Sale
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Player */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="saas-glass-dark p-4 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            {/* Decorative Player Controls */}
                            <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">REC_STUDIO_LIVE</span>
                            </div>

                            <div className="aspect-[9/16] w-full max-w-[450px] mx-auto rounded-[1.5rem] overflow-hidden shadow-2xl bg-zinc-950">
                                <Player
                                    component={ProductComposition}
                                    durationInFrames={150}
                                    compositionWidth={1080}
                                    compositionHeight={1920}
                                    fps={30}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    controls
                                    autoPlay
                                    loop
                                    inputProps={{
                                        productName: productName,
                                        productImage: image,
                                        price: price,
                                    }}
                                />
                            </div>

                            {/* Actions Bar */}
                            <div className="mt-6 flex items-center justify-between px-4 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-sky-500/20" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">3 Proyectos Guardados</span>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors">
                                    <Trash2 size={14} /> Eliminar Draft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
