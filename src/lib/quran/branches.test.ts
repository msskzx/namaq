import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { branch, branchesHref, conjunctions, listPage, PIECE_MAX, pieces, DEFAULT_PHRASE, keys, linkId, pickPhrase, stem, widerPhrases, listOpenings, listPhrases, openingId, readerAyat, sharedOpenings, shown, startingWith, variants, withConjunctions, type Branch, type BranchAyah } from './branches';
import { inJuzRange } from './juz';
import { normalizeWord } from './normalize';

const all = ayat as BranchAyah[];
const groups = sharedOpenings(all);
const shape = (node: Branch): unknown => ({ words: node.words.map(normalizeWord).join(' '), ayat: node.ayat, children: node.children.map(shape) });
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

  it('ignores the pause and section marks the reader keeps beside a word', () => {
    const read = readerAyat([{ juz: 1, items: [{ surah: 2 }, { line: ['۞ إِنَّ', 'ٱللَّهَ ۖ', 'عليم', 1, 'إِنَّ', 'ٱللَّهَ', 'غفور', 2] }] }]);
    const shared = sharedOpenings(read);
    expect(listOpenings(shared)).toEqual([{ id: 'إن الله', text: 'إِنَّ ٱللَّهَ', count: 2 }]);
    expect(branch(shared.get('إن الله')!).words).toEqual(['إِنَّ', 'ٱللَّهَ']);
  });

  it('matches what npm run quran:branches writes from the reader pages', () => {
    const pages = Array.from({ length: 604 }, (_, i) => JSON.parse(readFileSync(join(__dirname, '../../app/quran/read/data', `${i + 1}.json`), 'utf8')));
    const morphology = readFileSync(join(__dirname, '../../../data/quran/quranic-corpus-morphology-0.4.txt'), 'utf8');
    expect([...sharedOpenings(withConjunctions(readerAyat(pages), morphology)).values()].flat()).toEqual(all);
  });

  it('keeps every committed ayah in a group of two or more', () => {
    expect(groups.size).toBe(816);
    expect([...groups.keys()].every(id => id === id.trim() && !id.includes('  '))).toBe(true);
    expect([...groups.values()].flat()).toHaveLength(all.length);
  });

  it('lists the largest openings first', () => {
    const list = listOpenings(groups);
    expect(list[0]).toMatchObject({ id: 'يايها الذين', count: 90 });
    expect(list.every((o, i) => i === 0 || list[i - 1].count >= o.count)).toBe(true);
  });
});

describe('branch', () => {
  it('splits the six ayat that open with إن المتقين where their wording parts', () => {
    expect(shape(branch(groups.get('إن المتقين')!))).toEqual({
      words: 'ان المتقين في',
      ayat: [],
      children: [
        {
          words: 'جنت',
          ayat: [],
          children: [
            { words: 'وعيون', ayat: ['15:45', '51:15'], children: [] },
            { words: 'ونعيم', ayat: ['52:17'], children: [] },
            { words: 'ونهر', ayat: ['54:54'], children: [] },
          ],
        },
        { words: 'مقام امين', ayat: ['44:51'], children: [] },
        { words: 'ظلل وعيون', ayat: ['77:41'], children: [] },
      ],
    });
  });

  it('lists an ayah that ends where a longer one goes on', () => {
    expect(shape(branch([ayah('1:1', 'قال رب'), ayah('1:2', 'قال رب اغفر لي'), ayah('1:3', 'قال رب انصرني')]))).toEqual({
      words: 'قال رب',
      ayat: ['1:1'],
      children: [
        { words: 'اغفر لي', ayat: ['1:2'], children: [] },
        { words: 'انصرني', ayat: ['1:3'], children: [] },
      ],
    });
  });

  it('places every ayah of a group on exactly one node', () => {
    const keys = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keys)];
    for (const group of groups.values()) expect(keys(branch(group)).sort()).toEqual(group.map(a => a.key).sort());
  });
});

