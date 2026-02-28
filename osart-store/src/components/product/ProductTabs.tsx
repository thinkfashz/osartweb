'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql/types';
import { Info, Cpu, Truck, Shield, Box, FileText } from 'lucide-react';

interface ProductTabsProps {
    product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

    const tabs = [
        { id: 'desc', label: 'MEMO_DESCRIPCION', icon: <FileText size={14} /> },
        { id: 'specs', label: 'DATA_SHEET', icon: <Cpu size={14} />, hidden: !product.specs || typeof product.specs !== 'object' || Object.keys(product.specs).length === 0 },
        { id: 'shipping', label: 'LOGISTICA_PRO', icon: <Truck size={14} /> },
    ];

    const visibleTabs = tabs.filter(t => !t.hidden);

    return (
        <div className="space-y-12">
            <div className="flex flex-wrap gap-2 lg:gap-4 border-b border-white/5 pb-px">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group",
                            activeTab === tab.id ? "text-electric-blue" : "text-white/40 hover:text-white"
                        )}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabPDP"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[300px]"
                >
                    {activeTab === 'desc' && (
                        <div className="max-w-4xl space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-1 h-8 bg-electric-blue/40 mt-1" />
                                <p className="text-white/70 leading-relaxed text-lg font-medium italic">
                                    "{product.description || "Este componente de alta precisión ha sido validado para su integración en sistemas críticos. Cada unidad pasa por un riguroso proceso de control de calidad antes del despacho."}"
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-8">
                                <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-electric-blue">
                                        <Box size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Integridad Estructural</h4>
                                    </div>
                                    <p className="text-[11px] text-white/40 uppercase leading-relaxed font-mono">
                                        Empaque antiestático certificado y blindaje contra interferencias electromagnéticas garantizado.
                                    </p>
                                </div>
                                <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <Shield size={16} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Control Calidad</h4>
                                    </div>
                                    <p className="text-[11px] text-white/40 uppercase leading-relaxed font-mono">
                                        Inspección visual y funcional realizada por técnicos nivel 3 bajo protocolos ISO-OSART.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'specs' && product.specs && (
                        <div className="max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
                            <div className="p-4 bg-zinc-900/50 border-b border-white/10 flex justify-between items-center">
                                <span className="text-[10px] font-mono text-electric-blue/60 uppercase tracking-widest">Registro de Componente V3.2</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                </div>
                            </div>
                            <table className="w-full border-collapse">
                                <tbody className="divide-y divide-white/5">
                                    {product.specs && typeof product.specs === 'object' && Object.entries(product.specs).map(([key, value]) => (
                                        <tr key={key} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-6 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">{key}</td>
                                            <td className="py-4 px-6 text-sm font-black text-white text-right font-mono italic">{String(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                            <div className="bg-zinc-900/40 p-10 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-electric-blue border border-white/10 mb-6 font-mono font-bold text-xs">A-1</div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-4">Garantía Certificada</h4>
                                <p className="text-[11px] text-white/40 leading-relaxed font-mono uppercase">
                                    Cobertura total por 180 ciclos solares (6 meses). Soporte técnico prioritario en caso de anomalías de hardware detectadas bajo uso nominal.
                                </p>
                            </div>
                            <div className="bg-zinc-900/40 p-10 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 border border-white/10 mb-6 font-mono font-bold text-xs">NX-9</div>
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-4">Logística Terrestre</h4>
                                <p className="text-[11px] text-white/40 leading-relaxed font-mono uppercase">
                                    Despacho instantáneo procesado en HUB Central. Latencia de entrega promedio para Región Metropolitana: 120 minutos estándar.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
