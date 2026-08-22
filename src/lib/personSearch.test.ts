import { describe, expect, it } from 'vitest';
import {
  filterAndRankPeople,
  normalizePersonSearch,
  rankPersonSearch,
  type PersonSearchCandidate,
} from './personSearch';

describe('normalizePersonSearch', () => {
  it('strips Arabic diacritics (tashkeel)', () => {
    expect(normalizePersonSearch('مُحَمَّد')).toBe(normalizePersonSearch('محمد'));
  });

  it('normalizes hamza-on-alef variants to a bare alef', () => {
    expect(normalizePersonSearch('أحمد')).toBe(normalizePersonSearch('احمد'));
    expect(normalizePersonSearch('إبراهيم')).toBe(normalizePersonSearch('ابراهيم'));
    expect(normalizePersonSearch('آدم')).toBe(normalizePersonSearch('ادم'));
  });

  it('normalizes ta marbuta to ha', () => {
    expect(normalizePersonSearch('فاطمة')).toBe(normalizePersonSearch('فاطمه'));
  });

  it('normalizes alef maqsura to ya', () => {
    expect(normalizePersonSearch('موسى')).toBe(normalizePersonSearch('موسي'));
  });

  it('normalizes hamza-on-waw and hamza-on-ya', () => {
    expect(normalizePersonSearch('مؤمن')).toBe(normalizePersonSearch('مومن'));
    expect(normalizePersonSearch('سئل')).toBe(normalizePersonSearch('سيل'));
  });

  it('lowercases Latin text and collapses punctuation/whitespace', () => {
    expect(normalizePersonSearch('  Abu   Bakr, As-Siddiq!  ')).toBe('abu bakr as siddiq');
  });

  it('maps common Latin spelling variants to a single canonical form', () => {
    expect(normalizePersonSearch('Mohamed')).toBe(normalizePersonSearch('Muhammad'));
    expect(normalizePersonSearch('Mohammed')).toBe(normalizePersonSearch('Muhammad'));
    expect(normalizePersonSearch('Muhammed')).toBe(normalizePersonSearch('Muhammad'));
    expect(normalizePersonSearch('Ayesha')).toBe(normalizePersonSearch('Aishah'));
    expect(normalizePersonSearch('Othman')).toBe(normalizePersonSearch('Uthman'));
    expect(normalizePersonSearch('Omar')).toBe(normalizePersonSearch('Umar'));
  });

  it('normalizes "bin"/"ben" to "ibn"', () => {
    expect(normalizePersonSearch('Malik bin Anas')).toBe('malik ibn anas');
    expect(normalizePersonSearch('Malik ben Anas')).toBe('malik ibn anas');
  });

  it('does not apply Latin spelling equivalents to Arabic text', () => {
    // "عمر" (Umar) normalized should stay Arabic, not get swapped via the Latin table
    expect(normalizePersonSearch('عمر')).toBe('عمر');
  });

  it('returns an empty string for empty or whitespace-only input', () => {
    expect(normalizePersonSearch('')).toBe('');
    expect(normalizePersonSearch('   ')).toBe('');
  });
});

