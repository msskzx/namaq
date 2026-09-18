import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Checked against the batch itself, so editing either side alone fails.
const batch = JSON.parse(
  readFileSync('data/history/batches/abu-ubaydah-pilot/batch.json', 'utf8'),
) as { claims: { key: string }[] };
const declared = new Set(batch.claims.map((claim) => claim.key));

function modules(kind: string) {
  return readdirSync(join('data/catalog', kind))
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
    .map((file) => `${kind}/${file}`);
}

// What this batch put in the catalog. Later batches add their own modules and
// their own participants to these, which is why nothing here counts files.
const authored = [
  'people/abu-ubaydah-ibn-al-jarrah.ts',
  'battles/badr.ts',
  'battles/uhud.ts',
  'battles/zat-as-salasil.ts',
  'battles/fath-damascus.ts',
  'battles/yarmuk.ts',
  'events/saqifah-bani-saidah.ts',
  'events/plague-of-amwas.ts',
];

describe('catalog modules authored from the Abu Ubaydah pilot', () => {
  it('covers the person, the battles the entry places him at, and its two new events', () => {
    const present = [...modules('people'), ...modules('battles'), ...modules('events')];

    authored.forEach((path) => expect(present).toContain(path));
  });

  it('claims every value it declares on the pilot subject', async () => {
    const person = (await import('./people/abu-ubaydah-ibn-al-jarrah')).default;
    const keys = [
      ...Object.values(person.fields).map((field) => field.claims),
      ...person.titles.map((title) => title.claims),
      ...person.relations.map((relation) => relation.claims),
    ].flat();

    expect(keys.length).toBeGreaterThan(0);
    keys.forEach((key) => expect(declared.has(key)).toBe(true));
  });

  it('keeps the event year and the person death year on the same claim', async () => {
    const person = (await import('./people/abu-ubaydah-ibn-al-jarrah')).default;
    const plague = (await import('./events/plague-of-amwas')).default;

    expect(plague.fields.hijriYear?.claims).toEqual(person.fields.deathYearHijri?.claims);
  });
});
