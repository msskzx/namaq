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

  // Ten had no subject anywhere until the badr-martyrs batch reached the
  // roster, and their modules are their only author. Ubaydah ibn al-Harith
  // joined them from chapter six, which names him Zaynab bint Khuzaymah's
  // second husband and so gives the catalog a cited value to author him for.
  // Aqil ibn al-Bukayr joined them from his own Siyar entry (entry 16), which
  // retired his seed row the same way. Saad ibn Khaythamah and Safwan ibn
  // Bayda joined last, carried wholesale off the graph seeds when the wider
  // ancestor migration reached their fathers' edges -- still nothing cited
  // about either beyond that carried ancestor link.
  it('creates a subject for every one of the fourteen', () => {
    const authored = martyrs.filter((slug) => bySlug.has(slug));
    expect(authored).toHaveLength(14);
  });

  // The roster's own word رجالا is what states this, so one claim carries it
  // for all of them rather than each guessing.
  it('takes their sex from the roster rather than from their names', () => {
    for (const slug of martyrs) {
      const sex = bySlug.get(slug)?.fields.sex;
      expect(sex).toBeDefined();
      expect(SEXES).toContain(sex?.value);
    }
    // Each cites the roster line that names him plus the count that calls the
    // fourteen رجالا, rather than inferring a man from an Arabic name. Ubaydah
    // ibn al-Harith's sex claim cites his Siyar nasab line instead.
    const cited = martyrs.flatMap((slug) => {
      const claims = bySlug.get(slug)?.fields.sex?.claims;
      return claims && claims !== legacyUnreviewed ? [...claims] : [];
    });
    expect(cited).toHaveLength(11);
    for (const key of cited) {
      const claim = claimByKey.get(key);
      const citesRoster = claim?.citations.some((c) => c.excerptArabic.includes('أربعة عشر رجلا'));
      const citesSiyar = claim?.citations.some((c) => c.excerptArabic.includes('عُبَيْدَةُ بنُ الحَارِثِ'));
      expect(citesRoster || citesSiyar).toBe(true);
    }
  });
});
