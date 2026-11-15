import { describe, expect, it } from 'vitest';
import { irabWordsAt } from '@shared/quran/irabData';
import { irabAyah } from './irab';

describe('the reader\'s i\'rab for an ayah', () => {
  it('finds the pressed word from its place on the page', async () => {
    const ayah = await irabAyah('112:4', 604, 3);
    expect(ayah.words).toHaveLength(5);
    expect(ayah.word).toBe(3);
    expect(ayah.lines[3].role).toBe('خبر يكن');
    expect(ayah.ukbari.some(entry => entry[2] === 3 && entry[4] === 1309)).toBe(true);
  });

  it('leaves out the ۞ mark when it counts the pressed word', async () => {
    // Page 49 opens al-Baqara 283 with ۞; its spans count the mark as the ayah's first.
    const ayah = await irabAyah('2:283', 49, 1);
    expect(ayah.words[0]).not.toBe('۞');
    expect(ayah.word).toBe(0);
    expect(ayah.words.length).toBe(irabWordsAt('2:283').length);
  });

  it('starts on the first word when no word was pressed', async () => {
    expect((await irabAyah('1:2')).word).toBe(0);
  });
});
