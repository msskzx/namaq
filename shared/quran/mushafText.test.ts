import { expect, it } from 'vitest';
import data from './quranText/corpus';
import words from '../data/quran/mushafWords.json';

it('leaves the trees\' words as the Madina page prints them, signs and all (they come from the pages)', async () => {
  const { mushafText } = await import('./mushafText');
  const changed = data.ayat.flatMap(ayah => ayah.words.filter(word => mushafText(word) !== word).map(word => `${ayah.key} ${word}`));
  expect(changed).toEqual([]);
  expect(mushafText(data.ayat.find(ayah => ayah.key === '27:26')!.words.at(-1)!)).toMatch(/۩$/);
});

it('turns a word of the older copies into the page\'s spelling', async () => {
  const { mushafText } = await import('./mushafText');
  const display: Record<string, string> = words;
  const [old, page] = Object.entries(display).find(([key, value]) => key !== value)!;
  expect(mushafText(old)).toBe(page);
});

it('leaves an ayah number bare so the font draws one medallion, not one inside ﴿﴾', async () => {
  const { mushafText } = await import('./mushafText');
  expect(mushafText('﴿٤٣﴾')).toBe('٤٣');
  expect(mushafText('ٱلۡمُتَّقِينَ ﴿٤٣﴾ فِي')).not.toMatch(/[﴿﴾]/);
});
