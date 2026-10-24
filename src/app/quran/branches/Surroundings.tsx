'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import type { Neighbour, Surrounding } from '@/lib/quran/ayahContext';

export type Around = { data: Surrounding; ends: Record<string, string>; inTree: Set<string>; names: Record<number, string>; tree: string };

export const anchorOf = (tree: string, key: string) => `${tree}-${key.replace(':', '-')}`;

async function load(url: string): Promise<Surrounding> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load surrounding ayat');
  return response.json();
}

export function useSurrounding(on: boolean, keys: string[], ends: Record<string, string>) {
  const url = `/api/quran/surrounding?${new URLSearchParams({ before: keys.join(','), after: [...new Set(Object.values(ends))].join(',') })}`;
  return useSWR<Surrounding>(on && keys.length > 0 ? url : null, load, { revalidateOnFocus: false });
}

type ToggleProps = { on: boolean; onChange(on: boolean): void; loading?: boolean; failed?: boolean };

function AddressToggle({ onChange, ...props }: ToggleProps) {
  const router = useRouter();
  return <SurroundSwitch {...props} onChange={checked => {
    onChange(checked);
    const url = new URL(window.location.href);
    if (checked) url.searchParams.set('c', '1');
    else url.searchParams.delete('c');
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }} />;
}

function SurroundSwitch({ on, onChange, loading = false, failed = false }: ToggleProps) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const label = ar ? 'الآيات المحيطة' : 'Surrounding ayat';
  return (
    <span className="inline-flex items-center gap-2 text-sm text-[var(--home-ink)]">
      <Toggle checked={on} label={label} onChange={onChange} />
      <span aria-hidden>{label}</span>
      {on && loading && <span role="status" className="text-xs text-[var(--home-muted)]">{ar ? 'جارٍ التحميل…' : 'Loading…'}</span>}
      {on && failed && <span role="alert" className="text-xs text-[var(--home-accent)]">{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</span>}
    </span>
  );
}

export const SurroundToggle = ({ sync = false, ...props }: ToggleProps & { sync?: boolean }) => (sync ? <AddressToggle {...props} /> : <SurroundSwitch {...props} />);

export function NeighbourBox({ neighbour, of, side, around }: { neighbour: Neighbour; of: string; side: 'before' | 'after'; around: Around }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [surah, ayah] = neighbour.key.split(':').map(Number);
  const basmala = neighbour.basmala && <span className="block border-[var(--home-rule)] text-center first:border-b last:border-t first:pb-1 last:pt-1 border-dotted">{neighbour.basmala.join(' ')}</span>;
  return (
    <div data-ctx={of} data-keys={of} className="w-64 max-w-[70vw] shrink-0 rounded border border-dashed border-[var(--home-muted)] bg-[var(--home-paper)] px-3 py-1.5 text-[var(--home-muted)]">
      <span className="flex flex-wrap items-center gap-2">
        <Link href={`/quran/read/${neighbour.page}?a=${neighbour.key}`} className="text-xs text-[var(--home-accent)] hover:underline">
          {around.names[surah] ? `${around.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}
        </Link>
        {around.inTree.has(neighbour.key) && <a href={`#${anchorOf(around.tree, neighbour.key)}`} className="rounded-sm border border-[var(--home-root)] px-1 text-xs text-[var(--home-root)] hover:underline">
          {ar ? 'في هذه الشجرة' : 'In this tree'}
        </a>}
      </span>
      <span className="block font-arabic leading-loose">
        {side === 'after' && basmala}
        <span className="block">{neighbour.words.join(' ')}</span>
        {side === 'before' && basmala}
      </span>
    </div>
  );
}

export function surroundStyle(tree: string, keys: string[]) {
  const scope = `[data-tree="${tree}"]`;
  return [
    `${scope} :has(> [data-anchor]:target){outline:2px solid var(--home-accent);outline-offset:2px}`,
    ...keys.map(key => {
      const lit = `${scope}:has([data-ctx="${key}"]:hover,[data-ctx="${key}"]:focus-within)`;
      return `${lit} [data-keys~="${key}"]:not([data-line]){border-color:var(--home-accent);border-style:solid;color:var(--home-ink)}${lit} [data-line][data-keys~="${key}"]{border-color:var(--home-accent)}`;
    }),
  ].join('\n');
}
