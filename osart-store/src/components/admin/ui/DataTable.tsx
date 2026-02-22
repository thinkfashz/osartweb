"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DataTableProps {
    headers?: string[];
    children?: React.ReactNode;
    data?: any[];
    columns?: {
        header: string;
        accessorKey?: string;
        cell?: (props: { row: { original: any } }) => React.ReactNode;
    }[];
    loading?: boolean;
    title?: string;
    actions?: React.ReactNode;
}

export const DataTable = ({ headers, children, data, columns, loading, title, actions }: DataTableProps) => {
    const tableHeaders = headers || columns?.map(c => c.header) || [];

    return (
        <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-xl shadow-zinc-900/[0.02] relative group/table transition-all duration-500">
            {/* Ambient Grid for industrial feel */}
            <div className="absolute inset-0 opacity-[0.01] pointer-events-none group-hover/table:opacity-[0.02] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {(title || actions) && (
                <div className="px-6 md:px-10 py-6 md:py-8 border-b border-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/10 relative z-10">
                    {title && (
                        <div className="space-y-1">
                            <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-zinc-950 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                {title}
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Lectura de Sensores en Tiempo Real</p>
                        </div>
                    )}
                    {actions && <div className="flex items-center gap-3">{actions}</div>}
                </div>
            )}

            <div className="overflow-x-auto custom-scrollbar relative z-10">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-zinc-50/50">
                            {tableHeaders.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-6 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-b border-zinc-50"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50/50">
                        {loading ? (
                            <tr>
                                <td colSpan={tableHeaders.length} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 border-4 border-zinc-100 border-t-blue-500 rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Sincronizando con Satélite...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data && columns ? (
                            data.length > 0 ? (
                                data.map((item, rowIdx) => (
                                    <DataRow key={item.id || rowIdx} className="group/row">
                                        {columns.map((col, colIdx) => (
                                            <DataCell key={colIdx} className="group-hover/row:bg-zinc-50/30 transition-colors">
                                                {col.cell ? col.cell({ row: { original: item } }) : (col.accessorKey ? item[col.accessorKey] : null)}
                                            </DataCell>
                                        ))}
                                    </DataRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <div className="w-12 h-12 rounded-full border border-dashed border-zinc-300 flex items-center justify-center">
                                                <span className="text-xl font-black text-zinc-300">0</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sin datos detectados en este sector</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ) : children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const DataRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`hover:bg-zinc-50/50 transition-colors group ${className}`}
    >
        {children}
    </motion.tr>
);

export const DataCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <td className={`px-4 md:px-6 py-4 text-sm text-zinc-600 ${className}`}>
        {children}
    </td>
);
