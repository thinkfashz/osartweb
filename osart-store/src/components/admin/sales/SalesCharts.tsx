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
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Target size={10} />
                        Temporal Data: {label}
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">
                            Revenue: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(payload[0].value)}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                            Volume: {payload[0].payload.orders} Transactions
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Area Chart */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group"
            >
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic flex items-center gap-3">
                            <TrendingUp size={20} className="text-slate-400" />
                            Revenue Throughput
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transactional Flow - Temporal Distribution</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                        <Zap size={14} className="text-slate-950" />
                        <span className="text-[10px] font-black text-slate-950 uppercase">Live Telemetry</span>
                    </div>
                </div>

                <div className="h-[350px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.08} />
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                                dy={15}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).toUpperCase();
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0f172a', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0f172a"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                                animationDuration={2000}
                                activeDot={{ r: 6, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-40 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            </motion.div>

            {/* Volume Chart */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col group relative overflow-hidden"
            >
                <div className="mb-10 relative z-10">
                    <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic flex items-center gap-3">
                        <BarChart3 size={20} className="text-slate-400" />
                        System Load
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction Volume (7D Segment)</p>
                </div>

                <div className="h-[350px] w-full flex-1 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData.slice(-7)}>
                            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                                dy={15}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('es-CL', { weekday: 'short' }).toUpperCase();
                                }}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                content={<CustomTooltip />}
                            />
                            <Bar dataKey="orders" fill="#0f172a" radius={[12, 12, 4, 4]} barSize={32}>
                                {revenueData.slice(-7).map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 6 ? '#0f172a' : '#f1f5f9'}
                                        stroke={index === 6 ? '#0f172a' : '#e2e8f0'}
                                        strokeWidth={1}
                                        className="transition-all duration-500 hover:fill-slate-900 cursor-pointer"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Technical Deco */}
                <div className="absolute top-2 right-2 flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-3 bg-slate-100 rounded-full" />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
