import { expect, it } from 'vitest';
import { groupPresentation } from './presentation';
import { phrasePresentation } from '../phraseTrees';
import { ayahEnds, type BranchAyah } from '../branches';
import { groups } from './data';
import { groupHasId } from './identity';
import { num } from '../arabicNumber';
import data from '../../data/quran/trees.json';

const ayat = new Map<string, BranchAyah>(data.ayat.map(ayah => [ayah.key, ayah]));

it('uses the same continuation for the الم group and phrase', () => {
  const group = groups.find(group => groupHasId(group, 'group:2:1,3:1,29:1,30:1,31:1,32:1'))!;
  const plain = phrasePresentation(group.tree, data.ayat);
  const presentation = groupPresentation(group, ayat);
  expect(ayahEnds(presentation.tree)).toEqual(ayahEnds(plain.tree));
  expect(presentation.ayat).toEqual(plain.ayat);
});

it('keeps explicit multi-ayah passages complete without repeating their final ayah', () => {
  for (const group of groups.filter(group => group.places.some(place => place.through))) {
    const presentation = groupPresentation(group, ayat);
    const ends = ayahEnds(presentation.tree);
    for (const place of group.places.filter(place => place.through)) {
      const passage = presentation.ayat.find(ayah => ayah.key === place.key)!;
      const last = ayat.get(place.through!)!;
      const first = ayat.get(place.key)!;
      expect(passage.words).toEqual([...first.words, `﴿${num(Number(place.key.split(':')[1]))}﴾`, ...last.words]);
      expect(ends[place.key]).toBe(place.through);
      expect(ayat.has(ends[place.key])).toBe(true);
    }
  }
});

it('stops automatic continuation at the end of the selected juz', () => {
  const keys = ['44:59', '45:37'];
  const places = keys.map(key => ({ key, start: 0, end: 1 }));
  const base = groups[0];
  const group = { ...base, places, tree: { ...base.tree, occurrences: places } };
  const corpus = new Map<string, BranchAyah>([
    ['44:59', { key: '44:59', page: 498, words: ['مشترك'] }],
    ['45:1', { key: '45:1', page: 499, words: ['داخل'] }],
    ['45:37', { key: '45:37', page: 502, words: ['مشترك'] }],
    ['46:1', { key: '46:1', page: 502, words: ['خارج'] }],
  ]);
  const presentation = groupPresentation(group, corpus, { from: 25, to: 25 });
  expect(ayahEnds(presentation.tree)).toEqual({ '44:59': '45:1', '45:37': '45:37' });
  expect(presentation.ayat.flatMap(ayah => ayah.words)).not.toContain('خارج');
});

it('does not jump over excluded chapters when a sparse selection ends a passage', () => {
  const keys = ['50:45', '60:13'];
  const places = keys.map(key => ({ key, start: 0, end: 1 }));
  const group = { ...groups[0], places, tree: { ...groups[0].tree, occurrences: places } };
  const corpus = new Map<string, BranchAyah>([
    ['50:45', { key: '50:45', page: 520, words: ['مشترك'] }],
    ['51:1', { key: '51:1', page: 520, words: ['خارج'] }],
    ['60:1', { key: '60:1', page: 549, words: ['داخل'] }],
    ['60:13', { key: '60:13', page: 551, words: ['مشترك'] }],
    ['61:1', { key: '61:1', page: 551, words: ['خارج'] }],
  ]);
  const presentation = groupPresentation(group, corpus, null, { surahs: '50,60' });
  expect(ayahEnds(presentation.tree)).toEqual({ '50:45': '50:45', '60:13': '60:13' });
  expect(presentation.ayat.flatMap(ayah => ayah.words)).toEqual(['مشترك', 'مشترك']);
});
