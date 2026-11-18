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

// The pages' text from the first page to the last, paragraphs and pages joined with one space, as a report is quoted.
const pagesText = (slug: string, volume: number, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => paragraphs(slug, volume, from + i)).flat().join(' ');

describe('battle moments', () => {
  it('has some to check', () => expect(moments.length).toBeGreaterThan(0));

  it.each(moments.map(moment => [`${moment.battle}: ${moment.title}`, moment] as const))('%s quotes its pages word for word, chain and all', (_, moment) => {
    const { slug, volume, page, endPage = page } = moment.source;
    const text = pagesText(slug, volume, page, endPage);
    expect(text).toContain(moment.isnad ? `${moment.isnad} ${moment.quote}` : moment.quote);
    // The report starts on its first page and ends on its last.
    expect(pagesText(slug, volume, page, page)).toContain((moment.isnad ?? moment.quote).slice(0, 20));
    expect(pagesText(slug, volume, endPage, endPage)).toContain(moment.quote.slice(-20));
  });

  // The whole report is quoted: its grading follows it at once, on the same page or opening the next one.
  it.each(moments.map(moment => [`${moment.battle}: ${moment.title}`, moment] as const))('%s is a whole report the source places in a Sahih', (_, moment) => {
    const { slug, volume, page, endPage = page } = moment.source;
    const text = pagesText(slug, volume, page, endPage + 1);
    const after = text.slice(text.indexOf(moment.quote) + moment.quote.length).replace(/^[\s،,.]+/, '');
    expect(after.startsWith(moment.grading)).toBe(true);
    expect(moment.grading).toMatch(/البخاري|مسلم/);
  });

  it('names only people the catalog has', () => {
    const people = new Set(readdirSync('data/catalog/people').map(file => file.replace(/\.ts$/, '')));
    expect(moments.flatMap(moment => moment.people).filter(slug => !people.has(slug))).toEqual([]);
  });
});
