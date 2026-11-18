import { nextPrayer, type PrayerDay, type PrayerKey } from './prayer';
import { counted } from './quran/arabicNumber';

/**
 * Which batch of the home feed carries the cards added on 2026-11-18 (owner): today's juz in the first, a scene from «مشاهد»
 * on the even batches after it (with the saved card), the books on every fourth from the second. The prophets card keeps
 * the odd batches (feedSeen.ts hasStoryCard).
 */
export const hasJuzCard = (slot: number) => slot === 0;
export const hasSceneCard = (slot: number) => slot > 0 && slot % 2 === 0;
export const hasBooksCard = (slot: number) => slot % 4 === 1;

/** The scene of a batch, the same all day; the next scene batch brings the next one. */
export const sceneOfSlot = (count: number, day: number, slot: number) => (count ? (((day * 5 + slot / 2) % count) + count) % count : -1);

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

/** The tarajim card («من التراجم», owner 2026-11-18) comes on every fourth batch from the fourth. */
export const hasTarajimCard = (slot: number) => slot % 4 === 3;

/** The virtue a tarajim card shows, the same all day: every person's virtues in turn, the next card the next one. */
export function tarajimOfSlot<P extends { slug: string; virtues: readonly unknown[] }>(people: readonly P[], day: number, slot: number) {
  const all = people.flatMap(person => person.virtues.map((_, index) => ({ person, index })));
  if (all.length === 0) return null;
  const at = (((day * 7 + Math.floor(slot / 4)) % all.length) + all.length) % all.length;
  return all[at];
}
