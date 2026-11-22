import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { appLife } from './appLife';
import { appStories } from './appStories';
import { loadCatalog } from './loadCatalog';

describe("a person's «حياته»", async () => {
  const catalog = await loadCatalog();
  const life = appLife(catalog);

  // The phone reads these two files, not the catalog. A catalog fix reaches it only once they are written again.
  it('and the sira stories are what the catalog builds now (npm run battles:app)', () => {
    expect(JSON.parse(readFileSync('shared/data/events/life.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(life)));
    expect(JSON.parse(readFileSync('shared/data/events/stories.json', 'utf8'))).toEqual(JSON.parse(JSON.stringify(appStories(catalog))));
  });

  it('holds only what places the person with its quotes, dated ones by year and undated stories last', () => {
    for (const entries of Object.values(life)) {
      for (const entry of entries) expect(entry.refs.length).toBeGreaterThan(0);
      const years = entries.flatMap(entry => (entry.year ? [entry.year.value] : []));
      expect(years).toEqual([...years].sort((a, b) => a - b));
      const firstUndated = entries.findIndex(entry => !entry.year);
      if (firstUndated >= 0) expect(entries.slice(firstUndated).every(entry => entry.kind === 'story' && !entry.year)).toBe(true);
    }
  });

  it('keeps an event with no cited year off the timeline', () => {
    const slugs = Object.values(life).flat().map(entry => entry.slug);
    expect(slugs).not.toContain('hajjat-al-wada');
  });

  it('shows a disputed year with its other reading (the Isra)', () => {
    const isra = life['prophet-muhammad'].find(entry => entry.slug === 'al-isra-wal-miraj');
    expect(isra?.year?.value).toBe(-1);
    expect(isra?.year?.others?.[0].text).toMatch(/ابن سعد/);
  });

  it('says who was martyred in a battle', () => {
    expect(life['hamzah-ibn-abd-al-muttalib'].find(entry => entry.slug === 'uhud')?.role).toBe('استشهد فيها');
  });

  it('puts the people of a sira story in it', () => {
    expect(life['utbah-ibn-rabiah'].map(entry => entry.slug)).toContain('utbah-offers-and-hears-fussilat');
  });
});
