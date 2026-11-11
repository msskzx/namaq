import { describe, expect, it } from 'vitest';
import corpus from '@shared/data/quran/trees.json';
import { ayahWords } from '@shared/quran/normalize';
import { PROPHETS } from '@shared/quran/prophets';
import { STORIES } from '@shared/quran/prophets/stories';
import { buildStory, storedText, storyKeys } from '@shared/quran/prophets/story';
import { AYAT } from '.';

const quran = new Map((corpus.ayat as { key: string; words: string[] }[]).map(a => [a.key, a.words.join(' ')]));
// Two encodings of the same Hafs text: compare letters only, forgiving the hamza seat (ئ/ي), word breaks, the sajda sign
// (۩ with its direction mark), and a hamza written on the line in one (فَءَامَنُوا۟, 37:148) but over a tatweel in the other.
const letters = (text: string) => ayahWords(text.replace(/[۩\u200f]/g, ''), false).norm.join('').replace(/ئ/g, 'ي').replace(/ء/g, '');

describe.each(PROPHETS)('stored ayat of $slug', ({ slug }) => {
  it('hold exactly the ayat of the story, and the page builds from them', () => {
    const keys = storyKeys(STORIES[slug].events);
    expect(Object.keys(AYAT[slug].ayat).sort()).toEqual([...new Set(keys)].sort());
    expect(() => buildStory(STORIES[slug].events, storedText(AYAT[slug]))).not.toThrow();
  });

  it('match the Quran text the app bundles, letter for letter', () => {
    const wrong = Object.entries(AYAT[slug].ayat).filter(([key, text]) => letters(text) !== letters(quran.get(key) ?? ''));
    expect(wrong.map(([key]) => key)).toEqual([]);
  });
});
