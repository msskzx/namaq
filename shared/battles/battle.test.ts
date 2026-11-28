import { describe, expect, it } from 'vitest';
import { courseLine, prophetSaying, unitFor, type AppBattle } from './battle';
import data from '../data/battles/battles.json';

const battles = data as unknown as AppBattle[];

const moments = (n: number) => Array.from({ length: n }, () => ({ title: '', quote: '', grading: '', cite: '', url: '', people: [] }));

describe('courseLine', () => {
  it('counts one, two, three to ten and eleven on each in its own form', () => {
    const kind = { value: 'غزوة', refs: [] };
    expect(courseLine({ kind, moments: moments(1) })).toBe('مجرى الغزوة في مشهد واحد');
    expect(courseLine({ kind, moments: moments(2) })).toBe('مجرى الغزوة في مشهدين');
    expect(courseLine({ kind, moments: moments(7) })).toBe('مجرى الغزوة في ٧ مشاهد');
    expect(courseLine({ kind, moments: moments(11) })).toBe('مجرى الغزوة في ١١ مشهدًا');
  });
});

describe('prophetSaying', () => {
  it('takes the first quote when the words just before it name the Prophet ﷺ', () => {
    expect(prophetSaying('أن النبي صلى الله عليه وسلم قال يوم بدر: "هذا جبريل". فخرج.')).toEqual({
      lead: 'أن النبي صلى الله عليه وسلم قال يوم بدر:', saying: 'هذا جبريل', rest: 'فخرج.',
    });
  });
  it('keeps a question mark printed after the closing quote with the saying', () => {
    expect(prophetSaying('قال رسول الله صلى الله عليه وسلم: "ما ترون في هؤلاء"؟. فقال أبو بكر.')?.saying).toBe('ما ترون في هؤلاء؟');
  });
  it('leaves whole a report whose first quote is another speaker\'s, or that has none', () => {
    expect(prophetSaying('قال رسول الله صلى الله عليه وسلم يومئذ. فقال أبو بكر: "حسبك".')).toBeUndefined();
    expect(prophetSaying('قال رسول الله صلى الله عليه وسلم: من ينظر ما صنع أبو جهل؟')).toBeUndefined();
  });
});

describe('unitFor', () => {
  it('keeps every side of every battle under a hundred dots', () => {
    const sides = battles.flatMap(battle => Object.values(battle.counts).map(count => count?.value ?? 0)).filter(Boolean);
    expect(sides.length).toBeGreaterThan(0);
    for (const most of sides) expect(Math.ceil(most / unitFor(most))).toBeLessThanOrEqual(100);
  });
});
