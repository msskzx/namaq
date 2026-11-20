import { nextPrayer, type PrayerDay, type PrayerKey } from './prayer';
import { counted } from './quran/arabicNumber';
import type { FeedQuizKind } from './quiz/feedQuiz';
import type { FeedCardKind, Interest } from './interests';

/**
 * The reader's own cards, not any interest's (owner, 2026-11-18/19): today's juz in the feed's first round, the books on
 * every fourth from the second.
 */
export const hasJuzCard = (slot: number) => slot === 0;
export const hasBooksCard = (slot: number) => slot % 4 === 1;

/**
 * On a Friday (by the reader's own clock) Surat al-Kahf comes as the feed's second card (owner, 2026-11-20), a card to open
 * the mushaf at its first page.
 */
export const isKahfDay = (now: Date) => now.getDay() === 5;
export const KAHF_SLOT = 1;

/** A few books for the books card: those with a فاصلة first, then the others turning by the day. */
export function feedBooks<T extends { id: string }>(books: readonly T[], hasFasila: (id: string) => boolean, day: number, count = 4): T[] {
  const marked = books.filter(book => hasFasila(book.id));
  const rest = books.filter(book => !hasFasila(book.id));
  const turn = rest.length ? ((day % rest.length) + rest.length) % rest.length : 0;
  return [...marked, ...rest.slice(turn), ...rest.slice(0, turn)].slice(0, count);
}

/** How near a prayer must be for its card to come into the feed. */
export const PRAYER_SOON_MINUTES = 30;

/** The next of the five prayers when it is at most `within` minutes away, with the whole minutes left (rounded up). */
export function prayerSoon(day: PrayerDay, now: Date, within = PRAYER_SOON_MINUTES): { key: Exclude<PrayerKey, 'sunrise'>; minutes: number } | null {
  const key = nextPrayer(day, now);
  if (!key) return null;
  const minutes = Math.ceil((day[key].getTime() - now.getTime()) / 60_000);
  return minutes >= 0 && minutes <= within ? { key, minutes } : null;
}

/** «بعد ١٨ دقيقة», «بعد دقيقة», «بعد دقيقتين», «الآن». */
export const inMinutes = (minutes: number) => (minutes <= 0 ? 'الآن' : `بعد ${counted(minutes, ['دقيقة', 'دقيقتين', 'دقائق'])}`);

/**
 * Where a card that comes while the feed is open goes (the prayer card, owner 2026-11-18): before the first post that starts
 * below what is on screen, so nothing the reader is looking at moves. `tops` are the posts' tops in the page, in order.
 */
export function insertAt(tops: readonly number[], screenBottom: number): number {
  const at = tops.findIndex(top => top >= screenBottom);
  return at === -1 ? tops.length : at;
}

/** Every virtue of every converted person, in the people's order: the «من التراجم» card's list. */
export const allVirtues = <P extends { slug: string; virtues: readonly unknown[] }>(people: readonly P[]) =>
  people.flatMap(person => person.virtues.map((_, index) => ({ person, index })));

/** One card of a round: an interest's content card or its question, and which turn of that kind it is in the visit. */
export type FeedSlot = { interest: string; kind: FeedCardKind | FeedQuizKind; quiz: boolean; surprise?: true };

const spin = (n: number, count: number) => ((n % count) + count) % count;

/** Same numbers, same order: a list shuffled by a seed (the day and the round), so a round reads the same all day. */
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

/** The kind an interest gives in a round: its content cards and its questions take turns, each list in turn by the day. */
function slotOf(interest: Interest, at: number, round: number, day: number, cardOnly = false): FeedSlot | null {
  const { cards, quizzes } = interest;
  if (!cards.length && !quizzes.length) return null;
  const both = cards.length > 0 && quizzes.length > 0;
  // Interests take turns starting on a card or a question, so a round holds both (owner, 2026-11-19: learn, then test).
  const quiz = cardOnly && cards.length ? false : both ? (round + at) % 2 === 1 : quizzes.length > 0;
  const turn = both ? Math.floor((round + (at % 2)) / 2) : round;
  const list = quiz ? quizzes : cards;
  return { interest: interest.id, kind: list[spin(turn + day, list.length)], quiz };
}

