"use client";

import React, { useRef, useEffect } from 'react';

/**
 * GSAP-powered page transition wrapper for the admin panel.
 * Replaces the previous framer-motion version while keeping the same API.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: any;
        (async () => {
            const { gsap } = await import('gsap');
            const el = ref.current;
            if (!el) return;
            ctx = gsap.context(() => {
                gsap.fromTo(
                    el,
                    { opacity: 0, x: 16 },
                    { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
                );
            }, el);
        })();
        return () => ctx?.revert();
    }, []);

    return (
        <div ref={ref} className="gsap-hidden">
            {children}
        </div>
    );
};
