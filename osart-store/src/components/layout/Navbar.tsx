'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Zap, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';

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
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
                <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
                        <span className="text-white">OSART</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue group-hover:scale-150 transition-transform duration-300 neon-glow" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link href="/catalog" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Catálogo</Link>
                        <Link href="/services" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Servicios</Link>
                        <Link href="/about" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Nosotros</Link>
                        <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-electric-blue hover:text-white transition-colors">Admin</Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden lg:flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2"
                        >
                            <ShoppingCart size={20} className="text-muted-foreground group-hover:text-white transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-electric-blue text-background text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-electric-blue truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                <User size={14} />
                                Acceso
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-white/5 py-10 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col gap-8 text-center items-center">
                            <Link href="/catalog" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase italic tracking-tighter">Catálogo</Link>
                            <Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase italic tracking-tighter">Servicios</Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase italic tracking-tighter">Nosotros</Link>
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-black uppercase italic tracking-tighter text-electric-blue">Admin</Link>
                            <hr className="w-12 border-white/10" />
                            <button
                                onClick={() => { setIsOpen(false); setIsCartOpen(true); }}
                                className="text-sm font-bold uppercase tracking-widest text-electric-blue"
                            >
                                Ver Carrito ({itemCount})
                            </button>

                            {user ? (
                                <button onClick={() => { signOut(); setIsOpen(false); }} className="text-sm font-bold uppercase tracking-widest text-red-500">Cerrar Sesión</button>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)} className="neon-button px-10">Iniciar Sesión</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
