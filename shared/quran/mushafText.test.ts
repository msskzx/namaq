import { expect, it } from 'vitest';
import data from './quranText/corpus';
import { mushafText } from './mushafText';

it('leaves the trees\' words as the Madina page prints them, signs and all (they come from the pages)', () => {
  const changed = data.ayat.flatMap(ayah => ayah.words.filter(word => mushafText(word) !== word).map(word => `${ayah.key} ${word}`));
  expect(changed).toEqual([]);
  expect(mushafText(data.ayat.find(ayah => ayah.key === '27:26')!.words.at(-1)!)).toMatch(/۩$/);
});

it('leaves an ayah number bare so the font draws one medallion, not one inside ﴿﴾', () => {
  expect(mushafText('﴿٤٣﴾')).toBe('٤٣');
  expect(mushafText('ٱلۡمُتَّقِينَ ﴿٤٣﴾ فِي')).not.toMatch(/[﴿﴾]/);
});
