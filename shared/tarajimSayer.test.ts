import { describe, expect, it } from 'vitest';
import { sayerAt, sayerLine, type PersonFact } from './tarajim';

const fact = (by: string[]) => ({ id: 'x', text: 'x', refs: [], by }) as PersonFact;

describe('sayer lines', () => {
  it('puts a kunya after «قاله» in the nominative and after «عند» in the genitive', () => {
    expect(sayerLine(fact(['أبي هريرة']))).toBe('قاله أبو هريرة');
    // Salman al-Farisi's name readings (Siyar 4/555): «عند أبو نعيم» read wrong.
    expect(sayerAt(fact(['أبو نعيم الأصبهاني']))).toBe('عند أبي نعيم الأصبهاني');
    expect(sayerAt(fact(['أبو عبيد', 'شباب']))).toBe('عند أبي عبيد، شباب');
    expect(sayerAt(fact(['ابن عساكر']))).toBe('عند ابن عساكر');
  });
});
