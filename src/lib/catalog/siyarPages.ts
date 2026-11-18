// The Shamela page of a printed page of al-Dhahabi's sira (Siyar, al-Risalah edition, Shamela book 10906). The online
// book numbers its own pages and skips where the print does (vol 1 p296 and p442, vol 2 p298), so the gap moves; the
// points below were read off each Shamela page's own printed number (2026-11-18).
const OFFSETS: Record<number, [from: number, offset: number][]> = {
  1: [[1, 138], [297, 137], [443, 136]],
  2: [[1, 659], [299, 658]],
};

export function siyarSiraPage(volume: number, page: number): number {
  const offset = OFFSETS[volume]?.findLast(([from]) => page >= from)?.[1];
  if (offset === undefined) throw new Error(`no Shamela offsets for sira volume ${volume}`);
  return page + offset;
}

export const siyarSiraUrl = (volume: number, page: number) => `https://shamela.ws/book/10906/${siyarSiraPage(volume, page)}`;
