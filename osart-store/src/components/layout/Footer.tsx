import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="text-white">OSART</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue neon-glow" />
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            Tu aliado experto en repuestos y componentes electrónicos de alta precisión. Innovación y respaldo técnico en cada pieza.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-text-muted hover:text-electric-blue hover:border-electric-blue transition-all">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Navegación</h4>
                        <ul className="space-y-4">
                            {['Catálogo General', 'Ofertas', 'Novedades', 'Servicio Técnico', 'FAQ'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-text-secondary hover:text-electric-blue transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Contacto</h4>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <span className="text-[10px] text-text-muted uppercase font-bold mb-1">Email de Ventas</span>
                                <Link href="mailto:ventas@osart.cl" className="text-sm text-white hover:text-electric-blue">ventas@osart.cl</Link>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] text-text-muted uppercase font-bold mb-1">WhatsApp</span>
                                <Link href="https://wa.me/56979346165" target="_blank" className="text-sm text-white hover:text-electric-blue">+56 9 7934 6165</Link>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] text-text-muted uppercase font-bold mb-1">Ubicación</span>
                                <span className="text-sm text-white">Santiago, Chile</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-widest">Newsletter</h4>
                        <p className="text-xs text-text-muted leading-relaxed">Suscríbete para recibir alertas de reposición de stock y nuevas ofertas.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-4 pr-12 text-sm focus:border-electric-blue/40 outline-none transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-electric-blue text-bg-dark rounded flex items-center justify-center hover:bg-white transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">
                        © {new Date().getFullYear()} OSART REPUESTOS ELECTRÓNICOS. TODOS LOS DERECHOS RESERVADOS.
                    </p>
                    <div className="flex gap-6 text-[10px] text-text-muted uppercase font-bold tracking-widest">
                        <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-white transition-colors">Términos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
