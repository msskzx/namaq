'use client';

import React, { useSyncExternalStore } from 'react';
import useSWR from 'swr';
import { LocateFixed, RotateCwSquare, TextSearch, UnfoldHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { PathBox, PathButton } from './Paths';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import type { Neighbour, Surrounding } from '@/lib/quran/ayahContext';
import { quranSurrounding } from '@/lib/quran/quranText';
import LoadingDots from '@/components/common/LoadingDots';

export type Around = { data: Surrounding; ends: Record<string, string>; inTree: Set<string>; names: Record<number, string>; tree: string };

export const anchorOf = (tree: string, key: string) => `${tree}-${key.replace(':', '-')}`;

export function useSurrounding(on: boolean, keys: string[], ends: Record<string, string>, given?: Surrounding) {
  const after = [...new Set(Object.values(ends))];
  const fetched = useSWR<Surrounding>(on && !given && keys.length > 0 ? ['quran-surrounding', keys.join(','), after.join(',')] : null, () => quranSurrounding(keys, after), { revalidateOnFocus: false });
  return given ? { data: given, isLoading: false, error: undefined, mutate: fetched.mutate } : fetched;
}

const AROUND = 'branches-surround';
const listeners = new Set<() => void>();
const readAround = () => { try { return localStorage.getItem(AROUND) === '1'; } catch { return false; } };
const subscribeAround = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
};

/** One setting for every tree and matrix on the branches page, kept in this browser. */
export function useAroundSetting() {
  const on = useSyncExternalStore(subscribeAround, readAround, () => false);
  const set = (next: boolean) => {
    try { localStorage.setItem(AROUND, next ? '1' : '0'); } catch {}
    listeners.forEach(listener => listener());
  };
  return [on, set] as const;
}

/** The surrounding-ayat switch in the side rail (the top bar on phones). */
export function AroundButton() {
  const ar = useLanguage().language === 'ar';
  const [on, set] = useAroundSetting();
  const label = ar ? 'الآيات المحيطة' : 'Surrounding ayat';
  return <Button size="lg" variant="muted" aria-pressed={on} onClick={() => set(!on)} aria-label={label} title={label}
    className="aria-pressed:border-[var(--home-accent)] aria-pressed:text-[var(--home-accent)]">
    <UnfoldHorizontal aria-hidden />
  </Button>;
}

// Whether the open tree is drawn the other way round from the direction it picked for itself (not kept: each tree opens in its own best direction).
let rotated = false;
const rotateListeners = new Set<() => void>();
const subscribeRotate = (listener: () => void) => { rotateListeners.add(listener); return () => { rotateListeners.delete(listener); }; };
const setRotatedValue = (next: boolean) => {
  if (rotated === next) return;
  rotated = next;
  rotateListeners.forEach(listener => listener());
};

export function useRotated() {
  const on = useSyncExternalStore(subscribeRotate, () => rotated, () => false);
  return [on, setRotatedValue] as const;
}

/** Turns the open tree between right to left and top down; beside the surrounding-ayat switch. */
export function RotateButton() {
  const ar = useLanguage().language === 'ar';
  const [on, set] = useRotated();
  const label = ar ? 'تدوير الشجرة' : 'Rotate tree';
  return <Button size="lg" variant="muted" aria-pressed={on} onClick={() => set(!on)} aria-label={label} title={label}
    className="aria-pressed:border-[var(--home-accent)] aria-pressed:text-[var(--home-accent)]">
    <RotateCwSquare aria-hidden />
  </Button>;
}

export function AroundStatus({ loading, failed }: { loading: boolean; failed: boolean }) {
  const ar = useLanguage().language === 'ar';
  if (failed) return <span role="alert" className="text-xs text-[var(--home-accent)]">{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</span>;
  return loading ? <LoadingDots label={ar ? 'جارٍ تحميل الآيات المحيطة' : 'Loading surrounding ayat'} /> : null;
}

type ToggleProps = { on: boolean; onChange(on: boolean): void; loading?: boolean; failed?: boolean };

function SurroundSwitch({ on, onChange, loading = false, failed = false }: ToggleProps) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const label = ar ? 'الآيات المحيطة' : 'Surrounding ayat';
  return (
    <span title={label} className="inline-flex items-center gap-2 text-sm text-[var(--home-ink)]">
      <Toggle checked={on} label={label} onChange={onChange} onIcon={<UnfoldHorizontal className="size-3" aria-hidden />} />
      {on && loading && <LoadingDots />}
      {on && failed && <span role="alert" className="text-xs text-[var(--home-accent)]">{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</span>}
    </span>
  );
}

export const SurroundToggle = SurroundSwitch;

export function NeighbourBox({ neighbour, of, side, around, opens, nodeId }: { nodeId?: string; neighbour: Neighbour; of: string; side: 'before' | 'after'; around: Around; opens: string }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [surah, ayah] = neighbour.key.split(':').map(Number);
  const id = nodeId ?? `${side}${of}`;
  const ref = around.names[surah] ? `${around.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const label = ar ? 'عرض الآيات في سياقها' : 'View ayat in context';
  const basmala = neighbour.basmala && <span className="block border-[var(--home-rule)] text-center first:border-b last:border-t first:pb-1 last:pt-1 border-dotted"><MushafText>{neighbour.basmala.join(' ')}</MushafText></span>;
  return (
    <PathBox id={id} ctx={of} keys={[of]} lit="border-dashed border-[var(--home-accent)] text-[var(--home-ink)]" tone="border-dashed border-[var(--home-muted)] text-[var(--home-muted)]" className="w-64 max-w-[70vw] shrink-0 rounded border text-lg bg-[var(--home-paper)] px-3 py-1.5">
      <span className="block font-quran leading-loose">
        {side === 'after' && basmala}
        <span className="block"><MushafText>{neighbour.words.join(' ')}</MushafText></span>
        {side === 'before' && basmala}
      </span>
      <span className="mt-1 block text-xs">{ref}</span>
      <span className="mt-1 flex flex-wrap items-center gap-2">
        <PathButton id={id} keys={[of]} subject={ref} />
        <Button size="sm" aria-haspopup="dialog" aria-label={`${label}: ${ref}`} title={label} onClick={event => event.currentTarget.closest('[data-tree]')?.querySelector<HTMLButtonElement>(`[data-node="${opens}"] [data-context-open]`)?.click()}>
          <TextSearch size={16} aria-hidden />
        </Button>
        {around.inTree.has(neighbour.key) && <Button size="sm" href={`#${anchorOf(around.tree, neighbour.key)}`} aria-label={ar ? 'في هذه الشجرة' : 'In this tree'} title={ar ? 'في هذه الشجرة' : 'In this tree'}>
          <LocateFixed size={16} aria-hidden />
        </Button>}
      </span>
    </PathBox>
  );
}

export const targetStyle = (tree: string) => `[data-tree="${tree}"] :has(> [data-anchor]:target){outline:2px solid var(--home-accent);outline-offset:2px}`;
