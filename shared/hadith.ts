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

/** A Bukhari record or one printed Muslim route that al-Nawawi's hadith comes from (data/hadith/forty.json). */
export interface FortyRecord {
  book: 'bukhari' | 'muslim';
  /** Bukhari's printed number, or Abd al-Baqi's number for Muslim. */
  number: number;
  /** Muslim's route under that number as printed («١٥٥», «١ م»); empty when printed bare. */
  route?: string;
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
}

export interface AppForty {
  books: Record<'nawawi' | 'bukhari' | 'muslim', { shamela: number; title: string; edition: string }>;
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

/** «صحيح البخاري ٥٤» or «صحيح مسلم ١٩٠٧ (١٥٥)», a record's short reference. */
export const recordName = (record: Pick<FortyRecord, 'book' | 'number' | 'route'>, digits: (n: number) => string) =>
  `${record.book === 'bukhari' ? 'صحيح البخاري' : 'صحيح مسلم'} ${digits(record.number)}${record.route ? ` (${record.route})` : ''}`;

/** «عن أبي هريرة»: the Companion after «عن», a kunya in the genitive. */
export const fromCompanion = (companion: string) => `عن ${companion.replace(/^أبو /, 'أبي ')}`;

/** al-Nawawi's text after his opening «عن فلان رضي الله عنه», for a short preview; a «قال:» that opens what is left goes too. */
export function sayingStart(text: string): string {
  const at = /رضي الله (?:تعالى )?عن(?:هما|هم|ها|ه)(?: أيضًا)?\s*[:،]?\s*/.exec(text);
  const rest = at ? text.slice(at.index + at[0].length) : text.replace(/^«/, '');
  return rest.replace(/^(?:قالت?|يقول)\s*:\s*/, '');
}

