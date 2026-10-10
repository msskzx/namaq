// docs/plans/quran-qiraat.md
import { normalizeWord } from './normalize';

export const READERS = [
  { id: 'nafi', name: 'نافع' },
  { id: 'ibn-kathir', name: 'ابن كثير' },
  { id: 'abu-amr', name: 'أبو عمرو' },
  { id: 'ibn-amir', name: 'ابن عامر' },
  { id: 'asim', name: 'عاصم' },
  { id: 'hamza', name: 'حمزة' },
  { id: 'kisai', name: 'الكسائي' },
  { id: 'abu-jafar', name: 'أبو جعفر' },
  { id: 'yaqub', name: 'يعقوب' },
  { id: 'khalaf', name: 'خلف العاشر' },
] as const;

export type ReaderId = (typeof READERS)[number]['id'];

export const RIWAYAT = [
  { id: 'qalun', name: 'قالون', reader: 'nafi' },
  { id: 'warsh', name: 'ورش', reader: 'nafi' },
  { id: 'bazzi', name: 'البزي', reader: 'ibn-kathir' },
  { id: 'qunbul', name: 'قنبل', reader: 'ibn-kathir' },
  { id: 'duri-abu-amr', name: 'الدوري عن أبي عمرو', reader: 'abu-amr' },
  { id: 'susi', name: 'السوسي', reader: 'abu-amr' },
  { id: 'hisham', name: 'هشام', reader: 'ibn-amir' },
  { id: 'ibn-dhakwan', name: 'ابن ذكوان', reader: 'ibn-amir' },
  { id: 'shuba', name: 'شعبة', reader: 'asim' },
  { id: 'hafs', name: 'حفص', reader: 'asim' },
  { id: 'khalaf-hamza', name: 'خلف عن حمزة', reader: 'hamza' },
  { id: 'khallad', name: 'خلاد', reader: 'hamza' },
  { id: 'abu-al-harith', name: 'أبو الحارث', reader: 'kisai' },
  { id: 'duri-kisai', name: 'الدوري عن الكسائي', reader: 'kisai' },
  { id: 'ibn-wardan', name: 'ابن وردان', reader: 'abu-jafar' },
  { id: 'ibn-jammaz', name: 'ابن جمّاز', reader: 'abu-jafar' },
  { id: 'ruways', name: 'رويس', reader: 'yaqub' },
  { id: 'rawh', name: 'روح', reader: 'yaqub' },
  { id: 'ishaq', name: 'إسحاق', reader: 'khalaf' },
  { id: 'idris', name: 'إدريس', reader: 'khalaf' },
] as const satisfies readonly { id: string; name: string; reader: ReaderId }[];

export type RiwayaId = (typeof RIWAYAT)[number]['id'];

export type Reading = {
  text?: string;
  readers?: ReaderId[];
  riwayat?: RiwayaId[];
};

export type Meaning =
  | { kind: 'quote'; quotes: string[]; source: string; url: string }
  | { kind: 'unsourced'; text: string }
  | { kind: 'withheld'; text: string };

export type Variant = {
  surah: number;
  ayah: number;
  hafsWord: string;
  occurrence?: number;
  readings: [Reading, Reading];
  note?: string;
  meaning: Meaning;
};

export type ChipState = 0 | 1 | null;

export const riwayatOf = (reader: ReaderId): RiwayaId[] => RIWAYAT.filter(r => r.reader === reader).map(r => r.id);

export function riwayatOfReading(reading: Reading): Set<RiwayaId> {
  return new Set([...(reading.readers ?? []).flatMap(riwayatOf), ...(reading.riwayat ?? [])]);
}

export function chipStates(variant: Variant): { id: RiwayaId; name: string; state: ChipState }[] {
  const [first, second] = variant.readings.map(riwayatOfReading);
  return RIWAYAT.map(({ id, name }) => {
    const inFirst = first.has(id);
    const inSecond = second.has(id);
    return { id, name, state: inFirst === inSecond ? null : inFirst ? 0 : 1 };
  });
}

export function neighbors(norm: string[], target: string, occurrence = 0, radius = 2) {
  const wanted = target.split(' ').map(normalizeWord);
  let seen = 0;
  for (let start = 0; start + wanted.length <= norm.length; start++) {
    if (!wanted.every((w, k) => norm[start + k] === w)) continue;
    if (seen++ < occurrence) continue;
    const end = start + wanted.length;
    return { start, end, before: [Math.max(0, start - radius), start] as const, after: [end, Math.min(norm.length, end + radius)] as const };
  }
  return null;
}
