import { describe, expect, it } from 'vitest';
import {
  filterAndRankSubjects,
  normalizeSubjectSearch,
  rankSubjectSearch,
  type SubjectSearchCandidate,
} from './subjectSearch';

describe('normalizeSubjectSearch', () => {
  it('strips Arabic diacritics (tashkeel)', () => {
    expect(normalizeSubjectSearch('مُحَمَّد')).toBe(normalizeSubjectSearch('محمد'));
  });

  it('normalizes hamza-on-alef variants to a bare alef', () => {
    expect(normalizeSubjectSearch('أحمد')).toBe(normalizeSubjectSearch('احمد'));
    expect(normalizeSubjectSearch('إبراهيم')).toBe(normalizeSubjectSearch('ابراهيم'));
    expect(normalizeSubjectSearch('آدم')).toBe(normalizeSubjectSearch('ادم'));
  });

  it('normalizes ta marbuta to ha', () => {
    expect(normalizeSubjectSearch('فاطمة')).toBe(normalizeSubjectSearch('فاطمه'));
  });

  it('normalizes alef maqsura to ya', () => {
    expect(normalizeSubjectSearch('موسى')).toBe(normalizeSubjectSearch('موسي'));
  });

  it('normalizes hamza-on-waw and hamza-on-ya', () => {
    expect(normalizeSubjectSearch('مؤمن')).toBe(normalizeSubjectSearch('مومن'));
    expect(normalizeSubjectSearch('سئل')).toBe(normalizeSubjectSearch('سيل'));
  });

  it('lowercases Latin text and collapses punctuation/whitespace', () => {
    expect(normalizeSubjectSearch('  Abu   Bakr, As-Siddiq!  ')).toBe('abu bakr as siddiq');
  });

  it('maps common Latin spelling variants to a single canonical form', () => {
    expect(normalizeSubjectSearch('Mohamed')).toBe(normalizeSubjectSearch('Muhammad'));
    expect(normalizeSubjectSearch('Mohammed')).toBe(normalizeSubjectSearch('Muhammad'));
    expect(normalizeSubjectSearch('Muhammed')).toBe(normalizeSubjectSearch('Muhammad'));
    expect(normalizeSubjectSearch('Ayesha')).toBe(normalizeSubjectSearch('Aishah'));
    expect(normalizeSubjectSearch('Othman')).toBe(normalizeSubjectSearch('Uthman'));
    expect(normalizeSubjectSearch('Omar')).toBe(normalizeSubjectSearch('Umar'));
  });

  it('normalizes "bin"/"ben" to "ibn"', () => {
    expect(normalizeSubjectSearch('Malik bin Anas')).toBe('malik ibn anas');
    expect(normalizeSubjectSearch('Malik ben Anas')).toBe('malik ibn anas');
  });

  it('does not apply Latin spelling equivalents to Arabic text', () => {
    // "عمر" (Umar) normalized should stay Arabic, not get swapped via the Latin table
    expect(normalizeSubjectSearch('عمر')).toBe('عمر');
  });

  it('returns an empty string for empty or whitespace-only input', () => {
    expect(normalizeSubjectSearch('')).toBe('');
    expect(normalizeSubjectSearch('   ')).toBe('');
  });
});

