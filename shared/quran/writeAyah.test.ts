import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { MushafPage } from './readerPage';
import { freshBoxes, gradeWritten, keepsSpace, maxLetters, nextBox, previousBox, typeInBox, wordTargets, writeTargets, writtenRight } from './writeAyah';

describe('writing an ayah\'s first and last words', () => {
  it('asks the first and last three words, or every word of a short ayah', () => {
    expect(writeTargets(12)).toEqual([0, 1, 2, 9, 10, 11]);
    expect(writeTargets(7)).toEqual([0, 1, 2, 4, 5, 6]);
    expect(writeTargets(6)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(writeTargets(2)).toEqual([0, 1]);
  });

  it('asks no box for the ۞ that opens a quarter', () => {
    const ayah = ['۞', 'وَإِذِ', 'ٱبۡتَلَىٰٓ', 'إِبۡرَٰهِـۧمَ', 'رَبُّهُۥ', 'بِكَلِمَٰتٖ', 'فَأَتَمَّهُنَّۖ', 'قَالَ'];
    expect(wordTargets(ayah)).toEqual([1, 2, 3, 5, 6, 7]);
    expect(wordTargets(['۞', 'قُلۡ', 'هُوَ'])).toEqual([1, 2]);
    expect(wordTargets(['قُلۡ', 'هُوَ'])).toEqual(writeTargets(2));
  });

  it('sizes each box by the letters the word is said with', () => {
    expect(maxLetters('وَٱلَّذِينَ')).toBe(6);
    expect(maxLetters('ٱلۡكِتَٰبُ')).toBe(6);
    expect(maxLetters('بِمَآ')).toBe(3);
    expect(maxLetters('هُمۡ')).toBe(2);
    expect(maxLetters('يُوقِنُونَ')).toBe(6);
  });

  it('grades as the quiz leaves do', () => {
    expect(writtenRight('والذين', 'وَٱلَّذِينَ')).toBe(true);
    expect(writtenRight('الكتاب', 'ٱلۡكِتَٰبُ')).toBe(true);
    expect(writtenRight('الكتب', 'ٱلۡكِتَٰبُ')).toBe(true);
    expect(writtenRight('وبالاخرة', 'وَبِٱلۡأٓخِرَةِ')).toBe(true);
    expect(writtenRight('وبالآخره', 'وَبِٱلۡأٓخِرَةِ')).toBe(true);
    expect(writtenRight('بمن', 'بِمَآ')).toBe(false);
    expect(writtenRight('الذين', 'وَٱلَّذِينَ')).toBe(false);
    expect(writtenRight('', 'هُمۡ')).toBe(false);
  });
});

// Words as the mushaf data stores them (the order of a word's marks matters), found by their bare letters.
const mushafWords = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(new URL(`../data/quran/mushaf/${i + 1}.json`, import.meta.url), 'utf8')) as MushafPage)
  .flatMap(page => page.items.flatMap(item => ('line' in item ? item.line : []).filter((token): token is string => typeof token === 'string')));
const bare = (word: string) => word.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u0653]/g, '');
const inMushaf = (letters: string) => {
  const found = mushafWords.find(word => bare(word) === letters);
  if (!found) throw new Error(`no mushaf word ${letters}`);
  return found;
};

describe('the letters people type for what the mushaf writes small', () => {
  it('lets the common spelling fill its box before moving on', () => {
    const typed: [string, string][] = [
      ['شيئا', 'شيا'], ['يسألونك', 'يسلونك'], ['سيئاتكم', 'سياتكم'], ['خاسئين', 'خسين'], ['يئوده', 'يوده'],
      ['إبراهيم', 'إبرهم'], ['النبيين', 'ٱلنبين'], ['داوود', 'داود'], ['تلوون', 'تلون'], ['ننجي', 'نجي'],
      ['إيلافهم', 'إلفهم'], ['الموءودة', 'ٱلموءدة'], ['ءاتاني', 'ءاتىن'],
      ['بآياتنا', 'بايتنا'], ['المآب', 'ٱلماب'], ['الآن', 'ٱلن'], ['له', 'له'], ['به', 'به'], ['موسى', 'موسى'],
    ];
    for (const [spelling, letters] of typed) {
      const word = inMushaf(letters);
      expect(writtenRight(spelling, word), spelling).toBe(true);
      expect(maxLetters(word), spelling).toBe([...spelling].length);
    }
  });

  it('keeps the box after a vocative يا or ها typed apart', () => {
    expect(keepsSpace('يا ', inMushaf('يقوم'))).toBe(true);
    expect(keepsSpace('يا ', inMushaf('يأيها'))).toBe(true);
    expect(keepsSpace('ويا ', inMushaf('ويقوم'))).toBe(true);
    expect(keepsSpace('ها ', inMushaf('هأنتم'))).toBe(true);
    expect(writtenRight('يا قوم', inMushaf('يقوم'))).toBe(true);
    expect(keepsSpace('يا ', inMushaf('يوم'))).toBe(false);
    expect(keepsSpace('قوم ', inMushaf('يقوم'))).toBe(false);
  });
});

describe('the write boxes', () => {
  const words = ['قَالَ', 'رَبِّ', 'ٱشۡرَحۡ', 'لِي', 'صَدۡرِي'];
  const asked = [0, 1, 4];

  it('fill a box, move on with a space or a full box, and finish on the last', () => {
    let boxes = freshBoxes(asked);
    expect(boxes.current).toBe(0);
    let step = typeInBox(boxes, asked, words, 'قال ');
    expect(step).toEqual({ boxes: { typed: { 0: 'قال' }, current: 1 }, finished: false });
    step = typeInBox(step.boxes, asked, words, 'رب');
    expect(step.boxes.current).toBe(4);
    boxes = step.boxes;
    step = typeInBox(boxes, asked, words, 'صدر', true);
    expect(step.finished).toBe(false);
    step = typeInBox(boxes, asked, words, 'صدري');
    expect(step.finished).toBe(true);
    expect(gradeWritten(asked, step.boxes.typed, words)).toEqual({ right: [0, 1, 4], wrong: [], typed: {} });
  });

  it('go back from an empty box and grade a wrong word with what was typed', () => {
    expect(previousBox({ typed: {}, current: 0 }, asked)).toBeNull();
    expect(previousBox({ typed: {}, current: 4 }, asked)?.current).toBe(1);
    expect(nextBox({ typed: {}, current: 4 }, asked).finished).toBe(true);
    expect(gradeWritten(asked, { 0: 'قال', 1: 'خطا', 4: 'صدري' }, words)).toEqual({ right: [0, 4], wrong: [1], typed: { 1: 'خطا' } });
  });
});
