'use client';

import React, { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Route } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';

// Only the path button lights a path: hover lit paths by accident on phones.
type Paths = { lit: Set<string>; pinned: Map<string, string[]>; pin(id: string, keys: string[]): void };

const PathContext = createContext<Paths | null>(null);
const LINE = 'border-[var(--home-rule)]';
const LIT = 'border-[var(--home-accent)]';

export function usePaths(lit: string[] = []) {
  const [pinned, setPinned] = useState(() => new Map<string, string[]>(lit.length ? [['search', lit]] : []));
  return useMemo<Paths>(() => ({
    lit: new Set([...pinned.values()].flat()),
    pinned,
    pin: (id, keys) => setPinned(current => {
      const next = new Map(current);
      if (!next.delete(id)) next.set(id, keys);
      return next;
    }),
  }), [pinned]);
}

export const PathProvider = PathContext.Provider;
export const useOuterPaths = () => useContext(PathContext);

export function PathScope({ children, lit }: { children: React.ReactNode; lit?: string[] }) {
  return <PathProvider value={usePaths(lit)}>{children}</PathProvider>;
}

export function useIsLit() {
  const paths = useContext(PathContext);
  return (keys: string[]) => !!paths && keys.some(key => paths.lit.has(key));
}

export function PathBox({ id, keys, className, tone, lit, ctx, children }: { id: string; keys: string[]; className: string; tone: string; lit: string; ctx?: string; children: React.ReactNode }) {
  const on = useIsLit()(keys);
  return <div data-node={id} data-ctx={ctx} data-keys={keys.join(' ')} data-lit={on || undefined} className={`${className} ${on ? lit : tone}`}>{children}</div>;
}

export function PathButton({ id, keys, subject }: { id: string; keys: string[]; subject?: string }) {
  const paths = useContext(PathContext);
  const { language } = useLanguage();
  const label = language === 'ar' ? 'إظهار المسار' : 'Show path';
  if (!paths) return null;
  return (
    <Button size="sm" active={paths.pinned.has(id)} aria-pressed={paths.pinned.has(id)} aria-label={subject ? `${label}: ${subject}` : label} title={label} onClick={() => paths.pin(id, keys)}>
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
    : across ? { left: span[0], width: span[1] - span[0], [side === 'start' ? 'top' : 'bottom']: 0, borderTopWidth: side === 'start' ? 2 : 0, borderBottomWidth: side === 'start' ? 0 : 2, borderInlineWidth: 0 }
    : { top: span[0], height: span[1] - span[0] };
  return <span ref={line} aria-hidden data-stem className={`pointer-events-none absolute z-[1] ${LIT} ${side === 'start' ? 'start-0 border-s-2' : 'end-0 border-e-2'}`} style={style} />;
}

export type FanEntry = { key: string; keys: string[]; item: React.ReactNode };

export function Fan({ side, entries, label }: { side: 'start' | 'end'; entries: FanEntry[]; label?: string }) {
  const isLit = useIsLit();
  const lit = entries.flatMap((entry, i) => (isLit(entry.keys) ? [i] : []));
  const start = side === 'start';
  return (
    <div className="relative shrink-0">
      {/* Right to left by default; inside a top-down tree ([data-down]) the fan becomes a row under (start) or above (end) its node. */}
      <ul aria-label={label} className={`flex flex-col [[data-down]_&]:flex-row ${start ? '[[data-down]_&]:items-start' : '[[data-down]_&]:items-end'}`}>
        {entries.map((entry, i) => (
          <li key={entry.key} className={`relative flex items-center py-1 [[data-down]_&]:flex-col [[data-down]_&]:px-1 ${start ? 'ps-6 [[data-down]_&]:pb-0 [[data-down]_&]:pt-6' : 'justify-end pe-6 [[data-down]_&]:pt-0 [[data-down]_&]:pb-6'}`}>
            <span aria-hidden data-line className={`absolute top-1/2 w-6 -translate-y-1/2 border-t-2 [[data-down]_&]:start-1/2 [[data-down]_&]:end-auto [[data-down]_&]:h-6 [[data-down]_&]:w-0 [[data-down]_&]:translate-y-0 [[data-down]_&]:rtl:translate-x-px [[data-down]_&]:border-t-0 [[data-down]_&]:border-s-2 ${start ? 'start-0 [[data-down]_&]:top-0' : 'end-0 [[data-down]_&]:top-auto [[data-down]_&]:bottom-0'} ${lit.includes(i) ? LIT : LINE}`} />
            {entries.length > 1 && <span aria-hidden className={`absolute ${start ? 'start-0 border-s-2 [[data-down]_&]:top-0 [[data-down]_&]:bottom-auto' : 'end-0 border-e-2 [[data-down]_&]:top-auto [[data-down]_&]:bottom-0'} ${LINE} ${i === 0 ? 'top-1/2 [[data-down]_&]:start-1/2' : 'top-0 [[data-down]_&]:start-0'} ${i === entries.length - 1 ? 'bottom-1/2 [[data-down]_&]:end-1/2' : 'bottom-0 [[data-down]_&]:end-0'} [[data-down]_&]:h-0 [[data-down]_&]:border-x-0 [[data-down]_&]:border-t-2`} />}
            {entry.item}
          </li>
        ))}
      </ul>
      {entries.length > 1 && <Stem lit={lit} side={side} />}
    </div>
  );
}

export const Stub = ({ keys }: { keys: string[] }) => <span aria-hidden data-line className={`w-4 shrink-0 border-t-2 [[data-down]_&]:h-4 [[data-down]_&]:w-0 [[data-down]_&]:border-t-0 [[data-down]_&]:border-s-2 ${useIsLit()(keys) ? LIT : LINE}`} />;
