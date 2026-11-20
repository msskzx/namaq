// al-Nawawi's Forty on the website, as the app's hadith tab has them (mobile/src/lib/hadith.ts, mobile/src/screens/hadith*.tsx),
// worked out on the server: the records and Ibn Rajab's chapters stay here, a page or card gets only what it shows.
import forty from '@shared/data/hadith/forty.json';
import rajab from '@shared/data/hadith/ibnRajab.json';
import units from '@shared/data/hadith/units.json';
import { rajabItem } from '@shared/feedItems';
import { compiledSource, recordSource } from '@shared/quiz/hadith';
import { uniqueSources, type QuizSource } from '@shared/quiz/sources';
import { drawnBukhari, fromSahihayn, rajabFeedPassages, recordedIn, sayingStart, type AppForty, type AppIsnad, type BookBox, type AppHadith, type FortyEntry, type RajabChapter, type RajabParagraph } from '@shared/hadith';

export const FORTY = forty as AppForty;
const RAJAB = rajab as RajabChapter[];
export type FortyBooks = AppForty['books'];

export const fortyEntry = (n: number): FortyEntry | undefined => FORTY.entries.find(entry => entry.n === n);
export const rajabChapter = (n: number): RajabChapter | undefined => RAJAB.find(chapter => chapter.n === n);

/** The Jibril pages, which tell no. 2 with its scenes: Muslim's from Umar, and al-Bukhari's from Abu Hurayra. */
export const JIBRIL = { muslim: 'muslim-jibril', bukhari: 'bukhari-jibril' } as const;

/** A hadith in a list (the hadith tab's card, the quiz's look-up): its number, the Companion, al-Nawawi's text and the books he names. */
export type FortyListItem = Pick<FortyEntry, 'n' | 'heading' | 'companion' | 'text' | 'named' | 'source'> & { start: string };
export const fortyList = (): FortyListItem[] => FORTY.entries.map(({ n, heading, companion, text, named, source }) => ({ n, heading, companion, text, named, ...(source ? { source } : {}), start: sayingStart(text) }));

/** One hadith's page: the entry, the books' titles and editions, Ibn Rajab's chapter on it, and the steps its chains are placed in. */
export const fortyPage = (n: number) => {
  const entry = fortyEntry(n);
  return entry ? { entry, books: FORTY.books, chapter: rajabChapter(n) ?? null, size: (units as AppHadith).size } : null;
};
export type FortyPage = NonNullable<ReturnType<typeof fortyPage>>;

/** The Forty al-Nawawi took whole from the Sahihayn, the most authentic first (owner, 2026-11-18), for the hadith card. */
const FEED_FORTY = FORTY.entries.filter(fromSahihayn);
let passages: ReturnType<typeof rajabFeedPassages> | undefined;
const rajabPassages = () => (passages ??= rajabFeedPassages(RAJAB, FORTY.entries));
const turnOf = (day: number, at: number, count: number) => ((((day * 37 + at) % count) + count) % count);

/**
 * The «الحديث» cards (the app's HadithPost, RajabPost and RecordedPost), taking turns batch by batch: one of the Forty in
 * al-Nawawi's words (Ibn Rajab's for his eight), a passage of Ibn Rajab's explanation of one, the books that record one («من أخرجه»),
 * or al-Bukhari's chain for one drawn («من الإسناد», the app's IsnadPost).
 */
export type HadithCard = { slot: number;
  /** The card's lasting id, as the app's feed saves it (shared/feedItems.ts). */
  item: string; entry: Pick<FortyEntry, 'n' | 'heading' | 'companion' | 'text' | 'shamela' | 'source'>; books: Pick<FortyBooks, 'nawawi' | 'ibnrajab'>;
  /** The books the card stands on, for its source line (owner, 2026-11-20). */
  sources: QuizSource[] } & (
  | { kind: 'hadith' }
  | { kind: 'rajab'; passage: RajabParagraph[] }
  | { kind: 'recorded'; boxes: BookBox[] }
  | { kind: 'isnad'; record: { number: number; shamela: number; isnad: AppIsnad; saying: string }; size: AppHadith['size']; bukhari: FortyBooks['bukhari'] });
const KINDS = ['hadith', 'rajab', 'recorded', 'isnad'] as const;
/** The hadith with al-Bukhari's chain drawn, for «من الإسناد». */
const FEED_CHAINS = FEED_FORTY.filter(entry => drawnBukhari(entry));

