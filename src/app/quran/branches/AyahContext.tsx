import type { SpreadMark } from '@/components/quran/PageSpread';
import type { AyahContext } from '@shared/quran/ayahContext';

export const MAX_KEYS = 200;

export function sharedMarks(context: AyahContext, exact: string, root: string): Record<number, SpreadMark> {
  return Object.fromEntries(context.ayah.words.flatMap((_, i): [number, SpreadMark][] => {
    if (context.match?.rooted.includes(i)) return [[i, { kind: 'root', title: root }]];
    if (context.match?.exact.includes(i)) return [[i, { kind: 'exact', title: exact }]];
    return [];
  }));
}
