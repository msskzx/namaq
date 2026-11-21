// The home feed's question cards (owner, 2026-11-14): every Quran quiz kind takes its turn, one question a card.
import type { Random } from './random';
import type { QuizTopic } from './settings';

/** The surah openings kind (write a surah's first ayah); the feed draws it as its own card (OpeningPost). */
export const OPENINGS = 'OPENINGS';
export type FeedQuizKind = QuizTopic | typeof OPENINGS;

/** The kinds in the order they take turns: the Quran's, then the tarajim's three built on the converted entries, then the sira stories and battles, then the hadith (owner, 2026-11-18). */
export const FEED_QUIZ_KINDS: readonly FeedQuizKind[] = ['SURAH', 'ORDER', 'ORDER_JUZ', 'SURAH_AIM', 'BRANCHES', 'RECITE', 'COMPARE', OPENINGS, 'MEANING', 'TAFSIR', 'BALAGHA', 'TERM', 'IRAB', 'QIRAAT', 'QIRAAT_WHO', 'TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE', 'TARAJIM_NASAB', 'TARAJIM_NASAB_FILL', 'TARAJIM_VIRTUE', 'TARAJIM_TIE', 'TARAJIM_LIFE', 'TARAJIM_LAQAB', 'TARAJIM_KUNYA', 'PROPHET_NAMES', 'SIRA', 'HADITH_NARRATOR', 'HADITH_COMPLETE', 'HADITH_BOOK', 'HADITH_CHAIN', 'SAHIH_KITAB'];

/** Each kind's card title, the quiz's own names for them (shared/quiz/kinds.ts), without loading the kinds' data. */
export const FEED_QUIZ_NAMES: Record<FeedQuizKind & string, string> = {
  SURAH: 'في أي سورة؟', ORDER: 'رتّب السور', ORDER_JUZ: 'رتّب سور الجزء', SURAH_AIM: 'ما مقصود هذه السورة؟', BRANCHES: 'أكمل المتشابهات', RECITE: 'سمّع بقية الآية', COMPARE: 'قارن الموضعين', [OPENINGS]: 'أوائل السور', ENDS: 'سمّع الآية', MEANING: 'ما معنى؟',
  TAFSIR: 'لأي آية هذا التفسير؟', BALAGHA: 'ما الأسلوب؟', TERM: 'ما المصطلح؟', IRAB: 'ما إعرابها؟', QIRAAT: 'كيف يقرؤها؟', QIRAAT_WHO: 'مَن يقرأ هكذا؟',
  TUHFA_COMPLETE: 'التحفة: أكمل البيت', TUHFA_NEXT: 'التحفة: البيت التالي', TUHFA_RULE: 'التحفة: حكم الحرف',
  TARAJIM_NASAB: 'أين يلتقي النسبان؟', TARAJIM_NASAB_FILL: 'أكمل النسب', TARAJIM_VIRTUE: 'صاحب المنقبة', TARAJIM_TIE: 'ما صلته به؟', TARAJIM_LIFE: 'في أي سنة كان؟', TARAJIM_LAQAB: 'بمَ لُقّب؟', TARAJIM_KUNYA: 'ما كنيته؟', PROPHET_NAMES: 'أسماء النبي ﷺ', SIRA: 'السيرة والغزوات',
  HADITH_NARRATOR: 'من راوي الحديث؟', HADITH_COMPLETE: 'أكمل الحديث', HADITH_BOOK: 'من أخرجه؟', HADITH_CHAIN: 'من حدّث به؟', SAHIH_KITAB: 'في أيّ كتاب؟',
} as Record<FeedQuizKind & string, string>;

/** The kind of the feed's question card in batch `slot` on a day: the turn moves on one kind a day, so each day starts elsewhere. */
export const feedQuizKind = (day: number, slot: number) => FEED_QUIZ_KINDS[(((day + slot) % FEED_QUIZ_KINDS.length) + FEED_QUIZ_KINDS.length) % FEED_QUIZ_KINDS.length];

/** A random source from a number, the same numbers every time (mulberry32), so a card asks the same question all day. */
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

/** The seed of the question card in batch `slot` on a day. */
export const feedQuizSeed = (day: number, slot: number) => day * 1000 + slot;

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => i + 1);

/** The surah whose opening the card asks, by the card's seed: any of the 114, or of `surahs` (those memorized) when given. */
export const openingSurah = (seed: number, surahs: readonly number[] = ALL_SURAHS) =>
  surahs.length ? surahs[Math.floor(seededRandom(seed)() * surahs.length)] : null;
