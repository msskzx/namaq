import { describe, expect, it } from 'vitest';
import {
  reconcileBattles,
  validateCanonicalBattles,
  validateCanonicalParticipations,
} from './canonicalBattles';

const postgresBattles = [
  { slug: 'badr', name: 'غزوة بدر', nameTransliterated: 'Battle of Badr', hijriYear: 2, location: 'بدر', locationEn: 'Badr' },
  { slug: 'uhud', name: 'غزوة أحد', nameTransliterated: 'Battle of Uhud', hijriYear: 3, location: 'أحد', locationEn: 'Uhud' },
];
const graphBattles = [
  { slug: 'badr', name: ' غزوة بدر ', nameTransliterated: 'Battle of Badr', hijriYear: 2, location: 'بدر', locationEn: 'Badr' },
  { slug: 'khandaq', name: 'غزوة الخندق', nameTransliterated: 'Battle of the Trench', hijriYear: 5, location: null, locationEn: null },
];

const postgresParticipations = [
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'badr', status: [], isMuslim: true, courage: null },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'badr', status: ['ABSENT_EXCUSED'], isMuslim: true, courage: null },
];
const graphParticipations = [
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'badr', status: [], isMuslim: true, courage: null },
  { personSlug: 'hamzah-ibn-abd-al-muttalib', battleSlug: 'badr', status: ['MARTYRED'], isMuslim: true, courage: null },
];

describe('reconcileBattles', () => {
  it('separates postgres-only and graph-only battle slugs', () => {
    const report = reconcileBattles(postgresBattles, graphBattles, [], []);
    expect(report.battlesPostgresOnly).toEqual(['uhud']);
    expect(report.battlesGraphOnly).toEqual(['khandaq']);
  });

  it('treats whitespace-only differences as no mismatch', () => {
    const report = reconcileBattles(postgresBattles, graphBattles, [], []);
    expect(report.battleMismatches).toHaveLength(0);
  });

  it('reports a mismatch for differing battle field values', () => {
    const report = reconcileBattles(
      [postgresBattles[0]],
      [{ ...graphBattles[0], hijriYear: 3 }],
      [],
      [],
    );
    expect(report.battleMismatches).toEqual([
      { slug: 'badr', field: 'hijriYear', postgres: 2, neo4j: 3 },
    ]);
  });

  it('separates postgres-only and graph-only participations by person+battle key', () => {
    const report = reconcileBattles([], [], postgresParticipations, graphParticipations);
    expect(report.participationsPostgresOnly).toEqual(['uthman-ibn-affan|badr']);
    expect(report.participationsGraphOnly).toEqual(['hamzah-ibn-abd-al-muttalib|badr']);
  });

  it('reports a mismatch when status arrays differ regardless of order', () => {
    const report = reconcileBattles(
      [],
      [],
      [{ personSlug: 'a', battleSlug: 'badr', status: ['INJURED', 'CAPTURED'], isMuslim: true, courage: null }],
      [{ personSlug: 'a', battleSlug: 'badr', status: ['CAPTURED', 'INJURED'], isMuslim: true, courage: null }],
    );
    expect(report.participationMismatches).toHaveLength(0);
  });

  it('reports a mismatch for differing isMuslim values', () => {
    const report = reconcileBattles(
      [],
      [],
      [{ personSlug: 'a', battleSlug: 'badr', status: [], isMuslim: true, courage: null }],
      [{ personSlug: 'a', battleSlug: 'badr', status: [], isMuslim: false, courage: null }],
    );
    expect(report.participationMismatches).toEqual([
      { key: 'a|badr', field: 'isMuslim', postgres: true, neo4j: false },
    ]);
  });
});

describe('validateCanonicalBattles', () => {
  it('flags duplicate slugs', () => {
    expect(validateCanonicalBattles([postgresBattles[0], postgresBattles[0]])).toEqual([
      'Duplicate battle slug: badr',
    ]);
  });
});

describe('validateCanonicalParticipations', () => {
  it('flags duplicate person+battle pairs', () => {
    expect(validateCanonicalParticipations([postgresParticipations[0], postgresParticipations[0]])).toEqual([
      'Duplicate participation: ali-ibn-abi-talib|badr',
    ]);
  });
});
