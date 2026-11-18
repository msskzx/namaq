import { describe, expect, it } from 'vitest';
import { feedBooks, hasBooksCard, hasJuzCard, hasMomentCard, hasSceneCard, hasSiraCard, hasTermCard, inMinutes, insertAt, momentOfSlot, prayerSoon, sceneOfSlot, siraOfSlot, termOfSlot } from './homeFeed';
import { hasStoryCard } from './feedSeen';
import type { PrayerDay } from './prayer';

const at = (hours: number, minutes = 0) => new Date(2026, 10, 18, hours, minutes);
const day: PrayerDay = { fajr: at(6, 1), sunrise: at(7, 40), dhuhr: at(12, 5), asr: at(14, 22), maghrib: at(16, 28), isha: at(18, 12) };

describe('home feed cards', () => {
  it('puts today\'s juz in the first batch, scenes on even batches after it and books on every fourth from the second', () => {
    expect([0, 1, 2, 3, 4].filter(hasJuzCard)).toEqual([0]);
    expect([0, 1, 2, 3, 4, 5, 6].filter(hasSceneCard)).toEqual([2, 4, 6]);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(hasBooksCard)).toEqual([1, 5, 9]);
    // A scene never shares a batch with the prophets card.
    for (let slot = 0; slot < 20; slot++) expect(hasSceneCard(slot) && hasStoryCard(slot)).toBe(false);
  });

  it('picks a scene for each scene batch, the same all day and a different one in the next batch', () => {
    expect(sceneOfSlot(7, 100, 2)).toBe(sceneOfSlot(7, 100, 2));
    expect(sceneOfSlot(7, 100, 4)).not.toBe(sceneOfSlot(7, 100, 2));
    for (let d = 0; d < 30; d++) expect(sceneOfSlot(7, d, 2)).toBeGreaterThanOrEqual(0);
    expect(sceneOfSlot(0, 3, 2)).toBe(-1);
  });

  it('puts a battle\'s moment on every fourth batch from the fourth, never with the books or a scene', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].filter(hasMomentCard)).toEqual([3, 7]);
    for (let slot = 0; slot < 20; slot++) expect(hasMomentCard(slot) && (hasBooksCard(slot) || hasSceneCard(slot))).toBe(false);
  });

  it('puts a sira story on every fourth batch from the second, never with a battle\'s moment or a scene', () => {
    expect([0, 1, 2, 3, 4, 5, 6].filter(hasSiraCard)).toEqual([1, 5]);
    for (let slot = 0; slot < 20; slot++) expect(hasSiraCard(slot) && (hasMomentCard(slot) || hasSceneCard(slot))).toBe(false);
  });

  it('picks a sira story for each story batch, the same all day and the next one in the next', () => {
    expect(siraOfSlot(3, 10, 1)).toBe(siraOfSlot(3, 10, 1));
    expect(siraOfSlot(3, 10, 5)).toBe((siraOfSlot(3, 10, 1) + 1) % 3);
    expect(siraOfSlot(3, 11, 1)).toBe((siraOfSlot(3, 10, 1) + 1) % 3);
    expect(siraOfSlot(0, 3, 1)).toBe(-1);
  });

  it('puts a balagha term on every fourth batch from the third, never with the books, a sira story or a battle\'s moment', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7].filter(hasTermCard)).toEqual([2, 6]);
    for (let slot = 0; slot < 20; slot++) expect(hasTermCard(slot) && (hasBooksCard(slot) || hasSiraCard(slot) || hasMomentCard(slot))).toBe(false);
  });

  it('picks a term for each term batch, the same all day and a different one in the next', () => {
    expect(termOfSlot(67, 100, 2)).toBe(termOfSlot(67, 100, 2));
    expect(termOfSlot(67, 100, 6)).not.toBe(termOfSlot(67, 100, 2));
    expect(termOfSlot(67, 101, 2)).not.toBe(termOfSlot(67, 100, 2));
    for (let d = 0; d < 30; d++) expect(termOfSlot(67, d, 2)).toBeGreaterThanOrEqual(0);
    expect(termOfSlot(0, 3, 2)).toBe(-1);
  });

  it('picks a moment for each moment batch, the same all day and a different one in the next', () => {
    expect(momentOfSlot(7, 100, 3)).toBe(momentOfSlot(7, 100, 3));
    expect(momentOfSlot(7, 100, 7)).not.toBe(momentOfSlot(7, 100, 3));
    for (let d = 0; d < 30; d++) expect(momentOfSlot(7, d, 3)).toBeGreaterThanOrEqual(0);
    expect(momentOfSlot(0, 3, 3)).toBe(-1);
  });

  it('lists the books with a فاصلة first, then turns the others by the day', () => {
    const books = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id }));
    const marked = (id: string) => id === 'd';
    expect(feedBooks(books, marked, 0, 3).map(book => book.id)).toEqual(['d', 'a', 'b']);
    expect(feedBooks(books, marked, 1, 3).map(book => book.id)).toEqual(['d', 'b', 'c']);
    expect(feedBooks(books, () => false, 5, 5).map(book => book.id)).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(feedBooks([], marked, 2)).toEqual([]);
  });
});

describe('the prayer card', () => {
  it('comes only when the next prayer is at most half an hour away', () => {
    expect(prayerSoon(day, at(14, 4))).toEqual({ key: 'asr', minutes: 18 });
    expect(prayerSoon(day, at(13, 51))).toBeNull();
    expect(prayerSoon(day, at(13, 52))).toEqual({ key: 'asr', minutes: 30 });
    // Sunrise is not one of the five.
    expect(prayerSoon(day, at(7, 30))).toBeNull();
    expect(prayerSoon(day, at(20, 0))).toBeNull();
  });

  it('says the time left in Arabic', () => {
    expect(inMinutes(18)).toBe('بعد ١٨ دقيقة');
    expect(inMinutes(5)).toBe('بعد ٥ دقائق');
    expect(inMinutes(2)).toBe('بعد دقيقتين');
    expect(inMinutes(1)).toBe('بعد دقيقة');
    expect(inMinutes(0)).toBe('الآن');
  });

  it('goes in before the first post below the screen, so nothing on screen moves', () => {
    expect(insertAt([0, 400, 900, 1500], 844)).toBe(2);
    expect(insertAt([0, 400], 844)).toBe(2);
    expect(insertAt([900], 844)).toBe(0);
  });
});
