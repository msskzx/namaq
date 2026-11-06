'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type Drawing = { width: number; height: number; paths: string[] };

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
          const bend = (from + to) / 2;
          const x = item.offsetLeft + item.offsetWidth / 2;
          return `M ${width / 2} ${from} C ${width / 2} ${bend}, ${x} ${bend}, ${x} ${to}`;
        }
        const from = start === rtl ? width : 0;
        const to = from === 0 ? 24 : width - 24;
        const bend = (from + to) / 2;
        const y = item.offsetTop + item.offsetHeight / 2;
        return `M ${from} ${height / 2} C ${bend} ${height / 2}, ${bend} ${y}, ${to} ${y}`;
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
