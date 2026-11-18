/**
 * The people as the phone app shows them (owner, 2026-11-18). The app reads only the new model: each person comes from
 * an entry converted under data/works (src/lib/model/appPeople.ts builds it; scripts/model/buildAppPeople.ts writes
 * shared/data/tarajim/people.json). A person whose entry is not converted yet is not in the app.
 */

/** A page of the book the value is read from. */
export interface PageRef {
  volume: number;
  page: string;
}

/** One value as the book prints it, with who says it. `by` is empty when the author says it himself. */
export interface PersonFact {
  text: string;
  refs: PageRef[];
  by: string[];
  /** Carried over from the old data without a page; the conversion of its entry sources it. */
  legacy?: true;
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
}

export interface PersonTitle extends PersonFact {
  title: string;
  name: string;
}

export interface AppPerson {
  slug: string;
  name: string;
  sex?: 'MALE' | 'FEMALE';
  /** The entry in the book: its number as printed, volume and pages. */
  entry: { unit: string; number?: string; volume: number; from: string; to: string };
  fullName?: PersonFact;
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
export function sayer(fact: PersonFact) {
  return fact.by.length === 0 ? TITLE_SPEAKER_AUTHOR : fact.by.join('، ');
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

export function pageLabel(refs: PageRef[]) {
  const books = new Map<string, string[]>();
  for (const ref of refs) {
    const { book, part } = volumeLabel(ref.volume);
    const at = part === undefined ? arabic(ref.page) : `${arabic(part)}/${arabic(ref.page)}`;
    const list = books.get(book) ?? [];
    if (!list.includes(at)) list.push(at);
    books.set(book, list);
  }
  return [...books].map(([book, pages]) => `${book} ${pages.join('، ')}`).join('؛ ');
}
