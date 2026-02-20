'use client';

import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface ChartProps {
    type: 'area' | 'bar';
    data: any[];
    dataKey: string;
    color?: string;
    height?: number;
}

const ModernChart: React.FC<ChartProps> = ({ type, data, dataKey, color = "#0f172a", height = 240 }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-black text-slate-900">
                        {`$${payload[0].value.toLocaleString()}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height, minHeight: height }}>
            <ResponsiveContainer width="100%" height="100%" debounce={1}>
                {type === 'area' ? (
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey={dataKey}
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={color} fillOpacity={0.4 + (index / data.length) * 0.6} />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default ModernChart;