describe('rankPersonSearch', () => {
  const person: PersonSearchCandidate = {
    slug: 'abu-bakr-as-siddiq',
    name: 'أبو بكر الصديق',
    fullName: 'عبد الله بن أبي قحافة',
    nameTransliterated: 'Abu Bakr as-Siddiq',
    nasabRank: null,
    titleCount: 0,
  };

  it('returns null when the query is empty', () => {
    expect(rankPersonSearch('', person)).toBeNull();
    expect(rankPersonSearch('   ', person)).toBeNull();
  });

  it('returns null when nothing matches', () => {
    expect(rankPersonSearch('Zaynab', person)).toBeNull();
  });

  it('scores a full exact match as "exact" with the best score', () => {
    const result = rankPersonSearch('Abu Bakr as-Siddiq', person);
    expect(result).toEqual({ score: 0, match: 'exact' });
  });

  it('scores a whole-word match within a longer field as "exact"', () => {
    const result = rankPersonSearch('Siddiq', person);
    expect(result).toEqual({ score: 1, match: 'exact' });
  });

  it('scores a prefix match as "prefix"', () => {
    const result = rankPersonSearch('Abu Bakr', person);
    expect(result).toEqual({ score: 2, match: 'prefix' });
  });

  it('scores a mid-word substring match as "contains"', () => {
    const result = rankPersonSearch('iddiq', person);
    expect(result).toEqual({ score: 3, match: 'contains' });
  });

  it('matches against the Arabic name field directly', () => {
    const result = rankPersonSearch('الصديق', person);
    expect(result?.match).toBe('exact');
  });

  it('matches against fullName and slug fields', () => {
    expect(rankPersonSearch('قحافة', person)?.match).toBe('exact');
    expect(rankPersonSearch('abu-bakr-as-siddiq', person)).toEqual({ score: 0, match: 'exact' });
  });

  it('matches via transliteration spelling equivalents', () => {
    const withMuhammad: PersonSearchCandidate = {
      slug: 'muhammad-ibn-abdullah',
      name: 'محمد بن عبد الله',
      fullName: null,
      nameTransliterated: 'Muhammad ibn Abdullah',
      nasabRank: null,
      titleCount: 0,
    };
    expect(rankPersonSearch('Mohammed', withMuhammad)?.match).toBe('exact');
    expect(rankPersonSearch('Mohamed bin Abdullah', withMuhammad)).toEqual({ score: 0, match: 'exact' });
  });

  it('picks the best (lowest-score) match across all fields', () => {
    // "Abu Bakr" is a prefix of nameTransliterated but a whole word inside fullName-like data
    const candidate: PersonSearchCandidate = {
      slug: 'abu-bakr-anecdote',
      name: 'كنية أبو بكر',
      fullName: 'قصة عن أبو بكر الصديق',
      nameTransliterated: 'Abu Bakr',
      nasabRank: null,
      titleCount: 0,
    };
    // exact match on nameTransliterated (score 0) should win over the "contains"/"exact-word"
    // matches on the other fields.
    expect(rankPersonSearch('Abu Bakr', candidate)).toEqual({ score: 0, match: 'exact' });
  });

  it('does not match against a null field', () => {
    const noFullName: PersonSearchCandidate = {
      slug: 'test-person',
      name: 'Test Person',
      fullName: null,
      nameTransliterated: null,
      nasabRank: null,
      titleCount: 0,
    };
    // "Test" is a whole word within "Test Person" -> counts as an exact word match
    expect(rankPersonSearch('Test', noFullName)).toEqual({ score: 1, match: 'exact' });
    // Nothing to match against fullName/nameTransliterated since both are null
    expect(rankPersonSearch('Zaynab', noFullName)).toBeNull();
  });
});

