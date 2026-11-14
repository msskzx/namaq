'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type Drawing = { width: number; height: number; paths: string[] };

/** The app's corner radius where a line turns (mobile/src/lib/litSpine.ts CURVE). */
const CURVE = 10;

/**
 * A line from (x0, y0) that runs along its axis to `bend`, turns across to the child's line and runs on to (x1, y1), with
 * round corners as in the app's tree. `down` runs it down first (top-down trees), else sideways first.
 */
export function elbow(x0: number, y0: number, bend: number, x1: number, y1: number, down: boolean) {
  const [a0, b0, a1, b1] = down ? [y0, x0, y1, x1] : [x0, y0, x1, y1];
  const across = b1 - b0;
  const r = Math.min(CURVE, Math.abs(across) / 2, Math.abs(bend - a0), Math.abs(a1 - bend));
  const point = (a: number, b: number) => (down ? `${b} ${a}` : `${a} ${b}`);
  if (r < 0.5) return `M ${point(a0, b0)} L ${point(a1, b1)}`;
  const da = Math.sign(a1 - a0);
  const db = Math.sign(across);
  return `M ${point(a0, b0)} L ${point(bend - da * r, b0)} Q ${point(bend, b0)} ${point(bend, b0 + db * r)} L ${point(bend, b1 - db * r)} Q ${point(bend, b1)} ${point(bend + da * r, b1)} L ${point(a1, b1)}`;
}

export default function TreeLinks({ side, lit }: { side: 'start' | 'end'; lit: number[] }) {
  const svg = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  useLayoutEffect(() => {
    const element = svg.current?.parentElement;
    const items = [...(element?.querySelector(':scope > ul')?.children ?? [])] as HTMLElement[];
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return setDrawing(null);
      const down = !!element.closest('[data-down]');
      const rtl = element.closest('[dir]')?.getAttribute('dir') === 'rtl';
      const start = side === 'start';
      const paths = items.map(item => {
        if (down) {
          const from = start ? 0 : height;
          const to = start ? 24 : height - 24;
          const x = item.offsetLeft + item.offsetWidth / 2;
          return elbow(width / 2, from, (from + to) / 2, x, to, true);
        }
        const from = start === rtl ? width : 0;
        const to = from === 0 ? 24 : width - 24;
        const y = item.offsetTop + item.offsetHeight / 2;
        return elbow(from, height / 2, (from + to) / 2, to, y, false);
      });
      setDrawing({ width, height, paths });
    };
    measure();
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    [element, ...items].forEach(item => resize?.observe(item));
    const rotation = new MutationObserver(measure);
    const content = element.closest('[data-tree-content]');
    if (content) rotation.observe(content, { attributes: true, attributeFilter: ['data-down', 'dir'] });
    return () => { resize?.disconnect(); rotation.disconnect(); };
  }, [side]);

  return <svg ref={svg} data-tree-links={drawing ? '' : undefined} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible" viewBox={drawing ? `0 0 ${drawing.width} ${drawing.height}` : undefined} fill="none">
    {drawing?.paths.map((d, i) => <path key={i} data-line data-entry={i} data-connected={lit.includes(i) || undefined} d={d} pathLength={1} vectorEffect="non-scaling-stroke" />)}
  </svg>;
}
