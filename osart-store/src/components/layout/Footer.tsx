import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const NAV = [
    { label: 'Catálogo', href: '/catalog' },
    { label: 'Servicios', href: '/services' },
    { label: 'Nosotros', href: '/about' },
    { label: 'Contacto', href: 'mailto:ventas@osart.cl' },
];

const SOCIAL = [
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
];

const Footer = () => (
    <footer className="border-t border-white/5 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
                <span className="text-sm font-black tracking-tighter text-white uppercase">OSART</span>
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue neon-glow group-hover:scale-150 transition-transform" />
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                {NAV.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Social + copyright */}
            <div className="flex items-center gap-6 shrink-0">
                <div className="flex items-center gap-3">
                    {SOCIAL.map(({ icon: Icon, href }, i) => (
                        <Link
                            key={i}
                            href={href}
                            className="text-zinc-600 hover:text-electric-blue transition-colors"
                        >
                            <Icon size={15} />
                        </Link>
                    ))}
                </div>
                <span className="text-[9px] text-zinc-700 font-mono uppercase tracking-wider hidden md:block">
                    © {new Date().getFullYear()} OSART
                </span>
            </div>
        </div>
    </footer>
);

export default Footer;
