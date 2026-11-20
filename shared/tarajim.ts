import type { QuizSource } from './quiz/sources';

/**
 * The people as the phone app shows them (owner, 2026-11-18). The app reads only the new model: each person comes from
 * an entry converted under data/works (src/lib/model/appPeople.ts builds it; scripts/model/buildAppPeople.ts writes
 * shared/data/tarajim/people.json). A person whose entry is not converted yet is not in the app.
 */

/** A page of the book the value is read from. */
export interface PageRef {
  volume: number;
  page: string;
  /** Another book than the Siyar (data/works/<work>), named in OTHER_WORKS; left out for the Siyar. */
  work?: string;
}

/**
 * Books other than the Siyar that a person's values are cited from, by their data/works slug: the book's short name for
 * a page label, its author for the line under a value he says himself, and its entry in shared/sources.ts.
 */
export const OTHER_WORKS: Record<string, { book: string; author: string; source: string }> = {
  'zad-al-maad': { book: 'زاد المعاد', author: 'ابن القيم', source: 'zad-al-maad' },
  'sunan-al-tirmidhi': { book: 'سنن الترمذي', author: 'الترمذي', source: 'sunan-tirmidhi' },
};

/** The books a list of pages comes from, the Siyar as «siyar», each once, in the order met. */
export const sourcesOf = (refs: PageRef[]) => [...new Set(refs.map((ref) => (ref.work ? OTHER_WORKS[ref.work]?.source ?? ref.work : 'siyar')))];

/** One value as the book prints it, with who says it. `by` is empty when the author says it himself. */
export interface PersonFact {
  /** The assertion this rests on, «unit#assertion», for review lists that pick a fact out. */
  id?: string;
  text: string;
  refs: PageRef[];
  by: string[];
  /** Carried over from the old data without a page; the conversion of its entry sources it. */
  legacy?: true;
  /** The book gives it and also a word against it (a companionship some deny): shown with «على خلاف» and both texts. */
  disputed?: true;
  /** An unnamed view («وقيل», «غيره»): shown as «قيل», with no sayer. */
  anonymous?: true;
  /** The number or key read from the text: a year, an age, a month, an ayah key. */
  value?: number | string;
}

/**
 * Another person or an event the entry ties this person to; `text` is the sentence that states the tie, as printed.
 * `inApp` when that one has a page in the app too.
 */
export interface PersonLink extends PersonFact {
  slug: string;
  name: string;
  inApp: boolean;
  /** The linked person's sex when known, so a parent reads «أبوه» or «أمه». */
  sex?: 'MALE' | 'FEMALE';
}

export interface PersonTitle extends PersonFact {
  title: string;
  name: string;
  /** Held by others too (a group such as «العشرة المبشرون بالجنة»), so it opens the list of them; a title of one person does not. */
  shared?: true;
}

export interface AppPerson {
  slug: string;
  name: string;
  sex?: 'MALE' | 'FEMALE';
  /** The entry in the book: its number as printed, volume and pages. */
  /** The entry's pages; `toVolume` when it runs into the next volume (the Sira, ١/٢٩ to ٢/٤٩٥). */
  entry: { unit: string; number?: string; volume: number; from: string; to: string; toVolume?: number };
  fullName?: PersonFact;
  /** The book's other readings of the full name, each with its sayer («وقيل…»). */
  otherNames?: PersonFact[];
  /** Variants the book gives for one name in the nasab («ويقال: حسيل»), shown under it; the tree and quizzes keep the printed line. */
  nameVariants: PersonFact[];
  /** The fathers named in the full name, from the person up, as printed. */
  nasab: string[];
  kunya: PersonFact[];
  /** Names others called him or her by («أنت طلحة الفياض»), each with who said it. */
  laqab: PersonFact[];
  titles: PersonTitle[];
  appearance: PersonFact[];
  virtues: PersonFact[];
  islamAge: PersonFact[];
  died: { year: PersonFact[]; month: PersonFact[]; age: PersonFact[]; place: PersonFact[] };
  parents: PersonLink[];
  children: PersonLink[];
  siblings: PersonLink[];
  spouses: PersonLink[];
  cousins: PersonLink[];
  companionOf: PersonLink[];
  battles: PersonLink[];
  /** Battles the entry says he or she missed, with the reason in its words. */
  absentFrom: PersonLink[];
  /** `value` is the ayah key. REVEALED_ABOUT when the source says it came down about him or her («نزلت فيه»). */
  ayat: (PersonFact & { kind: 'REVEALED_ABOUT' | 'ABOUT' })[];
}

