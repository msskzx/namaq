import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { siyarSiraUrl } from '@/lib/catalog/siyarPages';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';

// A story is told whole (owner, 2026-11-18: nothing is cut): each report's moments, joined, are the pages' text.
const SOURCES = 'data/history/sources';
const { events } = await loadCatalog();
const stories = events.filter(event => event.reports?.length);
const paragraphs = (slug: string, volume: number, page: number) => {
  const file = `${SOURCES}/${slug}/v${volume}/${page}.md`;
  return existsSync(file) ? readFileSync(file, 'utf8').split(/\n\s*\n/).map(text => text.trim()).filter(Boolean) : [];
};
const pagesText = (slug: string, volume: number, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => paragraphs(slug, volume, from + i)).flat().join(' ');
const sadi = (JSON.parse(readFileSync('shared/data/quran/tafsirSadi.json', 'utf8')) as { passages: [number, number, number, number, number, string][] }).passages;
const reports = stories.flatMap(story => story.reports!.map((report, i) => [`${story.slug} report ${i + 1}`, report] as const));

describe('sira stories', () => {
  it('has some to check', () => expect(stories.length).toBeGreaterThan(0));

  it.each(reports)('%s is the pages word for word, chain and all', (_, report) => {
    const { slug, volume, page, endPage = page } = report.source;
    const body = report.moments.map(moment => moment.text).join(' ');
    expect(pagesText(slug, volume, page, endPage)).toContain(report.isnad ? `${report.isnad} ${body}` : body);
    expect(pagesText(slug, volume, page, page)).toContain((report.isnad ?? body).slice(0, 20));
    expect(pagesText(slug, volume, endPage, endPage)).toContain(body.slice(-20));
  });

  it.each(reports)('%s ends where the source says who has it, when it does', (_, report) => {
    const { slug, volume, page, endPage = page } = report.source;
    const text = pagesText(slug, volume, page, endPage + 1);
    const body = report.moments.map(moment => moment.text).join(' ');
    const after = text.slice(text.indexOf(body) + body.length).replace(/^[\s،,.]+/, '');
    if (report.grading) expect(after.startsWith(report.grading)).toBe(true);
    else expect(after).not.toMatch(/^(أخرجه|رواه)/);
  });

  it('links each report to its page', () => {
    for (const report of stories.flatMap(story => story.reports!)) {
      expect(report.source.url).toBe(siyarSiraUrl(report.source.volume, report.source.page));
    }
  });

  it('links the sira evidence for its ayat to its page', () => {
    for (const evidence of stories.flatMap(story => story.ayat ?? []).flatMap(ayat => [...ayat.evidence, ...(ayat.others ?? []).flatMap(other => other.evidence)])) {
      if (evidence.source === 'siyar-alam-al-nubala-risalah') expect(evidence.url).toBe(siyarSiraUrl(evidence.volume!, evidence.page));
    }
  });

  it('quotes the evidence for its ayat as the books print it', () => {
    for (const evidence of stories.flatMap(story => story.ayat ?? []).flatMap(ayat => [...ayat.evidence, ...(ayat.others ?? []).flatMap(other => other.evidence)])) {
      const text =
        evidence.source === 'tafsir-sadi'
          ? sadi.filter(passage => passage[3] <= evidence.page && evidence.page <= passage[4]).map(passage => passage[5]).join('\n')
          : pagesText(evidence.source, evidence.volume!, evidence.page, evidence.page);
      expect(text).toContain(evidence.quote);
    }
  });

  it('names only people the catalog has', () => {
    const people = new Set(readdirSync('data/catalog/people').map(file => file.replace(/\.ts$/, '')));
    const named = stories.flatMap(story => [...story.people.map(p => p.person), ...story.reports!.flatMap(r => r.moments.flatMap(m => m.people))]);
    expect(named.filter(slug => !people.has(slug))).toEqual([]);
  });
});
