'use client';

import { useEffect, useState } from 'react';
import { sharedByAll, type Neighbour } from '@shared/quran/ayahContext';
import type { BranchAyah } from '@shared/quran/branches';
import type { CardSide } from '@shared/quran/compareCards';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import { quranSurrounding } from '@/lib/quran/quranText';

export type Neighbours = { before: (SpreadAyah | null)[]; after: (SpreadAyah | null)[] };

/** The two neighbours at one end, as muted rows marked where they share words (same word, or same root). */
function marked(pair: (Neighbour | null)[]): (SpreadAyah | null)[] {
  const present = pair.filter((ayah): ayah is Neighbour => !!ayah);
  const shared = present.length === 2 && present[0].key !== present[1].key
    ? new Map(sharedByAll(present.map(ayah => ({ ayah: ayah as BranchAyah, before: null, after: null }))).map(context => [context.ayah.key, context.match]))
    : new Map<string, { exact: number[]; rooted: number[] } | undefined>();
  return pair.map(ayah => {
    if (!ayah) return null;
    const match = shared.get(ayah.key);
    const marks = Object.fromEntries([
      ...(match?.exact ?? []).map(i => [i, { kind: 'exact' as const }]),
      ...(match?.rooted ?? []).map(i => [i, { kind: 'root' as const }]),
    ]);
    return { number: Number(ayah.key.split(':')[1]), words: ayah.words, marks, muted: true };
  });
}

/** The ayah before and after each side of a compare card, for its matrix; loaded when `on`. */
export function useNeighbours(sides: CardSide[], on: boolean): Neighbours | undefined {
  const first = sides.map(side => `${side.surah}:${Math.min(...side.ayat.map(ayah => ayah.number))}`);
  const last = sides.map(side => `${side.surah}:${Math.max(...side.ayat.map(ayah => ayah.number))}`);
  const key = `${first.join(',')}|${last.join(',')}`;
  const [loaded, setLoaded] = useState<{ key: string; neighbours: Neighbours }>();
  useEffect(() => {
    if (!on || loaded?.key === key) return;
    let live = true;
    quranSurrounding(first, last).then(around => {
      if (live) setLoaded({ key, neighbours: { before: marked(first.map(k => around.before[k] ?? null)), after: marked(last.map(k => around.after[k] ?? null)) } });
    }).catch(() => {});
    return () => { live = false; };
  }, [on, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return on && loaded?.key === key ? loaded.neighbours : undefined;
}
