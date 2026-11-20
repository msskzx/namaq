import { describe, expect, it } from 'vitest';
import { ADHKAR, ADHKAR_OCCASIONS, adhkarFor, dhikrById, type Dhikr } from './adhkar';
import witness from './adhkar/author-excerpts.json';
import { SOURCES } from './sources';

const reports = new Map(Object.entries(witness.reports));
const grading = new Map(Object.entries(witness.grading));

/** The words as printed: the parts, or the shown text with each fix undone. */
function printed(item: Dhikr): string[] {
  if (item.content.kind !== 'text') return [];
  if (item.content.parts) return [...item.content.parts];
  let text = item.content.text;
  for (const fix of item.fixes ?? []) text = text.replace(fix.reads, fix.printed);
  return [text];
}

function authorReport(report: number | undefined) {
  const text = reports.get(String(report));
  expect(text, `missing al-Adhkar report ${report}`).toBeTruthy();
  return text!.join('\n');
}

describe('the al-Adhkar selection', () => {
  it('holds distinct items, each under the occasions it names', () => {
    expect(ADHKAR.length).toBeGreaterThan(0);
    expect(new Set(ADHKAR.map(item => item.id)).size).toBe(ADHKAR.length);
    for (const occasion of ADHKAR_OCCASIONS) {
      const selected = adhkarFor(occasion);
      expect(selected.length).toBeGreaterThan(0);
      expect(selected.every(item => item.occasions.includes(occasion))).toBe(true);
    }
  });

  it('returns the exact item for a source/search link and no fallback for an unknown id', () => {
    expect(dhikrById('evening-by-you')).toBe(adhkarFor('evening').find(item => item.id === 'evening-by-you'));
    expect(dhikrById('not-an-item')).toBeUndefined();
    expect(adhkarFor('morning').some(item => item.id === 'evening-by-you')).toBe(false);
    expect(adhkarFor('evening').some(item => item.id === 'morning-by-you')).toBe(false);
    expect(adhkarFor('sleep').filter(item => item.id === 'morning-evening-sleep-creator')).toHaveLength(1);
  });

  it('keeps every displayed word and supporting claim in its own author-only witness', () => {
    for (const item of ADHKAR) {
      const report = authorReport(item.citation.report);
      for (const part of printed(item)) expect(report).toContain(part);
      expect(report).toContain(item.occasionQuote);
      if (item.noteQuote) expect(report).toContain(item.noteQuote);
      if (item.virtueQuote) expect(report).toContain(item.virtueQuote);
      if (item.instructionQuote) expect(report).toContain(item.instructionQuote);
      for (const collection of item.collections) expect(report).toContain(collection);
      expect(item.citation.volume).toBe(1);
      expect(item.citation.url).toBe(`https://shamela.ws/book/1956/${item.citation.page - 2}`);
      expect(SOURCES.find(source => source.id === item.citation.source)?.edition).toContain('١٤١٤');
    }
  });

  it('shows the printed words, joined from their parts and corrected only where a cited source reads otherwise', () => {
    for (const item of ADHKAR) {
      if (item.content.kind !== 'text') continue;
      let shown = item.content.parts ? item.content.parts.join(' ') : printed(item)[0];
      for (const fix of item.fixes ?? []) {
        expect(shown.split(fix.printed), `${item.id}: «${fix.printed}» once`).toHaveLength(2);
        expect(shown.split(fix.reads), `${item.id}: «${fix.reads}» not already in the words`).toHaveLength(1);
        shown = shown.replace(fix.printed, fix.reads);
        const plain = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '');
        expect(plain(fix.quote), `${item.id}: the source reads «${fix.reads}»`).toContain(plain(fix.reads));
        if (fix.citation.report) expect(authorReport(fix.citation.report)).toContain(fix.quote);
      }
      expect(item.content.text).toBe(shown);
    }
    expect(ADHKAR.flatMap(item => (item.fixes ?? []).map(fix => fix.citation.report))).toEqual([29, 214, 174, 225]);
  });

  it('has only attributed sahih/hasan judgments, quoted within their source context', () => {
    const words = { 'in-sahih': /^(صحيح (البخاري|مسلم)|الصحيحين|أخرجه البخاري .*)$/, 'sahih': /صحيح/, 'hasan': /حسن/, 'hasan-sahih': /حسن صحيح/, 'isnad-sahih': /بإسناد صحيح|صحيح الإ.?سناد/ };
    const pages = new Map(Object.entries(witness.gradingPages));
    for (const item of ADHKAR) {
      for (const grade of item.grades.filter(grade => grade.rank === 'in-sahih')) {
        // The Sahih as al-Nawawi names it, or, where Ibn Hajar answers that, his own word on who put it out.
        if (grade.citation.source === 'adhkar-nawawi') {
          expect(item.collections, `${item.id}: the Sahih al-Nawawi names`).toContain(grade.quote);
          expect(grade.reportedBy).toBe('النووي');
        } else expect(grade.reportedBy).toBe('ابن حجر العسقلاني');
      }
      expect(item.grades.some(grade => grade.rank !== 'isnad-sahih'), `${item.id} needs a grade of the hadith, not only its chain`).toBe(true);
      for (const grade of item.grades) {
        expect(grade.quote).toMatch(words[grade.rank]);
        expect(grade.scholar.length).toBeGreaterThan(0);
        const { source, volume, page } = grade.citation;
        expect(SOURCES.some(entry => entry.id === source && entry.edition)).toBe(true);
        if (source === 'nataij-afkar') {
          const key = `nataij-${volume}-${page}`;
          const context = grading.get(key);
          expect(context, key).toContain(grade.quote);
          expect(grade.citation.url).toBe(`https://shamela.ws/book/30108/${pages.get(key)}`);
          if (item.content.kind === 'text') {
            const plain = (text: string) => text.replace(/[\u064B-\u0652\u0670]/g, '').replace(/[أإآ]/g, 'ا');
            const said = plain(item.content.text).split(/[\s،.]+/).filter(word => word.length > 3);
            const found = said.filter(word => plain(context!).includes(word.replace(/^و/, '')));
            expect(found.length, `${item.id}: ${key} is about another hadith`).toBeGreaterThanOrEqual(Math.min(3, said.length));
          }
        } else {
          expect(authorReport(grade.citation.report)).toContain(grade.quote);
          expect(grade.citation.url).toBe(item.citation.url);
        }
        if (grade.scholar === 'الترمذي' || grade.scholar === 'الحاكم أبو عبد الله') expect(grade.reportedBy).toBe('النووي');
      }
    }
    expect(dhikrById('waking-spirit')?.grades.map(grade => [grade.scholar, grade.rank])).toEqual([
      ['النووي', 'isnad-sahih'], ['ابن حجر العسقلاني', 'hasan'],
    ]);
  });

  it('gives a counter only the sourced target and the whole selection as its unit', () => {
    const counted = ADHKAR.filter(item => item.repeat);
    expect(counted.map(item => [item.citation.report, item.repeat!.count])).toEqual([[207, 3], [213, 3], [206, 100], [215, 4], [255, 3], [259, 3]]);
    for (const item of counted) {
      expect(item.repeat!.scope).toBe('whole-selection');
      expect(authorReport(item.citation.report)).toContain(item.repeat!.quote);
    }
    // Abu Bakrah's three times is his own practice, quoted in the reference: no counter.
    expect(dhikrById('morning-evening-wellness')?.repeat).toBeUndefined();
    expect(dhikrById('prayer-peace')?.repeat).toBeUndefined();
    expect(dhikrById('sleep-side')?.repeat).toBeUndefined();
    expect(dhikrById('waking-life')?.repeat).toBeUndefined();
  });

  it('preserves both printed variants without manufacturing an evening substitution', () => {
    const morning = dhikrById('morning-by-you')!.content;
    const evening = dhikrById('evening-by-you')!.content;
    expect(morning.kind).toBe('text');
    expect(evening.kind).toBe('text');
    if (morning.kind !== 'text' || evening.kind !== 'text') throw new Error('expected report 208 text');
    expect(morning.text).toContain('وَبِكَ أمْسَيْنا');
    expect(evening.text).not.toContain('وَبِكَ أصْبَحْنا');
    expect(evening.text).toContain('وَإِلَيْكَ النُّشُورُ');
    expect(evening.text).not.toContain('المصير');
  });

  it('stores the Quran selection as positions, with no Quran wording or local font/display path', () => {
    const item = dhikrById('morning-evening-protection')!;
    expect(item.content).toEqual({ kind: 'quran', ranges: [
      { surah: 112, from: 1, to: 4 }, { surah: 113, from: 1, to: 5 }, { surah: 114, from: 1, to: 6 },
    ] });
    expect(item.repeat?.scope).toBe('whole-selection');
    expect(item.virtueQuote).toBe('تَكْفِيكَ مِنْ كُلّ شئ');
  });
});
