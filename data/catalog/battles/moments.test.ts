import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';

const SOURCES = 'data/history/sources';
const { battles } = await loadCatalog();
const moments = battles.flatMap(battle => (battle.moments ?? []).map(moment => ({ battle: battle.slug, ...moment })));
const paragraphs = (slug: string, volume: number, page: number) => {
  const file = `${SOURCES}/${slug}/v${volume}/${page}.md`;
  return existsSync(file) ? readFileSync(file, 'utf8').split(/\n\s*\n/).map(text => text.trim()).filter(Boolean) : [];
};

describe('battle moments', () => {
  it('has some to check', () => expect(moments.length).toBeGreaterThan(0));

  it.each(moments.map(moment => [`${moment.battle}: ${moment.title}`, moment] as const))('%s quotes its page word for word', (_, moment) => {
    expect(paragraphs(moment.source.slug, moment.source.volume, moment.source.page).some(text => text.includes(moment.quote))).toBe(true);
  });

  // The report's own paragraph carries the grading, or it runs onto the next page and the grading opens that page.
  it.each(moments.map(moment => [`${moment.battle}: ${moment.title}`, moment] as const))('%s is a report the source places in a Sahih', (_, moment) => {
    const { slug, volume, page } = moment.source;
    const here = paragraphs(slug, volume, page);
    const at = here.findIndex(text => text.includes(moment.quote));
    const rest = here[at].slice(here[at].indexOf(moment.quote));
    const carried = at === here.length - 1 ? (paragraphs(slug, volume, page + 1)[0] ?? '') : '';
    expect(`${rest} ${carried.startsWith('أخرجه') ? carried : ''}`).toContain(moment.grading);
    expect(moment.grading).toMatch(/البخاري|مسلم/);
  });

  it('names only people the catalog has', () => {
    const people = new Set(readdirSync('data/catalog/people').map(file => file.replace(/\.ts$/, '')));
    expect(moments.flatMap(moment => moment.people).filter(slug => !people.has(slug))).toEqual([]);
  });
});
