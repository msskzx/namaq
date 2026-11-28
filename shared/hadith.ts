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
  lead?: string;
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

export interface AppIsnad {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { from: string; to: string; label: string }[];
  rows: { y: number; kind: 'collector' | 'tabaqa' | 'unranked'; tabaqa?: number; name?: string }[];
  width: number;
  height: number;
}

export type AppHadithUnit = HadithUnitView & { isnad: Record<string, AppIsnad> };

export interface AppHadith {
  size: { width: number; gap: number; row: number };
  units: AppHadithUnit[];
}

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

export const DRAW_MODES = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص' }] as const;
export type DrawMode = (typeof DRAW_MODES)[number]['key'];

export const PROPHET_AGENT = 'prophet-muhammad';
export const PROPHET_LABEL = 'رسول الله ﷺ';

export function sceneSlots(scenes: SceneView[], count: number): Map<string, number>[] {
  const earlier = new Map<string, number>();
  return scenes.map((scene) => {
    const taken = new Set<number>();
    const slots = new Map<string, number>();
    const speakers = sceneSpeakers(scene.lines);
    for (const { speaker, prophet } of speakers) {
      if (prophet) { slots.set(speaker, 0); taken.add(0); }
    }
    const others = Math.max(1, count - 1);
    let shared = 0;
    for (const { speaker, prophet } of speakers) {
      if (prophet) continue;
      const kept = earlier.get(speaker);
      let at = kept !== undefined && !taken.has(kept) ? kept : undefined;
      for (let i = 1; at === undefined && i < count; i++) if (!taken.has(i)) at = i;
      at ??= 1 + (shared++ % others);
      taken.add(at);
      earlier.set(speaker, at);
      slots.set(speaker, at % count);
    }
    return slots;
  });
}

export function sceneSpeakers(lines: Pick<SceneLine, 'kind' | 'speaker' | 'agent'>[]): { speaker: string; prophet: boolean }[] {
  const seen = new Map<string, boolean>();
  for (const { kind, speaker, agent } of lines) {
    if (kind !== 'turn' || !speaker) continue;
    seen.set(speaker, (seen.get(speaker) ?? false) || agent === PROPHET_AGENT);
  }
  const all = [...seen].map(([speaker, prophet]) => ({ speaker, prophet }));
  return [...all.filter(one => one.prophet), ...all.filter(one => !one.prophet)];
}

const SAYING = /^[فو]?(قال|قالت|قالوا|قلت|قلنا)$/;
const JOINERS = new Set(['ثم']);

export function splitLead(narration: string): { before?: string; lead: string } {
  const words = narration.trim().split(/\s+/);
  const bare = words.map(word => normalizeWord(word).replace(/[^\u0621-\u064a]/g, ''));
  let at = bare.findLastIndex(word => SAYING.test(word));
  if (at <= 0) return { lead: narration.trim() };
  while (at > 0 && JOINERS.has(bare[at - 1])) at--;
  if (at === 0) return { lead: narration.trim() };
  return { before: words.slice(0, at).join(' '), lead: words.slice(at).join(' ') };
}

export const RECORD_BOOKS = ['bukhari', 'muslim', 'tirmidhi', 'abudawud', 'nasai', 'ibnmajah', 'ahmad', 'darimi', 'muwatta', 'daraqutni', 'bayhaqi', 'abd'] as const;
export type RecordBook = (typeof RECORD_BOOKS)[number];
export type FortyBook = RecordBook | 'nawawi' | 'ibnrajab';

export interface FortyRecord {
  book: RecordBook;
  number: number;
  route?: string;
  from?: string;
  mursal?: boolean;
  shamela: number;
  volume: number;
  pages: number[];
  text: string;
  isnadEnd?: number;
  partial?: boolean;
  isnad?: AppIsnad;
}

export interface FortyGrade {
  by: string;
  book: FortyBook;
  number?: number;
  quote: string;
  volume: number;
  pages: number[];
  shamela: number;
}

export interface FortyEntry {
  n: number;
  heading: string;
  companion: string;
  text: string;
  shamela: number;
  pages: number[];
  named: string[];
  partial?: boolean;
  alsoFrom?: string[];
  records: FortyRecord[];
  grades?: FortyGrade[];
  source?: 'ibnrajab';
  volume?: number;
}

export interface AppForty {
  books: Record<FortyBook, { shamela: number; title: string; edition: string }>;
  entries: FortyEntry[];
}

export function searchForty<T extends Pick<FortyEntry, 'heading' | 'companion' | 'text'>>(entries: T[], query: string): T[] {
  const plain = (text: string) => normalizeWord(text).replace(/[^\u0621-\u064A\s]/g, ' ');
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (!words.length) return entries;
  return entries.filter(entry => {
    const hay = plain(`${entry.heading} ${entry.companion} ${entry.text}`);
    return words.every(word => hay.includes(word));
  });
}

