import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SEXES, legacyUnreviewed, type CatalogBattle, type CatalogPerson } from '@/lib/catalog/types';
import badr from '../battles/badr';

type Claim = { key: string; citations: { excerptArabic: string }[] };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);

const battle: CatalogBattle = badr;
const martyrs = battle.participants.filter((entry) => entry.status?.includes('MARTYRED')).map((entry) => entry.person);

const people = await Promise.all(
  readdirSync('data/catalog/people')
    .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
    .map(async (name) => (await import(`./${name.slice(0, -3)}`)).default as CatalogPerson),
);
const bySlug = new Map(people.map((person) => [person.slug, person]));

describe('the fourteen dead of Badr', () => {
  // al-Dhahabi names them and closes with فالجملة أربعة عشر رجلا, so the roster
  // is a count as well as a list, and the record should match it exactly.
  it('records all fourteen the roster names', () => {
    expect(martyrs).toHaveLength(14);
  });

  // Ten had no subject anywhere until this batch reached the roster, and their
  // modules are their only author. Ubaydah ibn al-Harith joined them from
  // chapter six, which names him Zaynab bint Khuzaymah's second husband and so
  // gives the catalog a cited value to author him for. The three left have
  // nothing cited about them yet and keep their seed entries.
  it('creates a subject for each of the eleven the batch has reached', () => {
    const authored = martyrs.filter((slug) => bySlug.has(slug));
    expect(authored).toHaveLength(11);

    const seedDeclared = martyrs.filter((slug) => !bySlug.has(slug));
    expect(seedDeclared.sort()).toEqual(
      ['aqil-ibn-al-bukayr', 'saad-ibn-khaythamah', 'safwan-ibn-bayda'].sort(),
    );
  });

  // The roster's own word رجالا is what states this, so one claim carries it
  // for all of them rather than each guessing.
  it('takes their sex from the roster rather than from their names', () => {
    for (const slug of martyrs) {
      const sex = bySlug.get(slug)?.fields.sex;
      if (!sex) continue;
      expect(SEXES).toContain(sex.value);
      expect(sex.claims).not.toBe(legacyUnreviewed);
    }

    // Each cites the roster line that names him plus the count that calls the
    // fourteen رجالا, rather than inferring a man from an Arabic name.
    const cited = martyrs.flatMap((slug) => {
      const claims = bySlug.get(slug)?.fields.sex?.claims;
      return claims && claims !== legacyUnreviewed ? [...claims] : [];
    });
    expect(cited).toHaveLength(10);
    for (const key of cited) {
      expect(claimByKey.get(key)?.citations.some((c) => c.excerptArabic.includes('أربعة عشر رجلا'))).toBe(true);
    }
  });
});

describe('sex across the catalog', () => {
  // legacyUnreviewed is the one-time migration's to write, never an authored
  // module's, so an uncited sex is left unset rather than marked owed.
  it('is cited wherever it is set at all', () => {
    const marked = people.filter((person) => person.fields.sex?.claims === legacyUnreviewed).map((person) => person.slug);
    expect(marked).toEqual([]);

    const unknown = people
      .filter((person) => person.fields.sex && !SEXES.includes(person.fields.sex.value))
      .map((person) => person.slug);
    expect(unknown).toEqual([]);
  });
});
