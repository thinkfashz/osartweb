'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Zap, LogOut, Terminal, Package, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const MobileNavLink = ({ href, onClick, children, variant = 'default' }: { href: string, onClick: () => void, children: React.ReactNode, variant?: 'default' | 'accent' }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`text-2xl font-black uppercase italic tracking-tighter transition-all active:translate-x-2 ${variant === 'accent' ? 'text-sky-500' : 'text-zinc-900 dark:text-white'}`}
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
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 safe-area-pt ${scrolled ? 'py-4 bg-background/80 backdrop-blur-2xl border-b border-border shadow-2xl' : 'py-6 bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 group">
                        <span className="text-foreground capitalize text-readability">Osart</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link href="/catalog" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-sky-500 transition-colors">Catálogo</Link>
                        <Link href="/services" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-sky-500 transition-colors">Servicios</Link>
                        <Link href="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-sky-500 transition-colors">Nosotros</Link>
                        <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">Consola Admin</Link>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2 transition-transform active:scale-95 bg-zinc-100 dark:bg-white/5 rounded-xl border border-transparent hover:border-sky-500/30 transition-all"
                        >
                            <ShoppingCart size={18} className="text-zinc-600 dark:text-zinc-400 group-hover:text-sky-500 transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-sky-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20 border-2 border-white dark:border-zinc-950">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* 3-Way Theme Switcher */}
                        <button
                            onClick={nextTheme}
                            aria-label="Cambiar tema"
                            className="relative p-2.5 rounded-xl bg-background/50 border border-foreground/10 hover:border-sky-500/50 transition-all active:scale-90 flex items-center justify-center overflow-hidden hover:bg-sky-500/5 shadow-xl"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' && (
                                    <motion.span key="dark" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={16} className="text-sky-500" />
                                    </motion.span>
                                )}
                                {theme === 'light' && (
                                    <motion.span key="light" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={16} className="text-sky-500" />
                                    </motion.span>
                                )}
                                {theme === 'red' && (
                                    <motion.span key="red" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Zap size={16} className="text-white" fill="white" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-zinc-200 dark:border-white/10 pl-6">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 group/user"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover/user:scale-105 transition-all">
                                        <User size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                            Activo
                                        </span>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors active:scale-90"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                                <User size={14} />
                                Acceso
                            </Link>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 active:scale-90"
                        >
                            <ShoppingCart size={22} className="text-foreground" />
                            {itemCount > 0 && (
                                <span className="absolute 0 right-0 w-4 h-4 bg-sky-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="p-2 text-foreground bg-muted/20 border border-border rounded-xl active:scale-90 transition-transform"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                            className="lg:hidden w-full bg-background/95 backdrop-blur-2xl border-b border-white/5 py-10 px-8 overflow-hidden shadow-2xl"
                        >
                            <div className="flex flex-col gap-10">
                                <nav className="flex flex-col gap-8 text-left">
                                    <MobileNavLink href="/catalog" onClick={() => setIsOpen(false)}>Catálogo</MobileNavLink>
                                    <MobileNavLink href="/services" onClick={() => setIsOpen(false)}>Servicios</MobileNavLink>
                                    <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>Nosotros</MobileNavLink>
                                    <MobileNavLink href="/admin" onClick={() => setIsOpen(false)} variant="accent">Admin Panel</MobileNavLink>
                                </nav>

                                <div className="pt-6 border-t border-white/10">
                                    {user ? (
                                        <div>
                                            <div className="py-2 border-b border-white/5">
                                                <div className="px-4 py-2">
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Operario</p>
                                                    <p className="text-xs font-black text-white truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Terminal size={14} className="text-sky-500" />
                                                    Panel de Control
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <Package size={14} />
                                                    Mis Pedidos
                                                </Link>
                                                <button
                                                    onClick={() => { signOut(); setIsOpen(false); }}
                                                    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase italic tracking-widest text-red-500/60 hover:text-red-500 hover:bg-white/5 transition-all w-full text-left"
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
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-sky-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-sky-500/20"
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
