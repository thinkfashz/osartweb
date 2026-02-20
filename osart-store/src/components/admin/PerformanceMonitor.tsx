'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Zap, Cpu, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PerformanceMonitorProps {
    status: 'connected' | 'connecting' | 'error';
    latency: number | null;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ status, latency }) => {
    const [loadTime, setLoadTime] = useState<number>(0);
    const [memory, setMemory] = useState<{ used: number; total: number } | null>(null);

    useEffect(() => {
        // Estimate load time
        if (typeof window !== 'undefined') {
            const timing = window.performance.timing;
            const time = timing.loadEventEnd - timing.navigationStart;
            setLoadTime(time > 0 ? time : 0);

            // Memory usage (if supported)
            if ((performance as any).memory) {
                const mem = (performance as any).memory;
                setMemory({
                    used: Math.round(mem.usedJSHeapSize / 1048576),
                    total: Math.round(mem.jsHeapSizeLimit / 1048576)
                });
            }
        }
    }, []);

    const getStatusColor = (val: number, thresholds: [number, number]) => {
        if (val < thresholds[0]) return 'bg-emerald-500';
        if (val < thresholds[1]) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Connection Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <Server size={18} className="text-slate-400" />
                    <div className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    )}>
                        {status}
                    </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{latency ?? '—'} <span className="text-xs text-slate-400">ms</span></div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Latencia Servidor</div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: latency ? `${Math.min((latency / 500) * 100, 100)}%` : 0 }}
                        className={cn("h-full", getStatusColor(latency || 0, [150, 400]))}
                    />
                </div>
            </div>

            {/* Load Speed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <Zap size={18} className="text-slate-400" />
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Page Load</div>
                </div>
                <div className="text-2xl font-black text-slate-900">{loadTime} <span className="text-xs text-slate-400">ms</span></div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Velocidad de Carga</div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((loadTime / 3000) * 100, 100)}%` }}
                        className={cn("h-full", getStatusColor(loadTime, [800, 2000]))}
                    />
                </div>
            </div>

            {/* Memory usage */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <Cpu size={18} className="text-slate-400" />
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Heap Size</div>
                </div>
                <div className="text-2xl font-black text-slate-900">{memory?.used || '—'} <span className="text-xs text-slate-400">MB</span></div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Uso de Memoria</div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: memory ? `${(memory.used / memory.total) * 100}%` : 0 }}
                        className={cn("h-full", getStatusColor(memory?.used || 0, [50, 150]))}
                    />
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitor;