describe('rankSubjectSearch', () => {
  const person: SubjectSearchCandidate = {
    slug: 'abu-bakr-as-siddiq',
    name: 'أبو بكر الصديق',
    fullName: 'عبد الله بن أبي قحافة',
    nameTransliterated: 'Abu Bakr as-Siddiq',
    graphRank: null,
  };

  it('returns null when the query is empty', () => {
    expect(rankSubjectSearch('', person)).toBeNull();
    expect(rankSubjectSearch('   ', person)).toBeNull();
  });

  it('returns null when nothing matches', () => {
    expect(rankSubjectSearch('Zaynab', person)).toBeNull();
  });

  it('scores a full exact match as "exact" with the best score', () => {
    const result = rankSubjectSearch('Abu Bakr as-Siddiq', person);
    expect(result).toEqual({ score: 0, match: 'exact' });
  });

  it('scores a whole-word match within a longer field as "exact"', () => {
    const result = rankSubjectSearch('Siddiq', person);
    expect(result).toEqual({ score: 1, match: 'exact' });
  });

  it('scores a prefix match as "prefix"', () => {
    const result = rankSubjectSearch('Abu Bakr', person);
    expect(result).toEqual({ score: 2, match: 'prefix' });
  });

  it('scores a mid-word substring match as "contains"', () => {
    const result = rankSubjectSearch('iddiq', person);
    expect(result).toEqual({ score: 3, match: 'contains' });
  });

  it('matches against the Arabic name field directly', () => {
    const result = rankSubjectSearch('الصديق', person);
    expect(result?.match).toBe('exact');
  });

  it('matches against fullName and slug fields', () => {
    expect(rankSubjectSearch('قحافة', person)?.match).toBe('exact');
    expect(rankSubjectSearch('abu-bakr-as-siddiq', person)).toEqual({ score: 0, match: 'exact' });
  });

  it('matches via transliteration spelling equivalents', () => {
    const withMuhammad: SubjectSearchCandidate = {
      slug: 'muhammad-ibn-abdullah',
      name: 'محمد بن عبد الله',
      fullName: null,
      nameTransliterated: 'Muhammad ibn Abdullah',
      graphRank: null,
    };
    expect(rankSubjectSearch('Mohammed', withMuhammad)?.match).toBe('exact');
    expect(rankSubjectSearch('Mohamed bin Abdullah', withMuhammad)).toEqual({ score: 0, match: 'exact' });
  });

  it('picks the best (lowest-score) match across all fields', () => {
    // "Abu Bakr" is a prefix of nameTransliterated but a whole word inside fullName-like data
    const candidate: SubjectSearchCandidate = {
      slug: 'abu-bakr-anecdote',
      name: 'كنية أبو بكر',
      fullName: 'قصة عن أبو بكر الصديق',
      nameTransliterated: 'Abu Bakr',
      graphRank: null,
    };
    // exact match on nameTransliterated (score 0) should win over the "contains"/"exact-word"
    // matches on the other fields.
    expect(rankSubjectSearch('Abu Bakr', candidate)).toEqual({ score: 0, match: 'exact' });
  });

  it('does not match against a null field', () => {
    const noFullName: SubjectSearchCandidate = {
      slug: 'test-person',
      name: 'Test Person',
      fullName: null,
      nameTransliterated: null,
      graphRank: null,
    };
    // "Test" is a whole word within "Test Person" -> counts as an exact word match
    expect(rankSubjectSearch('Test', noFullName)).toEqual({ score: 1, match: 'exact' });
    // Nothing to match against fullName/nameTransliterated since both are null
    expect(rankSubjectSearch('Zaynab', noFullName)).toBeNull();
  });
});

