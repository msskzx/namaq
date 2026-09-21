import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import person from './prophet-muhammad';
import birth from '../events/birth-prophet-muhammad';
import revelation from '../events/first-revelation-of-the-quran';
import istisqa from '../events/istisqa-by-abu-talib';
import kaaba from '../events/rebuilding-of-the-kaaba';

// Read rather than fixtured, so editing the module or the batch alone fails.
const batch = JSON.parse(readFileSync('data/history/batches/prophet-muhammad-sira/batch.json', 'utf8')) as {
  claims: {
    key: string;
    field?: string;
    confidence?: string;
    disputed?: boolean;
    citations: { passageAnchor: string }[];
  }[];
};
const claimByKey = new Map(batch.claims.map((claim) => [claim.key, claim]));

const citedFields = Object.entries(person.fields) as [string, Cited<string>][];
const everyProvenance: [string, Provenance][] = [
  ...citedFields.map(([name, cited]): [string, Provenance] => [name, cited.claims]),
  ...person.titles.map((title): [string, Provenance] => [`title ${title.title}`, title.claims]),
  ...person.relations.map((relation): [string, Provenance] => [`relation ${relation.type} ${relation.to}`, relation.claims]),
  ...(person.ayat ?? []).map((ayah): [string, Provenance] => [`ayah ${ayah.surah}:${ayah.ayah}`, ayah.claims]),
];

describe('the Prophet in the catalog', () => {
  it('supports every value with a claim the batch actually declares', () => {
    const unknown = everyProvenance.flatMap(([where, claims]) =>
      claims === legacyUnreviewed ? [] : claims.filter((key) => !claimByKey.has(key)).map((key) => `${where}: ${key}`),
    );

    expect(unknown).toEqual([]);
  });

  // His seed entry and graph node are retired, so the catalog is his only
  // author and the legacy marker is what carries the values they held. What
  // must not happen is a carried value borrowing a claim it has no right to,
  // so every marked value stays marked and every cited one names a real claim,
  // which the test above checks.
  it('marks a carried value rather than citing the batch for it', () => {
    const marked = everyProvenance.filter(([, claims]) => claims === legacyUnreviewed).map(([where]) => where);

    expect(marked).toContain('appearance');
    expect(marked).toContain('title master-of-children-of-adam');
    expect(marked).toContain('ayah 48:29');
    expect(marked).toContain('relation HUSBAND safiyyah-bint-huyayy');

    // The marker is meant to come off as chapters reach the values. Two of the
    // marriages carried with the rest were cited by chapter six, so they are
    // no longer marked, and asserting that is what keeps this test honest
    // about which direction the debt moves.
    expect(marked).not.toContain('relation HUSBAND umm-salamah');
    expect(marked).not.toContain('relation HUSBAND zaynab-bint-jahsh');
  });

  it('points a single-claim field at a claim about that same field', () => {
    const mismatched = citedFields.flatMap(([name, cited]) => {
      if (cited.claims === legacyUnreviewed || cited.claims.length !== 1) return [];
      const claim = claimByKey.get(cited.claims[0]);
      return claim?.field && claim.field !== name ? [`${name}: ${claim.key} states ${claim.field}`] : [];
    });

    expect(mismatched).toEqual([]);
  });

  // The chapters are read in order, so no citation may point past the furthest
  // page the pass has reached -- an anchor beyond it would mean a page was read
  // out of order and its claim authored ahead of the pass. Chapter eight is the
  // first to cross into volume 2, and it stops at ٢/٢٨. Move this frontier when
  // a chapter reads further, and not before.
  const FRONTIER = { volume: 2, page: 28 };

  it('cites no page past the frontier the chapters have reached', () => {
    const anchors = [...claimByKey.values()]
      .filter((claim) => claim.key.startsWith('prophet/'))
      .flatMap((claim) => claim.citations.map((citation) => citation.passageAnchor));

    const past = anchors.filter((anchor) => {
      const [volume, page] = anchor.split('-')[0].split('/').map(Number);
      return volume > FRONTIER.volume || (volume === FRONTIER.volume && page > FRONTIER.page);
    });

    expect(past).toEqual([]);
  });

  // The title الأمين and the event it was earned in come from one passage, so
  // the two records have to rest on the same page: chapter one authored the
  // title and left the event out until it was asked for.
  it('ties al-Amin to the arbitration it was earned in', () => {
    expect(person.titles.map((title) => title.title)).toContain('truthful-trustworthy');

    const titleAnchors = claimByKey.get('prophet/al-amin')?.citations.map((c) => c.passageAnchor) ?? [];
    const eventAnchors = claimByKey.get('sira/kaaba-rebuilding')?.citations.map((c) => c.passageAnchor) ?? [];
    expect(titleAnchors).toContain('1/65-p1');
    expect(eventAnchors).toContain('1/64-p2');
    expect(kaaba.people.map((entry) => entry.person)).toEqual(['prophet-muhammad']);
  });

  // Urwah and Mujahid date it قبل المبعث بخمس عشرة سنة, counted from the
  // calling, which hijriYear cannot hold.
  it('leaves the rebuilding undated', () => {
    expect(Object.keys(kaaba.fields)).not.toContain('hijriYear');
  });

  // ADR 0014: a kunya is a name, so أبو القاسم is a column and not a Title.
  it('keeps the kunya out of the titles', () => {
    expect(person.fields.kunya.value).toBe('أبو القاسم');
    expect(person.titles.map((title) => title.title)).not.toContain('abu-al-qasim');
  });

  // MAWLA had no other side until this batch needed one; PATRON is his.
  it('records Zayd as a manumission in both directions', () => {
    const zayd = person.relations.find((relation) => relation.to === 'zaid-ibn-harithah');

    expect(zayd?.type).toBe('PATRON');
    expect(zayd?.inverse).toBe('MAWLA');
  });

  // The day of the birth is disputed and a description is one value, so the
  // description names both readings and carries both claims.
  it('holds both readings of the birth day', () => {
    expect(birth.fields.description.claims).toContain('prophet/birth-day');
    expect(birth.fields.description.claims).toContain('prophet/birth-day-alt');
    expect(claimByKey.get('prophet/birth-day')?.confidence).toBe('ESTABLISHED');
    expect(claimByKey.get('prophet/birth-day-alt')?.confidence).toBe('DISPUTED');
    expect(claimByKey.get('prophet/birth-day-alt')?.disputed).toBe(true);
  });

  // al-Dhahabi reports the istisqa on one chain and grades it neither way,
  // while calling Bahira منكر جدا and the next report ضعيف. LIKELY is what
  // that leaves, so the confidence is load-bearing and pinned here.
  it('records seeking rain through him as LIKELY, not ESTABLISHED', () => {
    expect(istisqa.people.map((entry) => entry.person)).toEqual(['prophet-muhammad', 'abu-talib']);
    expect(claimByKey.get('sira/istisqa-bi-an-nabi')?.confidence).toBe('LIKELY');
    expect(claimByKey.get('abu-talib/istisqa')?.confidence).toBe('LIKELY');
    expect(Object.keys(istisqa.fields)).not.toContain('hijriYear');
  });

  // The chapter dates neither by a hijri year: عام الفيل is not one, and the
  // revelation is dated by his age. Both years stay the seeds'.
  it('leaves both events undated', () => {
    expect(Object.keys(birth.fields)).toEqual(['description']);
    expect(Object.keys(revelation.fields)).toEqual(['description']);
  });
});
