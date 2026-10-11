'use client';

import React, { useLayoutEffect, useRef } from 'react';

const PROBE = 100;
const MIN_GAP = 0.3;

export default function FitLines({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const fit = () => {
      element.style.fontSize = `${PROBE}px`;
      const widest = Math.max(
        1,
        ...[...element.querySelectorAll<HTMLElement>('[data-line]')].map((line) => {
          const words = [...line.children] as HTMLElement[];
          return words.reduce((sum, word) => sum + word.offsetWidth, 0) + (words.length - 1) * MIN_GAP * PROBE;
        }),
      );
      element.style.fontSize = `${Math.min(PROBE * (element.clientWidth / widest), 40)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={box} style={{ fontSize: '4.6cqw' }}>
      {children}
    </div>
  );
}
