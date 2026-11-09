import { describe, expect, it } from 'vitest';
import { ayahWords, normalizeWord } from './normalize';

describe('normalizeWord', () => {
  it('drops vowels and Quranic marks and folds letter variants', () => {
    expect(normalizeWord('ٱلرَّحۡمَـٰنِ')).toBe('الرحمن');
    expect(normalizeWord('أُوْلَـٰٓئِكَ')).toBe(normalizeWord('اولئك'));
    expect(normalizeWord('رَحْمَةً')).toBe('رحمه');
    expect(normalizeWord('هُدَىٰ')).toBe(normalizeWord('هدي'));
    expect(normalizeWord('رَحِیمِ')).toBe('رحيم');
  });

  it('reduces a standalone waqf mark to nothing', () => {
    expect(normalizeWord('ۖ')).toBe('');
  });
});

describe('ayahWords', () => {
  const basmala = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ';

  it('strips the basmala Tanzil prepends to the first ayah when asked', () => {
    expect(ayahWords(`${basmala} الۤمۤ`, true).norm).toEqual(['الم']);
    expect(ayahWords(`${basmala} الۤمۤ`, false).norm).toHaveLength(5);
  });

  it('leaves a first ayah that does not start with the basmala', () => {
    expect(ayahWords('قُلْ هُوَ ٱللَّهُ أَحَدٌ', true).norm).toEqual(['قل', 'هو', 'الله', 'احد']);
  });

  it('drops a standalone mark and joins a split superscript alef', () => {
    const words = ayahWords('ذَ ٰ⁠لِكَ ۖ ٱلۡكِتَـٰبُ', false);
    expect(words.display).toHaveLength(2);
    expect(words.norm).toEqual(['ذلك', 'الكتب']);
  });
});
