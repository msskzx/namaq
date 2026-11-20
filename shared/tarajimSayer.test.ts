import { describe, expect, it } from 'vitest';
import { saidBy, sayerAt, type PersonFact } from './tarajim';

const fact = (by: string[], more: Partial<PersonFact> = {}) => ({ id: 'x', text: 'x', refs: [], by, ...more }) as PersonFact;

describe('sayer lines', () => {
  it('names who says it before the quote, a kunya after «قال» in the nominative and after «عند» in the genitive', () => {
    // Owner 2026-11-20: the speaker comes first, as the hadith and the sira put him.
    expect(saidBy(fact(['أبي هريرة']))).toBe('قال أبو هريرة:');
    expect(saidBy(fact(['محمد ﷺ']))).toBe('قال النبي ﷺ:');
    // Salman al-Farisi's name readings (Siyar 4/555): «عند أبو نعيم» read wrong.
    expect(sayerAt(fact(['أبو نعيم الأصبهاني']))).toBe('عند أبي نعيم الأصبهاني');
    expect(sayerAt(fact(['أبو عبيد', 'شباب']))).toBe('عند أبي عبيد، شباب');
  });

  it('says «قالت» for a woman, «قيل» for an unnamed view, and nothing for the author\'s own words', () => {
    expect(saidBy(fact(['عائشة']))).toBe('قالت عائشة:');
    expect(saidBy(fact(['أم سلمة']))).toBe('قالت أم سلمة:');
    expect(saidBy(fact(['أم خالد بنت خالد بن سعيد']))).toBe('قالت أم خالد بنت خالد بن سعيد:');
    expect(saidBy(fact(['أنس']))).toBe('قال أنس:');
    expect(saidBy(fact([], { anonymous: true }))).toBe('قيل:');
    expect(saidBy(fact([]))).toBeUndefined();
  });
});
