import { describe, expect, it } from 'vitest';
import data from '@shared/data/quran/trees.json';
import { ayahEnds, branch, branchesHref, conjunctions, linkable, pieces, keys, linkId, stem, listOpenings, listPhrases, openingId, readerAyat, searchKey, searchPieces, searchPhrases, sharedOpenings, spelledAs, startingWith, variants, withConjunctions, withNext, type Branch, type BranchAyah } from '@shared/quran/branches';
import { inJuzRange } from '@shared/quran/juz';
import { normalizeWord } from '@shared/quran/normalize';

const all = data.ayat as BranchAyah[];
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

  it('groups the known chapter letter openings, including all seven الحواميم', () => {
    const expected = {
      'الم': ['2:1', '3:1', '29:1', '30:1', '31:1', '32:1'],
      'الر': ['10:1', '11:1', '12:1', '14:1', '15:1'],
      'طسم': ['26:1', '28:1'],
      'حم': ['40:1', '41:1', '42:1', '43:1', '44:1', '45:1', '46:1'],
    };
    const phrases = listPhrases(groups);
    const entries = pieces(groups, phrases);
    for (const [id, members] of Object.entries(expected)) {
      expect(groups.get(id)?.map(ayah => ayah.key)).toEqual(members);
      expect(startingWith(all, id).map(ayah => ayah.key)).toEqual(members);
      expect(phrases.find(phrase => phrase.id === id)?.count).toBe(members.length);
      expect(searchPieces(entries, phrases, all, id).flatMap(piece => piece.keys)).toEqual(expect.arrayContaining(members));
    }
    expect(openingId(ayah('7:1', 'المص'))).toBe('المص');
    expect(openingId(ayah('42:1', 'حم'))).toBe('حم');
    expect(startingWith([ayah('42:1', 'حم'), ayah('2:1', 'الم'), ayah('105:1', 'أَلَمْ تر كيف')], 'الم').map(ayah => ayah.key)).toEqual(['2:1']);
    expect(startingWith(all, 'الم تر').length).toBe(31);
  });

  it('continues standalone letter openings into their next ayah without losing references', () => {
    for (const id of ['الم', 'طسم', 'حم']) {
      const group = groups.get(id)!;
      const tree = branch(group);
      expect(keys(tree).sort()).toEqual(group.map(ayah => ayah.key).sort());
      expect(group.every(ayah => ayah.next && ayah.next.length > 0)).toBe(true);
      expect(tree.words.join(' ')).toContain('﴿١﴾');
      expect(ayahEnds(tree)).toEqual(Object.fromEntries(group.map(ayah => [ayah.key, ayah.through])));
    }
    // طسم opens two surahs with the same next ayah, so both run on to the ayah after it.
    expect(ayahEnds(branch(groups.get('طسم')!))).toEqual({ '26:1': '26:3', '28:1': '28:3' });
  });

  it('ignores the pause and section marks the reader keeps beside a word', () => {
    const read = readerAyat([{ juz: 1, items: [{ surah: 2 }, { line: ['۞ إِنَّ', 'ٱللَّهَ ۖ', 'عليم', 1, 'إِنَّ', 'ٱللَّهَ', 'غفور', 2] }] }]);
    const shared = sharedOpenings(read);
    expect(listOpenings(shared)).toEqual([{ id: 'ان الله', text: 'إِنَّ ٱللَّهَ', count: 2 }]);
    expect(branch(shared.get('ان الله')!).words).toEqual(['إِنَّ', 'ٱللَّهَ']);
  });

  it('keeps the generated artifact as the full Quran corpus', () => {
    expect(all).toHaveLength(6236);
    expect(all.find(ayah => ayah.key === '2:3')?.conjs?.[3]).toBe('و');
    expect(all.find(ayah => ayah.key === '43:83')?.next?.slice(0, 2)).toEqual(['وَهُوَ', 'ٱلَّذِى']);
  });
});

