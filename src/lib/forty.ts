// al-Nawawi's Forty on the website, as the app's hadith tab has them (mobile/src/lib/hadith.ts, mobile/src/screens/hadith*.tsx),
// worked out on the server: the records and Ibn Rajab's chapters stay here, a page or card gets only what it shows.
import forty from '@shared/data/hadith/forty.json';
import rajab from '@shared/data/hadith/ibnRajab.json';
import units from '@shared/data/hadith/units.json';
import { rajabFeedPassages, sayingStart, type AppForty, type AppHadith, type FortyEntry, type RajabChapter, type RajabParagraph } from '@shared/hadith';

export const FORTY = forty as AppForty;
const RAJAB = rajab as RajabChapter[];
export type FortyBooks = AppForty['books'];

export const fortyEntry = (n: number): FortyEntry | undefined => FORTY.entries.find(entry => entry.n === n);
export const rajabChapter = (n: number): RajabChapter | undefined => RAJAB.find(chapter => chapter.n === n);

/** The Jibril pages, which tell no. 2 with its scenes: Muslim's from Umar, and al-Bukhari's from Abu Hurayra. */
export const JIBRIL = { muslim: 'muslim-jibril', bukhari: 'bukhari-jibril' } as const;

/** A hadith in a list (the hadith tab's card, the quiz's look-up): its number, the Companion, al-Nawawi's text and the books he names. */
export type FortyListItem = Pick<FortyEntry, 'n' | 'heading' | 'companion' | 'text' | 'named'> & { start: string };
export const fortyList = (): FortyListItem[] => FORTY.entries.map(({ n, heading, companion, text, named }) => ({ n, heading, companion, text, named, start: sayingStart(text) }));

/** One hadith's page: the entry, the books' titles and editions, Ibn Rajab's chapter on it, and the steps its chains are placed in. */
export const fortyPage = (n: number) => {
  const entry = fortyEntry(n);
  return entry ? { entry, books: FORTY.books, chapter: rajabChapter(n) ?? null, size: (units as AppHadith).size } : null;
};
export type FortyPage = NonNullable<ReturnType<typeof fortyPage>>;

/** The Forty al-Nawawi took whole from the Sahihayn, the most authentic first (owner, 2026-11-18), for the hadith card. */
const FEED_FORTY = FORTY.entries.filter(entry => !entry.partial && entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'));
let passages: ReturnType<typeof rajabFeedPassages> | undefined;
const rajabPassages = () => (passages ??= rajabFeedPassages(RAJAB, FORTY.entries));
const turnOf = (day: number, at: number, count: number) => ((((day * 37 + at) % count) + count) % count);

/**
 * The «الحديث» cards (the app's HadithPost and RajabPost), taking turns batch by batch: one of the Forty in al-Nawawi's words,
 * or a passage of Ibn Rajab's explanation of one.
 */
export type HadithCard = { slot: number; entry: Pick<FortyEntry, 'n' | 'heading' | 'companion' | 'text' | 'shamela'>; books: Pick<FortyBooks, 'nawawi' | 'ibnrajab'> } & (
  | { kind: 'hadith' }
  | { kind: 'rajab'; passage: RajabParagraph[] });

export function hadithCards(day: number, slots: number[]): HadithCard[] {
  const books = { nawawi: FORTY.books.nawawi, ibnrajab: FORTY.books.ibnrajab };
  const short = ({ n, heading, companion, text, shamela }: FortyEntry) => ({ n, heading, companion, text, shamela });
  return slots.flatMap((slot): HadithCard[] => {
    const turn = Math.floor(slot / 2);
    if (slot % 2 === 0) return FEED_FORTY.length ? [{ slot, kind: 'hadith', entry: short(FEED_FORTY[turnOf(day, turn, FEED_FORTY.length)]), books }] : [];
    const all = rajabPassages();
    if (!all.length) return [];
    const { chapter, passage } = all[turnOf(day, turn, all.length)];
    const entry = fortyEntry(chapter.n);
    return entry ? [{ slot, kind: 'rajab', entry: short(entry), books, passage }] : [];
  });
}
