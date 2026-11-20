'use client';

import React, { useCallback, useSyncExternalStore } from 'react';
import useSWR from 'swr';
import { LocateFixed, RotateCwSquare, UnfoldHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { PathBox, PathButton } from './Paths';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@shared/quran/arabicNumber';
import { likenessOf, sharedByAll, type Neighbour, type Surrounding } from '@shared/quran/ayahContext';
import { LIKENESS_TITLE } from '@shared/quran/wordMatch';
import { MARK_CLASS } from '@/lib/markMode';
import { closingSign } from '@shared/quran/branches';
import { quranSurrounding } from '@/lib/quran/quranText';
import LoadingDots from '@/components/common/LoadingDots';
import { TreeText } from '@/components/quran/text/AyahFlow';

export type Around = { data: Surrounding; ends: Record<string, string>; inTree: Set<string>; names: Record<number, string>; tree: string;
  /** The first ayah drawn before each ayah with no words before the phrase (see BranchTree), where its path's one tab starts. */
  first?: Record<string, string> };

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

/** The default every card opens with, kept in this browser and set in the settings sheet; each card switches its own (useCardAround). */
export function useAroundSetting() {
  const on = useSyncExternalStore(subscribeAround, readAround, () => false);
  const set = (next: boolean) => {
    try { localStorage.setItem(AROUND, next ? '1' : '0'); } catch {}
    listeners.forEach(listener => listener());
  };
  return [on, set] as const;
}

// The cards switched away from the default, by id (the compare page lists many); any other card opens on the default (owner, 2026-11-14).
let switched: ReadonlyMap<string, boolean> = new Map();
const NONE: ReadonlyMap<string, boolean> = new Map();
const cardListeners = new Set<() => void>();
const subscribeCard = (listener: () => void) => { cardListeners.add(listener); return () => { cardListeners.delete(listener); }; };

/** A card's own surrounding-ayat switch, opening on the settings' default. Without a card it is the default alone. */
export function useCardAround(card?: string) {
  const [fallback] = useAroundSetting();
  const own = useSyncExternalStore(subscribeCard, () => switched, () => NONE);
  const on = card ? own.get(card) ?? fallback : fallback;
  const set = (next: boolean) => {
    if (!card) return;
    switched = new Map(switched).set(card, next);
    cardListeners.forEach(listener => listener());
  };
  return [on, set] as const;
}

/** The card's surrounding-ayat switch, in its row of buttons. */
export function AroundButton({ card }: { card: string }) {
  const ar = useLanguage().language === 'ar';
  const [on, set] = useCardAround(card);
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

// A card that names itself (`card`) turns on its own, as each of the app's cards does: home's tree cards don't turn together.
let rotatedCards = new Map<string, boolean>();
const NO_CARDS = new Map<string, boolean>();

export function useRotated(card?: string) {
  const all = useSyncExternalStore(subscribeRotate, () => rotated, () => false);
  const own = useSyncExternalStore(subscribeRotate, () => rotatedCards, () => NO_CARDS);
  const on = card ? own.get(card) ?? false : all;
  const set = useCallback((next: boolean) => {
    if (!card) return setRotatedValue(next);
    if ((rotatedCards.get(card) ?? false) === next) return;
    rotatedCards = new Map(rotatedCards).set(card, next);
    rotateListeners.forEach(listener => listener());
  }, [card]);
  return [on, set] as const;
}

/** Turns the open tree between right to left and top down; in the card's row of buttons. */
export function RotateButton({ card }: { card?: string } = {}) {
  const ar = useLanguage().language === 'ar';
  const [on, set] = useRotated(card);
  const label = ar ? 'تدوير الشجرة' : 'Rotate tree';
  // An action, not a setting: it never takes the accent colour.
  return <Button size="lg" variant="muted" onClick={() => set(!on)} aria-label={label} title={label}>
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

export function NeighbourBox({ neighbour, of, side, around, nodeId }: { nodeId?: string; neighbour: Neighbour; of: string; side: 'before' | 'after'; around: Around }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [surah, ayah] = neighbour.key.split(':').map(Number);
  const id = nodeId ?? `${side}${of}`;
  const ref = around.names[surah] ? `${around.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const others = [...new Map(Object.values(around.data[side]).flatMap(ayah => ayah ? [[ayah.key, ayah] as const] : [])).values()];
  const match = sharedByAll(others.map(ayah => ({ ayah, before: null, after: null }))).find(context => context.ayah.key === neighbour.key)?.match;
  const basmala = neighbour.basmala && <span className="block border-[var(--home-rule)] text-center first:border-b last:border-t first:pb-1 last:pt-1 border-dotted"><MushafText>{neighbour.basmala.join(' ')}</MushafText></span>;
  return (
    <PathBox id={id} ctx={of} keys={[of]} lit="border-[var(--home-accent)] text-[var(--home-ink)]" tone="border-[var(--home-rule)] text-[var(--home-ink)]" className="w-52 max-w-[70vw] [[data-down]_&]:w-44">
      <TreeText>
        {side === 'after' && basmala}
        <span className="block"><span>{neighbour.words.map((word, i) => {
          const kind = likenessOf(match, i);
          return <React.Fragment key={i}>{i > 0 && ' '}{kind ? <mark className={`bg-transparent ${MARK_CLASS[kind]}`} title={ar ? LIKENESS_TITLE[kind].ar : LIKENESS_TITLE[kind].en}><MushafText>{word}</MushafText></mark> : <MushafText>{word}</MushafText>}</React.Fragment>;
        })}</span>{closingSign(neighbour.words, [neighbour.key]).map(sign => <React.Fragment key="end">{' '}<span data-end><MushafText>{sign}</MushafText></span></React.Fragment>)}</span>
        {side === 'before' && basmala}
      </TreeText>
      <span className="mt-1 block text-xs">{ref}</span>
      <span data-node-buttons className="mt-1 flex flex-wrap items-center gap-2">
        <PathButton id={id} keys={[of]} subject={ref} />
        {around.inTree.has(neighbour.key) && <Button size="sm" href={`#${anchorOf(around.tree, neighbour.key)}`} aria-label={ar ? 'في هذه الشجرة' : 'In this tree'} title={ar ? 'في هذه الشجرة' : 'In this tree'}>
          <LocateFixed size={16} aria-hidden />
        </Button>}
      </span>
    </PathBox>
  );
}

export const targetStyle = (tree: string) => `[data-tree="${tree}"] :has(> [data-anchor]:target){outline:2px solid var(--home-accent);outline-offset:2px}`;