/** A round's cards before the spacing: each interest once, the order shuffled by the day. */
function plainRound(interests: readonly Interest[], round: number, day: number): FeedSlot[] {
  const slots = interests.flatMap((interest, at) => slotOf(interest, at, round, day) ?? []);
  // More questions than cards to put between them: an interest with cards gives its card this round instead.
  const count = (quiz: boolean) => slots.filter(slot => slot.quiz === quiz).length;
  // Which ones give way turns with the round and the day, so no interest's questions are always the ones left out.
  const seed = day * 7919 + round * 104729;
  for (const i of shuffled(slots.map((_, at) => at), seed + 2)) {
    if (count(true) <= count(false) + 1) break;
    const interest = interests.find(item => item.id === slots[i].interest)!;
    if (slots[i].quiz && interest.cards.length) slots[i] = slotOf(interest, interests.indexOf(interest), round, day, true)!;
  }
  const cards = shuffled(slots.filter(slot => !slot.quiz), seed);
  const quizzes = shuffled(slots.filter(slot => slot.quiz), seed + 1);
  // Never two questions side by side: a card between each, the spare cards first. Only when the interests picked have too
  // few cards (questions alone) do the last questions meet.
  const out: FeedSlot[] = [];
  let card = 0;
  let quiz = 0;
  while (cards.length - card > quizzes.length - quiz) out.push(cards[card++]);
  if (quizzes.length - quiz > cards.length - card) out.push(quizzes[quiz++]);
  while (card < cards.length) out.push(cards[card++], quizzes[quiz++]);
  while (quiz < quizzes.length) out.push(quizzes[quiz++]);
  return out;
}

/**
 * The feed's round `round` (owner, 2026-11-19): one card from each interest in `interests`, content and questions taking
 * turns, never two questions side by side, and a round never starting with the interest the round before ended on. With
 * `others` (the interests not picked, when «فاجئني من غير اهتماماتي» is on), one card from one of them, marked `surprise`.
 */
export function feedRound(interests: readonly Interest[], round: number, day: number, others: readonly Interest[] = []): FeedSlot[] {
  const slots = plainRound(interests, round, day);
  if (round > 0 && slots.length > 1) {
    const before = plainRound(interests, round - 1, day);
    const last = before[before.length - 1]?.interest;
    if (slots[0].interest === last) {
      // Never the last slot, so the round ends where its plain order ends and the next round can see it.
      const swap = slots.findIndex((slot, i) => i > 0 && i < slots.length - 1 && slot.quiz === slots[0].quiz && slot.interest !== last);
      if (swap > 0) [slots[0], slots[swap]] = [slots[swap], slots[0]];
    }
  }
  if (others.length) {
    const other = others[spin(round + day, others.length)];
    const extra = slotOf(other, 0, other.cards.length ? round * 2 : round, day);
    if (extra) {
      // Near the middle, and a question only between two cards.
      const fits = (at: number) => !extra.quiz || (!slots[at - 1]?.quiz && !slots[at]?.quiz);
      const middle = Math.ceil(slots.length / 2);
      const at = [...Array(slots.length + 1).keys()].sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle)).find(fits);
      const place = at ?? middle;
      slots.splice(place, 0, { ...(at === undefined && extra.quiz ? slotOf(other, 0, round, day, true) ?? extra : extra), surprise: true });
    }
  }
  return slots;
}

/** Where a kind's list starts on a day, so each day begins elsewhere; the feed walks on from there. */
export const dayStart = (count: number, day: number, salt: number) => (count ? spin(day * 7 + salt * 13, count) : 0);

/** The content cards drawn from a list of items (pairs and trees have their own picks), in the order that salts each one's start. */
export const LIST_KINDS = ['note-tafsir', 'note-qiraat', 'note-irab', 'note-balagha', 'term', 'scene', 'hadith', 'bukhari', 'muslim', 'rajab',
  'recorded', 'isnad', 'prophets', 'sira', 'moment', 'tarajim', 'tie', 'laqab', 'kunya', 'life'] as const satisfies readonly FeedCardKind[];
export type ListKind = (typeof LIST_KINDS)[number];

/**
 * Where a kind's walk through its list starts: just after `after` when a story opened from the feed continues (owner,
 * 2026-11-19: the next phase, moment or story), else where the day begins.
 */
export const listStart = (list: readonly string[], kind: ListKind, day: number, after?: string) =>
  after !== undefined && list.includes(after) ? list.indexOf(after) + 1 : dayStart(list.length, day, LIST_KINDS.indexOf(kind));
