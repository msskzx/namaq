import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import { branchesHref, conjunctions, linkId, stem, openingId, readerAyat, searchKey, searchPhrases, sharedOpenings, withConjunctions, withNext, type BranchAyah } from '@shared/quran/branches';
import { inJuzRange } from '@shared/quran/juz';

const all = data.ayat as BranchAyah[];
const groups = sharedOpenings(all);
const ayah = (key: string, text: string): BranchAyah => ({ key, page: 1, words: text.split(' ') });

describe('readerAyat', () => {
  it('reads the ayat in page order, dropping the marks the reader sets beside a word', () => {
    const read = readerAyat([
      { juz: 1, items: [{ surah: 1 }, { line: ['۞ بِسْمِ', 'ٱللَّهِ ۖ', 1, 'ٱلْحَمْدُ'] }] },
      { juz: 1, items: [{ line: ['لِلَّهِ', 'ۛ', 2] }, { surah: 2 }, { line: ['الٓمٓ', 1] }] },
    ]);
    expect(read).toEqual([
      { key: '1:1', page: 1, words: ['بِسْمِ', 'ٱللَّهِ'] },
      { key: '1:2', page: 2, words: ['ٱلْحَمْدُ', 'لِلَّهِ'] },
      { key: '2:1', page: 2, words: ['الٓمٓ'] },
    ]);
  });
});

describe('sharedOpenings', () => {
  it('groups only ayat whose first two words match another ayah', () => {
    const shared = sharedOpenings([ayah('1:1', 'قال رب'), ayah('1:2', 'قَالَ رَبِّ ٱغفر'), ayah('1:3', 'قال'), ayah('1:4', 'قال موسى')]);
    expect([...shared.keys()]).toEqual(['قال رب']);
    expect(shared.get('قال رب')!.map(a => a.key)).toEqual(['1:1', '1:2']);
    expect(openingId(ayah('1:3', 'قال'))).toBeNull();
  });

  it('groups the known chapter letter openings, including all seven الحواميم', () => {
    const expected = {
      'الم': ['2:1', '3:1', '29:1', '30:1', '31:1', '32:1'],
      'الر': ['10:1', '11:1', '12:1', '14:1', '15:1'],
      'طسم': ['26:1', '28:1'],
      'حم': ['40:1', '41:1', '42:1', '43:1', '44:1', '45:1', '46:1'],
    };
    for (const [id, members] of Object.entries(expected)) expect(groups.get(id)?.map(ayah => ayah.key)).toEqual(members);
    expect(openingId(ayah('7:1', 'المص'))).toBe('المص');
    expect(openingId(ayah('42:1', 'حم'))).toBe('حم');
  });

  it('ignores the pause and section marks the reader keeps beside a word', () => {
    const read = readerAyat([{ juz: 1, items: [{ surah: 2 }, { line: ['۞ إِنَّ', 'ٱللَّهَ ۖ', 'عليم', 1, 'إِنَّ', 'ٱللَّهَ', 'غفور', 2] }] }]);
    expect([...sharedOpenings(read)].map(([id, group]) => [id, group.map(a => a.key)])).toEqual([['ان الله', ['2:1', '2:2']]]);
  });

  it('builds the groups from the ayat inside a juz\' range only', () => {
    const inRange = sharedOpenings(all.filter(a => inJuzRange(a.key, { from: 29, to: 30 })));
    expect([...inRange.values()].find(group => group.some(a => a.key === '69:38'))?.map(a => a.key)).toEqual(['69:38', '70:40', '75:1', '75:2', '81:15', '84:16', '90:1']);
  });

  it('keeps the generated artifact as the full Quran corpus', () => {
    expect(all).toHaveLength(6236);
    expect(all.find(ayah => ayah.key === '2:3')?.conjs?.[3]).toBe('و');
    expect(all.find(ayah => ayah.key === '43:83')?.next?.slice(0, 2)).toEqual(['وَهُوَ', 'ٱلَّذِى']);
  });
});

describe('withNext', () => {
  it('grows a synthetic twin into the next surah', () => {
    const read = [ayah('1:1', 'بسم الله الرحمن الرحيم'), ayah('2:1', 'سبح ربك'), ayah('2:2', 'قل هو'), ayah('3:1', 'سبح ربك'), ayah('4:1', 'الم'), ayah('8:2', 'سبح ربك'), ayah('9:1', 'براءة')];
    const grownAyat = withNext(new Map([['سبح ربك', [read[1], read[3], read[5]]]]), read);
    // The next surah's basmala is read before its first ayah; at-Tawbah has none.
    expect(grownAyat.map(a => [a.key, a.next, a.through])).toEqual([['2:1', ['قل', 'هو'], '2:2'], ['3:1', ['بسم', 'الله', 'الرحمن', 'الرحيم', 'الم'], '4:1'], ['8:2', ['براءة'], '9:1']]);
  });
});

