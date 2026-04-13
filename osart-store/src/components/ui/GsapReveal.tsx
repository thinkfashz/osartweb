'use client';

import React, { ElementType } from 'react';
import { useGSAPReveal } from '@/hooks/useGSAP';

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  selector?: string;
}

/**
 * Drop-in animated container powered by GSAP ScrollTrigger.
 * Replaces the old IntersectionObserver-based AnimateIn component.
 */
export default function GsapReveal({
  children,
  className = '',
  delay = 0,
  y = 40,
  stagger,
  selector,
}: GsapRevealProps) {
  const ref = useGSAPReveal({ y, delay, stagger, selector });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
