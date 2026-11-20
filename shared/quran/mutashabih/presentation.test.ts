import { expect, it } from 'vitest';
import { groupPresentation } from './presentation';
import { phrasePresentation } from '../phraseTrees';
import { ayahEnds, type BranchAyah } from '../branches';
import { groups } from './data';
import { num } from '../arabicNumber';
import data from '../quranText/corpus';

const ayat = new Map<string, BranchAyah>(data.ayat.map(ayah => [ayah.key, ayah]));

it('shows a book\'s card exactly as the book names its ayat: no row reads on into the next ayah', () => {
  // al-Kirmani's «في الأرض ولا في السماء» (3:5, 10:61, 14:38, 20:4, 29:22) ends 3:5 and 14:38, yet 3:6 and 14:39 are not his.
  for (const group of groups.filter(group => group.citations.length)) {
    const ends = ayahEnds(groupPresentation(group, ayat).tree);
    for (const place of group.places) expect([group.id, ends[place.key]]).toEqual([group.id, place.through ?? place.key]);
  }
});

it('uses the same continuation for an uncited group and its phrase', () => {
  const group = groups.find(group => !group.citations.length && !group.places.some(place => place.through) && group.places.length > 2)!;
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
      const whole = [...first.words, `﴿${num(Number(place.key.split(':')[1]))}﴾`, ...last.words];
      expect(passage.words.slice(0, whole.length)).toEqual(whole);
      expect(ayat.has(ends[place.key])).toBe(true);
      // A passage reads on past its last ayah only as every tree does: while another row stays identical to it
      // (al-Hijr 15:36-37 and Sad 38:79-80 both go on into «إلى يوم الوقت المعلوم»), never repeating its last ayah.
      if (passage.words.length === whole.length) expect(ends[place.key]).toBe(place.through);
      else {
        const [surah, through] = place.through!.split(':').map(Number);
        const [endSurah, end] = ends[place.key].split(':').map(Number);
        expect(endSurah === surah && end > through).toBe(true);
        // The ayah after the passage follows its end marker, not a second copy of the passage's last ayah.
        expect(passage.words.slice(whole.length + 1, whole.length + 1 + last.words.length)).not.toEqual(last.words);
      }
    }
  }
});

it('stops automatic continuation at the end of the selected juz', () => {
  const keys = ['44:59', '45:37'];
  const places = keys.map(key => ({ key, start: 0, end: 1 }));
  const base = groups[0];
  const group = { ...base, citations: [], places, tree: { ...base.tree, occurrences: places } };
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
