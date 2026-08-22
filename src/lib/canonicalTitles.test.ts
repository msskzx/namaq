import { describe, expect, it } from 'vitest';
import {
  reconcileTitles,
  validateCanonicalTitles,
  validateCanonicalTitleHolders,
} from './canonicalTitles';

const postgresTitles = [
  { slug: 'al-siddiq', name: 'الصديق', nameTransliterated: 'As-Siddiq', desc: 'The truthful one' },
  { slug: 'al-farooq', name: 'الفاروق', nameTransliterated: 'Al-Farooq', desc: 'The one who distinguishes' },
];
const graphTitles = [
  { slug: 'al-siddiq', name: ' الصديق ', nameTransliterated: 'As-Siddiq', desc: 'The truthful one' },
  { slug: 'saif-allah', name: 'سيف الله', nameTransliterated: 'Sword of Allah', desc: null },
];

const postgresHolders = [
  { personSlug: 'abu-bakr', titleSlug: 'al-siddiq' },
  { personSlug: 'umar-ibn-al-khattab', titleSlug: 'al-farooq' },
];
const graphHolders = [
  { personSlug: 'abu-bakr', titleSlug: 'al-siddiq' },
  { personSlug: 'khalid-ibn-al-walid', titleSlug: 'saif-allah' },
];

describe('reconcileTitles', () => {
  it('separates postgres-only and graph-only title slugs', () => {
    const report = reconcileTitles(postgresTitles, graphTitles, [], []);
    expect(report.titlesPostgresOnly).toEqual(['al-farooq']);
    expect(report.titlesGraphOnly).toEqual(['saif-allah']);
  });

  it('treats whitespace-only differences as no mismatch', () => {
    const report = reconcileTitles(postgresTitles, graphTitles, [], []);
    expect(report.titleMismatches).toHaveLength(0);
  });

  it('reports a mismatch for differing title field values', () => {
    const report = reconcileTitles(
      [postgresTitles[0]],
      [{ ...graphTitles[0], desc: 'different' }],
      [],
      [],
    );
    expect(report.titleMismatches).toEqual([
      { slug: 'al-siddiq', field: 'desc', postgres: 'The truthful one', neo4j: 'different' },
    ]);
  });

  it('separates postgres-only and graph-only holders by person+title key', () => {
    const report = reconcileTitles([], [], postgresHolders, graphHolders);
    expect(report.holdersPostgresOnly).toEqual(['umar-ibn-al-khattab|al-farooq']);
    expect(report.holdersGraphOnly).toEqual(['khalid-ibn-al-walid|saif-allah']);
  });
});

describe('validateCanonicalTitles', () => {
  it('flags duplicate slugs', () => {
    expect(validateCanonicalTitles([postgresTitles[0], postgresTitles[0]])).toEqual([
      'Duplicate title slug: al-siddiq',
    ]);
  });
});

describe('validateCanonicalTitleHolders', () => {
  it('flags duplicate person+title pairs', () => {
    expect(validateCanonicalTitleHolders([postgresHolders[0], postgresHolders[0]])).toEqual([
      'Duplicate title holder: abu-bakr|al-siddiq',
    ]);
  });
});
