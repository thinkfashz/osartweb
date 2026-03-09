"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { Activity, BarChart3, TrendingUp, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SalesCharts({ data }: { data: any }) {
    const revenueData = data?.revenueByDay || [];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-zinc-900/90 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                        Fecha: {label}
                    </p>
                    <div className="space-y-1">
                        <p className="text-base font-black text-sky-600 dark:text-sky-400">
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(payload[0].value)}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-500">
                            {payload[0].payload.orders} Transacciones
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        dy={15}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).toUpperCase();
                        }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0EA5E9', strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0EA5E9"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                        animationDuration={1500}
                        activeDot={{ r: 8, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
