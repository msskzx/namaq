'use client';

import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from 'react';
import { wordConnections, type ConnectionEnd } from '@/lib/quran/mutashabih/connections';
import type { Group, Tag } from '@/lib/quran/mutashabih/types';

const Connections = createContext<{ group?: Group; selected: Tag | null; select: (tag: Tag) => void } | null>(null);
export const useGroupConnections = () => useContext(Connections);

export function GroupConnections({ group, children, defaultOn = false }: { group?: Group; children: ReactNode; defaultOn?: boolean }) {
  const [selected, setSelected] = useState<Tag | null>(defaultOn ? group?.tags[0] ?? null : null);
  return <Connections.Provider value={{ group, selected, select: tag => setSelected(current => current === tag ? null : tag) }}>
    {children}
  </Connections.Provider>;
}

const COLORS: Partial<Record<Tag, string>> = {
  order: '--home-slot-1', inversion: '--home-slot-1',
  word: '--home-slot-3', addition_omission: '--home-slot-2',
  particle: '--home-root', number: '--home-green', definiteness: '--home-slot-4',
};

type Point = { x: number; y: number };
type Route = { d: string; from: Point; to: Point };

export function ConnectionLines({ lane, column, ready }: { lane: RefObject<HTMLDivElement | null>; column: number; ready: boolean }) {
  const state = useGroupConnections();
  const [routes, setRoutes] = useState<Route[]>([]);
  useEffect(() => {
    const frame = lane.current;
    if (!frame || !ready || !state?.group || !state.selected) {
      setRoutes([]);
      return;
    }
    const links = wordConnections(state.group, state.selected);
    let active = true;
    const draw = () => {
      if (!active) return;
      const bounds = frame.getBoundingClientRect();
      const card = frame.querySelector<HTMLElement>(`[data-col="${column}"][data-current]`)?.getBoundingClientRect();
      if (!card) { setRoutes([]); return; }
      const position = (end: ConnectionEnd) => {
        const find = (key: string, index: number) => frame.querySelector<HTMLElement>(`[data-col="${column}"][data-current] [data-word-position="${key}:${index}"]`);
        if ('gap' in end) {
          const element = find(end.gap.key, end.gap.index);
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const x = end.edge === 'after' ? rect.left - 4 : rect.right + 4;
          return { left: x, right: x, top: rect.top, bottom: rect.bottom };
        }
        const elements = end.words.map(word => find(word.key, word.index));
        if (elements.some(element => !element)) return;
        const rects = elements.map(element => element!.getBoundingClientRect());
        return { left: Math.min(...rects.map(rect => rect.left)), right: Math.max(...rects.map(rect => rect.right)), top: Math.min(...rects.map(rect => rect.top)), bottom: Math.max(...rects.map(rect => rect.bottom)) };
      };
      setRoutes(links.flatMap(link => {
        const a = position(link.from);
        const b = position(link.to);
        if (!a || !b) return [];
        const from = { x: (a.left + a.right) / 2 - bounds.left, y: a.bottom - bounds.top + 2 };
        const to = { x: (b.left + b.right) / 2 - bounds.left, y: b.top - bounds.top - 2 };
        const middle = (from.y + to.y) / 2;
        return [{ from, to, d: `M ${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}` }];
      }));
    };
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(draw);
    observer?.observe(frame);
    frame.querySelectorAll('[data-current]').forEach(element => observer?.observe(element));
    void document.fonts?.ready.then(() => { if (frame.isConnected) draw(); });
    window.addEventListener('resize', draw);
    return () => { active = false; observer?.disconnect(); window.removeEventListener('resize', draw); };
  }, [lane, column, ready, state?.group, state?.selected]);
  const color = COLORS[state?.selected ?? 'order'] ?? '--home-muted';
  return <svg aria-hidden data-word-connectors className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" fill="none" stroke={`color-mix(in srgb, var(${color}) 65%, var(--home-paper-deep))`} strokeWidth="1.25">
    {routes.map((route, index) => <g key={index}>
      <path d={route.d} />
      <circle cx={route.from.x} cy={route.from.y} r="2" fill="var(--home-paper-deep)" />
      <circle cx={route.to.x} cy={route.to.y} r="2" fill="var(--home-paper-deep)" />
    </g>)}
  </svg>;
}