export interface RajabParagraph { text: string; volume: number; page: number; shamela: number; turns?: { at: number; page: number }[] }
export interface RajabChapter { n: number; shamela: number; paragraphs: RajabParagraph[] }

const SAHIHAYN: Partial<Record<RecordBook, string>> = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' };
export const recordName = (record: Pick<FortyRecord, 'book' | 'number' | 'route'>, digits: (n: number) => string, titles?: AppForty['books']) =>
  `${SAHIHAYN[record.book] ?? titles?.[record.book].title ?? record.book} ${digits(record.number)}${record.route ? ` (${record.route})` : ''}`;

export const COLLECTOR: Record<RecordBook, string> = {
  bukhari: 'البخاري', muslim: 'مسلم', tirmidhi: 'الترمذي', nasai: 'النسائي', abudawud: 'أبو داود', ibnmajah: 'ابن ماجه', daraqutni: 'الدارقطني',
  bayhaqi: 'البيهقي', ahmad: 'أحمد', darimi: 'الدارمي', muwatta: 'مالك', abd: 'عبد بن حميد',
};

export interface BookBox {
  key: string;
  name: string;
  number?: number;
  named: boolean;
  notes: string[];
}

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

const GRADED_SAHIH = new Set([11, 18, 28, 29]);
export const fromSahihayn = (entry: Pick<FortyEntry, 'partial' | 'records'>) =>
  !entry.partial && entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim');

export const drawnBukhari = (entry: Pick<FortyEntry, 'records'>) => entry.records.find(record => record.book === 'bukhari' && record.isnad && !record.partial && record.isnadEnd);

export const compilerOf = (entry: Pick<FortyEntry, 'source'>) =>
  entry.source === 'ibnrajab' ? { book: 'ibnrajab' as const, name: 'ابن رجب' } : { book: 'nawawi' as const, name: 'النووي' };

export const authentic = (entry: Pick<FortyEntry, 'n' | 'records'>) => GRADED_SAHIH.has(entry.n)
  || (entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'));


export const fromCompanion = (companion: string) => `عن ${companion.replace(/^أبو /, 'أبي ')}`;

export function sayingStart(text: string): string {
  const at = /رضي الله (?:تعالى )?عن(?:هما|هم|ها|ه)(?: أيضًا)?[\s-]*[:،]?\s*/.exec(text);
  const rest = at ? text.slice(at.index + at[0].length) : text.replace(/^«/, '');
  return rest.replace(/^(?:ق\p{Mn}*ا\p{Mn}*ل\p{Mn}*(?:ت\p{Mn}*)?|يقول)\s*:\s*/u, '');
}


export const bareHadith = (text: string) => text.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
const bare = bareHadith;

const EXPLAINS = /^(?:[فو]?قوله|ومعنى|وأما معنى)/;
const ROUTES = /^(?:و?هذا الحديث|وقد روي|وروي|و?روى|و?خرج|وقد سبق|فأما ما خرج)/;
const leadsOn = (text: string) => /:\s*$/.test(text) || /^[فو]?قوله[^"«:]*:\s*["«][^"»]*["»]\s*[.،]?\s*$/.test(bare(text));

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
const COUNTS = /^و?(?:أحد(?:هما|ها)|ثاني(?:هما|ها)|ثالثها|رابعها|الثاني|الثالث|الرابع|الخامس|السادس|السابع)/;

export function rajabOpening(chapter: RajabChapter): RajabParagraph[] {
  const { paragraphs } = chapter;
  const explains = paragraphs.findIndex((paragraph, i) => i > 0 && EXPLAINS.test(bare(paragraph.text)));
  const other = paragraphs.findIndex((paragraph, i) => i > 0 && !ROUTES.test(bare(paragraph.text)));
  const from = explains > 0 ? explains : other > 0 ? other : Math.min(1, paragraphs.length - 1);
  return passageFrom(paragraphs, from);
}

export function rajabFeedPassages(chapters: readonly RajabChapter[], entries: readonly FortyEntry[]) {
  const sahihayn = new Set(entries.filter(fromSahihayn).map(entry => entry.n));
  return chapters.filter(chapter => sahihayn.has(chapter.n)).flatMap(chapter => chapter.paragraphs.flatMap((paragraph, i) => {
    if (!/^[فو]?قوله/.test(bare(paragraph.text))) return [];
    const passage = passageFrom(chapter.paragraphs, i);
    return passage.reduce((length, item) => length + item.text.length, 0) <= SCREEN_PASSAGE && !leadsOn(passage[passage.length - 1].text) ? [{ chapter, passage }] : [];
  }));
}

export const lastPage = (paragraph: RajabParagraph) => paragraph.turns?.length ? paragraph.turns[paragraph.turns.length - 1].page : paragraph.page;

const SCREEN_PASSAGE = 700;
