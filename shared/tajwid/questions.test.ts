import { describe, expect, it } from 'vitest';
import { completeQuestions, LAM_RULES, MEEM_RULES, NOON_RULES, nextQuestions, ruleQuestions, verses } from './questions';

const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآ]/g, 'ا');
const text = (number: number) => bare(`${verses[number - 1].first} ${verses[number - 1].second}`);
const initials = (number: number) => text(number).split(' ').map(word => word[0]).join('');
const seeded = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const ALPHABET = 'ءبتثجحخدذرزسشصضطظعغفقكلمنهوي';
const sorted = (letters: string) => [...letters].sort().join('');

describe('the letters the poem names for each rule', () => {
  it('reads them from the verses it cites', () => {
    // v8 names the throat letters, v9 codes idgham as يرملون, v10 the nasal four as ينمو, v12 lam and ra.
    expect(text(8)).toContain('همز فهاء ثم عين حاء');
    expect(text(8)).toContain('غين خاء');
    expect(text(9)).toContain('يرملون');
    expect(sorted(NOON_RULES[1].letters + NOON_RULES[2].letters)).toBe(sorted('يرملون'));
    expect(text(10)).toContain('بينمو');
    expect(text(12)).toContain('في اللام والرا');
    expect(text(13)).toContain('عند الباء');
    // v16: the first letter of each word is one ikhfa letter.
    expect(sorted(initials(16))).toBe(sorted(NOON_RULES[4].letters));
    expect(text(20)).toContain('عند الباء');
    // v25 codes the qamari letters as ابغ حجك وخف عقيمه (alif = hamza); v27's word initials are the shamsi ones.
    expect(sorted(bare('ابغ حجك وخف عقيمه').replace(/ /g, '').replace('ا', 'ء'))).toBe(sorted(LAM_RULES[0].letters));
    expect(text(25)).toContain('ابغ حجك وخف عقيمه');
    expect(sorted(initials(27))).toBe(sorted(LAM_RULES[1].letters));
  });

  it('gives every letter but alif exactly one rule in each chapter', () => {
    for (const rules of [NOON_RULES, MEEM_RULES, LAM_RULES]) expect(sorted(rules.map(rule => rule.letters).join(''))).toBe(sorted(ALPHABET));
  });
});

describe('Tuhfa questions', () => {
  const all = [...completeQuestions('medium', seeded()), ...nextQuestions('medium', seeded(2)), ...ruleQuestions(seeded(3))];

  it('asks every verse, every next verse and every letter once', () => {
    expect(all).toHaveLength(61 + 60 + 28 * 3);
    expect(new Set(all.map(question => question.key)).size).toBe(all.length);
  });

  it('offers the right answer among distinct choices', () => {
    for (const question of all) {
      const values = question.choices.map(choice => choice.value);
      expect(values).toContain(question.correctAnswer);
      expect(new Set(values).size).toBe(values.length);
      expect(values.length).toBeGreaterThanOrEqual(2);
      expect(values.length).toBeLessThanOrEqual(4);
    }
  });

  it('gives three wrong halves at every difficulty', () => {
    for (const level of ['easy', 'medium', 'hard'] as const) {
      for (const question of [...completeQuestions(level, seeded()), ...nextQuestions(level, seeded())]) expect(question.choices).toHaveLength(4);
    }
  });

  it('completes a verse with its own second half', () => {
    const question = completeQuestions('medium', seeded()).find(item => item.key === 'tuhfa:complete:14')!;
    expect(question.promptArabic).toContain(verses[13].first);
    expect(question.correctAnswer).toBe(verses[13].second);
  });

  it('cites the verse that names the letter', () => {
    const qaf = ruleQuestions(seeded()).find(item => item.key === 'tuhfa:noon:ق')!;
    expect(qaf.correctAnswer).toBe('الْإِخْفَاءُ');
    expect(qaf.note?.label).toBe('البيت ١٦');
  });
});
