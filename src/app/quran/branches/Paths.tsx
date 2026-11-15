'use client';

import React, { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Route } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { litPaths, pathToggleKey, togglePath } from '@shared/quran/pathHighlight';
import TreeLinks from './TreeLinks';

// Only the path button lights a path: hover lit paths by accident on phones.
type Paths = { lit: Set<string>; pinned: Map<string, string[]>; organic: boolean; pin(id: string, keys: string[]): void };

const PathContext = createContext<Paths | null>(null);
const LINE = 'border-[var(--home-rule)]';
const LIT = 'border-[var(--home-accent)]';

export function usePaths(lit: string[] = [], organic = false) {
  const [pinned, setPinned] = useState(() => new Map<string, string[]>(lit.length ? [['search', lit]] : []));
  return useMemo<Paths>(() => ({
    lit: litPaths(pinned),
    pinned,
    organic,
    pin: (id, keys) => setPinned(current => togglePath(current, id, keys)),
  }), [pinned, organic]);
}

export const PathProvider = PathContext.Provider;
export const useOuterPaths = () => useContext(PathContext);

export function PathScope({ children, lit, organic }: { children: React.ReactNode; lit?: string[]; organic?: boolean }) {
  const parent = useOuterPaths();
  return <PathProvider value={usePaths(lit, organic ?? parent?.organic)}>{children}</PathProvider>;
}

export function useIsLit() {
  const paths = useContext(PathContext);
  return (keys: string[]) => !!paths && keys.some(key => paths.lit.has(key));
}

// A tap on a node lights its path, like its path button (not on the node's buttons, links or fields, nor when selecting text).
const INTERACTIVE = 'button, a, input, textarea, select, summary, label, [role="button"]';

export function PathBox({ id, keys, className, tone, lit, ctx, children }: { id: string; keys: string[]; className: string; tone: string; lit: string; ctx?: string; children: React.ReactNode }) {
  const on = useIsLit()(keys);
  const paths = useContext(PathContext);
  const tap = paths ? (event: React.MouseEvent) => {
    if ((event.target as Element).closest(INTERACTIVE) || window.getSelection()?.toString()) return;
    paths.pin(id, keys);
  } : undefined;
  return <div data-node={id} data-ctx={ctx} data-keys={keys.join(' ')} data-lit={on || undefined} data-selected={paths?.pinned.has(pathToggleKey(id, keys)) || undefined} onClick={tap} className={`shrink-0 bg-[var(--home-paper-deep)] px-3 py-1.5 text-center ${ctx ? "border" : "border-4 border-double"} ${className} ${on ? lit : tone} ${paths ? 'cursor-pointer' : ''}`}>{children}</div>;
}

export function PathButton({ id, keys, subject }: { id: string; keys: string[]; subject?: string }) {
  const paths = useContext(PathContext);
  const { language } = useLanguage();
  const label = language === 'ar' ? 'إظهار المسار' : 'Show path';
  if (!paths) return null;
  const active = paths.pinned.has(pathToggleKey(id, keys));
  return (
    <Button size="sm" data-share-skip data-path-toggle={pathToggleKey(id, keys)} active={active} aria-pressed={active} aria-label={subject ? `${label}: ${subject}` : label} title={label} onClick={() => paths.pin(id, keys)}>
      <Route size={16} aria-hidden />
    </Button>
  );
}

