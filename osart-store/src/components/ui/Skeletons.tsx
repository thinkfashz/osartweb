'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <motion.div
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={cn("bg-slate-200 rounded-md", className)}
        />
    );
};

export const CardSkeleton = () => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="w-24 h-3" />
            <Skeleton className="w-32 h-6" />
        </div>
    </div>
);

export const TableRowSkeleton = () => (
    <tr className="border-b border-slate-50">
        <td className="px-8 py-5">
            <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-32 h-4" />
            </div>
        </td>
        <td className="px-8 py-5">
            <Skeleton className="w-20 h-4 mx-auto" />
        </td>
        <td className="px-8 py-5">
            <Skeleton className="w-24 h-3" />
        </td>
        <td className="px-8 py-5">
            <Skeleton className="w-8 h-8 rounded-full ml-auto" />
        </td>
    </tr>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-64 h-10 rounded-2xl" />
        </div>
        <table className="w-full">
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                ))}
            </tbody>
        </table>
    </div>
);
