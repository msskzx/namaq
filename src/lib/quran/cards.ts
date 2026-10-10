// docs/plans/quran-relations-page.md
import type { Pos } from './passages';

export type Card = { surah: number; ayah: number; text: string; marks: number[] };

export function sideCards(
  side: { from: Pos; to: Pos },
  marks: number[],
  ayat: Record<string, string>,
  { full = false, after = 0 } = {},
): Card[] {
  const cards: Card[] = [];
  const wordsOf = (ayah: number) => (ayat[`${side.from.surah}:${ayah}`] ?? '').split(' ');
  let offset = 0;
  for (let ayah = side.from.ayah; ayah <= side.to.ayah; ayah++) {
    const words = wordsOf(ayah);
    const first = ayah === side.from.ayah ? side.from.word : 0;
    const last = ayah === side.to.ayah ? side.to.word : words.length - 1;
    const length = last - first + 1;
    const inside = marks.filter(m => m >= offset && m < offset + length).map(m => m - offset + (full ? first : 0));
    const outside = words.map((_, i) => i).filter(i => i < first || i > last);
    cards.push({
      surah: side.from.surah,
      ayah,
      text: (full ? words : words.slice(first, last + 1)).join(' '),
      marks: full ? [...outside, ...inside] : inside,
    });
    offset += length;
  }
  for (let ayah = side.to.ayah + 1; ayah <= side.to.ayah + after && ayat[`${side.from.surah}:${ayah}`]; ayah++) {
    const words = wordsOf(ayah);
    cards.push({ surah: side.from.surah, ayah, text: words.join(' '), marks: words.map((_, i) => i) });
  }
  return cards;
}
