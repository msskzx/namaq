import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { appBattles, appMoments, batchClaims, citeOf } from './appBattles';
import { loadCatalog } from './loadCatalog';

const built = appBattles(await loadCatalog());
const badr = built.find(battle => battle.slug === 'badr')!;

describe('the app battles', () => {
  it('is what the catalog builds now (npm run battles:app)', () => {
    expect(JSON.parse(readFileSync('shared/data/battles/battles.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(built)));
    expect(JSON.parse(readFileSync('shared/data/battles/moments.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(appMoments(built))));
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

  // Batches wrote a Siyar volume two ways: Shamela's part label («1» for Talhah) and the edition's volume («5» for
  // al-Abbas, which is the Siyar's second part). The account the batch read names the volume, so every quote cites the
  // part its account is in, whichever way its batch wrote it.
  it("cites a Siyar quote by its account's volume, however its batch wrote the volume", () => {
    const quotes = [...batchClaims().values()].flatMap(claim => claim.citations ?? [])
      .filter(cite => cite.sourceSlug === 'siyar-alam-al-nubala-risalah' && !/^السيرة/.test(cite.volume ?? '') && cite.editionVolume !== undefined);
    expect(quotes.some(cite => cite.volume !== String(cite.editionVolume))).toBe(true);
    expect(quotes.some(cite => cite.volume === String(cite.editionVolume))).toBe(true);
    for (const cite of quotes) {
      const volume = cite.editionVolume!;
      const part = volume <= 2 ? `السيرة ${volume}` : volume === 3 ? 'سيرة الخلفاء الراشدين' : `ج ${volume - 3}`;
      expect(citeOf(cite), `${cite.extractionUrl} ${cite.volume}`).toContain(part.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]));
    }
  });
});
