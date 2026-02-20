'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Zap, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNavLink = ({ href, onClick, children, variant = 'default' }: { href: string, onClick: () => void, children: React.ReactNode, variant?: 'default' | 'accent' }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`text-2xl font-black uppercase italic tracking-tighter transition-all active:translate-x-2 ${variant === 'accent' ? 'text-electric-blue' : 'text-white'}`}
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 safe-area-pt ${scrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'py-6 bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 group">
                        <span className="text-white">OSART</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue group-hover:scale-150 transition-transform duration-300 neon-glow" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link href="/catalog" className="navbar-link">Catálogo</Link>
                        <Link href="/services" className="navbar-link">Servicios</Link>
                        <Link href="/about" className="navbar-link">Nosotros</Link>
                        <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-electric-blue hover:text-white transition-colors">Admin</Link>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden lg:flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2 transition-transform active:scale-95"
                        >
                            <ShoppingCart size={20} className="text-muted-foreground group-hover:text-white transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-electric-blue text-background text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-electric-blue truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
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
                            <ShoppingCart size={22} className="text-white" />
                            {itemCount > 0 && (
                                <span className="absolute 0 right-0 w-4 h-4 bg-electric-blue text-background text-[10px] font-black rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="p-2 text-white bg-white/5 rounded-lg active:scale-90 transition-transform"
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
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Signed in as</span>
                                                <span className="text-sm font-bold text-white truncate max-w-[200px]">{user.email}</span>
                                            </div>
                                            <button
                                                onClick={() => { signOut(); setIsOpen(false); }}
                                                className="p-3 bg-red-500/10 text-red-500 rounded-xl active:scale-90 transition-transform"
                                            >
                                                <LogOut size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="neon-button w-full text-center flex items-center justify-center gap-3 py-4"
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
