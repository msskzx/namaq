// What the reader came for (owner, 2026-11-19; plan «Plan: a better home feed with interests»): the home feed comes in turns
// by these, and every feed card and question kind belongs to exactly one of them (shared/interests.test.ts).
import { keyStore } from './storage';
import { FEED_QUIZ_KINDS, type FeedQuizKind } from './quiz/feedQuiz';

/**
 * The sections, as Ibn Khaldun names the transmitted and language sciences in the Muqaddimah (book 1, chapter 6, sections 4
 * to 6). «السيرة والتاريخ» is ours: he does not count history among them.
 */
export const SECTIONS = [
  { id: 'quran', name: 'علوم القرآن', ours: false },
  { id: 'lisan', name: 'علوم اللسان العربي', ours: false },
  { id: 'hadith', name: 'علوم الحديث', ours: false },
  { id: 'history', name: 'السيرة والتاريخ', ours: true },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

/** The feed's content cards, by kind; each app card (mobile/src/components/HomeFeed.tsx) draws one. */
export const FEED_CARD_KINDS = ['pair', 'tree', 'note-tafsir', 'note-qiraat', 'note-irab', 'note-balagha', 'term', 'scene',
  'hadith', 'rajab', 'prophets', 'sira', 'moment', 'tarajim', 'tie'] as const;
export type FeedCardKind = (typeof FEED_CARD_KINDS)[number];

export type Interest = {
  id: string; name: string; section: SectionId;
  /** A chip of ours, not a science's own heading (marked in the plan). */
  ours?: boolean;
  cards: readonly FeedCardKind[]; quizzes: readonly FeedQuizKind[];
};

export const INTERESTS: readonly Interest[] = [
  { id: 'hifz', name: 'الحفظ والمراجعة', section: 'quran', ours: true, cards: [], quizzes: ['RECITE', 'OPENINGS', 'SURAH'] },
  { id: 'mutashabih', name: 'المتشابه اللفظي', section: 'quran', ours: true, cards: ['pair', 'tree'], quizzes: ['BRANCHES', 'COMPARE'] },
  { id: 'tafsir', name: 'التفسير', section: 'quran', cards: ['note-tafsir'], quizzes: ['TAFSIR'] },
  { id: 'gharib', name: 'غريب القرآن', section: 'quran', ours: true, cards: [], quizzes: ['MEANING'] },
  { id: 'qiraat', name: 'القراءات', section: 'quran', cards: ['note-qiraat'], quizzes: ['QIRAAT', 'QIRAAT_WHO'] },
  { id: 'tajwid', name: 'التجويد', section: 'quran', ours: true, cards: [], quizzes: ['TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE'] },
  { id: 'irab', name: 'الإعراب', section: 'lisan', cards: ['note-irab'], quizzes: ['IRAB'] },
  { id: 'balagha', name: 'البلاغة', section: 'lisan', cards: ['note-balagha', 'term', 'scene'], quizzes: ['BALAGHA', 'TERM'] },
  { id: 'hadith', name: 'الحديث', section: 'hadith', cards: ['hadith', 'rajab'], quizzes: ['HADITH_NARRATOR', 'HADITH_COMPLETE', 'HADITH_BOOK'] },
  { id: 'prophets', name: 'قصص الأنبياء', section: 'history', ours: true, cards: ['prophets'], quizzes: [] },
  { id: 'sira', name: 'السيرة والمغازي', section: 'history', cards: ['sira', 'moment'], quizzes: ['SIRA'] },
  { id: 'tarajim', name: 'التراجم', section: 'history', cards: ['tarajim', 'tie'], quizzes: ['TARAJIM_NASAB', 'TARAJIM_VIRTUE', 'TARAJIM_TIE'] },
];

export const interestById = (id: string) => INTERESTS.find(interest => interest.id === id);
/** The interest a card or question kind belongs to. */
export const interestOf = (kind: FeedCardKind | FeedQuizKind) => INTERESTS.find(interest => (interest.cards as readonly string[]).includes(kind) || (interest.quizzes as readonly string[]).includes(kind));

/** Every question kind the feed asks is some interest's (the guard reads this). */
export const UNPLACED_QUIZ_KINDS = FEED_QUIZ_KINDS.filter(kind => !interestOf(kind));

const ids = new Set(INTERESTS.map(interest => interest.id));
function parsePicked(raw: string | null): readonly string[] {
  try {
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((id): id is string => typeof id === 'string' && ids.has(id)) : [];
  } catch { return []; }
}
const picked = keyStore('interests', parsePicked);
const asked = keyStore('interests-asked', raw => raw === '1');
const surprise = keyStore('interests-surprise', raw => raw !== '0');

/** The interests picked on this device, in the list's order; none picked means all of them. */
export const pickedInterests = {
  read: picked.read, subscribe: picked.subscribe, server: () => [] as readonly string[],
  write: (list: readonly string[]) => picked.write(JSON.stringify(INTERESTS.filter(interest => list.includes(interest.id)).map(interest => interest.id))),
};
/** The first-open picker was answered or skipped. */
export const interestsAsked = { read: asked.read, subscribe: asked.subscribe, server: () => true, write: () => asked.write('1') };
/** «فاجئني من غير اهتماماتي» (owner, 2026-11-19: on by default): one card a round from an interest not picked. */
export const surpriseMe = { read: surprise.read, subscribe: surprise.subscribe, server: () => true, write: (on: boolean) => surprise.write(on ? '1' : '0') };

/** Picks `id` or puts it back, keeping the rest. */
export const toggledInterest = (list: readonly string[], id: string) => (list.includes(id) ? list.filter(other => other !== id) : [...list, id]);

/** The interests the feed brings: those picked, or all when none is. */
export const activeInterests = (list: readonly string[], kinds: (interest: Interest) => boolean = () => true) => {
  const usable = INTERESTS.filter(kinds);
  const chosen = usable.filter(interest => list.includes(interest.id));
  return chosen.length ? chosen : usable;
};
