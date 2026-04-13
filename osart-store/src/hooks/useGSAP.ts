'use client';

import { useEffect, useRef } from 'react';

/**
 * GSAP ScrollTrigger reveal hook.
 * Animates children inside the returned `ref` element when it scrolls into view.
 * SSR-safe: GSAP and ScrollTrigger are imported dynamically inside useEffect.
 */
export function useGSAPReveal(options?: {
  y?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
  selector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const el = ref.current;
      if (!el) return;

      ctx = gsap.context(() => {
        const targets = options?.selector
          ? gsap.utils.toArray<Element>(options.selector, el)
          : [el];

        gsap.fromTo(
          targets,
          { opacity: 0, y: options?.y ?? 40 },
          {
            opacity: 1,
            y: 0,
            duration: options?.duration ?? 0.7,
            delay: options?.delay ?? 0,
            stagger: options?.stagger ?? 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }, el);
    })();

    return () => ctx?.revert();
  }, [options?.delay, options?.duration, options?.selector, options?.stagger, options?.y]);

  return ref;
}

/**
 * GSAP entrance animation hook for elements that animate on mount (no scroll).
 */
export function useGSAPMount(options?: {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
}) {
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
          { opacity: 0, y: options?.y ?? 20, x: options?.x ?? 0 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: options?.duration ?? 0.5,
            delay: options?.delay ?? 0,
            ease: 'power2.out',
          }
        );
      }, el);
    })();

    return () => ctx?.revert();
  }, [options?.delay, options?.duration, options?.x, options?.y]);

  return ref;
}
