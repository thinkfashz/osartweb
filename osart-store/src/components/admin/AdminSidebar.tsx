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
    Layers,
    Webhook
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LogoAnimado from './ui/LogoAnimado';
import { cn } from '@/lib/utils';

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
    { name: 'Explorador API', icon: Webhook, path: '/admin/api-tester' },
];

export default function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const { signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    // Auto-close on mobile when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname, setIsOpen]);

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 100 : 300,
                x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className={cn(
                "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 h-full flex flex-col transition-all",
                "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-sky-500/5"
            )}
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
            <div className={`p-8 mb-4 ${isCollapsed ? 'px-0 flex justify-center' : ''}`}>
                <LogoAnimado collapsed={isCollapsed} />
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
            <div className="p-6 mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-black/20">
                {!isCollapsed && (
                    <div className="px-4 py-3 mb-4 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Nodos Estables</span>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl transition-all group",
                        "text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="font-extrabold text-[11px] uppercase tracking-wider">Desconectar</span>}
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
            className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-zinc-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/5',
                isCollapsed && "justify-center px-0 mx-2"
            )}
        >
            <item.icon
                size={20}
                className={cn(
                    "transition-all duration-300",
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                )}
            />
            {!isCollapsed && (
                <span className={cn(
                    "text-[11px] font-extrabold uppercase tracking-widest transition-all",
                    isActive ? "ml-1" : "group-hover:ml-1"
                )}>
                    {item.name}
                </span>
            )}

            {isActive && !isCollapsed && (
                <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-3 bottom-3 w-1.5 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </Link>
    );
};
