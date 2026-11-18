import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countOf, counting, type Counting } from './adhkarCount';

const run = (events: Parameters<typeof counting>[1][]) => events.reduce<Counting>(counting, null);
const tap = (id: string, target = 3) => ({ type: 'tap' as const, id, target });

describe('the adhkar counter', () => {
  it('counts taps on one card and stops at the stated number', () => {
    expect(countOf(run([tap('a'), tap('a')]), 'a')).toBe(2);
    expect(countOf(run([tap('a'), tap('a'), tap('a'), tap('a')]), 'a')).toBe(3);
  });

  it('starts again from one on another card, and the first card is back at zero', () => {
    const state = run([tap('a'), tap('a'), tap('b')]);
    expect(countOf(state, 'b')).toBe(1);
    expect(countOf(state, 'a')).toBe(0);
  });

  it('is gone on reset and when the page or the app is left', () => {
    expect(run([tap('a'), { type: 'reset' }])).toBeNull();
    expect(run([tap('a'), tap('a'), { type: 'leave' }])).toBeNull();
  });

  it('writes nothing to the phone: the page and its counter use no storage', () => {
    const page = readFileSync(new URL('../components/Adhkar.tsx', import.meta.url), 'utf8');
    const libs = ['./adhkar.ts', './adhkarCount.ts'].map(file => readFileSync(new URL(file, import.meta.url), 'utf8'));
    for (const source of [page, ...libs]) {
      expect(source).not.toMatch(/storage|writeJson|AsyncStorage|SecureStore|MMKV/);
      // Settings it touches: which utility is open, the reminder switches and the place they need. Never a count.
      const settings = [...source.matchAll(/\b(\w+)\.(?:set|use)\(/g)].map(match => match[1]);
      expect(settings.every(name => ['utilityView', 'adhkarAlerts', 'prayerPlace'].includes(name))).toBe(true);
    }
    expect(page).toMatch(/useReducer\(counting, null\)/);
  });
});
