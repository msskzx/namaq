import type { ItqanData, ItqanParagraph } from './itqanBalagha';

// see docs/feed-cards.md
export const AYAH_NOTES = ['tafsir', 'balagha', 'irab', 'qiraat'] as const;
export type AyahNote = (typeof AYAH_NOTES)[number];

const turn = (n: number, count: number) => ((n % count) + count) % count;

export const ayahNoteKind = (day: number, slot: number): AyahNote => AYAH_NOTES[turn(day + slot, AYAH_NOTES.length)];

export const ayahNoteAt = (count: number, day: number, slot: number) => (count ? turn(day * 37 + Math.floor(slot / AYAH_NOTES.length) * 11 + slot, count) : -1);

export function itqanSureAyat(data: ItqanData): string[] {
  const keys = new Set<string>();
  for (const entry of data.entries) for (const [surah, ayah, , , places] of entry[7]) if (places === 1) keys.add(`${surah}:${ayah}`);
  return [...keys];
}

export const withoutOpeningQuote = (text: string) => text.replace(/^\s*﴿[^﴾]*﴾[.:،]?\s*/, '');

export const allAyat = (counts: readonly number[]): string[] => counts.flatMap((count, i) => Array.from({ length: count }, (_, ayah) => `${i + 1}:${ayah + 1}`));

export function balaghaNote(paragraphs: readonly ItqanParagraph[]): { text: string; heading: string } | null {
  const paragraph = paragraphs.find(found => found.places === 1);
  return paragraph ? { text: paragraph.text, heading: paragraph.heading || paragraph.kind } : null;
}
