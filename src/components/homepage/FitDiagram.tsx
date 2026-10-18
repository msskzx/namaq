'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Home.module.css';

export default function FitDiagram({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number; available: number } | null>(null);

  useEffect(() => {
    const outer = container.current;
    const inner = content.current;
    if (!outer || !inner) return;
    const measure = () => {
      const next = { width: inner.offsetWidth, height: inner.offsetHeight, available: outer.clientWidth };
      if (!next.width || !next.height || !next.available) return;
      setSize(previous => previous?.width === next.width && previous.height === next.height && previous.available === next.available ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const scale = size ? Math.min(1, size.available / size.width) : 1;
  return (
    <div ref={container} className={styles.fitDiagram} style={size ? { height: size.height * scale } : undefined}>
      <div ref={content} className={styles.fitContent} style={{ position: size ? 'absolute' : 'relative', insetInlineStart: size ? (size.available - size.width * scale) / 2 : 0, transform: `scale(${scale})` }}>{children}</div>
    </div>
  );
}
