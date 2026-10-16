import type { Range } from './curatedShifts';
import { ayahWords, plainName } from './normalize';

// docs/plans/quran-musa-timeline.md
export type Segment = { surah: number; range: Range };
export const PHASES = ['النشأة', 'الرسالة', 'الخروج', 'قومه بنو إسرائيل', 'علمه وكتابه'] as const;
export type MusaEvent = { title: string; segments: Segment[]; phase: number };

const s = (surah: number, lo: number, hi = lo): Segment => ({ surah, range: [lo, hi] });

export const MUSA_EVENTS: MusaEvent[] = [
  { phase: 0, title: 'أم موسى والتابوت في اليم', segments: [s(28, 3, 13), s(20, 37, 40), s(66, 11)] },
  { phase: 0, title: 'قتل المصري والخروج من مصر', segments: [s(28, 14, 21)] },
  { phase: 0, title: 'مدين: بنتا الشيخ والأجل', segments: [s(28, 22, 28)] },
  { phase: 1, title: 'النداء من جانب الطور', segments: [s(28, 29, 35), s(20, 9, 36), s(27, 7, 12), s(26, 10, 17), s(19, 51, 53), s(79, 15, 16), s(28, 44, 46)] },
  { phase: 1, title: 'الذهاب إلى فرعون والآيات', segments: [s(20, 41, 55), s(26, 18, 33), s(79, 17, 19), s(7, 103, 108), s(10, 75, 78), s(14, 5, 8), s(11, 96, 99), s(23, 45, 48), s(27, 13, 14), s(28, 36, 42), s(40, 23, 24), s(43, 46, 48), s(51, 38, 39), s(73, 15, 16), s(17, 101, 102)] },
  { phase: 1, title: 'السحرة يؤمنون', segments: [s(7, 109, 126), s(10, 79, 82), s(20, 56, 76), s(26, 34, 51)] },
  { phase: 1, title: 'الآيات والتهديد بالقتل', segments: [s(7, 127, 135), s(43, 49, 54)] },
  { phase: 1, title: 'مؤمن آل فرعون', segments: [s(40, 25, 46)] },
  { phase: 2, title: 'إيمان الذرية والدعاء على فرعون', segments: [s(10, 83, 89)] },
  { phase: 2, title: 'إغراق فرعون وجنوده', segments: [s(20, 77, 79), s(26, 52, 68), s(10, 90, 92), s(2, 49, 50), s(7, 136, 137), s(17, 103), s(43, 55, 56), s(44, 17, 33), s(51, 40), s(54, 41, 42), s(69, 9, 10), s(79, 20, 26)] },
  { phase: 2, title: 'فرعون وآله بين الأمم المكذبة', segments: [s(3, 11), s(8, 52), s(8, 54), s(38, 12), s(50, 13), s(85, 17, 18), s(89, 10)] },
  { phase: 3, title: 'بعد النجاة: طلب إله', segments: [s(7, 138, 141), s(20, 80, 82), s(10, 93), s(17, 104)] },
  { phase: 3, title: 'نعمة الله على بني إسرائيل وميثاقه', segments: [s(2, 40), s(2, 47), s(2, 83), s(2, 122), s(2, 211), s(5, 12), s(5, 32), s(5, 70), s(45, 16, 17)] },
  { phase: 3, title: 'المن والسلوى والماء', segments: [s(2, 57), s(2, 60, 61), s(7, 160)] },
  { phase: 3, title: 'ميقات ربه وطلب الرؤية', segments: [s(7, 142, 147), s(20, 83, 84)] },
  { phase: 3, title: 'العجل والسامري', segments: [s(7, 148, 153), s(20, 85, 98), s(2, 51, 54), s(2, 92, 93), s(4, 153, 154)] },
  { phase: 3, title: 'الألواح والسبعون ورفع الطور', segments: [s(7, 154, 156), s(7, 159), s(2, 55, 56), s(2, 63, 64), s(7, 171)] },
  { phase: 3, title: 'الأرض المقدسة والتيه', segments: [s(5, 20, 26)] },
  { phase: 3, title: 'دخول القرية والحطة', segments: [s(2, 58, 59), s(7, 161, 162)] },
  { phase: 3, title: 'البقرة', segments: [s(2, 67, 73)] },
  { phase: 3, title: 'قارون من قوم موسى', segments: [s(28, 76, 82), s(29, 39)] },
  { phase: 3, title: 'أذى قومه وبراءته', segments: [s(33, 69), s(61, 5)] },
  { phase: 4, title: 'موسى والعبد الصالح', segments: [s(18, 60, 82)] },
  { phase: 4, title: 'اسمه بين الأنبياء والأمم', segments: [s(2, 246), s(2, 248), s(22, 44), s(33, 7)] },
  {
    phase: 4,
    title: 'الكتاب الذي أوتيه موسى',
    segments: [s(5, 44, 45), s(2, 87), s(2, 108), s(2, 136), s(3, 84), s(4, 164), s(6, 84), s(6, 91), s(6, 154), s(11, 17), s(11, 110), s(17, 2), s(21, 48), s(23, 49), s(25, 35, 36), s(28, 43), s(28, 48, 49), s(32, 23), s(37, 114, 122), s(40, 53, 54), s(41, 45), s(42, 13), s(46, 12), s(46, 30), s(53, 36, 37), s(87, 18, 19)],
  },
];

export type MusaData = { names: Record<number, string>; ayat: Record<string, string> };
export type MusaLine = { ayah: number; text: string };
export type MusaSegmentView = { surah: number; name: string; range: Range; lines: MusaLine[] };
export type MusaEventView = { n: number; title: string; phase: number; segments: MusaSegmentView[]; count: number };

export function buildMusa({ names, ayat }: MusaData): MusaEventView[] {
  return MUSA_EVENTS.map(({ title, phase, segments }, i) => {
    const views = segments.map(({ surah, range: [lo, hi] }) => ({
      surah,
      name: plainName(names[surah] ?? ''),
      range: [lo, hi] as Range,
      lines: Array.from({ length: hi - lo + 1 }, (_, k) => {
        const text = ayat[`${surah}:${lo + k}`];
        if (text === undefined) throw new Error(`${surah}:${lo + k} is missing from the data`);
        return { ayah: lo + k, text: ayahWords(text, false).display.join(' ') };
      }),
    }));
    return { n: i + 1, title, phase, segments: views, count: views.reduce((t, v) => t + v.lines.length, 0) };
  });
}
