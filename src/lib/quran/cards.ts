// docs/plans/quran-relations-page.md
import type { Pos } from './passages';

export type Card = { surah: number; ayah: number; text: string; marks: number[] };

export function sideCards(
  side: { from: Pos; to: Pos },
  marks: number[],
  ayat: Record<string, string>,
): Card[] {
  const cards: Card[] = [];
  let offset = 0;
  for (let ayah = side.from.ayah; ayah <= side.to.ayah; ayah++) {
    const words = (ayat[`${side.from.surah}:${ayah}`] ?? '').split(' ');
    const first = ayah === side.from.ayah ? side.from.word : 0;
    const last = ayah === side.to.ayah ? side.to.word : words.length - 1;
    const span = words.slice(first, last + 1);
    cards.push({
      surah: side.from.surah,
      ayah,
      text: span.join(' '),
      marks: marks.filter(m => m >= offset && m < offset + span.length).map(m => m - offset),
    });
    offset += span.length;
  }
  return cards;
}
