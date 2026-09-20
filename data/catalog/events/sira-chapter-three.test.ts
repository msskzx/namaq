import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type CatalogEvent, type Provenance } from '@/lib/catalog/types';
import mosque from './building-of-the-prophets-mosque';
import quba from './founding-of-masjid-quba';
import muakhah from './brotherhood-of-muhajirun-and-ansar';
import adhan from './legislation-of-the-adhan';
import ibnSalam from './islam-of-abdullah-ibn-salam';
import deathAsad from './death-of-asad-ibn-zurarah';
import deathBaraa from './death-of-al-baraa-ibn-marur';

type Claim = { key: string; citations: { passageAnchor: string }[] };
const BATCHES = 'data/history/batches';
const claimByKey = new Map(
  readdirSync(BATCHES)
    .flatMap((dir) => (JSON.parse(readFileSync(`${BATCHES}/${dir}/batch.json`, 'utf8')) as { claims: Claim[] }).claims)
    .map((claim) => [claim.key, claim]),
);
const keysOf = (claims: Provenance): readonly string[] => (claims === legacyUnreviewed ? [] : claims);

const chapterThree: CatalogEvent[] = [mosque, quba, muakhah, adhan, ibnSalam, deathAsad, deathBaraa];

/** The heading السنة الأولى من الهجرة, which is what dates this chapter. */
const YEAR_ONE_ANCHOR = '1/283-p1';

describe('chapter three of the sira in the catalog', () => {
  it('backs every value with a claim some batch declares', () => {
    const unknown = chapterThree
      .flatMap((event) => [
        ...Object.entries(event.fields).flatMap(([name, cited]) =>
          (cited?.claims ? keysOf(cited.claims) : []).map((key) => [`${event.slug}.${name}`, key] as const),
        ),
        ...event.people.flatMap((entry) =>
          keysOf(entry.claims).map((key) => [`${event.slug}.${entry.person}`, key] as const),
        ),
      ])
      .filter(([, key]) => !claimByKey.has(key));

    expect(unknown).toEqual([]);
  });

  // Unlike chapters one and two, this one is dated, and the dating is not an
  // assumption: the claim behind each year cites the chapter heading itself.
  it('dates every event to year one on the strength of the chapter heading', () => {
    for (const event of chapterThree) {
      expect(event.fields.hijriYear?.value).toBe(1);

      const yearClaims = event.fields.hijriYear?.claims;
      const anchors = (yearClaims ? keysOf(yearClaims) : []).flatMap(
        (key) => claimByKey.get(key)?.citations.map((citation) => citation.passageAnchor) ?? [],
      );
      expect(anchors).toContain(YEAR_ONE_ANCHOR);
    }
  });

  // The chapter names عبد الله بن زيد without a patronymic and two subjects
  // carry that name, so he is deliberately not linked. Only Umar is.
  it('links only Umar to the adhan, not either Abdullah ibn Zayd', () => {
    const people = adhan.people.map((entry) => entry.person);

    expect(people).toEqual(['prophet-muhammad', 'umar-ibn-al-khattab']);
    expect(people.some((slug) => slug.startsWith('abdullah-ibn-zayd'))).toBe(false);
  });

  // The act, not the pairs. PACT_BROTHER records those on the people.
  it('leaves the brotherhood event unpeopled but for the Prophet', () => {
    expect(muakhah.people.map((entry) => entry.person)).toEqual(['prophet-muhammad']);
  });
});
