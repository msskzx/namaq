import assert from 'node:assert/strict';
import { reconcilePeople, validateCanonicalPeople } from '../../src/lib/canonicalPeople';

const profiles = [
  { slug: 'umar', name: 'عمر', fullName: null, nameTransliterated: 'Umar' },
  { slug: 'ali', name: 'علي', fullName: 'علي بن أبي طالب', nameTransliterated: null },
];
const graph = [
  { slug: 'umar', name: ' عمر ', fullName: null, nameTransliterated: 'Umar' },
  { slug: 'ancestor', name: 'جد', fullName: null, nameTransliterated: null },
];

const report = reconcilePeople(profiles, graph);
assert.deepEqual(report.postgresOnly, ['ali']);
assert.deepEqual(report.graphOnly, ['ancestor']);
assert.equal(report.mismatches.length, 0, 'whitespace-only values should agree');
assert.deepEqual(validateCanonicalPeople([{ ...profiles[0] }, { ...profiles[0] }]), ['Duplicate slug: umar']);

const mismatch = reconcilePeople([profiles[0]], [{ ...graph[0], nameTransliterated: 'Omar' }]);
assert.deepEqual(mismatch.mismatches[0], {
  slug: 'umar',
  field: 'nameTransliterated',
  postgres: 'Umar',
  neo4j: 'Omar',
});

console.log('canonicalPeople tests passed');
