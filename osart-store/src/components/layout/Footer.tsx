import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone } from 'lucide-react';

const HexLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
        <text x="16" y="20" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="900" fontFamily="system-ui">O</text>
    </svg>
);

const NAV_LINKS = [
    { label: 'Catálogo', href: '/catalog' },
    { label: 'Academia', href: '/academy' },
    { label: 'Servicios', href: '/services' },
    { label: 'Nosotros', href: '/about' },
    { label: 'Admin', href: '/admin' },
];

const SOCIAL = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
];

const Footer = () => (
    <footer className="bg-[#0a0a0f] border-t border-violet-500/10">
        {/* Main content */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Col 1: Logo + tagline */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2.5 group w-fit">
                        <HexLogo />
                        <span className="text-xl font-black tracking-tight text-white group-hover:text-violet-300 transition-colors">OSART</span>
                    </Link>
                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                        Repuestos Electrónicos de Alta Precisión
                    </p>
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Componentes de alta fidelidad para servicios técnicos de élite en Chile.
                    </p>
                </div>

                {/* Col 2: Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-400">Navegación</h3>
                    <nav className="flex flex-col gap-3">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-[11px] font-semibold text-zinc-500 hover:text-violet-400 transition-colors w-fit"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Col 3: Contact */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-400">Contacto</h3>
                    <div className="flex flex-col gap-3">
                        <a
                            href="mailto:ventas@osart.cl"
                            className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-violet-400 transition-colors group"
                        >
                            <Mail size={12} className="text-violet-500/60 group-hover:text-violet-400 transition-colors" />
                            ventas@osart.cl
                        </a>
                        <a
                            href="tel:+56900000000"
                            className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-violet-400 transition-colors group"
                        >
                            <Phone size={12} className="text-violet-500/60 group-hover:text-violet-400 transition-colors" />
                            +56 9 XXXX XXXX
                        </a>
                        <p className="text-[10px] text-zinc-600 mt-2">
                            Lun – Vie, 09:00 – 18:00 (CLT)
                        </p>
                    </div>
                </div>

                {/* Col 4: Social */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-400">Síguenos</h3>
                    <div className="flex items-center gap-3">
                        {SOCIAL.map(({ icon: Icon, href, label }) => (
                            <Link
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all shadow-sm"
                            >
                                <Icon size={16} />
                            </Link>
                        ))}
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Contenido técnico, tutoriales y novedades de producto.
                    </p>
                </div>
            </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] text-zinc-600 font-medium">
                    © 2026 OSART SpA — Chile. Todos los derechos reservados.
                </span>
                <span className="text-[9px] text-zinc-700 font-medium">
                    Sincronizado vía Supabase Cloud
                </span>
            </div>
        </div>
    </footer>
);

export default Footer;
