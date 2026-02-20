"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Users,
    BarChart3,
    Database,
    Settings,
    Menu,
    X,
    LogOut,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Power Hub', icon: LayoutDashboard, path: '/admin' },
    { name: 'Catalog', icon: Package, path: '/admin/catalog' },
    { name: 'Stock Control', icon: TrendingUp, path: '/admin/stock' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Revenue', icon: BarChart3, path: '/admin/sales' },
    { name: 'Database', icon: Database, path: '/admin/database' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 80 }}
            className="h-full bg-white border-r border-zinc-100 flex flex-col z-50 relative group shadow-sm"
        >
            {/* Sidebar Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-20 bg-white border border-zinc-100 rounded-full p-1.5 shadow-md hover:bg-zinc-50 transition-colors hidden md:block"
            >
                {isOpen ? <X size={12} /> : <Menu size={12} />}
            </button>

            {/* Logo */}
            <div className={`p-6 mb-8 flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center shrink-0 shadow-lg shadow-zinc-950/10">
                    <ShieldCheck size={18} className="text-white" />
                </div>
                {isOpen && (
                    <span className="font-bold text-xl tracking-tighter text-zinc-950 uppercase italic">
                        OSART<span className="text-zinc-400 font-light">PRO</span>
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-950/10'
                                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                                } ${!isOpen && 'justify-center'}`}
                        >
                            <item.icon size={20} className={isActive ? 'text-electric-blue' : ''} />
                            {isOpen && (
                                <span className={`font-semibold tracking-tight ${isActive ? 'translate-x-1' : ''} transition-transform`}>
                                    {item.name}
                                </span>
                            )}
                            {isActive && isOpen && (
                                <motion.div
                                    layoutId="nav-active"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-electric-blue"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 mt-auto border-t border-zinc-100">
                <button className={`flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ${!isOpen && 'justify-center'}`}>
                    <LogOut size={20} />
                    {isOpen && <span className="font-semibold">Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
}
