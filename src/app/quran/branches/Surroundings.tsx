'use client';

import React, { useId } from 'react';
import useSWR from 'swr';
import { Network, TextSearch } from 'lucide-react';
import Button from '@/components/common/Button';
import { PathBox, PathButton } from './Paths';
import { fetcher } from '@/lib/swr';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import type { Neighbour, Surrounding } from '@/lib/quran/ayahContext';
import InkLoader from '@/components/common/InkLoader';

export type Around = { data: Surrounding; ends: Record<string, string>; inTree: Set<string>; names: Record<number, string>; tree: string };

export const anchorOf = (tree: string, key: string) => `${tree}-${key.replace(':', '-')}`;

export function useSurrounding(on: boolean, keys: string[], ends: Record<string, string>, given?: Surrounding) {
  const url = `/api/quran/surrounding?${new URLSearchParams({ before: keys.join(','), after: [...new Set(Object.values(ends))].join(',') })}`;
  const fetched = useSWR<Surrounding>(on && !given && keys.length > 0 ? url : null, fetcher, { revalidateOnFocus: false });
  return given ? { data: given, isLoading: false, error: undefined, mutate: fetched.mutate } : fetched;
}

type ToggleProps = { on: boolean; onChange(on: boolean): void; loading?: boolean; failed?: boolean };

function AddressToggle({ onChange, ...props }: ToggleProps) {
  return <SurroundSwitch {...props} onChange={checked => {
    onChange(checked);
    const url = new URL(window.location.href);
    if (checked) url.searchParams.set('c', '1');
    else url.searchParams.delete('c');
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }} />;
}

function SurroundSwitch({ on, onChange, loading = false, failed = false }: ToggleProps) {
  const id = useId();
  const { language } = useLanguage();
  const ar = language === 'ar';
  const label = ar ? 'الآيات المحيطة' : 'Surrounding ayat';
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--home-ink)]">
      <Toggle id={id} checked={on} label={label} onChange={onChange} onIcon={<Network className="size-3" aria-hidden />} />
      <label htmlFor={id} className={`cursor-pointer ${on ? 'font-semibold text-[var(--home-accent)]' : 'text-[var(--home-muted)]'}`}>{label}</label>
      {on && loading && <span role="status"><InkLoader className="inline-block h-5 w-auto" /><span className="sr-only">{ar ? 'جارٍ التحميل' : 'Loading'}</span></span>}
      {on && failed && <span role="alert" className="text-xs text-[var(--home-accent)]">{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</span>}
    </span>
  );
}

export const SurroundToggle = ({ sync = false, ...props }: ToggleProps & { sync?: boolean }) => (sync ? <AddressToggle {...props} /> : <SurroundSwitch {...props} />);

export function NeighbourBox({ neighbour, of, side, around, opens, nodeId }: { nodeId?: string; neighbour: Neighbour; of: string; side: 'before' | 'after'; around: Around; opens: string }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [surah, ayah] = neighbour.key.split(':').map(Number);
  const id = nodeId ?? `${side}${of}`;
  const ref = around.names[surah] ? `${around.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  const label = ar ? 'عرض الآيات في سياقها' : 'View ayat in context';
  const basmala = neighbour.basmala && <span className="block border-[var(--home-rule)] text-center first:border-b last:border-t first:pb-1 last:pt-1 border-dotted">{neighbour.basmala.join(' ')}</span>;
  return (
    <PathBox id={id} ctx={of} keys={[of]} lit="border-dashed border-[var(--home-accent)] text-[var(--home-ink)]" tone="border-dashed border-[var(--home-muted)] text-[var(--home-muted)]" className="w-64 max-w-[70vw] shrink-0 rounded border text-lg bg-[var(--home-paper)] px-3 py-1.5">
      <span className="block font-arabic leading-loose">
        {side === 'after' && basmala}
        <span className="block">{neighbour.words.join(' ')}</span>
        {side === 'before' && basmala}
      </span>
      <span className="mt-1 block text-xs">{ref}</span>
      <span className="mt-1 flex flex-wrap items-center gap-2">
        <PathButton id={id} keys={[of]} subject={ref} />
        <Button size="sm" aria-haspopup="dialog" aria-label={`${label}: ${ref}`} title={label} onClick={event => event.currentTarget.closest('[data-tree]')?.querySelector<HTMLButtonElement>(`[data-node="${opens}"] [data-context-open]`)?.click()}>
          <TextSearch size={16} aria-hidden />
        </Button>
        {around.inTree.has(neighbour.key) && <Button size="sm" href={`#${anchorOf(around.tree, neighbour.key)}`}>
          {ar ? 'في هذه الشجرة' : 'In this tree'}
        </Button>}
      </span>
    </PathBox>
  );
}

export const targetStyle = (tree: string) => `[data-tree="${tree}"] :has(> [data-anchor]:target){outline:2px solid var(--home-accent);outline-offset:2px}`;
