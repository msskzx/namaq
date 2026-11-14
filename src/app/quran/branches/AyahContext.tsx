import type { SpreadMark } from '@/components/quran/PageSpread';
import { likenessOf, type AyahContext } from '@shared/quran/ayahContext';
import type { Likeness } from '@shared/quran/wordMatch';

export const MAX_KEYS = 200;

/**
 * A row's coloured words, by how alike they are (shared/quran/wordMatch.ts): those every row shares in full colour, those only some rows share faded. With `step`, each word
 * carries a link (unique to that step of the passages), so tapping it can light the same word in the other rows.
 */
export function sharedMarks(context: AyahContext, titles: Record<Likeness, string>, step?: number, lit?: string | null): Record<number, SpreadMark> {
  const match = context.match;
  return Object.fromEntries(context.ayah.words.flatMap((_, i): [number, SpreadMark][] => {
    const linked = match?.links?.[i];
    const link = step === undefined || !linked ? undefined : `${step}:${linked.link}`;
    const tap = link ? { link, lit: link === lit } : {};
    const kind = likenessOf(match, i);
    if (kind) return [[i, { kind, title: titles[kind], ...tap }]];
    if (step === undefined || !linked) return [];
    return [[i, { kind: linked.kind, some: true, title: titles[linked.kind], ...tap }]];
  }));
}
