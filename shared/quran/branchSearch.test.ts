import { expect, it } from 'vitest';
import { searchSharedPhrases } from './branchSearch';

it('does not qualify a broad tree through wording found only in an absorbed alias', () => {
  const broad = { id: 'broad', text: 'أولئك هم', aliases: ['أولئك على هدى من ربهم'], count: 58 };
  const focused = { id: 'focused', text: 'أولئك على هدى من ربهم', count: 2 };
  expect(searchSharedPhrases([broad, focused], 'على هدى').map(item => item.id)).toEqual(['focused']);
});

it('does not silently shorten a query to a matching suffix', () => {
  expect(searchSharedPhrases([{ id: 'short', text: 'على هدى', count: 2 }], 'ليس على هدى')).toEqual([]);
});

it('retains named family English search and Arabic normalization', () => {
  const family = { id: 'family', text: 'الحامدات', textEn: 'The praising chapters', count: 5 };
  expect(searchSharedPhrases([family], 'praising')).toEqual([family]);
  expect(searchSharedPhrases([family], 'الْحَامِدَات')).toEqual([family]);
});
