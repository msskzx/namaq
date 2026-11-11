import type { SpreadMark } from '@/components/quran/PageSpread';
import type { AyahContext } from '@shared/quran/ayahContext';

export const MAX_KEYS = 200;

/**
 * A row's coloured words: those every row shares in full colour, those only some rows share faded. With `step`, each word
 * carries a link (unique to that step of the passages), so tapping it can light the same word in the other rows.
 */
export function sharedMarks(context: AyahContext, exact: string, root: string, step?: number, lit?: string | null): Record<number, SpreadMark> {
  const match = context.match;
  return Object.fromEntries(context.ayah.words.flatMap((_, i): [number, SpreadMark][] => {
    const linked = match?.links?.[i];
    const link = step === undefined || !linked ? undefined : `${step}:${linked.link}`;
    const tap = link ? { link, lit: link === lit } : {};
    if (match?.rooted.includes(i)) return [[i, { kind: 'root', title: root, ...tap }]];
    if (match?.exact.includes(i)) return [[i, { kind: 'exact', title: exact, ...tap }]];
    if (step === undefined || !linked) return [];
    return [[i, { kind: linked.exact ? 'exact' : 'root', some: true, title: linked.exact ? exact : root, ...tap }]];
  }));
}
