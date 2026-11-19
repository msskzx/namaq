/**
 * The hadith as the website and the phone app show them (src/lib/model/hadithView.ts builds a unit's view; the app reads
 * them from data/hadith/units.json, written by scripts/model/buildAppHadith.ts), and what both draw them with.
 */
import { normalizeWord } from './quran/normalize';

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
  /** One of the eight Ibn Rajab adds (43–50): `text` is his quotation at the head of his chapter, `named` the books he names. */
  source?: 'ibnrajab';
  /** The volume of Ibn Rajab's book `pages` are in, on one of his eight. */
  volume?: number;
}

export interface AppForty {
  books: Record<FortyBook, { shamela: number; title: string; edition: string }>;
  entries: FortyEntry[];
}

/**
 * The Forty holding every word typed (in its number's heading, its Companion or al-Nawawi's text), marks, hamzas and
 * punctuation set aside: what a quiz's «ابحث عن الجواب» lists.
 */
export function searchForty<T extends Pick<FortyEntry, 'heading' | 'companion' | 'text'>>(entries: T[], query: string): T[] {
  const plain = (text: string) => normalizeWord(text).replace(/[^\u0621-\u064A\s]/g, ' ');
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (!words.length) return entries;
  return entries.filter(entry => {
    const hay = plain(`${entry.heading} ${entry.companion} ${entry.text}`);
    return words.every(word => hay.includes(word));
  });
}

/** A paragraph of Ibn Rajab's Jami' al-'Ulum wal-Hikam (shared/data/hadith/ibnRajab.json), with the page it starts on. */
export interface RajabParagraph { text: string; volume: number; page: number; shamela: number; turns?: { at: number; page: number }[] }
/** Ibn Rajab's chapter on al-Nawawi's hadith n, his words only. */
export interface RajabChapter { n: number; shamela: number; paragraphs: RajabParagraph[] }

const SAHIHAYN: Partial<Record<RecordBook, string>> = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' };
/** «صحيح البخاري ٥٤», «صحيح مسلم ١٩٠٧ (١٥٥)» or «سنن الترمذي ٢٥١٨», a record's short reference. */
export const recordName = (record: Pick<FortyRecord, 'book' | 'number' | 'route'>, digits: (n: number) => string, titles?: AppForty['books']) =>
  `${SAHIHAYN[record.book] ?? titles?.[record.book].title ?? record.book} ${digits(record.number)}${record.route ? ` (${record.route})` : ''}`;

/** Each book's collector as al-Nawawi names him after a hadith («رواه البخاري»), the Muwatta's as «مالك». */
export const COLLECTOR: Record<RecordBook, string> = {
  bukhari: 'البخاري', muslim: 'مسلم', tirmidhi: 'الترمذي', nasai: 'النسائي', abudawud: 'أبو داود', ibnmajah: 'ابن ماجه', daraqutni: 'الدارقطني',
  bayhaqi: 'البيهقي', ahmad: 'أحمد', darimi: 'الدارمي', muwatta: 'مالك', abd: 'عبد بن حميد',
};

/** One place a hadith is recorded, for «من أخرجه»: the collector, the record's number, and what to say under it. */
export interface BookBox {
  key: string;
  name: string;
  number?: number;
  /** al-Nawawi names this book for the hadith. */
  named: boolean;
  /** «بعضه» for a record holding only part of the wording; «عن فلان» or «مرسلًا» for one from another than al-Nawawi's Companion. */
  notes: string[];
}

/**
 * Where one of the Forty is recorded (owner, 2026-11-19; sketch /mnt/project-files/hadith-sciences, row 3): one box per record
 * number, in the books' order (a Muslim number's routes are one box; «بعضه» under the Sahihayn when al-Nawawi says only part
 * is there, no. 33), then each book al-Nawawi names that we hold no record
 * of (no. 41's «كتاب الحجة»), without a number.
 */
export function recordedIn(entry: Pick<FortyEntry, 'named' | 'records' | 'partial'>): BookBox[] {
  const boxes = new Map<string, BookBox>();
  for (const book of RECORD_BOOKS) {
    for (const record of entry.records.filter(each => each.book === book)) {
      const key = `${book}:${record.number}`;
      if (boxes.has(key)) continue;
      const routes = entry.records.filter(each => each.book === book && each.number === record.number);
      const notes = [
        ...(routes.every(each => each.partial) || (entry.partial && (book === 'bukhari' || book === 'muslim')) ? ['بعضه'] : []),
        ...(record.from ? [record.mursal ? 'مرسلًا' : fromCompanion(record.from)] : []),
      ];
      boxes.set(key, { key, name: COLLECTOR[book], number: record.number, named: entry.named.includes(COLLECTOR[book]), notes });
    }
  }
  const held = new Set([...boxes.values()].map(box => box.name));
  for (const name of entry.named.filter(each => !held.has(each))) boxes.set(name, { key: name, name, named: true, notes: [] });
  return [...boxes.values()];
}

/**
 * The hadith outside the Sahihayn a quiz may carry (owner, 2026-11-18: the most authentic first, undisputed): al-Tirmidhi's
 * «حسن صحيح» on nos. 11, 18, 28 and 29, printed in his Sunan beside each. Not no. 42, which his printed Sunan grades «حسن غريب»,
 * nor 12, 31 and 39, which Ibn Rajab weakens.
 */
const GRADED_SAHIH = new Set([11, 18, 28, 29]);
/** One of the Forty al-Nawawi takes whole from the Sahihayn: what the feed's hadith cards carry, the most authentic first. */
export const fromSahihayn = (entry: Pick<FortyEntry, 'partial' | 'records'>) =>
  !entry.partial && entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim');

