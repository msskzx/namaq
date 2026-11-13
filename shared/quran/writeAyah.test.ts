import { describe, expect, it } from 'vitest';
import { maxLetters, writeTargets, writtenRight } from './writeAyah';

describe('writing an ayah\'s first and last words', () => {
  it('asks the first and last three words, or every word of a short ayah', () => {
    expect(writeTargets(12)).toEqual([0, 1, 2, 9, 10, 11]);
    expect(writeTargets(7)).toEqual([0, 1, 2, 4, 5, 6]);
    expect(writeTargets(6)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(writeTargets(2)).toEqual([0, 1]);
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
