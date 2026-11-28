import { nextPrayer, type PrayerDay, type PrayerKey } from './prayer';
import { counted } from './quran/arabicNumber';
import type { FeedQuizKind } from './quiz/feedQuiz';
import { DRAWING_CARD_KINDS, DRAWN_KINDS, type FeedCardKind, type Interest } from './interests';

export const hasJuzCard = (slot: number) => slot === 0;
export const hasBooksCard = (slot: number) => slot % 4 === 1;

export const isKahfDay = (now: Date) => now.getDay() === 5;
export const KAHF_SLOT = 1;

export const CARD_CAP_SHARE = 2 / 3;

export function feedBooks<T extends { id: string }>(books: readonly T[], hasFasila: (id: string) => boolean, day: number, count = 4): T[] {
  const marked = books.filter(book => hasFasila(book.id));
  const rest = books.filter(book => !hasFasila(book.id));
  const turn = rest.length ? ((day % rest.length) + rest.length) % rest.length : 0;
  return [...marked, ...rest.slice(turn), ...rest.slice(0, turn)].slice(0, count);
}

export const PRAYER_SOON_MINUTES = 30;

export function prayerSoon(day: PrayerDay, now: Date, within = PRAYER_SOON_MINUTES): { key: Exclude<PrayerKey, 'sunrise'>; minutes: number } | null {
  const key = nextPrayer(day, now);
  if (!key) return null;
  const minutes = Math.ceil((day[key].getTime() - now.getTime()) / 60_000);
  return minutes >= 0 && minutes <= within ? { key, minutes } : null;
}

export function inMinutes(minutes: number) {
  if (minutes <= 0) return 'الآن';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const parts = [hours ? counted(hours, ['ساعة', 'ساعتين', 'ساعات']) : '', rest ? counted(rest, ['دقيقة', 'دقيقتين', 'دقائق']) : ''].filter(Boolean);
  return `بعد ${parts.join(' و')}`;
}

export function insertAt(tops: readonly number[], screenBottom: number): number {
  const at = tops.findIndex(top => top >= screenBottom);
  return at === -1 ? tops.length : at;
}

export const allVirtues = <P extends { slug: string; virtues: readonly unknown[] }>(people: readonly P[]) =>
  people.flatMap(person => person.virtues.map((_, index) => ({ person, index })));

export type FeedSlot = { interest: string; kind: FeedCardKind | FeedQuizKind; quiz: boolean; surprise?: true };

const spin = (n: number, count: number) => ((n % count) + count) % count;

function shuffled<T>(list: readonly T[], seed: number): T[] {
  const out = [...list];
  let state = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function slotOf(interest: Interest, at: number, round: number, day: number, cardOnly = false): FeedSlot | null {
  const { cards, quizzes } = interest;
  if (!cards.length && !quizzes.length) return null;
  const both = cards.length > 0 && quizzes.length > 0;
  const quiz = cardOnly && cards.length ? false : both ? (round + at) % 2 === 1 : quizzes.length > 0;
  const turn = both ? Math.floor((round + (at % 2)) / 2) : round;
  if (quiz) return { interest: interest.id, kind: quizzes[spin(turn + day, quizzes.length)], quiz };
  const drawn = cards.filter(kind => DRAWN_KINDS.includes(kind));
  const text = cards.filter(kind => !DRAWN_KINDS.includes(kind));
  const list = !drawn.length || !text.length ? cards : spin(turn + day, 2) === 0 ? drawn : text;
  const own = list === cards ? turn : Math.floor((turn + spin(day, 2)) / 2);
  return { interest: interest.id, kind: list[spin(own + day, list.length)], quiz };
}

function plainRound(interests: readonly Interest[], round: number, day: number): FeedSlot[] {
  const slots = interests.flatMap((interest, at) => slotOf(interest, at, round, day) ?? []);
  const count = (quiz: boolean) => slots.filter(slot => slot.quiz === quiz).length;
  const seed = day * 7919 + round * 104729;
  for (const i of shuffled(slots.map((_, at) => at), seed + 2)) {
    if (count(true) <= count(false) + 1) break;
    const interest = interests.find(item => item.id === slots[i].interest)!;
    if (slots[i].quiz && interest.cards.length) slots[i] = slotOf(interest, interests.indexOf(interest), round, day, true)!;
  }
  const cards = shuffled(slots.filter(slot => !slot.quiz), seed);
  const quizzes = shuffled(slots.filter(slot => slot.quiz), seed + 1);
  const out: FeedSlot[] = [];
  let card = 0;
  let quiz = 0;
  while (cards.length - card > quizzes.length - quiz) out.push(cards[card++]);
  if (quizzes.length - quiz > cards.length - card) out.push(quizzes[quiz++]);
  while (card < cards.length) out.push(cards[card++], quizzes[quiz++]);
  while (quiz < quizzes.length) out.push(quizzes[quiz++]);
  return out;
}

export function feedRound(interests: readonly Interest[], round: number, day: number, others: readonly Interest[] = []): FeedSlot[] {
  const slots = plainRound(interests, round, day);
  if (round > 0 && slots.length > 1) {
    const before = plainRound(interests, round - 1, day);
    const last = before[before.length - 1]?.interest;
    if (slots[0].interest === last) {
      const swap = slots.findIndex((slot, i) => i > 0 && i < slots.length - 1 && slot.quiz === slots[0].quiz && slot.interest !== last);
      if (swap > 0) [slots[0], slots[swap]] = [slots[swap], slots[0]];
    }
  }
  if (others.length) {
    const other = others[spin(round + day, others.length)];
    const extra = slotOf(other, 0, other.cards.length ? round * 2 : round, day);
    if (extra) {
      const fits = (at: number) => !extra.quiz || (!slots[at - 1]?.quiz && !slots[at]?.quiz);
      const middle = Math.ceil(slots.length / 2);
      const at = [...Array(slots.length + 1).keys()].sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle)).find(fits);
      const place = at ?? middle;
      slots.splice(place, 0, { ...(at === undefined && extra.quiz ? slotOf(other, 0, round, day, true) ?? extra : extra), surprise: true });
    }
  }
  return slots;
}

export const dayStart = (count: number, day: number, salt: number) => (count ? spin(day * 7 + salt * 13, count) : 0);

export const LIST_KINDS = ['note-tafsir', 'note-qiraat', 'note-irab', 'note-balagha', 'term', 'scene', 'mashahid', 'hadith', 'bukhari', 'muslim', 'rajab',
  'recorded', 'isnad', 'prophets', 'sira', 'moment', 'tarajim', 'tie', 'laqab', 'kunya', 'life', ...DRAWING_CARD_KINDS, 'battle-year', 'battle-armies', 'group', 'lives', 'meet', 'ring', 'gharib', 'tuhfa', 'adhkar'] as const satisfies readonly FeedCardKind[];
export type ListKind = (typeof LIST_KINDS)[number];

export const listStart = (list: readonly string[], kind: ListKind, day: number, after?: string) =>
  after !== undefined && list.includes(after) ? list.indexOf(after) + 1 : dayStart(list.length, day, LIST_KINDS.indexOf(kind));
