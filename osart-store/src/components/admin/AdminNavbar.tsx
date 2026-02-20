'use client';

import React, { useState } from 'react';
import {
    Bell,
    Search,
    Settings,
    HelpCircle,
    Terminal,
    Activity,
    LogOut,
    ChevronDown,
    Zap,
    Cpu,
    Monitor
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminNavbarProps {
    currentSection: string;
    connState: string;
    latency: number | null;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ currentSection, connState, latency }) => {
    const { user, signOut } = useAuth();
    const [showTools, setShowTools] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
            {/* Left: Section Indicator */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <h1 className="text-sm font-black uppercase tracking-tighter italic text-slate-900 leading-none">
                        {currentSection}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            connState === 'connected' ? "bg-emerald-500" : "bg-rose-500"
                        )} />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {connState === 'connected' ? `Live · ${latency}ms` : 'Offline'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center: Search (SaaS Style) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Comando rápido (Ctrl + K)..."
                        className="w-full bg-slate-100/50 border border-transparent focus:bg-white focus:border-slate-200 rounded-lg py-1.5 pl-10 pr-4 text-xs font-medium outline-none transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Advanced Tools Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowTools(!showTools)}
                        className={cn(
                            "p-2 rounded-lg transition-colors border",
                            showTools ? "bg-slate-100 border-slate-200 text-slate-900" : "border-transparent text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Zap size={18} />
                    </button>

                    <AnimatePresence>
                        {showTools && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 p-2 z-[60]"
                            >
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Herramientas Avanzadas</div>
                                <div className="space-y-1">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                        <Terminal size={14} className="text-slate-400" />
                                        Code Review & Diagnostics
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                        <Activity size={14} className="text-slate-400" />
                                        Performance Monitor
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                        <Cpu size={14} className="text-slate-400" />
                                        Hot Script Runner
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-slate-200 mx-1" />

                {/* User Menu */}
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                        {user?.email?.slice(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-900 leading-tight">{user?.email?.split('@')[0]}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Admin</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Logout Button (Direct Access) */}
                <button
                    onClick={signOut}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Cerrar Sesión"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default AdminNavbar;