describe('filterAndRankPeople', () => {
  const people: PersonSearchCandidate[] = [
    {
      slug: 'abu-bakr-as-siddiq',
      name: 'أبو بكر الصديق',
      fullName: 'عبد الله بن أبي قحافة',
      nameTransliterated: 'Abu Bakr as-Siddiq',
      nasabRank: null,
      titleCount: 0,
    },
    {
      slug: 'umar-ibn-al-khattab',
      name: 'عمر بن الخطاب',
      fullName: null,
      nameTransliterated: 'Umar ibn al-Khattab',
      nasabRank: null,
      titleCount: 0,
    },
    {
      slug: 'muhammad-ibn-abdullah',
      name: 'محمد بن عبد الله',
      fullName: null,
      nameTransliterated: 'Muhammad ibn Abdullah',
      nasabRank: null,
      titleCount: 0,
    },
    {
      slug: 'aishah-bint-abi-bakr',
      name: 'عائشة بنت أبي بكر',
      fullName: null,
      nameTransliterated: 'Aishah bint Abi Bakr',
      nasabRank: null,
      titleCount: 0,
    },
  ];

  it('excludes people that do not match the query', () => {
    const results = filterAndRankPeople(people, 'Umar');
    expect(results).toHaveLength(1);
    expect(results[0].person.slug).toBe('umar-ibn-al-khattab');
  });

  it('ranks prefix matches ahead of substring matches', () => {
    const candidates: PersonSearchCandidate[] = [
      {
        slug: 'p1',
        name: 'Person One',
        fullName: 'Student of Abu Bakr',
        nameTransliterated: null,
        nasabRank: null,
        titleCount: 0,
      },
      {
        slug: 'p2',
        name: 'Person Two',
        fullName: null,
        nameTransliterated: 'Abu Bakr as-Siddiq',
        nasabRank: null,
        titleCount: 0,
      },
    ];
    const results = filterAndRankPeople(candidates, 'Abu Bakr');
    expect(results.map((r) => r.person.slug)).toEqual(['p2', 'p1']);
    expect(results[0].match).toBe('prefix');
    expect(results[1].match).toBe('contains');
  });

  it('finds an Arabic-registered person via an English transliterated query', () => {
    const results = filterAndRankPeople(people, 'Mohammed');
    expect(results.map((r) => r.person.slug)).toEqual(['muhammad-ibn-abdullah']);
  });

  it('finds a person searching in Arabic script', () => {
    const results = filterAndRankPeople(people, 'عائشة');
    expect(results.map((r) => r.person.slug)).toEqual(['aishah-bint-abi-bakr']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterAndRankPeople(people, 'Zaynab bint Jahsh')).toEqual([]);
  });

  it('returns an empty array for an empty query', () => {
    expect(filterAndRankPeople(people, '')).toEqual([]);
  });

  it('breaks ties between equal text-match scores using nasabRank (lower/more prominent first)', () => {
    const candidates: PersonSearchCandidate[] = [
      { slug: 'p-low-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, nasabRank: 50, titleCount: 0 },
      { slug: 'p-high-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, nasabRank: 3, titleCount: 0 },
      { slug: 'p-no-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, nasabRank: null, titleCount: 0 },
    ];
    const results = filterAndRankPeople(candidates, 'Ahmad');
    expect(results.map((r) => r.person.slug)).toEqual(['p-high-rank', 'p-low-rank', 'p-no-rank']);
  });

  it('breaks ties by titleCount (more titles first) when nasabRank also ties', () => {
    const candidates: PersonSearchCandidate[] = [
      { slug: 'p-few-titles', name: 'Ahmad', fullName: null, nameTransliterated: null, nasabRank: 5, titleCount: 1 },
      { slug: 'p-many-titles', name: 'Ahmad', fullName: null, nameTransliterated: null, nasabRank: 5, titleCount: 4 },
    ];
    const results = filterAndRankPeople(candidates, 'Ahmad');
    expect(results.map((r) => r.person.slug)).toEqual(['p-many-titles', 'p-few-titles']);
  });

  it('never lets nasabRank or titleCount override text-match quality', () => {
    const candidates: PersonSearchCandidate[] = [
      {
        slug: 'exact-but-unranked',
        name: 'Ahmad',
        fullName: null,
        nameTransliterated: null,
        nasabRank: null,
        titleCount: 0,
      },
      {
        slug: 'prefix-but-prominent',
        name: 'Ahmad ibn Sa\'d',
        fullName: null,
        nameTransliterated: null,
        nasabRank: 1,
        titleCount: 10,
      },
    ];
    const results = filterAndRankPeople(candidates, 'Ahmad');
    expect(results.map((r) => r.person.slug)).toEqual(['exact-but-unranked', 'prefix-but-prominent']);
  });
});