export function Stem({ lit, side }: { lit: number[]; side: 'start' | 'end' }) {
  const line = useRef<HTMLSpanElement>(null);
  const [span, setSpan] = useState<[number, number, number] | null>(null);
  const shown = lit.join(' ');
  useLayoutEffect(() => {
    const list = line.current?.parentElement;
    const items = [...(list?.querySelector(':scope > ul')?.children ?? [])] as HTMLElement[];
    if (!list || !shown) return setSpan(null);
    const measure = () => {
      // A top-down tree (data-down) lays its fans out in rows, so the stem runs across instead of down.
      const across = !!list.closest('[data-down]');
      const centers = shown.split(' ').map(Number).map(i => across ? items[i].offsetLeft + items[i].offsetWidth / 2 : items[i].offsetTop + items[i].offsetHeight / 2);
      const middle = (across ? list.clientWidth : list.clientHeight) / 2;
      setSpan([Math.min(middle, ...centers), Math.max(middle, ...centers), across ? 1 : 0]);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [shown]);
  const across = span?.[2] === 1;
  const style: React.CSSProperties = !span ? { display: 'none' }
    // right/left: auto, or the start-0 class (right: 0 in Arabic) would win over left and pin the stem to the edge.
    : across ? { left: span[0], right: 'auto', width: span[1] - span[0], [side === 'start' ? 'top' : 'bottom']: 0, borderTopWidth: side === 'start' ? 2 : 0, borderBottomWidth: side === 'start' ? 0 : 2, borderInlineWidth: 0 }
    : { top: span[0], height: span[1] - span[0] };
  return <span ref={line} aria-hidden data-stem className={`pointer-events-none absolute z-[1] ${LIT} ${side === 'start' ? 'start-0 border-s-2' : 'end-0 border-e-2'}`} style={style} />;
}

export type FanEntry = { key: string; keys: string[]; item: React.ReactNode };

/** The line into one entry, and the bus joining it to its siblings, on the fan's `side`. */
function Lines({ side, i, count, lit }: { side: 'start' | 'end'; i: number; count: number; lit: boolean }) {
  const start = side === 'start';
  return <>
    <span aria-hidden data-line className={`absolute top-1/2 w-6 -translate-y-1/2 border-t-2 [[data-down]_&]:start-1/2 [[data-down]_&]:end-auto [[data-down]_&]:h-6 [[data-down]_&]:w-0 [[data-down]_&]:translate-y-0 [[data-down]_&]:rtl:translate-x-px [[data-down]_&]:border-t-0 [[data-down]_&]:border-s-2 ${start ? 'start-0 [[data-down]_&]:top-0' : 'end-0 [[data-down]_&]:top-auto [[data-down]_&]:bottom-0'} ${lit ? LIT : LINE}`} />
    {count > 1 && <span aria-hidden className={`absolute ${start ? 'start-0 border-s-2 [[data-down]_&]:top-0 [[data-down]_&]:bottom-auto' : 'end-0 border-e-2 [[data-down]_&]:top-auto [[data-down]_&]:bottom-0'} ${LINE} ${i === 0 ? 'top-1/2 [[data-down]_&]:start-1/2' : 'top-0 [[data-down]_&]:start-0'} ${i === count - 1 ? 'bottom-1/2 [[data-down]_&]:end-1/2' : 'bottom-0 [[data-down]_&]:end-0'} [[data-down]_&]:h-0 [[data-down]_&]:border-x-0 [[data-down]_&]:border-t-2`} />}
  </>;
}

/**
 * Lines from a node to its children (`start`) or from entries into the node after them (`end`). `join`: the children's paths meet
 * again after them (a compare card's tree, `Branch.rejoin`), so each runs on to the fan's far edge and a second fan gathers them there.
 * `bare`: no line into the fan, where no box comes before it.
 */
export function Fan({ side, entries, label, join = false, bare = false }: { side: 'start' | 'end'; entries: FanEntry[]; label?: string; join?: boolean; bare?: boolean }) {
  const organic = useContext(PathContext)?.organic;
  const isLit = useIsLit();
  const lit = entries.flatMap((entry, i) => (isLit(entry.keys) ? [i] : []));
  const start = side === 'start';
  const pad = start ? (bare ? '' : 'ps-6 [[data-down]_&]:pb-0 [[data-down]_&]:pt-6') : 'justify-end pe-6 [[data-down]_&]:pt-0 [[data-down]_&]:pb-6';
  return (
    <div data-fan={side} className="relative shrink-0">
      {/* Right to left by default; inside a top-down tree ([data-down]) the fan becomes a row under (start) or above (end) its node. */}
      <ul aria-label={label} className={`flex flex-col [[data-down]_&]:flex-row ${join ? '[[data-down]_&]:items-stretch' : start ? '[[data-down]_&]:items-start' : '[[data-down]_&]:items-end'}`}>
        {entries.map((entry, i) => (
          <li key={entry.key} data-entry={i} className={`relative flex items-center py-1 [[data-down]_&]:flex-col [[data-down]_&]:px-1 ${pad} ${join ? 'pe-6 [[data-down]_&]:pb-6' : ''}`}>
            {!(start && bare) && <Lines side={side} i={i} count={entries.length} lit={lit.includes(i)} />}
            {entry.item}
            {join && <>
              <span aria-hidden data-line className={`h-0 min-w-2 flex-1 border-t-2 [[data-down]_&]:min-h-2 [[data-down]_&]:w-0 [[data-down]_&]:min-w-0 [[data-down]_&]:border-t-0 [[data-down]_&]:border-s-2 ${lit.includes(i) ? LIT : LINE}`} />
              <Lines side="end" i={i} count={entries.length} lit={lit.includes(i)} />
            </>}
          </li>
        ))}
      </ul>
      {entries.length > 1 && !(start && bare) && <Stem lit={lit} side={side} />}
      {join && entries.length > 1 && <Stem lit={lit} side="end" />}
      {organic && !join && <TreeLinks key={JSON.stringify(entries.map(entry => entry.key))} side={side} lit={lit} />}
    </div>
  );
}

export const Stub = ({ keys }: { keys: string[] }) => {
  const on = useIsLit()(keys);
  return <span aria-hidden data-line data-connected={on || undefined} className={`w-4 shrink-0 border-t-2 [[data-down]_&]:h-4 [[data-down]_&]:w-0 [[data-down]_&]:border-t-0 [[data-down]_&]:border-s-2 ${on ? LIT : LINE}`} />;
};