describe('conjunctions', () => {
  const morphology = [
    '(52:24:1:1)\twa\tCONJ\tPREFIX|w:CONJ+',
    '(52:24:1:2)\tyaTuwfu\tV\tSTEM|POS:V',
    '(56:75:1:1)\tfa\tREM\tPREFIX|f:REM+',
    '(89:1:1:1)\twa\tP\tPREFIX|w:P+',
    '(2:5:2:1)\twa\tCONJ\tPREFIX|w:CONJ+',
  ].join('\n');

  it('reads a و or ف prefixed to an ayah\'s first word, leaving out the و of an oath', () => {
    expect([...conjunctions(morphology)]).toEqual([['52:24:1', 'و'], ['56:75:1', 'ف'], ['2:5:2', 'و']]);
  });

  it('refuses a reader word that does not start with the letter the corpus gives', () => {
    expect(() => withConjunctions([ayah('52:24', 'يطوف عليهم')], morphology)).toThrow('52:24');
    expect(withConjunctions([ayah('52:24', 'وَيَطُوفُ عليهم')], morphology)[0]).toMatchObject({ conj: 'و', conjs: ['و', null] });
  });
});

describe('an opening with and without و', () => {
  it('keeps the surrounding-ayat switch in tree links, but not on the list', () => {
    expect(branchesHref('يطوف عليهم', undefined, { context: true })).toBe(`/quran/branches?${new URLSearchParams({ o: 'يطوف عليهم', c: '1' })}`);
    expect(branchesHref('', undefined, { context: true })).toBe('/quran/branches');
  });

  it('does not merge a word whose و belongs to it', () => {
    expect(openingId(ayah('1:1', 'وُجُوهٌ يَوْمَئِذٍ'))).toBe('وجوه يومئذ');
  });
});

describe('a juz\' range', () => {
  it('carries the range without a list view parameter', () => {
    expect(branchesHref('فلا اقسم')).toBe(`/quran/branches?o=${encodeURIComponent('فلا اقسم').replace(/%20/g, '+')}`);
    expect(branchesHref('الم تر', { from: 29, to: 30 })).toBe(`/quran/branches?o=${encodeURIComponent('الم').replace(/%20/g, '+')}+${encodeURIComponent('تر')}&juzFrom=29&juzTo=30`);
  });
});

describe('linkId', () => {
  it('puts the joined letter back when every ayah under a branch carries it', () => {
    expect(linkId(['يَطُوفُ', 'عَلَيْهِمْ'], ['', 'و'])).toBe('يطوف عليهم');
    expect(linkId(['قَالَ', 'رَبِّ'], [])).toBe('قال رب');
  });
});

describe('stem', () => {
  it('drops only the joined letter and its marks, even when the word goes on with the same letter', () => {
    expect(stem({ key: '1:1', page: 1, words: ['وَوَصَّيْنَا', 'ٱلْإِنسَـٰنَ'], conj: 'و' }).words[0]).toBe('وَصَّيْنَا');
    expect(stem(ayah('1:1', 'وَوَصَّيْنَا')).words[0]).toBe('وَوَصَّيْنَا');
  });
});

describe('search', () => {
  // The phrases the page searches: the built phrase trees.
  const phrases = data.trees.map(group => ({ id: group.id, text: group.text, count: group.occurrences.length }));

  it('reads يا apart and ءا as one alif, as the text joins them', () => {
    expect(searchKey('يا أيها الذين آمنوا')).toBe(searchKey('يايها الذين ءامنوا'));
    expect(searchPhrases([{ id: 'يايها الذين ءامنوا', text: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟', count: 2 }], 'يا أيها الذين آمنوا')).toHaveLength(1);
  });

  it('reads يا قوم and يا بني as the text writes them', () => {
    expect(searchPhrases(phrases, 'يا قوم').length).toBeGreaterThan(0);
    expect(searchPhrases(phrases, 'يا بني').length).toBeGreaterThan(0);
  });

  it('lists phrases that start with the search before those that only contain it', () => {
    const listed = ['اذ قال رب', 'قال ربي', 'قال رب'].map(id => ({ id, text: id, count: 2 }));
    const found = searchPhrases(listed, 'قال رب').map(phrase => searchKey(phrase.id));
    const starts = found.findIndex(id => !id.startsWith('قال رب'));
    expect(starts).toBeGreaterThan(0);
    expect(found.slice(starts).every(id => !id.startsWith('قال رب') && id.includes('قال رب'))).toBe(true);
  });

  it('carries the search and surah on the list and into an open tree', () => {
    expect(branchesHref('', undefined, { query: 'قال' })).toBe('/quran/branches?q=%D9%82%D8%A7%D9%84');
    expect(branchesHref('قال رب', undefined, { query: 'قال', surah: 7 })).toBe('/quran/branches?o=%D9%82%D8%A7%D9%84+%D8%B1%D8%A8&q=%D9%82%D8%A7%D9%84&s=7');
  });
});

