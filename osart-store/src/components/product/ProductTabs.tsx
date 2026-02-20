'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql/types';
import { Info, Cpu, Truck, Shield } from 'lucide-react';

interface ProductTabsProps {
    product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

    const tabs = [
        { id: 'desc', label: 'Descripción', icon: <Info size={16} /> },
        { id: 'specs', label: 'Especificaciones', icon: <Cpu size={16} />, hidden: !product.specs || Object.keys(product.specs).length === 0 },
        { id: 'shipping', label: 'Envío y Garantía', icon: <Truck size={16} /> },
    ];

    const visibleTabs = tabs.filter(t => !t.hidden);

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-slate-100 pb-px">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                            activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-6"
                >
                    {activeTab === 'desc' && (
                        <div className="max-w-3xl prose prose-slate">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {product.description || "Este componente electrónico ha sido seleccionado bajo los más estrictos estándares de calidad. Ideal para proyectos que requieren máxima fiabilidad y precisión."}
                            </p>
                            <ul className="mt-8 space-y-4">
                                <li className="flex gap-3 text-sm font-bold text-slate-800">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                    Certificación Industrial Grado A
                                </li>
                                <li className="flex gap-3 text-sm font-bold text-slate-800">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                    Probado individualmente en laboratorio
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'specs' && product.specs && (
                        <div className="max-w-2xl bg-slate-50 rounded-3xl p-8 border border-slate-200">
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-200">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{key}</td>
                                            <td className="py-4 text-sm font-bold text-slate-900 text-right">{String(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                                <Shield className="text-emerald-500 mb-4" size={32} />
                                <h4 className="text-sm font-black uppercase tracking-widest text-emerald-900 mb-2">Garantía Limitada</h4>
                                <p className="text-xs text-emerald-700/80 leading-relaxed font-bold">
                                    Ofrecemos 12 meses de garantía técnica ante fallas de fábrica en todos nuestros componentes de precisión.
                                </p>
                            </div>
                            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                                <Truck className="text-blue-500 mb-4" size={32} />
                                <h4 className="text-sm font-black uppercase tracking-widest text-blue-900 mb-2">Envío Priority</h4>
                                <p className="text-xs text-blue-700/80 leading-relaxed font-bold">
                                    Despachos el mismo día hábil para compras antes de las 14:00h. Seguimiento en tiempo real integrado.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
