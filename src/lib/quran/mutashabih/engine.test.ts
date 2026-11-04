import { describe, expect, it } from 'vitest';
import corpus from '@/app/quran/branches/trees.json';
import { groups as artifact } from './data';
import type { BranchAyah } from '@/lib/quran/branches';
import { normalizeWord } from '@/lib/quran/normalize';
import { buildGroups, compareAyat } from './engine';

const byKey = new Map(corpus.ayat.map(ayah => [ayah.key, ayah]));
const ayah = (key: string) => {
  const result = byKey.get(key);
  if (!result) throw new Error(`Missing corpus ayah ${key}`);
  return result;
};

const benchmarks = [
  ['Z01', '2:58', '7:161', ['inversion']],
  ['Z02', '2:6', '36:10', ['addition_omission']],
  ['Z03', '2:129', '2:151', ['order']],
  ['Z04', '2:61', '3:21', ['definiteness']],
  ['Z05', '2:80', '3:24', ['number']],
  ['Z06', '2:35', '7:19', ['particle']],
  ['Z07', '2:170', '31:21', ['word']],
  ['Z08', '8:13', '59:4', ['assimilation']],
  ['Z09', '2:219', '2:266', []],
  ['Z10', '3:126', '8:10', ['inversion']],
  ['K01', '2:35', '7:19', ['particle', 'addition_omission']],
  ['K02', '2:48', '2:123', ['order', 'word']],
  ['K03', '2:49', '14:6', ['addition_omission']],
  ['K04', '2:58-59', '7:161-162', ['particle', 'addition_omission', 'order', 'number', 'word']],
  ['K05', '2:61', '3:21', ['definiteness']],
  ['K06', '2:80', '3:24', ['number']],
  ['K07', '2:136', '3:84', ['particle', 'addition_omission']],
  ['K08', '2:170', '31:21', ['word']],
  ['K09', '8:13', '59:4', ['assimilation', 'addition_omission']],
  ['K10', '55:13', '55:16', []],
  ['I01', '2:35', '7:19', ['particle']],
  ['I02', '2:48', '2:123', ['order', 'word']],
  ['I03', '2:49', '14:6', ['addition_omission']],
  ['I04', '2:58-59', '7:161-162', ['particle', 'number', 'addition_omission', 'order']],
  ['I05', '2:61', '3:21', ['definiteness']],
  ['I06', '2:62', '5:69', ['order', 'case']],
  ['I07', '2:80', '3:24', ['number']],
  ['I08', '2:126', '14:35', ['definiteness']],
  ['I09', '2:136', '3:84', ['particle', 'addition_omission']],
  ['I10', '2:170', '31:21', ['word']],
] as const;

const negatives = [
  ['2:153', '3:5'],
  ['2:195', '4:40'],
  ['2:222', '35:38'],
  ['4:58', '29:6'],
  ['16:90', '61:4'],
  ['2:228', '13:3'],
  ['2:248', '16:69'],
  ['3:13', '16:65'],
  ['3:49', '23:30'],
  ['16:13', '16:79'],
  ['69:3', '74:27'],
  ['83:8', '86:2'],
  ['83:19', '90:12'],
  ['97:2', '101:10'],
  ['101:3', '104:5'],
] as const;

const placeFor = (location: string) => {
  const [key, last] = location.split('-');
  return last ? { key, through: `${key.split(':')[0]}:${last}` } : { key };
};

