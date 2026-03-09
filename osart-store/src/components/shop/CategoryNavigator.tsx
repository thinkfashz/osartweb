'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdminCategory } from '@/types/admin';

interface CategoryNavigatorProps {
    categories: AdminCategory[];
}

export const CategoryNavigator = ({ categories }: CategoryNavigatorProps) => {
    return (
        <section className="py-8 px-4 max-w-7xl mx-auto overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Busca por categorías
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {categories.map((category, idx) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex-shrink-0 snap-start"
                    >
                        <Link
                            href={`/category/${category.slug}`}
                            className="group flex flex-col items-center gap-3 w-24 sm:w-28"
                        >
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 z-10 transition-colors" />
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                        <span className="text-2xl text-zinc-700">{category.name[0]}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-center text-xs font-medium text-zinc-400 group-hover:text-blue-400 transition-colors line-clamp-2 px-1 leading-tight">
                                {category.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
