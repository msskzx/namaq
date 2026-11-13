import { describe, expect, it } from 'vitest';
import { backToVisit, freshPicks, isFresh, leftVisit, storyIsNew, storyTimes, visitStart } from './feedSeen';

describe('feed seen', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];
  const pick = (offset: number) => items[offset % items.length];
  const id = (item: string) => item;

  it('skips what was shown before this visit, keeps what this visit showed', () => {
    expect(freshPicks(pick, id, { a: 9, b: 10 }, 3, { since: 10 })).toEqual(['b', 'c', 'd']);
    expect(isFresh({ a: 9 }, 'a', 10)).toBe(false);
    expect(isFresh({ a: 10 }, 'a', 10)).toBe(true);
    expect(isFresh({}, 'a')).toBe(true);
  });

  it('starts over with seen ones when nothing new is left', () => {
    const seen = Object.fromEntries(items.map(item => [item, 1]));
    expect(freshPicks(pick, id, seen, 2, { since: 10 })).toEqual(['a', 'b']);
    expect(freshPicks(pick, id, { ...seen, e: 10 }, 2, { since: 10 })).toEqual(['e', 'a']);
  });

  it('puts preferred fresh items first', () => {
    expect(freshPicks(pick, id, { c: 1 }, 3, { since: 10, prefer: item => item === 'c' || item === 'd' })).toEqual(['d', 'a', 'b']);
  });

  it('takes an item that is the number 0', () => {
    expect(freshPicks(offset => (offset < 3 ? offset : undefined), String, {}, 2)).toEqual([0, 1]);
  });

  it('never repeats an item', () => {
    expect(freshPicks(pick, id, {}, 9, { since: 10, tries: 12 })).toEqual(items);
  });

  it('lights a story only for content newer than its last opening', () => {
    expect(storyIsNew({}, 'juz', 5)).toBe(true);
    expect(storyIsNew({ juz: 6 }, 'juz', 5)).toBe(false);
    expect(storyIsNew({ juz: 4 }, 'juz', 5)).toBe(true);
    expect(storyIsNew({}, 'saved', null)).toBe(false);
  });

  it('dates each story by its newest content', () => {
    const now = new Date(2026, 10, 13, 15).getTime();
    const times = storyTimes({ due: { '2:1': { at: 5, due: 50 }, '2:2': { at: 70 } }, saved: [{ savedAt: 9 }], notes: {}, now });
    expect(times).toEqual({ juz: new Date(2026, 10, 13).getTime(), forgotten: 70, saved: 9, notes: null, prophets: 1 });
  });

  it('skips an item seen in an earlier visit when called with only a count, as the feeds call it', () => {
    expect(freshPicks(pick, id, { a: visitStart() - 1 }, 2)).toEqual(['b', 'c']);
  });

  it('starts a new visit only after a long time away', () => {
    const start = visitStart();
    leftVisit(start + 1000);
    backToVisit(start + 2000);
    expect(visitStart()).toBe(start);
    leftVisit(start + 3000);
    backToVisit(start + 3000 + 31 * 60_000);
    expect(visitStart()).toBe(start + 3000 + 31 * 60_000);
  });
});
