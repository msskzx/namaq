import type { Range } from './curatedShifts';
import { ayahWords, plainName } from './normalize';

// docs/plans/quran-oaths-and-order-juz-26.md
export type Oath = { surah: number; range: Range; by: string[] };

export const OATHS: Oath[] = [
  { surah: 50, range: [1, 1], by: ['القرءان'] },
  { surah: 51, range: [1, 4], by: ['الذاريات', 'الحاملات', 'الجاريات', 'المقسمات'] },
  { surah: 51, range: [7, 7], by: ['السماء'] },
  { surah: 51, range: [23, 23], by: ['رب'] },
  { surah: 52, range: [1, 6], by: ['الطور', 'كتاب', 'البيت', 'البحر'] },
  { surah: 53, range: [1, 1], by: ['النجم'] },
  { surah: 56, range: [75, 75], by: ['النجوم'] },
  { surah: 64, range: [7, 7], by: ['رب'] },
  { surah: 68, range: [1, 1], by: ['القلم'] },
  { surah: 69, range: [38, 39], by: ['ما'] },
  { surah: 70, range: [40, 40], by: ['رب'] },
  { surah: 74, range: [32, 34], by: ['القمر', 'الليل', 'الصبح'] },
  { surah: 75, range: [1, 2], by: ['القيامة', 'النفس'] },
  { surah: 77, range: [1, 6], by: ['المرسلات', 'العاصفات', 'الناشرات', 'الفارقات', 'الملقيات'] },
  { surah: 79, range: [1, 5], by: ['النازعات', 'الناشطات', 'السابحات', 'السابقات', 'المدبرات'] },
  { surah: 81, range: [15, 18], by: ['الخنس', 'الجوار', 'الكنس', 'الليل', 'الصبح'] },
  { surah: 84, range: [16, 18], by: ['الشفق', 'الليل', 'ما', 'القمر'] },
  { surah: 85, range: [1, 3], by: ['السماء', 'اليوم', 'شاهد', 'مشهود'] },
  { surah: 86, range: [1, 3], by: ['السماء', 'الطارق'] },
  { surah: 86, range: [11, 12], by: ['السماء', 'الارض'] },
  { surah: 89, range: [1, 4], by: ['الفجر', 'ليال', 'الشفع', 'الوتر', 'الليل'] },
  { surah: 90, range: [1, 3], by: ['البلد', 'والد', 'ما'] },
  { surah: 91, range: [1, 7], by: ['الشمس', 'القمر', 'النهار', 'الليل', 'السماء', 'الارض', 'نفس', 'ما'] },
  { surah: 92, range: [1, 3], by: ['الليل', 'النهار', 'ما'] },
  { surah: 93, range: [1, 2], by: ['الضحى', 'الليل'] },
  { surah: 95, range: [1, 3], by: ['التين', 'الزيتون', 'طور', 'البلد'] },
  { surah: 100, range: [1, 5], by: ['العاديات', 'الموريات', 'المغيرات'] },
  { surah: 103, range: [1, 1], by: ['العصر'] },
];

export type OathData = { names: Record<number, string>; ayat: Record<string, string> };
export type OathLine = { ayah: number; text: string };
export type OathView = { n: number; surah: number; name: string; range: Range; lines: OathLine[]; by: string[] };
export type WordLine = { id: string; first: number; last: number; has: Set<number> };

export function buildOaths({ names, ayat }: OathData): { oaths: OathView[]; lines: WordLine[] } {
  const oaths = OATHS.map(({ surah, range: [lo, hi], by }, i) => ({
    n: i + 1,
    surah,
    name: plainName(names[surah] ?? ''),
    range: [lo, hi] as Range,
    by,
    lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
      const text = ayat[`${surah}:${lo + k}`];
      if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
      return { ayah: lo + k, text: ayahWords(text, false).display.join(' ') };
    }),
  }));
  const carriers = new Map<string, number[]>();
  for (const o of oaths) for (const w of new Set(o.by)) carriers.set(w, [...(carriers.get(w) ?? []), o.n]);
  const lines = [...carriers]
    .filter(([, ns]) => ns.length > 1)
    .map(([id, ns]) => ({ id, first: ns[0], last: ns[ns.length - 1], has: new Set(ns) }))
    .sort((a, b) => b.has.size - a.has.size || a.first - b.first);
  return { oaths, lines };
}
