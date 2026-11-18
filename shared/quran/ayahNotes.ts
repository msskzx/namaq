import type { ItqanData, ItqanParagraph } from './itqanBalagha';

/**
 * The feed's ayah cards (owner, 2026-11-18; docs/feed-cards.md): an ayah with a little of what a book says on it, a tap
 * opening the reader's own sheet with the whole text. One card in each batch, the kind turning with the batch.
 */
export const AYAH_NOTES = ['tafsir', 'balagha', 'irab', 'qiraat'] as const;
export type AyahNote = (typeof AYAH_NOTES)[number];

const turn = (n: number, count: number) => ((n % count) + count) % count;

/** The kind of a batch's ayah card; the next day starts one kind on. */
export const ayahNoteKind = (day: number, slot: number): AyahNote => AYAH_NOTES[turn(day + slot, AYAH_NOTES.length)];

/** Which of `count` ayat a batch shows, the same all day; each kind walks its own list. */
export const ayahNoteAt = (count: number, day: number, slot: number) => (count ? turn(day * 37 + Math.floor(slot / AYAH_NOTES.length) * 11 + slot, count) : -1);

/**
 * The ayat al-Suyuti's balagha paragraphs quote where the place is sure (ITQAN RULE, owner 2026-11-18: never pin him to an
 * ayah he did not name), in the book's order, each once.
 */
export function itqanSureAyat(data: ItqanData): string[] {
  const keys = new Set<string>();
  for (const entry of data.entries) for (const [surah, ayah, , , places] of entry[7]) if (places === 1) keys.add(`${surah}:${ayah}`);
  return [...keys];
}

/** A tafsir passage without the ayat it opens by quoting («﴿…﴾.»), so a card starts with his own words. */
export const withoutOpeningQuote = (text: string) => text.replace(/^\s*﴿[^﴾]*﴾[.:،]?\s*/, '');

/** Every ayah key, in order, from the surahs' ayah counts. */
export const allAyat = (counts: readonly number[]): string[] => counts.flatMap((count, i) => Array.from({ length: count }, (_, ayah) => `${i + 1}:${ayah + 1}`));

/** The balagha card's text: al-Suyuti's first paragraph surely on the ayah, under his heading, or the kind of device when he gives none. */
export function balaghaNote(paragraphs: readonly ItqanParagraph[]): { text: string; heading: string } | null {
  const paragraph = paragraphs.find(found => found.places === 1);
  return paragraph ? { text: paragraph.text, heading: paragraph.heading || paragraph.kind } : null;
}
