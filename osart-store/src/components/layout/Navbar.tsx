'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Zap, LogOut, Terminal, Package, Sun, Moon, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const HexLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
        <text x="16" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="900" fontFamily="system-ui">O</text>
    </svg>
);

const MobileNavLink = ({ href, onClick, children, variant = 'default' }: { href: string, onClick: () => void, children: React.ReactNode, variant?: 'default' | 'accent' }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`text-2xl font-black uppercase italic tracking-tighter transition-all active:translate-x-2 ${variant === 'accent' ? 'text-violet-400' : 'text-white/80 hover:text-white'}`}
    >
        {children}
    </Link>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, signOut } = useAuth();
    const { itemCount } = useCart();
    const { theme, nextTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 safe-area-pt ${scrolled ? 'py-3 bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-violet-500/10 shadow-2xl shadow-black/40' : 'py-5 bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <HexLogo />
                        <span className="text-xl font-black tracking-tight text-white group-hover:text-violet-300 transition-colors">OSART</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link href="/catalog" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-violet-400 transition-colors">Catálogo</Link>
                        <Link href="/academy" className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5">
                            <BookOpen size={12} strokeWidth={3} />
                            Academia
                        </Link>
                        <Link href="/services" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-violet-400 transition-colors">Servicios</Link>
                        <Link href="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-violet-400 transition-colors">Nosotros</Link>
                        <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all">Consola Admin</Link>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-5">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2 rounded-xl border border-white/10 hover:border-violet-500/40 bg-white/5 hover:bg-violet-500/10 transition-all active:scale-95"
                        >
                            <ShoppingCart size={18} className="text-zinc-400 group-hover:text-violet-400 transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-violet-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30 border-2 border-[#0a0a0f]">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* 3-Way Theme Switcher */}
                        <button
                            onClick={nextTheme}
                            aria-label="Cambiar tema"
                            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all active:scale-90 flex items-center justify-center overflow-hidden hover:bg-violet-500/10 shadow-xl"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' && (
                                    <motion.span key="dark" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={16} className="text-violet-400" />
                                    </motion.span>
                                )}
                                {theme === 'light' && (
                                    <motion.span key="light" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={16} className="text-violet-400" />
                                    </motion.span>
                                )}
                                {theme === 'red' && (
                                    <motion.span key="red" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Zap size={16} className="text-amber-400" fill="currentColor" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-white/10 pl-5">
                                <Link href="/profile" className="flex items-center gap-2 group/user">
                                    <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover/user:scale-105 transition-all">
                                        <User size={15} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                            Activo
                                        </span>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors active:scale-90"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-violet-500/20">
                                <User size={13} />
                                Acceso
                            </Link>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center gap-4">
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 active:scale-90">
                            <ShoppingCart size={22} className="text-white/80" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="p-2 text-white/80 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden w-full bg-[#0a0a0f]/98 backdrop-blur-2xl border-b border-violet-500/10 py-10 px-8 overflow-hidden shadow-2xl"
                        >
                            <div className="flex flex-col gap-10">
                                <nav className="flex flex-col gap-8 text-left">
                                    <MobileNavLink href="/catalog" onClick={() => setIsOpen(false)}>Catálogo</MobileNavLink>
                                    <MobileNavLink href="/academy" onClick={() => setIsOpen(false)} variant="accent">Academia</MobileNavLink>
                                    <MobileNavLink href="/services" onClick={() => setIsOpen(false)}>Servicios</MobileNavLink>
                                    <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>Nosotros</MobileNavLink>
                                    <MobileNavLink href="/admin" onClick={() => setIsOpen(false)} variant="accent">Admin Panel</MobileNavLink>
                                </nav>

                                <div className="pt-6 border-t border-violet-500/10">
                                    {user ? (
                                        <div>
                                            <div className="py-2 border-b border-white/5">
                                                <div className="px-4 py-2">
                                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Operario</p>
                                                    <p className="text-xs font-black text-white truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-white/50 hover:text-white hover:bg-violet-500/10 rounded-xl transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Terminal size={14} className="text-violet-400" />
                                                    Panel de Control
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-white/50 hover:text-white hover:bg-violet-500/10 rounded-xl transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Package size={14} className="text-violet-400" />
                                                    Mis Pedidos
                                                </Link>
                                                <button
                                                    onClick={() => { signOut(); setIsOpen(false); }}
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full text-left"
                                                >
                                                    <LogOut size={14} />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-violet-500/25 transition-all"
                                        >
                                            <User size={18} />
                                            Acceso de Usuario
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
