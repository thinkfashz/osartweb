import React from 'react';
import { Package, AlertTriangle, ArrowUpRight, Activity, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiProps {
    title: string;
    value: string;
    description: string;
    icon: React.ElementType;
    color: string;
    trend?: { value: string; positive: boolean };
}

const StockKpi = ({ title, value, description, icon: Icon, color, trend }: KpiProps) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/[0.02] relative overflow-hidden group hover:border-slate-300 transition-all duration-500">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform" />

        <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-start justify-between">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500",
                    color
                )}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm",
                        trend.positive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                        {trend.positive ? <ArrowUpRight size={12} /> : <Activity size={12} />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                    <Zap size={10} className="text-slate-200" />
                    {title}
                </p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase underline decoration-slate-100 decoration-4 underline-offset-8">
                    {value}
                </h4>
            </div>

            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

export default function StockKpis({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StockKpi
                title="Inventario Total"
                value={String(stats.totalStock || 0)}
                description="Unidades físicas en bóveda logística OSART"
                icon={Package}
                color="bg-slate-950 text-white shadow-slate-950/20"
                trend={{ value: "+12.5%", positive: true }}
            />
            <StockKpi
                title="Hardware Activo"
                value={String(stats.totalSkus || 0)}
                description="Tipos de hardware único registrados"
                icon={Zap}
                color="bg-blue-600 text-white shadow-blue-600/20"
            />
            <StockKpi
                title="Alertas Críticas"
                value={String(stats.lowStockCount || 0)}
                description="Unidades requiriendo despliegue inmediato"
                icon={ShieldAlert}
                color="bg-rose-600 text-white shadow-rose-600/20"
                trend={{ value: "REABASTECER", positive: false }}
            />
            <StockKpi
                title="Flujo Entrante"
                value="+248"
                description="Ingresos registrados en último ciclo (7d)"
                icon={Activity}
                color="bg-emerald-600 text-white shadow-emerald-600/20"
                trend={{ value: "OPTIMAL", positive: true }}
            />
        </div>
    );
}
