/**
 * The hadith as the website and the phone app show them (src/lib/model/hadithView.ts builds a unit's view; the app reads
 * them from data/hadith/units.json, written by scripts/model/buildAppHadith.ts), and what both draw them with.
 */

export type ChainLink =
  | { gap: true }
  | { gap?: false; narrator: string; agent?: string; mode: string; modeKey: string; text?: string };

export interface ChainView {
  links: ChainLink[];
  tahwil?: string;
  branches?: ChainView[];
}

export interface ReportView {
  id: string;
  voice: string;
  origin: string;
  chainState: string;
  frame?: string;
  fullText?: string;
  statements: string[];
  chain?: ChainView;
  scenes: SceneView[];
}

export interface SceneLine {
  kind: 'turn' | 'narration';
  speaker?: string;
  agent?: string;
  text: string;
}

export interface SceneView {
  ordinal: number;
  inTurn?: string;
  lines: SceneLine[];
}

export interface ReaderPage {
  label: string;
  parts: { text: string; mark: boolean }[];
}

export interface HadithUnitView {
  book: string;
  compiler?: string;
  kitab?: string;
  bab?: string;
  reader?: ReaderPage[];
  id: string;
  work: string;
  author: string;
  type: string;
  reports: ReportView[];
  notes: { text: string; narrator?: string }[];
  explains: { unit: string; basis: string; book: string }[];
  explainedBy: { unit: string; texts: string[] }[];
  sameEvent: { unit: string; book: string; basis: string; source: string }[];
}

/** A unit's isnad as the website lays it out (src/lib/model/isnadGraph.ts layoutIsnad), its rows named. */
export interface AppIsnad {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { from: string; to: string; label: string }[];
  /** The rows' names, top to bottom: the collector, then each tabaqa (its number and Ibn Hajar's name for it), then the unranked. */
  rows: { y: number; kind: 'collector' | 'tabaqa' | 'unranked'; tabaqa?: number; name?: string }[];
  width: number;
  height: number;
}

export type AppHadithUnit = HadithUnitView & { isnad: Record<string, AppIsnad> };

export interface AppHadith {
  /** The website's sizes the layout is in: the app draws it smaller, by these steps. */
  size: { width: number; gap: number; row: number };
  units: AppHadithUnit[];
}

/** A new speaker moves to the other side, so two people in a row never share one. */
export function bubbleSides(lines: Pick<SceneLine, 'kind' | 'speaker'>[]): boolean[] {
  let previous: string | undefined;
  let seen = false;
  let start = false;
  return lines.map((line) => {
    if (line.kind !== 'turn') return start;
    if (seen && line.speaker !== previous) start = !start;
    seen = true;
    previous = line.speaker;
    return start;
  });
}

/**
 * Each scene's speakers and the colour each takes, by its place in a list of `count` colours: a speaker keeps the colour
 * an earlier scene gave him, unless someone in this scene already has it.
 */
export function sceneSlots(scenes: SceneView[], count: number): Map<string, number>[] {
  const earlier = new Map<string, number>();
  return scenes.map((scene) => {
    const taken = new Set<number>();
    const slots = new Map<string, number>();
    for (const { kind, speaker } of scene.lines) {
      if (kind !== 'turn' || !speaker || slots.has(speaker)) continue;
      const kept = earlier.get(speaker);
      let at = kept !== undefined && !taken.has(kept) ? kept : 0;
      while (taken.has(at)) at = (at + 1) % count;
      taken.add(at);
      earlier.set(speaker, at);
      slots.set(speaker, at);
    }
    return slots;
  });
}

/** The books the Forty's records come from: the Sahihayn first, then the books al-Nawawi names for the rest. */
export const RECORD_BOOKS = ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah', 'ahmad', 'darimi', 'muwatta', 'daraqutni', 'bayhaqi', 'abd'] as const;
export type RecordBook = (typeof RECORD_BOOKS)[number];
export type FortyBook = RecordBook | 'nawawi' | 'ibnrajab';

/** A record al-Nawawi's hadith comes from (data/hadith/forty.json): al-Bukhari's, one printed Muslim route, or a record in another book. */
export interface FortyRecord {
  book: RecordBook;
  /** The record's printed number (Abd al-Baqi's for Muslim and Ibn Majah; for the Muwatta, its number within its book). */
  number: number;
  /** Muslim's route under that number as printed («١٥٥», «١ م»); the Muwatta's book («كتاب الأقضية»). */
  route?: string;
  /** The Companion as the record names him, when another than al-Nawawi's (Ibn Majah has «لا ضرر» from Ubada, not Abu Sa'id). */
  from?: string;
  /** Told without a Companion: «from» is the Follower it stops at (Ali b. Husayn in al-Tirmidhi; Malik's teacher in the Muwatta). */
  mursal?: boolean;
  /** Shamela's id of the record's first page. */
  shamela: number;
  volume: number;
  pages: number[];
  /** The record as printed, its chain and its text. */
  text: string;
  /** Where the text's first quote mark opens the saying; before it is the chain. */
  isnadEnd?: number;
  /** The record holds only part of al-Nawawi's wording. */
  partial?: boolean;
  /** The chain drawn (one line of narrators the edition links), for «الرسم». */
  isnad?: AppIsnad;
}

