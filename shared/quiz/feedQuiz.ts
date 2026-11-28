import type { Random } from './random';
import type { QuizTopic } from './settings';

export const OPENINGS = 'OPENINGS';
export type FeedQuizKind = QuizTopic | typeof OPENINGS;

export const FEED_QUIZ_KINDS = ['SURAH', 'ORDER', 'ORDER_JUZ', 'SURAH_AIM', 'BRANCHES', 'RECITE', 'COMPARE', OPENINGS, 'MEANING', 'TAFSIR', 'BALAGHA', 'TERM', 'IRAB', 'QIRAAT', 'QIRAAT_WHO', 'TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE', 'TARAJIM_NASAB', 'TARAJIM_NASAB_FILL', 'TARAJIM_VIRTUE', 'TARAJIM_TIE', 'TARAJIM_LIFE', 'TARAJIM_LAQAB', 'TARAJIM_KUNYA', 'PROPHET_NAMES', 'PROPHET_STORY', 'SIRA', 'HADITH_NARRATOR', 'HADITH_COMPLETE', 'HADITH_BOOK', 'HADITH_CHAIN', 'SAHIH_KITAB', 'ADHKAR_COMPLETE', 'ATLAS_WHERE'] as const satisfies readonly FeedQuizKind[];
export type FeedKind = (typeof FEED_QUIZ_KINDS)[number];

export const FEED_QUIZ_NAMES: Record<FeedQuizKind & string, string> = {
  SURAH: 'في أي سورة؟', ORDER: 'رتّب السور', ORDER_JUZ: 'رتّب سور الجزء', SURAH_AIM: 'ما مقصود هذه السورة؟', BRANCHES: 'أكمل المتشابهات', RECITE: 'سمّع بقية الآية', COMPARE: 'قارن الموضعين', [OPENINGS]: 'أوائل السور', ENDS: 'سمّع الآية', MEANING: 'ما معنى؟',
  TAFSIR: 'لأي آية هذا التفسير؟', BALAGHA: 'ما الأسلوب؟', TERM: 'ما المصطلح؟', IRAB: 'ما إعرابها؟', QIRAAT: 'كيف يقرؤها؟', QIRAAT_WHO: 'مَن يقرأ هكذا؟',
  TUHFA_COMPLETE: 'التحفة: أكمل البيت', TUHFA_NEXT: 'التحفة: البيت التالي', TUHFA_RULE: 'التحفة: حكم الحرف',
  TARAJIM_NASAB: 'أين يلتقي النسبان؟', TARAJIM_NASAB_FILL: 'أكمل النسب', TARAJIM_VIRTUE: 'صاحب المنقبة', TARAJIM_TIE: 'ما صلته به؟', TARAJIM_LIFE: 'في أي سنة كان؟', TARAJIM_LAQAB: 'بمَ لُقّب؟', TARAJIM_KUNYA: 'ما كنيته؟', PROPHET_NAMES: 'أسماء النبي ﷺ', PROPHET_STORY: 'في قصة مَن هذه الآية؟', SIRA: 'السيرة والغزوات',
  HADITH_NARRATOR: 'من راوي الحديث؟', HADITH_COMPLETE: 'أكمل الحديث', HADITH_BOOK: 'من أخرجه؟', HADITH_CHAIN: 'من حدّث به؟', SAHIH_KITAB: 'في أيّ كتاب؟',
  ADHKAR_COMPLETE: 'أكمل الذكر', ATLAS_WHERE: 'أين كانت؟',
} as Record<FeedQuizKind & string, string>;

export const feedQuizKind = (day: number, slot: number) => FEED_QUIZ_KINDS[(((day + slot) % FEED_QUIZ_KINDS.length) + FEED_QUIZ_KINDS.length) % FEED_QUIZ_KINDS.length];

export function seededRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const feedQuizSeed = (day: number, slot: number) => day * 1000 + slot;

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => i + 1);

export const openingSurah = (seed: number, surahs: readonly number[] = ALL_SURAHS) =>
  surahs.length ? surahs[Math.floor(seededRandom(seed)() * surahs.length)] : null;
