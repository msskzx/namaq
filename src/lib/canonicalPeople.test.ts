import { describe, expect, it } from 'vitest';
import { reconcilePeople, validateCanonicalPeople } from './canonicalPeople';

const profiles = [
  { slug: 'umar', name: 'عمر', fullName: null, nameTransliterated: 'Umar' },
  { slug: 'ali', name: 'علي', fullName: 'علي بن أبي طالب', nameTransliterated: null },
];
const graph = [
  { slug: 'umar', name: ' عمر ', fullName: null, nameTransliterated: 'Umar' },
  { slug: 'ancestor', name: 'جد', fullName: null, nameTransliterated: null },
];

describe('reconcilePeople', () => {
  it('separates profile-only and graph-only slugs', () => {
    const report = reconcilePeople(profiles, graph);
    expect(report.postgresOnly).toEqual(['ali']);
    expect(report.graphOnly).toEqual(['ancestor']);
  });

  it('treats whitespace-only differences as no mismatch', () => {
    const report = reconcilePeople(profiles, graph);
    expect(report.mismatches).toHaveLength(0);
  });

  it('reports a mismatch for differing field values', () => {
    const mismatch = reconcilePeople([profiles[0]], [{ ...graph[0], nameTransliterated: 'Omar' }]);
    expect(mismatch.mismatches[0]).toEqual({
      slug: 'umar',
      field: 'nameTransliterated',
      postgres: 'Umar',
      neo4j: 'Omar',
    });
  });
});

describe('validateCanonicalPeople', () => {
  it('flags duplicate slugs', () => {
    expect(validateCanonicalPeople([{ ...profiles[0] }, { ...profiles[0] }])).toEqual([
      'Duplicate slug: umar',
    ]);
  });
});
