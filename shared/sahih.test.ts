import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import bukhariIndex from './data/hadith/bukhari.json';
import { findHadith, placeOf, searchSahih, type SahihIndex, type SahihText } from './sahih';
import { sahihKitabQuestions } from './quiz/sahih';
import { seededRandom } from './quiz/feedQuiz';

const index = bukhariIndex as SahihIndex;
const text = JSON.parse(readFileSync(join(__dirname, '../data/hadith/sahih/bukhari.json'), 'utf8')) as SahihText;

describe('the Sahihayn', () => {
  it('opens a number Abd al-Baqi gives a record printed under another to that record', () => {
    const record = text.kitabs.flatMap(file => file.hadith).find(hadith => hadith.also?.length)!;
    expect(findHadith(text, record.also![0])?.hadith).toBe(record);
  });

  it('places al-Bukhari\'s first hadith in «بدء الوحي»', () => {
    expect(placeOf(index, 1)?.kitab.title).toBe('بدء الوحي');
  });

  it('finds a hadith by its words typed without marks or hamzas', () => {
    const { hadith } = searchSahih([{ index, text }], 'انما الاعمال بالنيات');
    expect(hadith.map(hit => hit.n)).toContain(1);
  });

  it('finds a bab heading typed without marks, and only babs whose kitab and heading hold every word', () => {
    const { babs } = searchSahih([{ index }], 'فضل الوضوء');
    expect(babs.length).toBeGreaterThan(0);
    for (const hit of babs) {
      const kitab = index.kitabs.find(each => each.n === hit.kitab)!;
      const words = `${kitab.title} ${kitab.babs[hit.bab!].title}`.replace(/[ً-ْ]/g, '');
      expect(words).toMatch(/فضل/);
      expect(words).toMatch(/الوضوء/);
    }
  });
});

describe('«في أيّ كتاب؟»', () => {
  const bare = (s: string) => s.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim();
  const questions = sahihKitabQuestions(seededRandom(3));

  it('the right kitab holds the bab, and no wrong one holds a bab of the same heading', () => {
    for (const question of questions.filter(each => each.key.includes(':bukhari:'))) {
      const [, , kitabN, babAt] = question.key.split(':');
      const kitab = index.kitabs.find(each => each.n === Number(kitabN))!;
      const heading = kitab.babs[Number(babAt)].title;
      expect(question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic).toBe(bare(kitab.title));
      const wrong = question.choices.filter(choice => choice.value !== question.correctAnswer).map(choice => index.kitabs.find(each => bare(each.title) === choice.labelArabic)!);
      for (const other of wrong) expect(other.babs.some(bab => bare(bab.title) === bare(heading)), `${heading} in ${other.title}`).toBe(false);
    }
  });

  it('never asks a bab whose heading names its kitab («باب فضل الوضوء» in «كتاب الوضوء»)', () => {
    const wudu = index.kitabs.find(kitab => bare(kitab.title) === 'كتاب الوضوء')!;
    expect(questions.some(question => question.key.startsWith(`SAHIH_KITAB:bukhari:${wudu.n}:`) && /الوضوء/.test(bare(question.promptArabic)))).toBe(false);
  });
});