describe('listPhrases', () => {
  const phrases = listPhrases(groups);
  const count = (id: string) => phrases.find(p => p.id === id)?.count;

  it('lists every opening and every phrase two or more ayat share before they part', () => {
    expect(count('الم تر')).toBe(31);
    expect(count('الم تر كيف')).toBe(3);
    expect(count('الم تر كيف فعل ربك')).toBe(2);
    expect(count('إن المتقين في')).toBe(6);
    expect(count('إن المتقين في جنت')).toBe(4);
    expect(count('إن المتقين في جنت وعيون')).toBe(2);
    expect(phrases.every(p => p.count >= 2)).toBe(true);
    expect(new Set(phrases.map(p => p.id)).size).toBe(phrases.length);
  });

  it('agrees with startingWith on how many ayat each phrase opens', () => {
    for (const p of phrases.filter((_, i) => i % 40 === 0)) expect(startingWith(all, p.id)).toHaveLength(p.count);
  });
});

describe('startingWith', () => {
  it('matches whole words only', () => {
    expect(startingWith([ayah('1:1', 'الم تروا'), ayah('1:2', 'الم تر كيف')], 'الم تر').map(a => a.key)).toEqual(['1:2']);
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
    expect([...conjunctions(morphology)]).toEqual([['52:24', 'و'], ['56:75', 'ف']]);
  });

  it('refuses a reader word that does not start with the letter the corpus gives', () => {
    expect(() => withConjunctions([ayah('52:24', 'يطوف عليهم')], morphology)).toThrow('52:24');
    expect(withConjunctions([ayah('52:24', 'وَيَطُوفُ عليهم')], morphology)[0].conj).toBe('و');
  });
});

describe('an opening with and without و', () => {
  const group = startingWith(all, 'يطوف عليهم');

  it('groups يطوف عليهم with ويطوف عليهم and draws one tree from the shared word on', () => {
    expect(group.map(a => a.key)).toEqual(['52:24', '56:17', '76:19']);
    expect(shape(branch(shown(group)))).toEqual({
      words: 'يطوف عليهم',
      ayat: [],
      children: [
        { words: 'غلمان لهم كانهم لؤلؤ مكنون', ayat: ['52:24'], children: [] },
        { words: 'ولدن مخلدون', ayat: ['56:17'], children: [{ words: 'اذا رايتهم حسبتهم لؤلؤا منثورا', ayat: ['76:19'], children: [] }] },
      ],
    });
  });

  it('names each first word, the ayat that open with it and the phrase that narrows to them', () => {
    expect(variants(group).map(v => ({ ...v, word: normalizeWord(v.word) }))).toEqual([
      { word: 'يطوف', conj: '', keys: ['56:17'], id: undefined },
      { word: 'ويطوف', conj: 'و', keys: ['52:24', '76:19'], id: 'ويطوف عليهم' },
    ]);
    expect(variants(startingWith(all, 'ويطوف عليهم'))).toEqual([]);
  });

  it('lists the merged opening and each spelling two ayat share', () => {
    const phrases = listPhrases(groups);
    expect(phrases.find(p => p.id === 'يطوف عليهم')?.count).toBe(3);
    expect(phrases.find(p => p.id === 'ويطوف عليهم')?.count).toBe(2);
    expect(startingWith(all, 'ويطوف عليهم').map(a => a.key)).toEqual(['52:24', '76:19']);
  });

  it('does not merge a word whose و belongs to it', () => {
    expect(openingId(ayah('1:1', 'وُجُوهٌ يَوْمَئِذٍ'))).toBe('وجوه يومئذ');
  });
});

describe('a juz\' range', () => {
  it('builds the groups from the ayat inside it only', () => {
    const inRange = sharedOpenings(all.filter(a => inJuzRange(a.key, { from: 29, to: 30 })));
    const shared = [...inRange.values()].flat();
    expect(startingWith(shared, 'فلا اقسم').map(a => a.key)).toEqual(['69:38', '70:40', '81:15', '84:16']);
    expect(startingWith(all, 'فلا اقسم').map(a => a.key)).toContain('56:75');
  });

  it('carries the range and the list view in the link', () => {
    expect(branchesHref('فلا اقسم')).toBe(`/quran/branches?o=${encodeURIComponent('فلا اقسم').replace(/%20/g, '+')}`);
    expect(branchesHref('الم تر', { from: 29, to: 30 }, { list: true })).toBe(`/quran/branches?o=${encodeURIComponent('الم').replace(/%20/g, '+')}+${encodeURIComponent('تر')}&juzFrom=29&juzTo=30&v=list`);
  });
});