describe('the classical benchmark groups', () => {
  it.each(benchmarks)('%s retains both places, the documented differences, and a citation', (id, a, b, tags) => {
    const group = artifact.find(group => group.citations.some(citation => citation.id === id));
    expect(group).toBeDefined();
    expect(group?.places).toEqual(expect.arrayContaining([expect.objectContaining(placeFor(a)), expect.objectContaining(placeFor(b))]));
    expect(group?.tags).toEqual(expect.arrayContaining([...tags]));
    expect(group?.kind).toBe(id === 'Z09' ? 'shared_phrase' : id === 'K10' ? 'identical' : 'mutashabih_lafzi');
    const citation = group?.citations.find(citation => citation.id === id);
    expect(citation?.book.trim()).toBeTruthy();
    expect(citation?.edition.trim()).toBeTruthy();
    expect(citation?.locator.trim()).toBeTruthy();
    expect(citation?.quote.trim()).toBeTruthy();
    expect(citation?.url).toMatch(/^https:\/\//);
  });

  it.each([
    ['K03', ['2:49', '7:141', '14:6']],
    ['I06', ['2:62', '5:69', '22:17']],
  ] as const)('%s preserves the third place the book discusses', (id, keys) => {
    const group = artifact.find(group => group.citations.some(citation => citation.id === id));
    expect(group?.places.map(place => place.key)).toEqual(expect.arrayContaining([...keys]));
  });

  it('groups the four رسولا منهم passages together and records the moved words', () => {
    const keys = ['2:129', '2:151', '3:164', '62:2'];
    const group = artifact.find(group => group.kind === 'mutashabih_lafzi' && keys.every(key => group.places.some(place => place.key === key)));
    expect(group?.tags).toContain('order');
  });

  it('marks both words of the 2:48 and 2:123 swap in each ayah', () => {
    const group = artifact.find(group => group.citations.some(citation => citation.id === 'K02'));
    const differences: Record<string, number[]> | undefined = group?.differences;
    expect(group?.tags).toContain('order');
    for (const key of ['2:48', '2:123']) {
      const highlighted = differences?.[key]?.map(index => normalizeWord(ayah(key).words[index]));
      expect(highlighted?.some(word => /^شفا?عه$/.test(word))).toBe(true);
      expect(highlighted).toContain('عدل');
    }
  });
});

describe('automatic matching', () => {
  it.each(negatives)('%s and %s do not become a verbal parallel just because they share a formula', (a, b) => {
    expect(compareAyat(ayah(a), ayah(b)).kind).not.toBe('mutashabih_lafzi');
    expect(artifact.some(group => group.kind === 'mutashabih_lafzi' && [a, b].every(key => group.places.some(place => place.key === key)))).toBe(false);
  });

  it('keeps every automatic pair strong within the published word spans', () => {
    for (const group of artifact.filter(group => group.kind === 'mutashabih_lafzi' && group.citations.length === 0)) {
      const selected = group.places.map(place => {
        const original = ayah(place.key);
        return {
          ...original,
          words: original.words.slice(place.start, place.end),
          roots: original.roots?.slice(place.start, place.end),
          lemmas: original.lemmas?.slice(place.start, place.end),
          conjs: original.conjs?.slice(place.start, place.end),
        };
      });
      for (let i = 0; i < selected.length; i++) for (let j = i + 1; j < selected.length; j++) {
        const comparison = compareAyat(selected[i], selected[j]);
        expect(comparison.score, group.id).toBeGreaterThanOrEqual(0.72);
        expect(comparison.columns.filter(column => column.level && column.level !== 'root').length, group.id).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it('ranks a near-complete parallel above a short shared span', () => {
    const short = artifact.find(group => group.places.some(place => place.key === '2:4') && group.places.some(place => place.key === '4:162'))!;
    const close = artifact.find(group => group.citations.some(citation => citation.id === 'K02'))!;
    expect(short.score).toBeLessThan(close.score);
    expect(short.score).toBeLessThan(0.5);
  });

  it('keeps an automatically detected exact repeat', () => {
    expect(compareAyat(ayah('55:13'), ayah('55:16')).kind).toBe('identical');
  });

  it('rejects a three-place chain when the two endpoints are not a strong match', () => {
    const verse = (key: string, words: string): BranchAyah => ({ key, page: 1, words: words.split(' ') });
    const a = verse('1:1', 'بحر سفينة كتب كتاب حكمة علم جبل طريق');
    const b = verse('1:2', 'نهر قارب كتب كتاب حكمة علم جبل طريق');
    const c = verse('1:3', 'نهر قارب كتب كتاب حكمة علم واد سبيل');
    expect(compareAyat(a, b).kind).toBe('mutashabih_lafzi');
    expect(compareAyat(b, c).kind).toBe('mutashabih_lafzi');
    expect(compareAyat(a, c).kind).not.toBe('mutashabih_lafzi');
    const groups = buildGroups([a, b, c]).filter(group => group.kind === 'mutashabih_lafzi');
    expect(groups.some(group => group.places.length === 3)).toBe(false);
    expect(groups.map(group => group.places.map(place => place.key))).toEqual(expect.arrayContaining([['1:1', '1:2'], ['1:2', '1:3']]));
  });
});

describe('alignment levels', () => {
  it.each([
    ['exact', 'كَتَبَ', 'كَتَبَ', 'ktb', 'ktb', 'katab', 'katab'],
    ['letters', 'كَتَبَ', 'كُتِبَ', 'ktb', 'ktb', 'katab', 'katab'],
    ['lemma', 'كِتَابٌ', 'كُتُبٌ', 'ktb', 'ktb', 'kitab', 'kitab'],
    ['root', 'نُورٌ', 'أَنَارَ', 'nwr', 'nwr', 'nur', 'anar'],
  ] as const)('records the %s level for aligned words', (level, left, right, leftRoot, rightRoot, leftLemma, rightLemma) => {
    const a: BranchAyah = { key: '1:1', page: 1, words: [left], roots: [leftRoot], lemmas: [leftLemma] };
    const b: BranchAyah = { key: '1:2', page: 1, words: [right], roots: [rightRoot], lemmas: [rightLemma] };
    expect(compareAyat(a, b).columns).toEqual(expect.arrayContaining([expect.objectContaining({
      a: { key: '1:1', index: 0 },
      b: { key: '1:2', index: 0 },
      level,
    })]));
  });
});
