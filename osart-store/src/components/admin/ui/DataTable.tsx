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
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    {title && (
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
                            {title}
                        </h3>
                    )}
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50">
                            {tableHeaders.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 min-w-[120px]"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {loading ? (
                            <tr>
                                <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-2 border-zinc-100 border-t-zinc-950 rounded-full animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Accediendo a base de datos...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data && columns ? (
                            data.length > 0 ? (
                                data.map((item, rowIdx) => (
                                    <DataRow key={item.id || rowIdx}>
                                        {columns.map((col, colIdx) => (
                                            <DataCell key={colIdx}>
                                                {col.cell ? col.cell({ row: { original: item } }) : (col.accessorKey ? item[col.accessorKey] : null)}
                                            </DataCell>
                                        ))}
                                    </DataRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="px-6 py-12 text-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">No se encontraron registros activos</span>
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
