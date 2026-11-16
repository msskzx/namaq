import { num } from './arabicNumber';

/**
 * Balagha in the reader (docs/plans/balagha.md): al-Zamakhshari's al-Kashshaf, his whole passage on an ayah, with the
 * sentences where he names a device lit by a fixed rule (scripts/quran/kashshaf.ts), never chosen by hand.
 * The devices, in his own words; a lit sentence carries the place of its device here.
 */
export const BALAGHA_DEVICES = ['الاستعارة', 'التشبيه', 'التمثيل', 'الكناية', 'المجاز', 'الالتفات', 'التقديم', 'التكرير'] as const;
export type BalaghaDevice = (typeof BALAGHA_DEVICES)[number];

/** [start, end) in the passage's text, the device, and the ayah words the sentence quotes ([ayah, first, last], ayah 0 for none). */
export type KashshafLit = [start: number, end: number, device: number, ayah: number, from: number, to: number];
/** [surah, first ayah, last ayah, volume, first page, last page, text, lit sentences]; Quran quotes in the text are ﴿…﴾. */
export type KashshafEntry = [surah: number, from: number, to: number, part: number, first: number, last: number, text: string, lit: KashshafLit[]];
export type KashshafData = { source: { version: string; book: number; from: string }; entries: KashshafEntry[] };

export type KashshafPassage = { surah: number; from: number; to: number; part: number; pages: [number, number]; text: string; lit: KashshafLit[] };

const indexes = new WeakMap<KashshafData, Map<string, number>>();

/** His passage on an ayah, or null where the book has none. */
export function kashshafAt(data: KashshafData, key: string): KashshafPassage | null {
  let index = indexes.get(data);
  if (!index) {
    index = new Map();
    data.entries.forEach(([surah, from, to], at) => { for (let a = from; a <= to; a++) if (!index!.has(`${surah}:${a}`)) index!.set(`${surah}:${a}`, at); });
    indexes.set(data, index);
  }
  const at = index.get(key);
  if (at === undefined) return null;
  const [surah, from, to, part, first, last, text, lit] = data.entries[at];
  return { surah, from, to, part, pages: [first, last], text, lit };
}

/** A run of the passage: prose or a Quran quote, and the devices of the lit sentence it falls in (the sentence's place in `lit`). */
export type KashshafRun = { text: string; quran: boolean; lit: number | null; devices: BalaghaDevice[]; opens: boolean };

/**
 * The passage in runs for drawing: each lit sentence apart, its devices named on its first run (`opens`) so the chips
 * stand in front of it, and inside every piece the Quran quotes apart from the prose so they take the Quran font.
 */
export function kashshafRuns(passage: Pick<KashshafPassage, 'text' | 'lit'>): KashshafRun[] {
  const spans = new Map<number, { end: number; devices: BalaghaDevice[]; at: number }>();
  passage.lit.forEach(([start, end, device], at) => {
    const span = spans.get(start);
    const name = BALAGHA_DEVICES[device];
    if (span) { if (!span.devices.includes(name)) span.devices.push(name); } else spans.set(start, { end, devices: [name], at });
  });
  const runs: KashshafRun[] = [];
  const push = (text: string, lit: number | null, devices: BalaghaDevice[]) => {
    text.split(/(﴿[^﴾]*﴾)/).filter(Boolean).forEach((piece, i) => runs.push({ text: piece, quran: piece.startsWith('﴿'), lit, devices, opens: lit !== null && i === 0 }));
  };
  let at = 0;
  for (const start of [...spans.keys()].sort((a, b) => a - b)) {
    if (start < at) continue;
    const span = spans.get(start)!;
    push(passage.text.slice(at, start), null, []);
    push(passage.text.slice(start, span.end), span.at, span.devices);
    at = span.end;
  }
  push(passage.text.slice(at), null, []);
  return runs;
}

/** The ayah words a lit sentence quotes, for the pressed ayah: [first, last] mushaf words from 0, or null. */
export function litWords(passage: Pick<KashshafPassage, 'lit' | 'surah'>, at: number, key: string): [number, number] | null {
  const [, , , ayah, from, to] = passage.lit[at] ?? [];
  return ayah && `${passage.surah}:${ayah}` === key && from >= 0 ? [from, to] : null;
}

export const KASHSHAF_BOOK = 'الكشاف عن حقائق التنزيل وعيون الأقاويل في وجوه التأويل';
export const KASHSHAF_EDITION = 'جار الله الزمخشري (ت ٥٣٨هـ)، دار الكتاب العربي، بيروت، ط ٣، ١٤٠٧هـ';

/** The short line under a passage: book, volume and page(s). */
export const kashshafCredit = (passage: Pick<KashshafPassage, 'part' | 'pages'>) =>
  `الكشاف للزمخشري ${num(passage.part)}/${num(passage.pages[0])}${passage.pages[1] !== passage.pages[0] ? `–${num(passage.pages[1])}` : ''}`;

/** Quranpedia's page of the printed book where a passage starts. */
export const kashshafPage = (passage: Pick<KashshafPassage, 'part' | 'pages'>) => `https://quranpedia.net/book/346/${passage.part}/${passage.pages[0]}`;
