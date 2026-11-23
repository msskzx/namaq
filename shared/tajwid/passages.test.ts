import { describe, expect, it } from 'vitest';
import { numberVerses, type Poem } from './poem';
import poemData from './tuhfat-al-atfal.json';
import { LAM_RULES, MEEM_RULES, NOON_RULES } from './questions';
import { TUHFA_PASSAGES } from './passages';

const chapters = numberVerses(poemData as Poem);

describe('the tajwid card\'s passages', () => {
  it('give every verse of the rule chapters once, each passage within one chapter (introduction and closing left out)', () => {
    const rules = chapters.slice(1, -1).flatMap(chapter => chapter.verses.map(verse => verse.number));
    expect(TUHFA_PASSAGES.flatMap(passage => passage.verses.map(verse => verse.number))).toEqual(rules);
    for (const passage of TUHFA_PASSAGES) {
      const chapter = chapters.find(each => each.title === passage.chapter)!;
      expect(passage.verses.every(verse => chapter.verses.some(own => own.number === verse.number))).toBe(true);
    }
  });

  it('show the letters of each rule the poem names with the verse that names them', () => {
    for (const rule of [...NOON_RULES, ...MEEM_RULES, ...LAM_RULES]) {
      const passage = TUHFA_PASSAGES.find(each => each.verses.some(verse => verse.number === rule.verse))!;
      expect(passage.letters).toBe(rule.letters);
    }
  });
});