const books = () => ({ nawawi: FORTY.books.nawawi, ibnrajab: FORTY.books.ibnrajab });
const short = ({ n, heading, companion, text, shamela, source }: FortyEntry) => ({ n, heading, companion, text, shamela, ...(source ? { source } : {}) });
const recordedCard = (slot: number, entry: FortyEntry): HadithCard => ({ slot, kind: 'recorded', item: String(entry.n), entry: short(entry), books: books(), boxes: recordedIn(entry),
  sources: uniqueSources([...entry.records.map(recordSource), compiledSource(entry)]) });
const plainCard = (slot: number, entry: FortyEntry): HadithCard => ({ slot, kind: 'hadith', item: String(entry.n), entry: short(entry), books: books(), sources: [compiledSource(entry)] });
function isnadCard(slot: number, entry: FortyEntry): HadithCard {
  const record = drawnBukhari(entry)!;
  return { slot, kind: 'isnad', item: String(entry.n), entry: short(entry), books: books(), sources: [recordSource(record)], size: (units as AppHadith).size, bukhari: FORTY.books.bukhari,
    record: { number: record.number, shamela: record.shamela, isnad: record.isnad!, saying: record.text.slice(record.isnadEnd) } };
}
function rajabCard(slot: number, { chapter, passage }: ReturnType<typeof rajabPassages>[number]): HadithCard | null {
  const entry = fortyEntry(chapter.n);
  return entry ? { slot, kind: 'rajab', item: rajabItem(chapter.n, chapter.paragraphs.indexOf(passage[0])), entry: short(entry), books: books(), passage,
    sources: [{ book: FORTY.books.ibnrajab.title, author: 'ابن رجب' }] } : null;
}

export function hadithCards(day: number, slots: number[]): HadithCard[] {
  return slots.flatMap((slot): HadithCard[] => {
    const turn = Math.floor(slot / KINDS.length);
    const kind = KINDS[slot % KINDS.length];
    if (kind === 'recorded') {
      if (!FEED_FORTY.length) return [];
      // Half the list on from the hadith card of its group, so the two never show the same hadith side by side.
      return [recordedCard(slot, FEED_FORTY[turnOf(day, turn + Math.ceil(FEED_FORTY.length / 2), FEED_FORTY.length)])];
    }
    if (kind === 'isnad') {
      if (!FEED_CHAINS.length) return [];
      // A quarter of the list on, and past the group's hadith, Ibn Rajab and «من أخرجه» cards, so it never repeats one of them.
      const all = rajabPassages();
      const taken = [
        ...(FEED_FORTY.length ? [FEED_FORTY[turnOf(day, turn, FEED_FORTY.length)].n, FEED_FORTY[turnOf(day, turn + Math.ceil(FEED_FORTY.length / 2), FEED_FORTY.length)].n] : []),
        ...(all.length ? [all[turnOf(day, turn, all.length)].chapter.n] : []),
      ];
      const start = turnOf(day, turn + Math.ceil(FEED_CHAINS.length / 4), FEED_CHAINS.length);
      const entry = Array.from({ length: FEED_CHAINS.length }, (_, i) => FEED_CHAINS[(start + i) % FEED_CHAINS.length]).find(each => !taken.includes(each.n)) ?? FEED_CHAINS[start];
      return [isnadCard(slot, entry)];
    }
    if (kind === 'hadith') return FEED_FORTY.length ? [plainCard(slot, FEED_FORTY[turnOf(day, turn, FEED_FORTY.length)])] : [];
    const all = rajabPassages();
    const card = all.length ? rajabCard(slot, all[turnOf(day, turn, all.length)]) : null;
    return card ? [card] : [];
  });
}

/** A saved hadith card by its item (shared/feedItems.ts), as the feed drew it; null when the data no longer holds it. */
export function hadithCardOf(kind: string, item: string): HadithCard | null {
  const n = Number(item);
  if (kind === 'hadith' || kind === 'recorded') {
    const entry = FEED_FORTY.find(each => String(each.n) === item);
    return entry ? (kind === 'hadith' ? plainCard(0, entry) : recordedCard(0, entry)) : null;
  }
  if (kind === 'isnad') { const entry = FEED_CHAINS.find(each => each.n === n && String(n) === item); return entry ? isnadCard(0, entry) : null; }
  if (kind === 'rajab') {
    const found = rajabPassages().find(({ chapter, passage }) => rajabItem(chapter.n, chapter.paragraphs.indexOf(passage[0])) === item);
    return found ? rajabCard(0, found) : null;
  }
  return null;
}
