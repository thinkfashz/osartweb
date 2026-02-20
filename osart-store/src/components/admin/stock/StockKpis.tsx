import { StatCard } from '@/components/admin/ui/StatCard';
import { Package, Zap, ShieldAlert, Activity } from 'lucide-react';

export default function StockKpis({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Inventario Total"
                value={String(stats.totalStock || 0)}
                description="Unidades físicas en bóveda"
                icon={Package}
                trend={{ value: 12.5, isUp: true }}
            />
            <StatCard
                title="Hardware Activo"
                value={String(stats.totalSkus || 0)}
                description="Tipos de hardware único"
                icon={Zap}
                color="electric-blue"
            />
            <StatCard
                title="Alertas Críticas"
                value={String(stats.lowStockCount || 0)}
                description="Requieren atención"
                icon={ShieldAlert}
                color="red-500"
            />
            <StatCard
                title="Flujo Entrante"
                value="+248"
                description="Ingresos últimos 7d"
                icon={Activity}
                color="emerald-500"
            />
        </div>
    );
}