/** Who compiled the entry and in which book: al-Nawawi in his Forty, or Ibn Rajab for the eight he adds (43–50). */
export const compilerOf = (entry: Pick<FortyEntry, 'source'>) =>
  entry.source === 'ibnrajab' ? { book: 'ibnrajab' as const, name: 'ابن رجب' } : { book: 'nawawi' as const, name: 'النووي' };

/** One of the Forty a quiz may carry: wholly from the Sahihayn, or graded sahih undisputed. */
export const authentic = (entry: Pick<FortyEntry, 'n' | 'records'>) => GRADED_SAHIH.has(entry.n)
  || (entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'));


/** «عن أبي هريرة»: the Companion after «عن», a kunya in the genitive. */
export const fromCompanion = (companion: string) => `عن ${companion.replace(/^أبو /, 'أبي ')}`;

/** al-Nawawi's text after his opening «عن فلان رضي الله عنه», for a short preview; a «قال:» that opens what is left goes too. */
export function sayingStart(text: string): string {
  // Ibn Rajab's eight set the blessing between dashes («- رضي الله عنهما - قَالَ:») and keep their harakat.
  const at = /رضي الله (?:تعالى )?عن(?:هما|هم|ها|ه)(?: أيضًا)?[\s-]*[:،]?\s*/.exec(text);
  const rest = at ? text.slice(at.index + at[0].length) : text.replace(/^«/, '');
  return rest.replace(/^(?:ق\p{Mn}*ا\p{Mn}*ل\p{Mn}*(?:ت\p{Mn}*)?|يقول)\s*:\s*/u, '');
}


/** Ibn Rajab's text without its harakat, for matching how a paragraph starts («فقولُه» is «فقوله»). */
const bare = (text: string) => text.replace(/[\u064B-\u065F\u0670]/g, '');

/** A paragraph where Ibn Rajab explains a phrase of the hadith: «وقوله ﷺ: …», «فقوله: …», «ومعنى هذا الحديث …». */
const EXPLAINS = /^(?:[فو]?قوله|ومعنى|وأما معنى)/;
/** His paragraphs on a hadith's routes («هذا الحديث خرجه مسلم…», «وقد روي…», «وخرجه أحمد…») or pointing back («وقد سبق…»). */
const ROUTES = /^(?:و?هذا الحديث|وقد روي|وروي|و?روى|و?خرج|وقد سبق|فأما ما خرج)/;
/** A paragraph that only leads into what follows: it ends «…قولان:», or holds only the phrase he explains. */
const leadsOn = (text: string) => /:\s*$/.test(text) || /^[فو]?قوله[^"«:]*:\s*["«][^"»]*["»]\s*[.،]?\s*$/.test(bare(text));

/** From paragraph `from`, through the ones it leads into, so a passage never stops at his «قولان:» or on the bare phrase. */
function passageFrom(paragraphs: readonly RajabParagraph[], from: number): RajabParagraph[] {
  let to = from;
  let listing = false;
  while (to < paragraphs.length - 1) {
    const next = bare(paragraphs[to + 1].text);
    if (leadsOn(paragraphs[to].text)) listing = listing || COUNTS.test(next);
    else if (!(listing && COUNTS.test(next))) break;
    to += 1;
  }
  return paragraphs.slice(from, to + 1);
}
/** The items of what he counts out after «قولان:», «نوعان:»: «أحدهما…», «والثاني…», «الثالث…». */
const COUNTS = /^و?(?:أحد(?:هما|ها)|ثاني(?:هما|ها)|ثالثها|رابعها|الثاني|الثالث|الرابع|الخامس|السادس|السابع)/;

/**
 * The opening a hadith page shows of Ibn Rajab's chapter: his first paragraph that explains the hadith, past the hadith he
 * quotes and his paragraphs on its routes; a chapter with none opens on his first paragraph that is not about routes.
 */
export function rajabOpening(chapter: RajabChapter): RajabParagraph[] {
  const { paragraphs } = chapter;
  const explains = paragraphs.findIndex((paragraph, i) => i > 0 && EXPLAINS.test(bare(paragraph.text)));
  const other = paragraphs.findIndex((paragraph, i) => i > 0 && !ROUTES.test(bare(paragraph.text)));
  const from = explains > 0 ? explains : other > 0 ? other : Math.min(1, paragraphs.length - 1);
  return passageFrom(paragraphs, from);
}

/**
 * The passages the feed's Ibn Rajab card shows (owner, 2026-11-18: every feature gets a card): each place where he explains
 * a phrase of a hadith al-Nawawi took whole from the Sahihayn, short enough to read whole on a phone screen.
 */
export function rajabFeedPassages(chapters: readonly RajabChapter[], entries: readonly FortyEntry[]) {
  const sahihayn = new Set(entries.filter(fromSahihayn).map(entry => entry.n));
  return chapters.filter(chapter => sahihayn.has(chapter.n)).flatMap(chapter => chapter.paragraphs.flatMap((paragraph, i) => {
    if (!/^[فو]?قوله/.test(bare(paragraph.text))) return [];
    const passage = passageFrom(chapter.paragraphs, i);
    return passage.reduce((length, item) => length + item.text.length, 0) <= SCREEN_PASSAGE && !leadsOn(passage[passage.length - 1].text) ? [{ chapter, passage }] : [];
  }));
}

/** The last page a paragraph runs onto. */
export const lastPage = (paragraph: RajabParagraph) => paragraph.turns?.length ? paragraph.turns[paragraph.turns.length - 1].page : paragraph.page;

/** About what a phone screen holds of Ibn Rajab's text at the feed's size, so a card never scrolls inside. */
const SCREEN_PASSAGE = 700;
