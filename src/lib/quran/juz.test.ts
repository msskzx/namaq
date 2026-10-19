import { describe, expect, it } from 'vitest';
import { inJuzRange, juzOf, parseJuzRange } from './juz';

describe('juz', () => {
  it('places an ayah by the juz start before it, including starts in mid-page', () => {
    expect(juzOf('1:1')).toBe(1);
    expect(juzOf('2:141')).toBe(1);
    expect(juzOf('2:142')).toBe(2);
    expect(juzOf('3:92')).toBe(3);
    expect(juzOf('3:93')).toBe(4);
    expect(juzOf('56:75')).toBe(27);
    expect(juzOf('69:38')).toBe(29);
    expect(juzOf('114:6')).toBe(30);
  });

  it('reads a range from two parameters', () => {
    expect(parseJuzRange(null, null)).toBeNull();
    expect(parseJuzRange('30', '29')).toEqual({ from: 29, to: 30 });
    expect(parseJuzRange('29', null)).toEqual({ from: 29, to: 30 });
    expect(parseJuzRange('0', '31')).toEqual({ from: 1, to: 30 });
    expect(inJuzRange('81:15', { from: 29, to: 30 })).toBe(true);
    expect(inJuzRange('56:75', { from: 29, to: 30 })).toBe(false);
  });
});
