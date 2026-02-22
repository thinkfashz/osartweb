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
    ShieldCheck,
    Zap,
    Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Productos', icon: Package, path: '/admin/products' },
    { name: 'Categorías', icon: Layers, path: '/admin/categories' },
    { name: 'Stock en Vivo', icon: TrendingUp, path: '/admin/stock' },
    { name: 'Configuraciones', icon: Settings, path: '/admin/settings' },
];

const SYSTEM_ITEMS = [
    { name: 'Clientes', icon: Users, path: '/admin/customers' },
    { name: 'Ventas', icon: BarChart3, path: '/admin/sales' },
    { name: 'Sincronización', icon: Zap, path: '/admin/sync' },
    { name: 'Base de Datos', icon: Database, path: '/admin/database' },
];

export default function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // Auto-close on mobile when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname, setIsOpen]);

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 80 : 280,
                x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0
                h-full bg-zinc-950 border-r border-zinc-900/50 flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.4)] lg:shadow-none
            `}
        >
            {/* Mobile Close Button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-6 p-2 text-zinc-500 hover:text-white lg:hidden active:scale-95 transition-colors touch-target"
            >
                <X size={24} />
            </button>

            {/* Sidebar Toggle (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-zinc-900 border border-zinc-800 rounded-full p-1.5 shadow-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all hidden lg:flex items-center justify-center z-50 group interactive-focus"
            >
                {isCollapsed ?
                    <Menu size={11} className="text-zinc-400 group-hover:text-electric-blue transition-colors" /> :
                    <X size={11} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                }
            </button>

            {/* Logo Section */}
            <div className={`p-8 mb-4 flex items-center gap-4 ${isCollapsed ? 'justify-center px-0' : ''} transition-all`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group">
                    <ShieldCheck size={20} className="text-electric-blue relative z-10" />
                    <div className="absolute inset-0 bg-electric-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter text-white uppercase italic leading-none">
                            OSART<span className="text-electric-blue font-light">PRO</span>
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1 pulse-slow">
                            Nivel Crítico 01
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar-dark py-4">
                <div>
                    <h3 className={`px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                        {!isCollapsed && "Núcleo Operativo"}
                    </h3>
                    <div className="space-y-1.5">
                        {NAV_ITEMS.map((item) => (
                            <NavItem key={item.path} item={item} pathname={pathname} isCollapsed={isCollapsed} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className={`px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <div className="w-1 h-3 bg-zinc-800 rounded-full" />
                        {!isCollapsed && "Sistemas de Red"}
                    </h3>
                    <div className="space-y-1.5">
                        {SYSTEM_ITEMS.map((item) => (
                            <NavItem key={item.path} item={item} pathname={pathname} isCollapsed={isCollapsed} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Status & Logout */}
            <div className="p-4 mt-auto border-t border-zinc-900/50 bg-black/20 backdrop-blur-xl">
                {!isCollapsed && (
                    <div className="px-4 py-3 mb-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Sistema Operativo</span>
                    </div>
                )}
                <button className={`flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all group ${isCollapsed ? 'justify-center' : ''}`}>
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-black text-[10px] uppercase tracking-widest">Cerrar Sesión</span>}
                </button>
            </div>
        </motion.aside>
    );
}

const NavItem = ({ item, pathname, isCollapsed }: any) => {
    const isActive = pathname === item.path;
    return (
        <Link
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive
                ? 'bg-zinc-100 text-black font-black'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
            <item.icon size={18} className={`${isActive ? 'text-black' : 'group-hover:text-electric-blue group-hover:scale-110 transition-all duration-300'}`} />
            {!isCollapsed && (
                <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                    {item.name}
                </span>
            )}

            {isActive && !isCollapsed && (
                <motion.div
                    layoutId="nav-active"
                    className="absolute right-0 top-0 bottom-0 w-1 bg-electric-blue"
                />
            )}
        </Link>
    );
};
