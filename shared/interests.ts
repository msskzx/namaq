import { keyStore } from './storage';
import { FEED_QUIZ_KINDS, type FeedQuizKind } from './quiz/feedQuiz';

export const SECTIONS = [
  { id: 'quran', name: 'علوم القرآن', ours: false },
  { id: 'lisan', name: 'علوم اللسان العربي', ours: false },
  { id: 'hadith', name: 'علوم الحديث', ours: false },
  { id: 'history', name: 'السيرة والتاريخ', ours: true },
] as const;
export type SectionId = (typeof SECTIONS)[number]['id'];

export const DRAWING_CARD_KINDS = ['nasab', 'ties', 'battle', 'hadith-scene', 'opening', 'oath', 'event', 'surah-link', 'surah-aim'] as const;
export type DrawingCardKind = (typeof DRAWING_CARD_KINDS)[number];

export const PHONE_ONLY_KINDS = ['adhkar', 'gharib', 'tuhfa', 'mashahid', 'battle-year', 'battle-armies', 'group', 'lives', 'meet', 'ring'] as const;

export const FEED_CARD_KINDS = ['pair', 'tree', 'note-tafsir', 'note-qiraat', 'note-irab', 'note-balagha', 'term', 'scene',
  'hadith', 'rajab', 'recorded', 'isnad', 'bukhari', 'muslim', 'prophets', 'sira', 'moment', 'tarajim', 'tie', 'life', 'laqab', 'kunya', ...DRAWING_CARD_KINDS,
  ...PHONE_ONLY_KINDS] as const;
export type FeedCardKind = (typeof FEED_CARD_KINDS)[number];

export const onWebsite = (interest: Interest): Interest => ({ ...interest, cards: interest.cards.filter(kind => !(PHONE_ONLY_KINDS as readonly FeedCardKind[]).includes(kind)) });

export const DRAWN_KINDS: readonly FeedCardKind[] = ['pair', 'tree', 'isnad', 'recorded', 'prophets', 'tie', 'life', ...DRAWING_CARD_KINDS, ...PHONE_ONLY_KINDS];

export type Interest = {
  id: string; name: string; section: SectionId;
  ours?: boolean;
  cards: readonly FeedCardKind[]; quizzes: readonly FeedQuizKind[];
};

export const INTERESTS: readonly Interest[] = [
  { id: 'hifz', name: 'الحفظ والمراجعة', section: 'quran', ours: true, cards: ['opening'], quizzes: ['RECITE', 'OPENINGS', 'SURAH', 'ORDER', 'ORDER_JUZ'] },
  { id: 'tanasub', name: 'تناسب السور', section: 'quran', cards: ['surah-link', 'surah-aim'], quizzes: ['SURAH_AIM'] },
  { id: 'mutashabih', name: 'المتشابه اللفظي', section: 'quran', ours: true, cards: ['pair', 'tree'], quizzes: ['BRANCHES', 'COMPARE'] },
  { id: 'tafsir', name: 'التفسير', section: 'quran', cards: ['note-tafsir', 'oath', 'mashahid'], quizzes: ['TAFSIR'] },
  { id: 'gharib', name: 'غريب القرآن', section: 'quran', ours: true, cards: ['gharib'], quizzes: ['MEANING'] },
  { id: 'qiraat', name: 'القراءات', section: 'quran', cards: ['note-qiraat'], quizzes: ['QIRAAT', 'QIRAAT_WHO'] },
  { id: 'tajwid', name: 'التجويد', section: 'quran', ours: true, cards: ['tuhfa'], quizzes: ['TUHFA_COMPLETE', 'TUHFA_NEXT', 'TUHFA_RULE'] },
  { id: 'irab', name: 'الإعراب', section: 'lisan', cards: ['note-irab'], quizzes: ['IRAB'] },
  { id: 'balagha', name: 'البلاغة', section: 'lisan', cards: ['note-balagha', 'term', 'scene'], quizzes: ['BALAGHA', 'TERM'] },
  { id: 'hadith', name: 'الحديث', section: 'hadith', cards: ['hadith', 'rajab', 'recorded', 'isnad', 'bukhari', 'muslim', 'hadith-scene'], quizzes: ['HADITH_NARRATOR', 'HADITH_COMPLETE', 'HADITH_BOOK', 'HADITH_CHAIN', 'SAHIH_KITAB'] },
  { id: 'adhkar', name: 'الأذكار', section: 'hadith', cards: ['adhkar'], quizzes: ['ADHKAR_COMPLETE'] },
  { id: 'prophets', name: 'قصص الأنبياء', section: 'history', ours: true, cards: ['prophets', 'event'], quizzes: ['PROPHET_STORY'] },
  { id: 'sira', name: 'السيرة والمغازي', section: 'history', cards: ['sira', 'moment', 'battle', 'battle-year', 'battle-armies'], quizzes: ['SIRA', 'PROPHET_NAMES', 'ATLAS_WHERE'] },
  { id: 'tarajim', name: 'التراجم', section: 'history', cards: ['tarajim', 'tie', 'life', 'nasab', 'ties', 'group', 'lives', 'meet', 'ring'], quizzes: ['TARAJIM_NASAB', 'TARAJIM_NASAB_FILL', 'TARAJIM_VIRTUE', 'TARAJIM_TIE', 'TARAJIM_LIFE'] },
  { id: 'laqab', name: 'الألقاب', section: 'history', cards: ['laqab'], quizzes: ['TARAJIM_LAQAB'] },
  { id: 'kunya', name: 'الكنى', section: 'history', cards: ['kunya'], quizzes: ['TARAJIM_KUNYA'] },
];

export const interestById = (id: string) => INTERESTS.find(interest => interest.id === id);
export const interestOf = (kind: FeedCardKind | FeedQuizKind) => INTERESTS.find(interest => (interest.cards as readonly string[]).includes(kind) || (interest.quizzes as readonly string[]).includes(kind));

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

export const pickedInterests = {
  read: picked.read, subscribe: picked.subscribe, server: () => [] as readonly string[],
  write: (list: readonly string[]) => picked.write(JSON.stringify(INTERESTS.filter(interest => list.includes(interest.id)).map(interest => interest.id))),
};
export const interestsAsked = { read: asked.read, subscribe: asked.subscribe, server: () => true, write: () => asked.write('1') };
export const surpriseMe = { read: surprise.read, subscribe: surprise.subscribe, server: () => true, write: (on: boolean) => surprise.write(on ? '1' : '0') };

export const toggledInterest = (list: readonly string[], id: string) => (list.includes(id) ? list.filter(other => other !== id) : [...list, id]);
export const restoredInterest = (list: readonly string[], id: string) => (list.includes(id) ? [...list] : [...list, id]);

export const activeInterests = (list: readonly string[], kinds: (interest: Interest) => boolean = () => true) => {
  const usable = INTERESTS.filter(kinds);
  const chosen = usable.filter(interest => list.includes(interest.id));
  return chosen.length ? chosen : usable;
};
