import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, Twitter, Facebook, ArrowRight, Terminal, Cpu, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            {/* Structural Accents */}
            <div className="absolute top-0 right-0 w-32 h-[1px] bg-electric-blue/20" />
            <div className="absolute top-0 right-0 w-[1px] h-32 bg-electric-blue/20" />

            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
                            <span className="text-white">OSART</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue neon-glow group-hover:scale-150 transition-transform" />
                        </Link>

                        <div className="space-y-4">
                            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs font-medium">
                                Infraestructura técnica para servicios de hardware y repuestos electrónicos de alta precisión. Suministro global con certificación industrial.
                            </p>
                            <div className="flex items-center gap-3 py-2 px-3 bg-white/5 border border-white/5 w-fit rounded-lg">
                                <Cpu size={14} className="text-electric-blue" />
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System: OSART-INFRA-V1.0</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-zinc-500 hover:text-electric-blue hover:border-electric-blue/40 transition-all group">
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 flex items-center gap-2">
                            <div className="w-1 h-1 bg-electric-blue" /> NAVEGACION_SISTEMA
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Catálogo General', href: '/catalog' },
                                { label: 'Servicio Técnico', href: '/services' },
                                { label: 'Sobre Nosotros', href: '/about' },
                                { label: 'Panel de Control', href: '/profile' },
                                { label: 'Admin Access', href: '/admin' }
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-electric-blue transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 flex items-center gap-2">
                            <div className="w-1 h-1 bg-electric-blue" /> TERMINAL_CONTACTO
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex flex-col">
                                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Canal de Ventas</span>
                                <Link href="mailto:ventas@osart.cl" className="text-sm font-bold text-white hover:text-electric-blue transition-colors font-mono">ventas@osart.cl</Link>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Enlace Directo</span>
                                <Link href="https://wa.me/56979346165" target="_blank" className="text-sm font-bold text-white hover:text-electric-blue transition-colors font-mono">+56 9 7934 6165</Link>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Nodo Principal</span>
                                <span className="text-sm font-bold text-white">Santiago, Chile [CL]</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-electric-blue" /> ALERTAS_STOCK
                        </h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-bold uppercase tracking-wider">Sincroniza tu correo para recibir reportes de inventario crítico.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="IDENTIFICADOR@CORREO.COM"
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg py-4 pl-4 pr-12 text-xs font-mono focus:border-electric-blue/40 focus:bg-zinc-900 outline-none transition-all placeholder:text-zinc-700"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-electric-blue text-black rounded-md flex items-center justify-center hover:bg-white transition-all active:scale-95 shadow-[0_0_15px_rgba(0,163,255,0.3)]">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <ShieldCheck size={14} className="text-zinc-700" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Protocolo de Privacidad Activo</span>
                        </div>
                    </div>

                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} OSART HARDWARE INFRASTRUCTURE. OPERACIONES GLOBALES.
                        </p>
                        <div className="flex gap-8 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                            <Link href="#" className="hover:text-electric-blue transition-colors">Politicas_Seguridad</Link>
                            <Link href="#" className="hover:text-electric-blue transition-colors">Terminos_Uso</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-800">
                        <Terminal size={12} />
                        <span className="text-[8px] font-mono uppercase">Status: Connected_Local_Node</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