export const TITLE_SPEAKER_AUTHOR = 'الذهبي';

/** Who says it, for a line under the value: «الذهبي» when `by` is empty. Names lose their case endings' vowels only. */
/**
 * A kunya as a name, unvowelled and in the nominative: the book may give it only in the accusative or genitive
 * («قم أبا تراب»), so «أبا/أبي» read «أبو» and «ذا/ذي» read «ذو», as joinName reads «ابن» as «بن».
 */
export function kunyaName(text: string) {
  return text.replace(/[ً-ْٰـ]/g, '').trim().replace(/^(?:أبا|أبي|ابا|ابي)(?=\s)/u, 'أبو').replace(/^(?:ذا|ذي)(?=\s)/u, 'ذو');
}

export function sayer(fact: PersonFact) {
  return fact.by.length === 0 ? TITLE_SPEAKER_AUTHOR : fact.by.join('، ');
}

/**
 * The line under a quote that a narrator or the Prophet ﷺ says: «قاله البراء», «من قوله ﷺ». A bare name under a quote
 * read oddly (owner 2026-11-19).
 */
export function sayerLine(fact: PersonFact) {
  if (fact.by.length === 1 && fact.by[0] === PROPHET_NAME) return 'من قوله ﷺ';
  // A sayer is stored as the book's sentence has him («عن أبي هريرة»); after «قاله» he is the subject: «قاله أبو هريرة».
  return `قاله ${fact.by.map(name => (name === PROPHET_NAME ? 'النبي ﷺ' : name.replace(/^(?:أبي|أبا)(?= )/u, 'أبو'))).join('، ')}`;
}
const PROPHET_NAME = 'محمد ﷺ';

/** «عند فلان» under one reading among several: after «عند» a kunya is genitive («عند أبي نعيم», not «عند أبو نعيم»). */
export function sayerAt(fact: PersonFact) {
  return `عند ${sayer(fact).split('، ').map(name => name.replace(/^(?:أبو|أبا)(?= )/u, 'أبي')).join('، ')}`;
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const arabic = (value: string | number) => String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);

/**
 * The Risalah printing numbers its volumes from the two of the Sira and the one of the Rightly Guided Caliphs
 * (data/history/sources/siyar-alam-al-nubala-risalah/source.json): store volume 4 is the Siyar's own part 1.
 * «سير أعلام النبلاء ١/٤١»، «السيرة النبوية ١/٢٩».
 */
export function volumeLabel(volume: number) {
  if (volume <= 2) return { book: 'السيرة النبوية', part: volume };
  if (volume === 3) return { book: 'سيرة الخلفاء الراشدين' };
  return { book: 'سير أعلام النبلاء', part: volume - 3 };
}

/**
 * A value's pages as quiz sources (shared/quiz/sources.ts): one for each book, its pages, and the book's words with who
 * says them, when given. The three books of the Risalah printing (the Sira, the Caliphs, the Siyar) are al-Dhahabi's.
 */
export function pageSources(refs: PageRef[], quote?: { text: string; by?: string }): QuizSource[] {
  const books = new Map<string, { author: string; pages: string[] }>();
  for (const ref of refs) {
    const other = ref.work ? OTHER_WORKS[ref.work] : undefined;
    const { book, part } = other ? { book: other.book, part: ref.volume as number | undefined } : volumeLabel(ref.volume);
    const at = part === undefined ? arabic(ref.page) : `${arabic(part)}/${arabic(ref.page)}`;
    const entry = books.get(book) ?? { author: other?.author ?? 'الذهبي', pages: [] };
    if (!entry.pages.includes(at)) entry.pages.push(at);
    books.set(book, entry);
  }
  return [...books].map(([book, { author, pages }]) => ({
    book, author, at: pages.join('، '),
    ...(quote?.text && { quote: quote.text }), ...(quote?.by && { by: quote.by }),
  }));
}

export function pageLabel(refs: PageRef[]) {
  const books = new Map<string, string[]>();
  for (const ref of refs) {
    const other = ref.work ? OTHER_WORKS[ref.work] : undefined;
    const { book, part } = other ? { book: other.book, part: ref.volume as number | undefined } : volumeLabel(ref.volume);
    const at = part === undefined ? arabic(ref.page) : `${arabic(part)}/${arabic(ref.page)}`;
    const list = books.get(book) ?? [];
    if (!list.includes(at)) list.push(at);
    books.set(book, list);
  }
  return [...books].map(([book, pages]) => `${book} ${pages.join('، ')}`).join('؛ ');
}