describe('branch', () => {
  it('splits the six ayat that open with إن المتقين where their wording parts', () => {
    expect(shape(branch(groups.get('ان المتقين')!))).toEqual({
      words: 'ان المتقين في',
      ayat: [],
      children: [
        {
          words: 'جنت',
          ayat: [],
          children: [
            {
              words: 'وعيون ',
              ayat: [],
              children: [
                { words: 'ادخلوها بسلم ءامنين', ayat: ['15:45'], children: [] },
                { words: 'ءاخذين ما ءاتيهم ربهم انهم كانوا قبل ذلك محسنين', ayat: ['51:15'], children: [] },
              ],
            },
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

  it('runs identical ayat on into the ayat after them until they part, across surahs', () => {
    const tree = branch(startingWith(all, 'فسبح باسم'));
    expect(tree.words.map(normalizeWord).join(' ')).toBe('فسبح باسم ربك العظيم ');
    expect(tree.children.map(child => [child.ayat, normalizeWord(child.words[0])])).toEqual([[['56:74'], 'فلا'], [['56:96'], 'سبح'], [['69:52'], 'سال']]);
    // 56:96 and 69:52 close their surahs: the next surah's first ayah follows, without its basmala.
    expect(ayahEnds(tree)).toEqual({ '56:74': '56:75', '56:96': '57:1', '69:52': '70:1' });
  });

  it('runs on an ayah that is also in a chapter family, and marks no spelling difference for the end sign alone', () => {
    const tree = branch(startingWith(all, 'الحمد لله'));
    expect(ayahEnds(tree)).toMatchObject({ '1:2': '1:3', '37:182': '38:1' });
    expect(branch(startingWith(all, 'فسبح باسم')).forms).toBeUndefined();
  });

  it('keeps going while the following ayat are identical too', () => {
    const tree = branch(startingWith(all, 'والذين هم لفروجهم'));
    expect(tree.words.filter(word => word === '۝')).toHaveLength(4);
    expect(tree.children.map(child => child.ayat)).toEqual([['23:5'], ['70:29']]);
    expect(ayahEnds(tree)).toEqual({ '23:5': '23:9', '70:29': '70:33' });
  });

  it('shows one end sign where runs end on different ayah numbers, and links no node past it', () => {
    const tree = branch(startingWith(all, 'الا عباد الله'));
    expect(tree.words.at(-1)).toBe('۝');
    expect(linkable(tree.words)).toBe(false);
    expect(linkable(['حم', '﴿١﴾', 'تنزيل'])).toBe(true);
  });

  it('grows a synthetic twin into the next surah', () => {
    const read = [ayah('1:1', 'سبح ربك'), ayah('1:2', 'قل هو'), ayah('2:1', 'سبح ربك'), ayah('3:1', 'الم')];
    const grownAyat = withNext(new Map([['سبح ربك', [read[0], read[2]]]]), read);
    expect(grownAyat.map(a => [a.key, a.next, a.through])).toEqual([['1:1', ['قل', 'هو'], '1:2'], ['2:1', ['الم'], '3:1']]);
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
    expect(count('ان المتقين في')).toBe(6);
    expect(count('ان المتقين في جنت')).toBe(4);
    expect(count('ان المتقين في جنت وعيون')).toBe(2);
    expect(phrases.every(p => p.count >= 2)).toBe(true);
    expect(new Set(phrases.map(p => `${p.id}:${p.partition ?? ""}`)).size).toBe(phrases.length);
  });

  it('resolves every inner-node link to its known phrase and root partition', () => {
    for (const group of groups.values()) {
      const merged = Object.fromEntries(variants(group).flatMap(v => v.keys.map(key => [key, v.conj])));
      const visit = (node: Branch, path: string[], tags: Record<string, string>) => {
        const words = [...path, ...node.words];
        if (path.length > 0 && node.children.length > 0 && linkable(words)) {
          const id = linkId(words, keys(node).flatMap(key => (tags[key] !== undefined ? [tags[key]] : [])));
          const url = new URL(branchesHref(id, undefined, { partition: node.partition }), 'https://namaq.test');
          const partition = url.searchParams.get('r') ?? undefined;
          const selected = startingWith(group, id, partition);
          const matches = phrases.filter(phrase => phrase.id === id && (!partition || phrase.partition === partition || (!phrase.partition && selected.length >= 2)));
          expect(matches.length).toBeGreaterThan(0);
          expect(selected.map(ayah => ayah.key)).toEqual(expect.arrayContaining(keys(node)));
        }
        node.children.forEach(child => visit(child, words, tags));
      };
      visit(branch(group), [], merged);
      for (const variant of variants(group)) {
        const own = spelledAs(group, variant.word);
        expect(own.map(a => a.key)).toEqual(variant.keys);
        if (own.length > 1) visit(branch(own), [], {});
      }
    }
    expect(count('يايها الناس اتقوا ربكم')).toBe(startingWith(all, 'يايها الناس اتقوا ربكم').length);
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
    expect([...conjunctions(morphology)]).toEqual([['52:24:1', 'و'], ['56:75:1', 'ف'], ['2:5:2', 'و']]);
  });

  it('refuses a reader word that does not start with the letter the corpus gives', () => {
    expect(() => withConjunctions([ayah('52:24', 'يطوف عليهم')], morphology)).toThrow('52:24');
    expect(withConjunctions([ayah('52:24', 'وَيَطُوفُ عليهم')], morphology)[0]).toMatchObject({ conj: 'و', conjs: ['و', null] });
  });
});

describe('an opening with and without و', () => {
  const group = startingWith(all, 'يطوف عليهم');

  it('groups يطوف عليهم with ويطوف عليهم and draws one tree from the shared word on', () => {
    expect(group.map(a => a.key)).toEqual(['52:24', '56:17', '76:19']);
    expect(shape(branch(group))).toEqual({
      words: 'يطوف عليهم',
      ayat: [],
      children: [
        { words: 'غلمان لهم كانهم لؤلؤ مكنون', ayat: ['52:24'], children: [] },
        {
          words: 'ولدن مخلدون',
          ayat: [],
          children: [
            { words: '﴿١٧﴾ باكواب واباريق وكاس من معين', ayat: ['56:17'], children: [] },
            { words: 'اذا رايتهم حسبتهم لؤلؤا منثورا', ayat: ['76:19'], children: [] },
          ],
        },
      ],
    });
  });

  it('ends each ayah at the one its leaf runs into, so its next ayah comes after that', () => {
    expect(ayahEnds(branch(group))).toEqual({ '52:24': '52:24', '56:17': '56:18', '76:19': '76:19' });
  });

  it('keeps the surrounding-ayat switch in tree links, but not on the list', () => {
    expect(branchesHref('يطوف عليهم', undefined, { context: true })).toBe(`/quran/branches?${new URLSearchParams({ o: 'يطوف عليهم', c: '1' })}`);
    expect(branchesHref('', undefined, { context: true })).toBe('/quran/branches');
  });

  it('names each first word, the ayat that open with it and the phrase they share', () => {
    expect(variants(group).map(v => ({ word: normalizeWord(v.word), conj: v.conj, keys: v.keys, id: v.id }))).toEqual([
      { word: 'ويطوف', conj: 'و', keys: ['52:24', '76:19'], id: 'يطوف عليهم' },
      { word: 'يطوف', conj: '', keys: ['56:17'], id: 'يطوف عليهم' },
    ]);
    expect(branchesHref('يطوف عليهم', undefined, { spelling: 'يَطُوفُ' })).not.toContain('&w=');
    expect(spelledAs(group, 'يَطُوفُ').map(a => a.key)).toEqual(['56:17']);
    expect(spelledAs(group, 'وَيَطُوفُ').map(a => a.key)).toEqual(['52:24', '76:19']);
    expect(spelledAs(group, null)).toEqual([]);
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

  it('carries the range without a list view parameter', () => {
    expect(branchesHref('فلا اقسم')).toBe(`/quran/branches?o=${encodeURIComponent('فلا اقسم').replace(/%20/g, '+')}`);
    expect(branchesHref('الم تر', { from: 29, to: 30 })).toBe(`/quran/branches?o=${encodeURIComponent('الم').replace(/%20/g, '+')}+${encodeURIComponent('تر')}&juzFrom=29&juzTo=30`);
  });
});

describe('linkId', () => {
  it('puts the joined letter back when every ayah under a branch carries it', () => {
    const group = startingWith(all, 'اذ قال');
    const musa = branch(group).children.find(child => normalizeWord(child.words[0]) === 'موسي')!;
    const node = musa.children.find(child => normalizeWord(child.words[0]) === 'لقومه')!;
    const id = linkId(['إِذْ', 'قَالَ', ...musa.words, ...node.words], keys(node).map(key => all.find(a => a.key === key)!.conj ?? ''));
    expect(id.startsWith('واذ قال موسي لقومه')).toBe(true);
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

describe('spellings and marks', () => {
  it('draws أن, وإن and فإن as separate first words of ان كان', () => {
    const group = startingWith(all, 'ان كان');
    expect(variants(group).map(v => [v.word, v.keys])).toEqual([
      ['وَإِن', ['2:280', '6:35', '7:87', '12:27', '15:78']],
      ['أَن', ['68:14']],
      ['فَإِن', ['77:39']],
    ]);
  });

  it('joins words with the same letters, root and lemma, showing only the marks they share', () => {
    const tree = branch([ayah('1:1', 'قال لَهُمْ ربهم'), ayah('1:2', 'قال لَهُمُ موسى')]);
    expect(tree.words).toEqual(['قال', 'لَهُم']);
    expect(tree.children.map(child => child.words[0])).toEqual(['ربهم', 'موسى']);
    expect(branch(startingWith(all, 'قال رب')).words).toEqual(['قَالَ', 'رَبّ']);
    expect(branch(startingWith(all, 'قال موسي')).words).toEqual(['قَالَ', 'مُوسَىٰ']);
  });

  it('keeps words with the same letters apart when their lemmas differ', () => {
    const lemma = (key: string, text: string, lemmas: string[]) => ({ ...ayah(key, text), lemmas });
    const tree = branch([lemma('1:1', 'قل إِن كان', ['qaAla', '<in', 'kaAna']), lemma('1:2', 'قل إِنَّ ربي', ['qaAla', '<in~', 'rab~'])]);
    expect(tree.words).toEqual(['قل']);
    expect(tree.children.map(child => child.words[0])).toEqual(['إِن', 'إِنَّ']);
  });

  it('joins a spelling to a lemma through either link, and shows a madda the spellings share', () => {
    const lemma = (key: string, text: string, lemmas: string[]) => ({ ...ayah(key, text), lemmas });
    const tree = branch([lemma('1:1', 'قال مَآ هذا', ['qaAla', 'maA', 'ha*aA']), lemma('1:2', 'قال مَآ ذلك', ['qaAla', 'maA2', '*a`lik']), lemma('1:3', 'قال مَا هم', ['qaAla', 'maA2', 'hum'])]);
    expect(tree.words).toEqual(['قال', 'مَا']);
    expect(tree.children).toHaveLength(3);
    expect(branch([ayah('1:1', 'قال ءَامَنَّا به'), ayah('1:2', 'قال ءَامَنَّا بكم')]).words).toEqual(['قال', 'ءَامَنَّا']);
  });

  it('opens a first-word spelling from its marks, or from its letters when typed by hand', () => {
    const lemma = (key: string, text: string, lemmas: string[]) => ({ ...ayah(key, text), lemmas });
    const group = [lemma('1:1', 'وَإِنَّ منكم', ['<in~', 'min']), lemma('1:2', 'وَإِن منكم', ['<in', 'min'])];
    expect(spelledAs(group, 'وَإِنَّ').map(a => a.key)).toEqual(['1:1']);
    expect(spelledAs(group, 'وان').map(a => a.key)).toEqual(['1:1', '1:2']);
  });

  it('keeps identical words together even when the corpus gives them different lemmas', () => {
    const lemma = (key: string, text: string, lemmas: string[]) => ({ ...ayah(key, text), lemmas });
    const tree = branch([lemma('1:1', 'فَإِذَا جاء', ['<i*aA', 'jaA^a']), lemma('1:2', 'فَإِذَا هم', ['<i*aA2', 'hum'])]);
    expect(tree.words).toEqual(['فَإِذَا']);
  });

  it('keeps one node for words that differ only in a Quranic annotation sign, shown without it', () => {
    const tree = branch(startingWith(all, 'ان مع العسر'));
    expect(tree.ayat).toEqual([]);
    expect(tree.words.slice(0, 4).at(-1)).toBe('يُسْرًا');
    // The two ayat read the same, so each runs into the ayah after it: 94:5 into 94:6, 94:6 into 94:7.
    expect(tree.children.map(child => child.ayat)).toEqual([['94:5'], ['94:6']]);
    expect(ayahEnds(tree)).toEqual({ '94:5': '94:6', '94:6': '94:7' });
  });

  it('ignores the shadda an ayah\'s first letter carries over from the ayah before', () => {
    const group = startingWith(all, 'متعا لكم');
    expect(variants(group)).toEqual([]);
    expect(branch(group).words[0]).toBe('مَتَٰعًۭا');
  });

  it('uses the shared display in phrase names when only context marks differ', () => {
    const phrases = listPhrases(sharedOpenings(all.filter(a => inJuzRange(a.key, { from: 25, to: 30 }))));
    expect(phrases.find(p => p.id === 'قل ارءيتم ان')?.text).toBe('قُلْ أَرَءَيْتُم إِن');
  });

  it('drops a differing final sukun even when most ayat carry it', () => {
    const tree = branch([ayah('1:1', 'قُلْ أَرَءَيْتُمْ إِنْ'), ayah('1:2', 'قُلْ أَرَءَيْتُمْ إِن'), ayah('1:3', 'قُلْ أَرَءَيْتُم مَّا')]);
    expect(tree.words).toEqual(['قُلْ', 'أَرَءَيْتُم']);
    expect(tree.children[0].words[0]).toBe('إِن');
  });

  it('keeps an annotation sign every ayah under a node carries', () => {
    const tree = branch([ayah('1:1', 'إن الذين كَفَرُوا۟ ربهم'), ayah('1:2', 'إن الذين كَفَرُوا۟ موسى')]);
    expect(tree.words).toEqual(['إن', 'الذين', 'كَفَرُوا۟']);
  });

  it('keeps only shared marks across several words and preserves every complete original', () => {
    const group = [ayah('3:1', 'مِنْ أَرَءَيْتُمْ'), ayah('4:1', 'مِّنْ أَرَءَيْتُم'), ayah('5:1', 'مِّن أَرَءَيْتُمْ'), ayah('6:1', 'مِن أَرَءَيْتُم')];
    const tree = branch(group);
    expect(tree.words).toEqual(['مِن', 'أَرَءَيْتُم']);
    expect(tree.forms).toEqual(Object.fromEntries(group.map(a => [a.key, a.words])));
    expect(tree.ayat).toEqual(group.map(a => a.key));
    expect(tree.children).toEqual([]);
  });

  it('removes multiple differing annotation signs at their own letters', () => {
    const tree = branch([ayah('1:1', 'قال مِّۢنْۭ'), ayah('1:2', 'قال مِـنْ')]);
    expect(tree.words).toEqual(['قال', 'مِنْ']);
    expect(tree.forms).toEqual({ '1:1': ['قال', 'مِّۢنْۭ'], '1:2': ['قال', 'مِـنْ'] });
    const swapped = branch([ayah('1:1', 'قال مِۢنْ'), ayah('1:2', 'قال مِـنْۢ')]);
    expect(swapped.words).toEqual(['قال', 'مِنْ']);
  });

  it('preserves all originals even when the shared display matches none of them', () => {
    const group = [ayah('1:1', 'مِّنْ رب'), ayah('1:2', 'مِنۢ رب')];
    expect(branch(group).words).toEqual(['مِن', 'رب']);
    expect(branch(group).forms).toEqual(Object.fromEntries(group.map(a => [a.key, a.words])));
  });

  it('retains original first-word forms in each opening box', () => {
    const group = [ayah('1:1', 'مِّنْ رب'), ayah('1:2', 'مِن رب'), ayah('1:3', 'وَمِن رب')];
    expect(variants(group)[0]).toMatchObject({ word: 'مِن', forms: { '1:1': ['مِّنْ'], '1:2': ['مِن'] } });
    expect(branch(group).forms).toEqual(Object.fromEntries(group.map(a => [a.key, a.words])));
  });

  it('keeps corpus membership and exact source phrases for every merged node', () => {
    for (const group of groups.values()) {
      const original = new Map(group.map(a => [a.key, a.words]));
      const tree = branch(group);
      expect(keys(tree).sort()).toEqual(group.map(a => a.key).sort());
      const visit = (node: Branch, offset: number) => {
        if (node.forms) {
          expect(Object.keys(node.forms).sort()).toEqual(keys(node).sort());
          for (const [key, words] of Object.entries(node.forms)) {
            const source = original.get(key)!;
            if (offset + words.length <= source.length) expect(words).toEqual(source.slice(offset, offset + words.length));
          }
        }
        node.children.forEach(child => visit(child, offset + node.words.length));
      };
      visit(tree, 0);
    }
  });

  it('carries an ayah that ends mid-tree into the next one, marked with its number', () => {
    const tree = branch(startingWith(all, 'يطوف عليهم'));
    const leaf = tree.children[1].children[0];
    expect(leaf.ayat).toEqual(['56:17']);
    expect(leaf.words[0]).toBe('﴿١٧﴾');
  });
});

describe('variant Quran order', () => {
  it('places the al-Shura opening before the al-Najm opening', () => {
    const group = startingWith(all, 'الذين يجتنبون').filter(a => inJuzRange(a.key, { from: 25, to: 30 }));
    expect(variants(group).map(v => v.keys)).toEqual([['42:37'], ['53:32']]);
  });

  it('uses the earliest ayah in each spelling, comparing surah and ayah numerically', () => {
    const group = [ayah('10:1', 'قال رب'), ayah('2:100', 'وقال رب'), ayah('2:10', 'قال رب'), ayah('2:9', 'وقال رب')];
    expect(variants(group).map(v => v.keys)).toEqual([['2:100', '2:9'], ['10:1', '2:10']]);
    expect(group.map(a => a.key)).toEqual(['10:1', '2:100', '2:10', '2:9']);
  });

  it('orders every committed opening group by its earliest Quran reference', () => {
    const order = (key: string) => key.split(':').map(Number).reduce((s, n) => s * 1000 + n);
    for (const group of groups.values()) {
      const first = variants(group).map(v => Math.min(...v.keys.map(order)));
      expect(first).toEqual([...first].sort((a, b) => a - b));
    }
  });
});

describe('search', () => {
  const phrases = listPhrases(groups);

  it('reads يا apart and ءا as one alif, as the text joins them', () => {
    expect(searchKey('يا أيها الذين آمنوا')).toBe(searchKey('يايها الذين ءامنوا'));
    expect(searchPhrases(phrases, 'يا أيها الذين آمنوا').map(phrase => phrase.id)).toContain('يايها الذين ءامنوا');
  });

  it('reads يا قوم and يا بني as the text writes them', () => {
    expect(searchPhrases(phrases, 'يا قوم').length).toBeGreaterThan(0);
    expect(searchPhrases(phrases, 'يا بني').length).toBeGreaterThan(0);
  });

  it('keeps every shared phrase apart after reading its spelling', () => {
    const seen = new Set(phrases.map(phrase => `${phrase.id}:${phrase.partition ?? ''}`));
    const read = new Set(phrases.map(phrase => `${searchKey(phrase.id)}:${phrase.partition ?? ''}`));
    expect(read.size).toBe(seen.size);
  });

  it('lists phrases that start with the search before those that only contain it', () => {
    const found = searchPhrases(phrases, 'قال رب').map(phrase => searchKey(phrase.id));
    const starts = found.findIndex(id => !id.startsWith('قال رب'));
    expect(starts).toBeGreaterThan(0);
    expect(found.slice(starts).every(id => !id.startsWith('قال رب') && id.includes('قال رب'))).toBe(true);
  });

  it('carries the search and surah on the list and into an open tree', () => {
    expect(branchesHref('', undefined, { query: 'قال' })).toBe('/quran/branches?q=%D9%82%D8%A7%D9%84');
    expect(branchesHref('قال رب', undefined, { query: 'قال', surah: 7 })).toBe('/quran/branches?o=%D9%82%D8%A7%D9%84+%D8%B1%D8%A8&q=%D9%82%D8%A7%D9%84&s=7');
  });
});

