import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { appBattles, appMoments, batchClaims, citeOf } from './appBattles';
import { appPlaces } from './appPlaces';
import { loadCatalog } from './loadCatalog';

const catalog = await loadCatalog();
const built = appBattles(catalog);
const badr = built.find(battle => battle.slug === 'badr')!;

describe('the app battles', () => {
  it('is what the catalog builds now (npm run battles:app)', () => {
    expect(JSON.parse(readFileSync('shared/data/battles/battles.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(built)));
    expect(JSON.parse(readFileSync('shared/data/battles/moments.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(appMoments(built))));
    expect(JSON.parse(readFileSync('shared/data/places.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(appPlaces(catalog))));
  });

  it('carries every battle in the catalog, earliest first', () => {
    expect(built.length).toBeGreaterThan(40);
    const years = built.flatMap(battle => (battle.year ? [battle.year.value] : []));
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it('shows a value only with its quotes, and leaves out one whose evidence is owed', () => {
    expect(badr.counts.muslims).toMatchObject({ value: 313 });
    expect(badr.counts.muslims!.refs[0]).toMatchObject({ cite: 'سير أعلام النبلاء، السيرة ١، ص ٣٢٥' });
    expect(badr.location).toBeUndefined();
    const values = built.flatMap(battle => [battle.year, battle.location, ...Object.values(battle.counts)]);
    expect(values.every(value => value === undefined || value.refs.length > 0)).toBe(true);
  });

  it('gives a value its other readings, each with its own reference', () => {
    expect(badr.counts.muslims!.others?.[0]).toMatchObject({ text: expect.stringContaining('ثلاثمائة وتسعة عشر') });
    expect(badr.counts.muslims!.others![0].refs.length).toBeGreaterThan(0);
    expect(built.find(battle => battle.slug === 'banu-al-mustaliq')!.year!.others?.[0].text).toContain('سنة ست');
  });

  it('names the kind in Arabic and pins the place', () => {
    expect(badr.kind?.value).toBe('غزوة');
    expect(badr.place?.name).toBe('بدر');
  });

  it('keeps the moments in order, with their people by name', () => {
    expect(badr.moments.map(moment => moment.title)[0]).toBe('عدة أهل بدر');
    expect(badr.moments.find(moment => moment.title === 'المبارزة')!.people.map(person => person.name)).toHaveLength(3);
    expect(badr.moments.every(moment => moment.people.every(person => person.name !== person.slug))).toBe(true);
  });

  it('lists the martyrs apart from the others present', () => {
    expect(badr.martyrs.length).toBeGreaterThan(0);
    expect(badr.present.some(person => badr.martyrs.some(martyr => martyr.slug === person.slug))).toBe(false);
  });

  it('writes a citation the way the app shows it', () => {
    expect(citeOf({ sourceSlug: 'siyar-alam-al-nubala-risalah', volume: 'السيرة 2', pageReference: '18' })).toBe('سير أعلام النبلاء، السيرة ٢، ص ١٨');
  });

  // Batches wrote a Siyar volume three ways: Shamela's part label («1» for Talhah, edition volume 4), the edition's
  // volume («5» for al-Abbas, the Siyar's second part), and «السيرة 2» for Sawdah's vol-5 pages. The account the batch
  // read decides, except inside the Sira account, where «السيرة N» tells its two volumes apart. Each case below is
  // checked against the Risalah edition's own volume for that page.
  it("cites a Siyar quote by the volume its page is in, however its batch wrote the volume", () => {
    const claims = batchClaims();
    const siyar = (key: string) => claims.get(key)!.citations!.find(cite => cite.sourceSlug === 'siyar-alam-al-nubala-risalah')!;
    expect(citeOf(siyar('talhah/full-name'))).toBe('سير أعلام النبلاء، ج ١، ص ٢٣');
    expect(citeOf(siyar('al-abbas-ibn-abd-al-muttalib-siyar11/sex'))).toBe('سير أعلام النبلاء، ج ٢، ص ٧٨');
    expect(citeOf(siyar('sawdah-bint-zamah-siyar40/full-name'))).toBe('سير أعلام النبلاء، ج ٢، ص ٢٦٥');
    expect(citeOf(siyar('hudaybiyyah/year'))).toBe('سير أعلام النبلاء، السيرة ٢، ص ٢٨');
  });
});
