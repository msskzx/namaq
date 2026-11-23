import { describe, expect, it } from 'vitest';
import { dayStart, feedBooks, LIST_KINDS, feedRound, hasBooksCard, hasJuzCard, inMinutes, insertAt, prayerSoon } from './homeFeed';
import { DRAWN_KINDS, FEED_CARD_KINDS, INTERESTS, onWebsite, PHONE_ONLY_KINDS, type FeedCardKind } from './interests';
import type { PrayerDay } from './prayer';

const at = (hours: number, minutes = 0) => new Date(2026, 10, 18, hours, minutes);
const day: PrayerDay = { fajr: at(6, 1), sunrise: at(7, 40), dhuhr: at(12, 5), asr: at(14, 22), maghrib: at(16, 28), isha: at(18, 12) };

describe('home feed cards', () => {
  it('puts today\'s juz in the first batch and books on every fourth from the second', () => {
    expect([0, 1, 2, 3, 4].filter(hasJuzCard)).toEqual([0]);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(hasBooksCard)).toEqual([1, 5, 9]);
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

describe('the feed\'s item lists', () => {
  it('cover every card kind but the pairs and trees, which come by their own ids', () => {
    // A kind left out would never fill its slots, on the website or in the app.
    expect([...LIST_KINDS, 'pair', 'tree'].sort()).toEqual([...FEED_CARD_KINDS].sort());
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
    expect(inMinutes(130)).toBe('بعد ساعتين و١٠ دقائق');
    expect(inMinutes(60)).toBe('بعد ساعة');
    expect(inMinutes(0)).toBe('الآن');
  });

  it('goes in before the first post below the screen, so nothing on screen moves', () => {
    expect(insertAt([0, 400, 900, 1500], 844)).toBe(2);
    expect(insertAt([0, 400], 844)).toBe(2);
    expect(insertAt([900], 844)).toBe(0);
  });

});

describe('the feed by interests', () => {
  const all = INTERESTS;
  const some = INTERESTS.filter(interest => ['tafsir', 'hadith', 'tajwid'].includes(interest.id));

  it('brings every interest once a round, and the same round all day', () => {
    for (const list of [all, some]) {
      for (let round = 0; round < 6; round++) {
        const slots = feedRound(list, round, 9);
        expect(slots.map(slot => slot.interest).sort()).toEqual(list.map(interest => interest.id).sort());
        expect(feedRound(list, round, 9)).toEqual(slots);
      }
    }
  });

  it('gives each slot a card or question of its own interest', () => {
    for (let round = 0; round < 6; round++) {
      for (const slot of feedRound(all, round, 3)) {
        const interest = all.find(item => item.id === slot.interest)!;
        expect(((slot.quiz ? interest.quizzes : interest.cards) as readonly string[]).includes(slot.kind)).toBe(true);
      }
    }
  });

  it('never puts two questions side by side, nor one interest across a round\'s end', () => {
    for (let day = 0; day < 20; day++) {
      const rounds = [0, 1, 2, 3, 4].map(round => feedRound(all, round, day));
      for (const round of rounds) for (let i = 1; i < round.length; i++) expect(round[i - 1].quiz && round[i].quiz).toBe(false);
      for (let r = 1; r < rounds.length; r++) expect(rounds[r][0].interest).not.toBe(rounds[r - 1].at(-1)!.interest);
    }
  });

  it('asks every interest\'s questions over the rounds, even when questions outnumber cards', () => {
    const asked = new Set<string>();
    for (let round = 0; round < 12; round++) for (const slot of feedRound(all, round, 4)) if (slot.quiz) asked.add(slot.interest);
    expect([...asked].sort()).toEqual(all.filter(interest => interest.quizzes.length).map(interest => interest.id).sort());
  });

  it('gives an interest\'s drawings and text cards in turn, and over the rounds every card kind', () => {
    for (const day of [0, 1, 7]) {
      for (const interest of all.filter(each => each.cards.some(kind => DRAWN_KINDS.includes(kind)) && each.cards.some(kind => !DRAWN_KINDS.includes(kind)))) {
        const cards = Array.from({ length: 40 }, (_, round) => feedRound([interest], round, day)[0]).filter(slot => !slot.quiz);
        for (let i = 1; i < cards.length; i++) expect(DRAWN_KINDS.includes(cards[i].kind as FeedCardKind), interest.id).not.toBe(DRAWN_KINDS.includes(cards[i - 1].kind as FeedCardKind));
        expect(new Set(cards.map(slot => slot.kind)), interest.id).toEqual(new Set(interest.cards));
      }
    }
  });

  // The website draws nothing for the phone's own cards: a turn dealt to one was a blank slot in its feed.
  it('deals the website none of the cards only the phone draws', () => {
    const slots = Array.from({ length: 40 }, (_, round) => feedRound(INTERESTS.map(onWebsite), round, 3)).flat().filter(slot => !slot.quiz);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.filter(slot => (PHONE_ONLY_KINDS as readonly string[]).includes(slot.kind))).toEqual([]);
  });

  it('adds one surprise from an interest not picked, and none without one', () => {
    const others = INTERESTS.filter(interest => !some.includes(interest));
    const slots = feedRound(some, 2, 5, others);
    const surprises = slots.filter(slot => slot.surprise);
    expect(surprises).toHaveLength(1);
    expect(others.map(interest => interest.id)).toContain(surprises[0].interest);
    expect(feedRound(some, 2, 5).some(slot => slot.surprise)).toBe(false);
  });

  it('starts a list at a place of the day', () => {
    expect(dayStart(0, 4, 1)).toBe(0);
    for (let d = 0; d < 30; d++) {
      expect(dayStart(10, d, 2)).toBeGreaterThanOrEqual(0);
      expect(dayStart(10, d, 2)).toBeLessThan(10);
    }
    expect(dayStart(10, 7, 2)).toBe(dayStart(10, 7, 2));
  });
});
