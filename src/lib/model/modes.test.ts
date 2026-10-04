import { describe, expect, it } from 'vitest';
import { modeKeyOf } from './modes';

describe('modeKeyOf', () => {
  it('derives the key from the printed formula, whatever the vowels', () => {
    expect(modeKeyOf('حَدَّثَنَا')).toBe('haddatha/1pl');
    expect(modeKeyOf('حَدَّثَنِي')).toBe('haddatha/1sg');
    expect(modeKeyOf('أَخْبَرَنَا')).toBe('akhbara/1pl');
    expect(modeKeyOf('عَنْ')).toBe('an');
    expect(modeKeyOf('قَالَ')).toBe('qala/3sg');
  });

  it('maps an abbreviation to the full key', () => {
    expect(modeKeyOf('ثنا')).toBe('haddatha/1pl');
    expect(modeKeyOf('أنا')).toBe('akhbara/1pl');
    expect(modeKeyOf('ثني')).toBe('haddatha/1sg');
  });

  it('has no key for a formula it does not know, so an unmapped form fails the check', () => {
    expect(modeKeyOf('وَقَدْ رَوَى')).toBeUndefined();
    expect(modeKeyOf('')).toBeUndefined();
  });

  it("has the multi-word formulas of the plan's list", () => {
    expect(modeKeyOf('قَالَ لِي')).toBe('qala-li');
    expect(modeKeyOf('بَلَغَنِي')).toBe('balagha/1sg');
    expect(modeKeyOf('قَرَأْتُ عَلَى')).toBe("qara'tu-ala");
    expect(modeKeyOf('وَجَدْتُ')).toBe('wijadah');
  });
});
