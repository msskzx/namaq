import { num } from './arabicNumber';

// see docs/plans/balagha.md
export const BALAGHA_DEVICES = ['الاستعارة', 'التشبيه', 'التمثيل', 'الكناية', 'المجاز', 'الالتفات', 'التقديم', 'التكرير'] as const;
export type BalaghaDevice = (typeof BALAGHA_DEVICES)[number];

export type KashshafLit = [start: number, end: number, device: number, ayah: number, from: number, to: number];
export type KashshafEntry = [surah: number, from: number, to: number, part: number, first: number, last: number, text: string, lit: KashshafLit[]];
export type KashshafData = { source: { version: string; book: number; from: string }; entries: KashshafEntry[] };

export type KashshafPassage = { surah: number; from: number; to: number; part: number; pages: [number, number]; text: string; lit: KashshafLit[] };

const indexes = new WeakMap<KashshafData, Map<string, number>>();

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

export type KashshafRun = { text: string; quran: boolean; lit: number | null; devices: BalaghaDevice[]; opens: boolean };

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

export function litWords(passage: Pick<KashshafPassage, 'lit' | 'surah'>, at: number, key: string): [number, number] | null {
  const [, , , ayah, from, to] = passage.lit[at] ?? [];
  return ayah && `${passage.surah}:${ayah}` === key && from >= 0 ? [from, to] : null;
}

export const KASHSHAF_BOOK = 'الكشاف عن حقائق التنزيل وعيون الأقاويل في وجوه التأويل';
export const KASHSHAF_EDITION = 'جار الله الزمخشري (ت ٥٣٨هـ)، دار الكتاب العربي، بيروت، ط ٣، ١٤٠٧هـ';

export const kashshafCredit = (passage: Pick<KashshafPassage, 'part' | 'pages'>) =>
  `الكشاف للزمخشري ${num(passage.part)}/${num(passage.pages[0])}${passage.pages[1] !== passage.pages[0] ? `–${num(passage.pages[1])}` : ''}`;

export const kashshafPage = (passage: Pick<KashshafPassage, 'part' | 'pages'>) => `https://quranpedia.net/book/346/${passage.part}/${passage.pages[0]}`;
