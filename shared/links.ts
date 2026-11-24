/**
 * Every link between two things in the app, both ways (owner, 2026-11-24: everything links to everything it touches, in
 * both directions, from one source). A link is written once, by hand, on the catalog record that cites it
 * (data/catalog); src/lib/catalog/appLinks.ts gathers them all, adds the other direction, and writes
 * shared/data/links.json. Nothing edits that file by hand: a fix goes into the record and the build runs again.
 *
 * An id names its kind: person:<slug>, ayah:<surah>:<ayah>, hadith:<book>:<number>, battle:<slug>, event:<slug>,
 * utterance:<slug>, place:<slug>. A link between two kinds keeps its type on both ends, since the other end's kind says which way it
 * reads (person:x REVEALED_ABOUT ayah:y is read «آيات نزلت فيه» on the person and «نزلت فيه» on the ayah). Only a link
 * between two people turns into another type the other way (FATHER becomes SON or DAUGHTER), as the catalog's
 * relations already do.
 */

export const ID_KINDS = ['person', 'ayah', 'hadith', 'battle', 'event', 'utterance', 'place'] as const;
export type IdKind = (typeof ID_KINDS)[number];

/** The hadith books an id may name, by the catalog's source slug. */
export const HADITH_BOOKS: Readonly<Record<string, string>> = { 'sahih-al-bukhari': 'bukhari', 'sahih-muslim': 'muslim' };

/** The types that join two different kinds, with what each says. Person-to-person types are the catalog's relations. */
export const LINK_TYPES = {
  // A person and an ayah, as the source ties them (src/lib/catalog/types.ts, AyahLinkKind).
  REVEALED_ABOUT: 'نزلت فيه',
  DESCRIBES: 'ذُكر فيمن تصفهم',
  ACTED_ON: 'عمل بها',
  READ_AS_ABOUT: 'قرأها فيه أحد من نقل عنهم المصدر',
  IN_STORY: 'نزلت في خبر من أخباره',
  // A story and an ayah.
  RECITED: 'قُرئت في القصة',
  // A story and the hadith that tells it.
  TOLD_IN: 'رُويت القصة في الحديث',
  // A story and a person in it, and one whose words it gives.
  IN_EVENT: 'في القصة',
  SPEAKS_IN: 'تكلم في القصة',
  // A battle and a person.
  PARTICIPATED_IN: 'شهدها',
  ABSENT_FROM: 'غاب عنها',
  IN_MOMENT: 'ذُكر في خبر من أخبارها',
  // A battle and the place it was fought at, on the books that place it.
  FOUGHT_AT: 'كانت فيه',
  // Someone's words (poetry or a saying) and who said them, who they are about, and where they were said.
  SAID: 'قالها',
  ABOUT: 'قيلت فيه',
  SAID_AT: 'قيلت فيها',
} as const;
export type CrossLinkType = keyof typeof LINK_TYPES;

/**
 * One link as one end sees it. `src` is every source behind it: a hadith id, a book page (<slug>:<volume>:<page>, or
 * <slug>:<page> for a book cited without a volume), or a
 * batch claim (claim:<key>); `legacy-unreviewed` marks a value carried from the old seeds that no batch cites yet.
 * `at` is the record (or records) the link is written on, so whoever reads the file knows which record to fix.
 */
export interface Link {
  readonly t: string;
  readonly to: string;
  readonly src: readonly string[];
  readonly at: readonly string[];
}

export type LinkIndex = Readonly<Record<string, readonly Link[]>>;

export const kindOf = (id: string) => id.slice(0, id.indexOf(':')) as IdKind;
