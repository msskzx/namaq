import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { kindOf } from '@shared/links';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import type { RelationType } from '@/lib/relationship/types';
import { appLinks, linksFile } from './appLinks';
import { loadCatalog } from './loadCatalog';
import { legacyUnreviewed, type Catalog, type CatalogEvent, type CatalogPerson, type Provenance } from './types';

const person = (slug: string, sex: 'MALE' | 'FEMALE', relations: CatalogPerson['relations'] = []): CatalogPerson => ({
  kind: 'PERSON', slug, name: slug, hasProfile: true, fields: { sex: { value: sex, claims: legacyUnreviewed } }, titles: [], relations,
});

const story = (people: CatalogEvent['people'], ayat: CatalogEvent['ayat'] = []): CatalogEvent => ({
  kind: 'EVENT', slug: 'a-story', name: 'قصة', type: 'OTHER', fields: {}, people, ayat,
  reports: [{ source: { slug: 'sahih-al-bukhari', hadith: 4367, url: '' }, moments: [{ title: '', text: '', people: [] }] }],
});

const catalog = (over: Partial<Catalog>): Catalog => ({ people: [], battles: [], events: [], utterances: [], ...over });

describe('every link, both ways (owner, 2026-11-24)', async () => {
  const built = appLinks(await loadCatalog());

  // The phone reads the file, not the catalog: a link written on a record reaches it only once the file is written again.
  it('is what the catalog builds now (npm run battles:app)', () => {
    expect(readFileSync('shared/data/links.json', 'utf8')).toBe(linksFile(built.links));
  });

  it('names a record at both ends, a type and a source for every link the catalog holds', () => {
    expect(built.problems).toEqual([]);
  });

  // The owner's rule: whatever a link joins, each end shows the other, read the right way (a father's daughter, the
  // ayah revealed about him).
  it('shows every link from its other end too', () => {
    const entries = Object.entries(built.links);
    expect(entries.length).toBeGreaterThan(0);
    for (const [id, links] of entries)
      for (const link of links) {
        const reads = kindOf(id) === 'person' && kindOf(link.to) === 'person' ? RECIPROCAL_INVERSES[link.t as RelationType] ?? [] : [link.t];
        expect(built.links[link.to]?.some(back => back.to === id && (reads as readonly string[]).includes(back.t)), `${link.to} back to ${id}`).toBe(true);
      }
  });

  it('writes a link once on a record and builds the other way, the inverse by the other person\'s sex', () => {
    const { links } = appLinks(catalog({
      people: [person('abu-bakr', 'MALE', [{ type: 'FATHER', to: 'aisha', claims: legacyUnreviewed }]), person('aisha', 'FEMALE')],
    }));
    expect(links['person:aisha']).toEqual([{ t: 'DAUGHTER', to: 'person:abu-bakr', src: [legacyUnreviewed], at: ['person:abu-bakr'] }]);
  });

  // The same tie written on two records, as «نزل فيه» on a person and on a story is today, is one link with both sources.
  it('keeps a link written on two records once, with each record and source', () => {
    const { links } = appLinks(catalog({
      people: [{ ...person('abu-bakr', 'MALE'), ayat: [{ surah: 49, ayah: 1, kind: 'REVEALED_ABOUT', claims: legacyUnreviewed }] }],
      events: [story([{ person: 'abu-bakr' }], [{ kind: 'REVEALED_ABOUT', about: 'abu-bakr', from: '49:1', to: '49:1', evidence: [{ source: 'sahih-al-bukhari', hadith: 4367, quote: '', url: '' }] }])],
    }));
    expect(links['ayah:49:1']).toContainEqual({ t: 'REVEALED_ABOUT', to: 'person:abu-bakr', src: ['hadith:bukhari:4367', legacyUnreviewed], at: ['event:a-story', 'person:abu-bakr'] });
  });

  // A person in a story stands on the report that names them, not on every report of it.
  it('cites only the report whose moment names the person', () => {
    const told = story([]);
    const { links } = appLinks(catalog({
      people: [person('saad', 'MALE')],
      events: [{ ...told, reports: [...told.reports!, { source: { slug: 'sahih-muslim', hadith: 1779, url: '' }, moments: [{ title: '', text: '', people: ['saad'] }] }] }],
    }));
    expect(links['person:saad']).toEqual([{ t: 'IN_EVENT', to: 'event:a-story', src: ['hadith:muslim:1779'], at: ['event:a-story'] }]);
  });

  it('refuses a link to a record that does not exist, or one with no source', () => {
    const { problems } = appLinks(catalog({ events: [story([{ person: 'nobody', claims: [] as unknown as Provenance }])] }));
    expect(problems.map(problem => problem.message)).toEqual(['person:nobody names no record', 'no source']);
  });

  it('gives a range of ayat one link for each ayah in it, across a surah\'s end', () => {
    const { links } = appLinks(catalog({
      events: [story([], [{ kind: 'RECITED', from: '113:5', to: '114:1', evidence: [{ source: 'sahih-al-bukhari', hadith: 4367, quote: '', url: '' }] }])],
    }));
    expect(links['event:a-story'].map(link => link.to)).toEqual(['ayah:113:5', 'ayah:114:1', 'hadith:bukhari:4367']);
  });

  // A relative with no record is left out of the links; once he gets a record, the list must stop leaving him out.
  it('refuses a relative kept as a plain name who now has a record', () => {
    const { links, problems } = appLinks(catalog({ people: [person('jabr', 'MALE', [{ type: 'FATHER', to: 'atik', claims: legacyUnreviewed }])] }), new Set(['person:atik']));
    expect([links, problems]).toEqual([{}, []]);
    const recorded = appLinks(catalog({ people: [person('jabr', 'MALE'), person('atik', 'MALE')] }), new Set(['person:atik']));
    expect(recorded.problems.map(problem => problem.message)).toEqual(['has a record now: take it off UNPROFILED_PEOPLE']);
  });

  it('refuses a range of ayat that runs backwards', () => {
    const { problems } = appLinks(catalog({
      events: [story([], [{ kind: 'RECITED', from: '114:1', to: '113:5', evidence: [{ source: 'sahih-al-bukhari', hadith: 4367, quote: '', url: '' }] }])],
    }));
    expect(problems.map(problem => problem.message)).toEqual(['ayat 114:1 to 113:5 is no range of the mushaf']);
  });
});