/** A scholar's grade, quoted as printed in the book it is from (al-Nawawi's entry, a record, Ibn Rajab's chapter). */
export interface FortyGrade {
  by: string;
  book: FortyBook;
  number?: number;
  quote: string;
  volume: number;
  pages: number[];
  shamela: number;
}

/** One of al-Nawawi's Forty: his own text as printed, the Companion, the books he names, and the records found. */
export interface FortyEntry {
  n: number;
  heading: string;
  companion: string;
  text: string;
  /** Shamela's id of the entry's first page. */
  shamela: number;
  pages: number[];
  named: string[];
  partial?: boolean;
  /** Other Companions al-Bukhari has the same hadith from, in another wording or in part. */
  alsoFrom?: string[];
  records: FortyRecord[];
  /** What the scholars said of its grade, each quoted (the hadith outside the Sahihayn). */
  grades?: FortyGrade[];
}

export interface AppForty {
  books: Record<FortyBook, { shamela: number; title: string; edition: string }>;
  entries: FortyEntry[];
}

/** A paragraph of Ibn Rajab's Jami' al-'Ulum wal-Hikam (shared/data/hadith/ibnRajab.json), with the page it starts on. */
export interface RajabParagraph { text: string; volume: number; page: number; shamela: number; turns?: { at: number; page: number }[] }
/** Ibn Rajab's chapter on al-Nawawi's hadith n, his words only. */
export interface RajabChapter { n: number; shamela: number; paragraphs: RajabParagraph[] }

const SAHIHAYN: Partial<Record<RecordBook, string>> = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' };
/** «صحيح البخاري ٥٤», «صحيح مسلم ١٩٠٧ (١٥٥)» or «سنن الترمذي ٢٥١٨», a record's short reference. */
export const recordName = (record: Pick<FortyRecord, 'book' | 'number' | 'route'>, digits: (n: number) => string, titles?: AppForty['books']) =>
  `${SAHIHAYN[record.book] ?? titles?.[record.book].title ?? record.book} ${digits(record.number)}${record.route ? ` (${record.route})` : ''}`;

/** «عن أبي هريرة»: the Companion after «عن», a kunya in the genitive. */
export const fromCompanion = (companion: string) => `عن ${companion.replace(/^أبو /, 'أبي ')}`;

/** al-Nawawi's text after his opening «عن فلان رضي الله عنه», for a short preview; a «قال:» that opens what is left goes too. */
export function sayingStart(text: string): string {
  const at = /رضي الله (?:تعالى )?عن(?:هما|هم|ها|ه)(?: أيضًا)?\s*[:،]?\s*/.exec(text);
  const rest = at ? text.slice(at.index + at[0].length) : text.replace(/^«/, '');
  return rest.replace(/^(?:قالت?|يقول)\s*:\s*/, '');
}


/** A paragraph where Ibn Rajab explains a phrase of the hadith: «وقوله ﷺ: …», «فقوله: …», «ومعنى هذا الحديث …». */
const EXPLAINS = /^(?:[فو]?قوله|ومعنى|وأما معنى|فأما)/;

/**
 * The opening a hadith page shows of Ibn Rajab's chapter: from his first paragraph that explains the hadith to the next one,
 * past the hadith he quotes and his paragraphs on its routes; a chapter with none opens on the paragraph after the hadith.
 */
export function rajabOpening(chapter: RajabChapter): RajabParagraph[] {
  const at = chapter.paragraphs.findIndex((paragraph, i) => i > 0 && EXPLAINS.test(paragraph.text));
  const from = at > 0 ? at : Math.min(1, chapter.paragraphs.length - 1);
  return chapter.paragraphs.slice(from, from + 1);
}

/**
 * The passages the feed's Ibn Rajab card shows (owner, 2026-11-18: every feature gets a card): each paragraph where he
 * explains a phrase of a hadith al-Nawawi took whole from the Sahihayn, short enough to read whole on a phone screen.
 */
export function rajabFeedPassages(chapters: readonly RajabChapter[], entries: readonly FortyEntry[]) {
  const sahihayn = new Set(entries.filter(entry => !entry.partial && entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim')).map(entry => entry.n));
  return chapters.filter(chapter => sahihayn.has(chapter.n)).flatMap(chapter =>
    chapter.paragraphs.filter(paragraph => /^[فو]?قوله/.test(paragraph.text) && paragraph.text.length <= SCREEN_PASSAGE).map(paragraph => ({ chapter, paragraph })));
}
/** About what a phone screen holds of Ibn Rajab's text at the feed's size, so a card never scrolls inside. */
const SCREEN_PASSAGE = 700;
