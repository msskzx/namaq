import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countOf, countsOnDay, counting, isDone, isSaidToday, localDay, saidCount, saidDone, saidKey, sayOnce, type Counting } from './adhkarCount';

const run = (events: Parameters<typeof counting>[1][]) => events.reduce<Counting>(counting, null);
const tap = (id: string, target = 3) => ({ type: 'tap' as const, id, target });

describe('the adhkar counter', () => {
  it('counts taps on one card and stops at the stated number', () => {
    expect(countOf(run([tap('a'), tap('a')]), 'a')).toBe(2);
    expect(countOf(run([tap('a'), tap('a'), tap('a'), tap('a')]), 'a')).toBe(3);
  });

  it('starts again from one on another card, and an unfinished first card is back at zero', () => {
    const state = run([tap('a'), tap('a'), tap('b')]);
    expect(countOf(state, 'b')).toBe(1);
    expect(countOf(state, 'a')).toBe(0);
  });

  it('keeps a finished card done while the next one counts, and counts a card without a number once (owner, 2026-11-23)', () => {
    const state = run([tap('a'), tap('a'), tap('a'), tap('b', 1), tap('c')]);
    expect(isDone(state, 'a') && isDone(state, 'b')).toBe(true);
    expect(countOf(state, 'a')).toBe(3);
    expect(isDone(state, 'c')).toBe(false);
    expect(countOf(run([tap('a'), tap('a'), tap('a'), tap('a')]), 'a')).toBe(3);
  });

  it('starts one card again on its reset, and forgets everything when the page or the app is left', () => {
    const state = run([tap('a', 1), tap('b'), { type: 'reset', id: 'a' }]);
    expect(isDone(state, 'a')).toBe(false);
    expect(countOf(state, 'b')).toBe(1);
    expect(countOf(run([tap('a'), { type: 'reset' }]), 'a')).toBe(0);
    expect(run([tap('a'), tap('a'), { type: 'leave' }])).toBeNull();
  });

  it('the website writes nothing: its page and counter use no storage', () => {
    const web = readFileSync(new URL('../src/components/utilities/Adhkar.tsx', import.meta.url), 'utf8');
    expect(web).not.toMatch(/storage|writeJson|AsyncStorage|SecureStore|MMKV/);
    expect(web).toMatch(/useReducer\(counting, null\)/);
  });

  it('the phone keeps each count until the day ends, each time and each dhikr on its own', () => {
    const morning = new Date(2026, 10, 24, 7, 0);
    const night = new Date(2026, 10, 24, 23, 59);
    const next = new Date(2026, 10, 25, 0, 1);
    const [a, b, evening] = [saidKey('morning', 'a'), saidKey('morning', 'b'), saidKey('evening', 'a')];
    const counts = sayOnce(sayOnce(sayOnce({}, a, 3), a, 3), b, 1);
    const said = { day: localDay(morning), counts };
    expect(isSaidToday(said)).toBe(true);
    const tonight = countsOnDay(said, localDay(night));
    expect(saidCount(tonight, a)).toBe(2);
    expect(saidDone(tonight, b)).toBe(true);
    expect(saidDone(tonight, evening)).toBe(false);
    expect(saidCount(sayOnce(sayOnce(tonight, a, 3), a, 3), a)).toBe(3);
    expect(saidCount(sayOnce(tonight, a, null), a)).toBe(0);
    expect(countsOnDay(said, localDay(next))).toEqual({});
  });
});
