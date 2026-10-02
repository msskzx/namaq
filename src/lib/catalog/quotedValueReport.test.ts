import { describe, expect, it } from 'vitest';
import type { CitationRecord } from '@/lib/history/batchSchema';
import { checkQuotedValues, collectQuotedValues, type LoadPage } from './quotedValueReport';
import { legacyUnreviewed, type Catalog, type CatalogPerson, type Provenance } from './types';

const heading = '٣ - الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى * (ع)';
const continuation = 'ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ.';
const seamed =
  'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى بنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ';

const source = 'siyar-alam-al-nubala-risalah';
const pages: Record<string, string> = { [`${source}/v4/41`]: `${heading}\n\n${continuation}` };
const loadPage: LoadPage = (sourceSlug, volume, printedPage) => pages[`${sourceSlug}/v${volume}/${printedPage}`] ?? null;

const citation = (anchor: string): CitationRecord => ({
  sourceSlug: source,
  passageAnchor: anchor,
  extractionUrl: `https://shamela.ws/book/10906/${anchor}`,
  excerptArabic: heading,
  accessedAt: '2026-01-01',
});

const claimKey = 'people/az-zubayr-ibn-al-awwam.fullName';
const citationsByClaim = new Map<string, CitationRecord[]>([[claimKey, [citation('4/41-p1')]]]);

const sahabi = { title: 'sahabi', name: 'صَحَابِيٌّ', nameTransliterated: 'Sahabi', claims: ['titles.sahabi'] } as const;

function person(fields: Omit<CatalogPerson['fields'], 'sex'> = {}, titles: CatalogPerson['titles'] = []): CatalogPerson {
  return {
    kind: 'PERSON',
    slug: 'az-zubayr-ibn-al-awwam',
    name: seamed,
    hasProfile: true,
    fields: { sex: { value: 'MALE', claims: ['people/az-zubayr-ibn-al-awwam.sex'] }, ...fields },
    titles,
    relations: [],
  };
}

const catalog = (people: CatalogPerson[]): Catalog => ({ people, battles: [], events: [], utterances: [] });

describe('collectQuotedValues', () => {
  const withLegacy = catalog([
    person(
      {
        fullName: { value: seamed, claims: [claimKey] },
        kunya: { value: 'أَبُو عَبْدِ اللهِ', claims: legacyUnreviewed },
        birthYearHijri: { value: '2', claims: ['people/az-zubayr-ibn-al-awwam.birthYearHijri'] },
        placeOfBirthTransliterated: { value: 'Mecca', claims: ['people/az-zubayr-ibn-al-awwam.birthPlace'] },
      },
      [sahabi],
    ),
  ]);

  it('skips legacy-unreviewed, structured and transliterated values, and title labels', () => {
    const paths = collectQuotedValues(withLegacy).map((entry) => entry.path);
    expect(paths).toEqual([
      'people/az-zubayr-ibn-al-awwam.fullName',
      'people/az-zubayr-ibn-al-awwam.name',
    ]);
    expect(paths.some((path) => path.includes('.titles.'))).toBe(false);
  });

  it("gives the known name its fullName's claims", () => {
    const name = collectQuotedValues(withLegacy).find((entry) => entry.path.endsWith('.name'));
    expect(name).toMatchObject({ kind: 'name', value: seamed, claims: [claimKey] });
  });

  it('drops the known name of a person with no cited fullName', () => {
    const names = collectQuotedValues(catalog([person()]));
    expect(names.some((entry) => entry.kind === 'name')).toBe(false);
  });

  it('collects battle, event and utterance text', () => {
    const claims: Provenance = ['battle/uhud.location'];
    const rows = collectQuotedValues({
      people: [],
      battles: [
        {
          kind: 'BATTLE',
          slug: 'uhud',
          name: 'أُحُدٌ',
          fields: { location: { value: 'بُنُ حُظَيْنٍ', claims }, hijriYear: { value: 3, claims } },
          participants: [{ person: 'hamzah', isMuslim: true, claims, summary: { value: 'قُتِلَ', claims } }],
        },
      ],
      events: [{ kind: 'EVENT', slug: 'hijrah', name: 'الهجرة', type: 'OTHER', fields: {}, people: [{ person: 'muhammad', claims }] }],
      utterances: [
        { kind: 'UTTERANCE', slug: 'u', utteranceKind: 'POETRY', textArabic: { value: 'كَانَ', claims }, fields: {} },
      ],
    });
    expect(rows.map((entry) => entry.path)).toEqual([
      'battles/uhud.location',
      'battles/uhud.hamzah.summary',
      'utterances/u.textArabic',
    ]);
  });
});

describe('checkQuotedValues', () => {
  const check = (value: string, claims: Provenance) =>
    checkQuotedValues(collectQuotedValues(catalog([person({ fullName: { value, claims } })])), citationsByClaim, loadPage);

  it('passes a fullName joined across the seam', () => {
    expect(check(seamed, [claimKey])).toEqual([
      { subject: 'people/az-zubayr-ibn-al-awwam', path: 'people/az-zubayr-ibn-al-awwam.fullName', kind: 'value', status: 'pass' },
      { subject: 'people/az-zubayr-ibn-al-awwam', path: 'people/az-zubayr-ibn-al-awwam.name', kind: 'name', status: 'pass' },
    ]);
  });

  it('fails an unvowelled value and says where it diverges', () => {
    const [fail] = check('الزبير بن العوام', [claimKey]);
    expect(fail).toMatchObject({ path: 'people/az-zubayr-ibn-al-awwam.fullName', status: 'fail' });
    expect(fail.detail).toBe('matched «الز» | next «بير بن العوام» (diverges)');
  });

  it('skips a value whose citations are outside volumes 4 and 5', () => {
    const other = new Map(citationsByClaim).set(claimKey, [citation('1/5-p1')]);
    const [row] = checkQuotedValues(collectQuotedValues(catalog([person({ fullName: { value: seamed, claims: [claimKey] } })])), other, loadPage);
    expect(row.status).toBe('out-of-scope');
  });

  it('reports a page the store does not hold as unresolved', () => {
    const missing = new Map(citationsByClaim).set(claimKey, [citation('4/999-p1')]);
    const [row] = checkQuotedValues(collectQuotedValues(catalog([person({ fullName: { value: seamed, claims: [claimKey] } })])), missing, loadPage);
    expect(row).toMatchObject({ status: 'unresolved', detail: 'unresolved «4/999-p1»' });
  });

  it('reports a value whose claims no batch declares as having no evidence', () => {
    const [row] = checkQuotedValues(collectQuotedValues(catalog([person({ fullName: { value: seamed, claims: ['nobody/claims'] } })])), citationsByClaim, loadPage);
    expect(row.status).toBe('no-evidence');
  });
});