describe('filterAndRankSubjects', () => {
  const people: SubjectSearchCandidate[] = [
    {
      slug: 'abu-bakr-as-siddiq',
      name: 'أبو بكر الصديق',
      fullName: 'عبد الله بن أبي قحافة',
      nameTransliterated: 'Abu Bakr as-Siddiq',
      graphRank: null,
    },
    {
      slug: 'umar-ibn-al-khattab',
      name: 'عمر بن الخطاب',
      fullName: null,
      nameTransliterated: 'Umar ibn al-Khattab',
      graphRank: null,
    },
    {
      slug: 'muhammad-ibn-abdullah',
      name: 'محمد بن عبد الله',
      fullName: null,
      nameTransliterated: 'Muhammad ibn Abdullah',
      graphRank: null,
    },
    {
      slug: 'aishah-bint-abi-bakr',
      name: 'عائشة بنت أبي بكر',
      fullName: null,
      nameTransliterated: 'Aishah bint Abi Bakr',
      graphRank: null,
    },
  ];

  it('excludes people that do not match the query', () => {
    const results = filterAndRankSubjects(people, 'Umar');
    expect(results).toHaveLength(1);
    expect(results[0].subject.slug).toBe('umar-ibn-al-khattab');
  });

  it('ranks prefix matches ahead of substring matches', () => {
    const candidates: SubjectSearchCandidate[] = [
      {
        slug: 'p1',
        name: 'Person One',
        fullName: 'Student of Abu Bakr',
        nameTransliterated: null,
        graphRank: null,
      },
      {
        slug: 'p2',
        name: 'Person Two',
        fullName: null,
        nameTransliterated: 'Abu Bakr as-Siddiq',
        graphRank: null,
      },
    ];
    const results = filterAndRankSubjects(candidates, 'Abu Bakr');
    expect(results.map((r) => r.subject.slug)).toEqual(['p2', 'p1']);
    expect(results[0].match).toBe('prefix');
    expect(results[1].match).toBe('contains');
  });

  it('finds an Arabic-registered person via an English transliterated query', () => {
    const results = filterAndRankSubjects(people, 'Mohammed');
    expect(results.map((r) => r.subject.slug)).toEqual(['muhammad-ibn-abdullah']);
  });

  it('finds a person searching in Arabic script', () => {
    const results = filterAndRankSubjects(people, 'عائشة');
    expect(results.map((r) => r.subject.slug)).toEqual(['aishah-bint-abi-bakr']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterAndRankSubjects(people, 'Zaynab bint Jahsh')).toEqual([]);
  });

  it('returns an empty array for an empty query', () => {
    expect(filterAndRankSubjects(people, '')).toEqual([]);
  });

  it('breaks ties between equal text-match scores using graphRank (lower/more prominent first)', () => {
    const candidates: SubjectSearchCandidate[] = [
      { slug: 'p-low-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, graphRank: 50 },
      { slug: 'p-high-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, graphRank: 3 },
      { slug: 'p-no-rank', name: 'Ahmad', fullName: null, nameTransliterated: null, graphRank: null },
    ];
    const results = filterAndRankSubjects(candidates, 'Ahmad');
    expect(results.map((r) => r.subject.slug)).toEqual(['p-high-rank', 'p-low-rank', 'p-no-rank']);
  });

  it('falls through to name, then slug, when graphRank also ties', () => {
    const candidates: SubjectSearchCandidate[] = [
      { slug: 'ahmad-b', name: 'Ahmad', fullName: null, nameTransliterated: null, graphRank: 5 },
      { slug: 'ahmad-a', name: 'Ahmad', fullName: null, nameTransliterated: null, graphRank: 5 },
    ];
    const results = filterAndRankSubjects(candidates, 'Ahmad');
    expect(results.map((r) => r.subject.slug)).toEqual(['ahmad-a', 'ahmad-b']);
  });

  it('never lets graphRank override text-match quality', () => {
    const candidates: SubjectSearchCandidate[] = [
      {
        slug: 'exact-but-unranked',
        name: 'Ahmad',
        fullName: null,
        nameTransliterated: null,
        graphRank: null,
      },
      {
        slug: 'prefix-but-prominent',
        name: 'Ahmad ibn Sa\'d',
        fullName: null,
        nameTransliterated: null,
        graphRank: 1,
      },
    ];
    const results = filterAndRankSubjects(candidates, 'Ahmad');
    expect(results.map((r) => r.subject.slug)).toEqual(['exact-but-unranked', 'prefix-but-prominent']);
  });
});

describe('ranking across kinds', () => {
  // Non-person kinds carry no nasab, so fullName is absent rather than null.
  const badr = { slug: 'badr', name: 'غزوة بدر', nameTransliterated: 'Ghazwat Badr', graphRank: 12 };
  const hijra = { slug: 'hijra', name: 'الهجرة', nameTransliterated: 'Al-Hijra', graphRank: 30 };
  const companion = { slug: 'sahabi', name: 'صحابي', nameTransliterated: 'Sahabi', graphRank: 8 };
  const umar = {
    slug: 'umar-ibn-al-khattab',
    name: 'عمر بن الخطاب',
    fullName: 'عمر بن الخطاب بن نفيل',
    nameTransliterated: 'Umar ibn al-Khattab',
    graphRank: 2,
  };

  it('ranks a subject with no fullName at all, alongside people who have one', () => {
    const results = filterAndRankSubjects([badr, umar], 'Badr');
    expect(results.map((r) => r.subject.slug)).toEqual(['badr']);
  });

  it('puts an exact non-person match above a contains-match on a far more prominent person', () => {
    const results = filterAndRankSubjects([umar, hijra], 'Hijra');
    expect(results[0].subject.slug).toBe('hijra');
    expect(results[0].match).toBe('exact');
  });

  it('orders subjects of different kinds by graphRank once their match quality ties', () => {
    const results = filterAndRankSubjects(
      [
        { slug: 'battle-of-the-trench', name: 'غزوة الخندق', nameTransliterated: 'Ghazwat al-Khandaq', graphRank: 40 },
        { ...companion, name: 'الخندق', nameTransliterated: 'Al-Khandaq' },
      ],
      'Al-Khandaq',
    );
    expect(results.map((r) => r.subject.slug)).toEqual(['sahabi', 'battle-of-the-trench']);
  });

  it('applies the Latin spelling-equivalence table to battle and event names, not just people', () => {
    const uhud = { slug: 'uhud', name: 'غزوة أحد', nameTransliterated: 'Ghazwat Uhud', graphRank: 15 };
    expect(rankSubjectSearch('Ghazwat  UHUD!', uhud)).toEqual({ score: 0, match: 'exact' });

    const farewell = { slug: 'farewell-sermon', name: 'خطبة الوداع', nameTransliterated: null, graphRank: 20 };
    expect(rankSubjectSearch('خطبه الوداع', farewell)?.match).toBe('exact');
  });

  it('normalizes an event name spelled with the Umar/Omar equivalence', () => {
    const shura = { slug: 'shura-of-umar', name: 'شورى عمر', nameTransliterated: 'Shura of Umar', graphRank: 25 };
    expect(rankSubjectSearch('Shura of Omar', shura)).toEqual({ score: 0, match: 'exact' });
  });
});

