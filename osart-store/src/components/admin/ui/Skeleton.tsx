"use client";
import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-pulse bg-zinc-800/60 rounded-lg ${className}`} />
);

export const StatCardSkeleton = () => (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 md:p-6 min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        </div>
        <Skeleton className="h-2.5 w-32 mt-4" />
    </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
            </div>
        ))}
    </div>
);