describe('linkId', () => {
  it('puts the joined letter back when every ayah under a branch carries it', () => {
    const group = startingWith(all, 'إذ قال');
    const musa = branch(shown(group)).children.find(child => normalizeWord(child.words[0]) === 'موسي')!;
    const node = musa.children.find(child => normalizeWord(child.words[0]) === 'لقومه')!;
    const id = linkId(['إِذْ', 'قَالَ', ...musa.words, ...node.words], keys(node).map(key => all.find(a => a.key === key)!.conj ?? ''));
    expect(id.startsWith('وإذ قال موسي لقومه')).toBe(true);
    expect(listPhrases(groups).some(p => p.id === id)).toBe(true);
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

describe('pickPhrase and widerPhrases', () => {
  const phrases = listPhrases(groups);

  it('keeps a known phrase, else the default, else the largest opening in range', () => {
    expect(pickPhrase(phrases, 'ويطوف عليهم')).toBe('ويطوف عليهم');
    expect(pickPhrase(phrases, 'لا شيء هنا')).toBe(DEFAULT_PHRASE);
    const juz30 = listPhrases(sharedOpenings(all.filter(a => inJuzRange(a.key, { from: 30, to: 30 }))));
    expect(juz30.some(p => p.id === DEFAULT_PHRASE)).toBe(false);
    expect(pickPhrase(juz30, null)).toBe([...juz30].sort((a, b) => b.count - a.count)[0].id);
    expect(pickPhrase([], null)).toBe('');
  });

  it('offers the merged opening as wider than one spelling of it, and shorter phrases above a deeper one', () => {
    expect(widerPhrases(phrases, 'ويطوف عليهم', startingWith(all, 'ويطوف عليهم')).map(p => p.id)).toEqual(['يطوف عليهم']);
    expect(widerPhrases(phrases, 'إن المتقين في جنت', startingWith(all, 'إن المتقين في جنت')).map(p => p.id)).toEqual(['إن المتقين', 'إن المتقين في']);
    expect(widerPhrases(phrases, 'إن المتقين', startingWith(all, 'إن المتقين'))).toEqual([]);
  });
});

describe('pieces', () => {
  const list = pieces(groups);

  it('cuts every opening at the first node of six ayat or fewer, so each ayah lands in at most one piece', () => {
    expect(list.every(p => p.count >= 2)).toBe(true);
    const seen = list.flatMap(p => p.keys);
    expect(new Set(seen).size).toBe(seen.length);
    expect(list.every(p => p.keys.length === p.count)).toBe(true);
    for (const p of list.filter((_, i) => i % 25 === 0)) expect(startingWith(all, p.id).map(a => a.key)).toEqual(expect.arrayContaining(p.keys));
    expect(list.some(p => p.id === 'يايها الذين')).toBe(false);
  });

  it('sorts by how many words the ayat share, then by fewer ayat', () => {
    expect(list.every((p, i) => i === 0 || list[i - 1].shared > p.shared || (list[i - 1].shared === p.shared && list[i - 1].count <= p.count))).toBe(true);
    expect(list[0].shared).toBe(18);
  });

  it('keeps a larger node whole where no two of its ayat go on together', () => {
    expect(list.find(p => p.id === 'ويل يومئذ للمكذبين')).toMatchObject({ count: 11 });
    expect(list.find(p => p.id === 'فباي ءالاء ربكما تكذبان')).toMatchObject({ count: 31 });
    expect(list.filter(p => p.count > PIECE_MAX).every(p => p.count <= 8 || p.id === 'فباي ءالاء ربكما تكذبان' || p.id === 'ويل يومئذ للمكذبين')).toBe(true);
  });

  it('splits such a node by its first word when the ayat differ in a joined letter', () => {
    expect(list.find(p => p.id === 'فلا اقسم')!.keys).toEqual(['56:75', '69:38', '70:40', '81:15', '84:16']);
    expect(list.find(p => p.id === 'لا اقسم')!.keys).toEqual(['75:1', '90:1']);
    expect(list.some(p => p.keys.includes('75:2'))).toBe(false);
    const juz = pieces(sharedOpenings(all.filter(a => inJuzRange(a.key, { from: 29, to: 30 }))));
    expect(juz.find(p => p.id === 'فلا اقسم')!.keys).toEqual(['69:38', '70:40', '81:15', '84:16']);
  });

  it('keeps a small opening whole and names the opening a piece was cut from', () => {
    expect(list.find(p => p.id === 'يطوف عليهم')).toMatchObject({ count: 3, opening: { id: 'يطوف عليهم', count: 3 } });
    const cut = list.find(p => p.id.startsWith('يايها الذين ءامنوا'))!;
    expect(cut.opening).toMatchObject({ id: 'يايها الذين', count: 90 });
  });

  it('names a piece whose ayat all carry the joined letter by its own spelling', () => {
    expect(list.some(p => p.id.startsWith('وإذ قال موسي لقومه'))).toBe(true);
  });
});

describe('the list\'s pages', () => {
  it('reads the page number, keeping it inside the list', () => {
    expect(listPage(null, 45, 20)).toEqual({ page: 1, pageCount: 3 });
    expect(listPage('2', 45, 20).page).toBe(2);
    expect(listPage('9', 45, 20).page).toBe(3);
    expect(listPage('0', 45, 20).page).toBe(1);
    expect(listPage('abc', 45, 20).page).toBe(1);
    expect(listPage('3', 0, 20)).toEqual({ page: 1, pageCount: 1 });
  });

  it('puts the page in the link only past the first page of a list', () => {
    expect(branchesHref('ان الذين', undefined, { list: true, page: 1 })).not.toContain('p=');
    expect(branchesHref('ان الذين', undefined, { list: true, grouped: true, page: 3 })).toContain('v=list&g=opening&p=3');
    expect(branchesHref('ان الذين', undefined, { page: 3 })).not.toContain('p=');
  });

  it('breaks a tie in shared words and ayat by mushaf order', () => {
    const list = pieces(groups);
    const order = (key: string) => key.split(':').map(Number).reduce((s, n) => s * 1000 + n);
    const first = (p: { keys: string[] }) => Math.min(...p.keys.map(order));
    expect(list.every((p, i) => i === 0 || list[i - 1].shared !== p.shared || list[i - 1].count !== p.count || first(list[i - 1]) < first(p))).toBe(true);
  });
});

describe('hamza below an alif', () => {
  const groupOf = (key: string) => [...groups.values()].find(group => group.some(a => a.key === key))?.map(a => a.key) ?? [];

  it('keeps إن and أن apart, with or without a joined و or ف', () => {
    expect(groupOf('68:14')).not.toContain('77:39');
    expect(groupOf('77:39')).not.toContain('68:14');
    expect(shown(groups.get('إن الذين')!).every(a => a.words[0].startsWith('إ'))).toBe(true);
  });

  it('parts وأدبار السجود from وإدبار النجوم', () => {
    const find = (node: Branch): Branch | undefined => keys(node).includes('50:40') && keys(node).includes('52:49') && node.children.every(child => !(keys(child).includes('50:40') && keys(child).includes('52:49'))) ? node : node.children.map(find).find(Boolean);
    const node = find(branch(shown(groups.get('من اليل')!)))!;
    expect(node.children).toHaveLength(2);
    expect(node.children.map(child => child.words[0])).toEqual(expect.arrayContaining(['وَأَدْبَـٰرَ', 'وَإِدْبَـٰرَ']));
  });

  it('opens an old link spelled without the hamza on the tree it meant', () => {
    const phrases = listPhrases(groups);
    expect(pickPhrase(phrases, 'ان المتقين')).toBe('إن المتقين');
    expect(DEFAULT_PHRASE).toBe('إن المتقين');
  });
});
