'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode, type RefObject } from 'react';
import { closeStudio, growthState, useGrowth, useMatrixGrowTarget } from './Grow';
import { wordConnections, type ConnectionEnd } from '@/lib/quran/mutashabih/connections';
import type { Group, Tag } from '@shared/quran/mutashabih/types';
import { evidenceGroup } from '@shared/quran/mutashabih/evidence';

const Connections = createContext<{ group?: Group; selected: Tag[]; select: (tag: Tag) => void; enable: () => void } | null>(null);
export const useGroupConnections = () => useContext(Connections);

export function GroupConnections({ group: original, shownKeys, children, defaultOn = false }: { group?: Group; shownKeys?: string[]; children: ReactNode; defaultOn?: boolean }) {
  const group = useMemo(() => original ? evidenceGroup(original, shownKeys) : undefined, [original, shownKeys]);
  const [enabled, setSelected] = useState<Tag[]>(defaultOn ? group?.tags ?? [] : []);
  const selected = useMemo(() => enabled.every(tag => group?.tags.includes(tag)) ? enabled : enabled.filter(tag => group?.tags.includes(tag)), [enabled, group]);
  const enable = useCallback(() => setSelected(current => current.length ? current : group?.tags ?? []), [group]);
  return <Connections.Provider value={{ group, selected, select: tag => { if (!group?.tags.includes(tag)) return; if (growthState().kind === 'matrix') closeStudio(); setSelected(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag]); }, enable }}>
    {children}
  </Connections.Provider>;
}

const COLORS: Partial<Record<Tag, string>> = {
  order: '--home-slot-1', inversion: '--home-slot-1',
  word: '--home-slot-3', addition_omission: '--home-slot-2',
  particle: '--home-root', number: '--home-green', definiteness: '--home-slot-4',
};

export const connectionColor = (tag: Tag) => `var(${COLORS[tag] ?? '--home-muted'})`;

const noConnections = () => {};
const NO_TAGS: Tag[] = [];

type Point = { x: number; y: number };
type Route = { tag: Tag; d: string; from: Point; to: Point };

export function ConnectionLines({ lane, column, ready }: { lane: RefObject<HTMLDivElement | null>; column: number; ready: boolean }) {
  const state = useGroupConnections();
  const growth = useGrowth();
  const selected = state?.selected.length ? state.selected : state?.group?.tags ?? NO_TAGS;
  const [routes, setRoutes] = useState<Route[]>([]);
  useEffect(() => {
    const frame = lane.current;
    if (!frame || !ready || !state?.group || !selected.length) {
      setRoutes([]);
      return;
    }
    const group = state.group;
    const links = selected.flatMap(tag => wordConnections(group, tag).map(link => ({ ...link, tag })));
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
        return [{ tag: link.tag, from, to, d: `M ${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}` }];
      }));
    };
    draw();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(draw);
    observer?.observe(frame);
    frame.querySelectorAll('[data-current]').forEach(element => observer?.observe(element));
    void document.fonts?.ready.then(() => { if (frame.isConnected) draw(); });
    window.addEventListener('resize', draw);
    return () => { active = false; observer?.disconnect(); window.removeEventListener('resize', draw); };
  }, [lane, column, ready, state?.group, selected]);
  useMatrixGrowTarget(lane, routes.length, routes, state?.enable ?? noConnections);
  return <svg aria-hidden data-word-connectors data-connection-group={state?.group?.id} style={{ visibility: state?.selected.length || growth.studio && growth.kind === 'matrix' ? undefined : 'hidden' }} className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" fill="none" strokeWidth="1.25">
    {(state?.selected.length || growth.studio && growth.kind === 'matrix' ? routes : []).map((route, index) => <g key={index} stroke={connectionColor(route.tag)} data-tag={route.tag} data-connection data-to-x={route.to.x} data-to-y={route.to.y}>
      <path d={route.d} pathLength="1" />
      <circle cx={route.from.x} cy={route.from.y} r="2" fill="var(--home-paper-deep)" />
      <circle cx={route.to.x} cy={route.to.y} r="2" fill="var(--home-paper-deep)" />
    </g>)}
  </svg>;
}
