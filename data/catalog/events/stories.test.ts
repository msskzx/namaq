import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { siyarSiraUrl } from '@/lib/catalog/siyarPages';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';
import { plainName } from '@shared/quran/normalize';
import { appStories, HADITH_URL } from '@/lib/catalog/appStories';
import { STORY_WHEN } from '@/lib/catalog/storyWhen';
import { CHAPTER_OF_STORY, chapterOfBab, OTHER_CHAPTER, siraBab } from '@/lib/catalog/storyChapters';
import { isHadithSource } from '@/lib/catalog/types';

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
// The two Sahihs are the app's own copies (scripts/hadith/buildSahihayn.ts): a hadith's text is its first printed route, chain and all.
type SahihText = { kitabs: { hadith: { n: number; routes: { text: string }[] }[] }[] };
const sahih = (book: string) => (JSON.parse(readFileSync(`data/hadith/sahih/${book}.json`, 'utf8')) as SahihText).kitabs.flatMap(kitab => kitab.hadith);
const SAHIH: Record<string, ReturnType<typeof sahih>> = { 'sahih-al-bukhari': sahih('bukhari'), 'sahih-muslim': sahih('muslim') };
const hadithText = (slug: string, hadith: number) => SAHIH[slug].find(item => item.n === hadith)!.routes[0].text;
const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
const sadi = (JSON.parse(readFileSync('shared/data/quran/tafsirSadi.json', 'utf8')) as { passages: [number, number, number, number, number, string][] }).passages;
const reports = stories.flatMap(story => story.reports!.map((report, i) => [`${story.slug} report ${i + 1}`, report] as const));

describe('sira stories', () => {
  it('has some to check', () => expect(stories.length).toBeGreaterThan(0));

  it.each(reports)('%s is the pages word for word, chain and all', (_, report) => {
    const body = report.moments.map(moment => moment.text).join(' ');
    const told = report.isnad ? `${report.isnad} ${body}` : body;
    // A hadith is told whole, from its chain to its last word.
    if (isHadithSource(report.source)) return expect(told).toBe(hadithText(report.source.slug, report.source.hadith));
    const { slug, volume, page, endPage = page } = report.source;
    expect(pagesText(slug, volume, page, endPage)).toContain(told);
    expect(pagesText(slug, volume, page, page)).toContain((report.isnad ?? body).slice(0, 20));
    expect(pagesText(slug, volume, endPage, endPage)).toContain(body.slice(-20));
  });

  it.each(reports)('%s ends where the source says who has it, when it does', (_, report) => {
    if (isHadithSource(report.source)) return expect(report.grading).toBeUndefined();
    const { slug, volume, page, endPage = page } = report.source;
    const text = pagesText(slug, volume, page, endPage + 1);
    const body = report.moments.map(moment => moment.text).join(' ');
    const after = text.slice(text.indexOf(body) + body.length).replace(/^[\s،,.]+/, '');
    if (report.grading) expect(after.startsWith(report.grading)).toBe(true);
    else expect(after).not.toMatch(/^(أخرجه|رواه)/);
  });

  it('links each report to its page', () => {
    for (const report of stories.flatMap(story => story.reports!)) {
      const { source } = report;
      expect(source.url).toBe(isHadithSource(source) ? HADITH_URL[source.slug](source.hadith) : siyarSiraUrl(source.volume, source.page));
    }
  });

  it('links the evidence for its ayat to its page', () => {
    for (const evidence of stories.flatMap(story => story.ayat ?? []).flatMap(ayat => [...ayat.evidence, ...(ayat.others ?? []).flatMap(other => other.evidence)])) {
      if ('hadith' in evidence) expect(evidence.url).toBe(HADITH_URL[evidence.source](evidence.hadith));
      else if (evidence.source === 'siyar-alam-al-nubala-risalah') expect(evidence.url).toBe(siyarSiraUrl(evidence.volume!, evidence.page));
    }
  });

  it('quotes the evidence for its ayat as the books print it', () => {
    for (const evidence of stories.flatMap(story => story.ayat ?? []).flatMap(ayat => [...ayat.evidence, ...(ayat.others ?? []).flatMap(other => other.evidence)])) {
      const text =
        'hadith' in evidence
          ? hadithText(evidence.source, evidence.hadith)
          : evidence.source === 'tafsir-sadi'
          ? sadi.filter(passage => passage[3] <= evidence.page && evidence.page <= passage[4]).map(passage => passage[5]).join('\n')
          : pagesText(evidence.source, evidence.volume!, evidence.page, evidence.page);
      expect(text).toContain(evidence.quote);
    }
  });

  const turned = reports.flatMap(([name, report]) => report.moments.filter(moment => moment.turns).map(moment => [`${name}, «${moment.title}»`, moment, report] as const));

  it.each(turned)('%s is its turns put back together', (_, moment) => {
    expect(moment.turns!.map(turn => turn.text).join(' ')).toBe(moment.text);
    for (const turn of moment.turns!) if (turn.lead) expect(turn.text.startsWith(turn.lead)).toBe(true);
    // A lead-in is drawn above a bubble: on narration it would have nowhere to go and drop out of the text.
    for (const turn of moment.turns!) if (turn.lead) expect(turn.speaker).toBeDefined();
  });

  // A kunya changes with its case: «أن أبا سفيان أخبره», «في جواب أبي بكر».
  const kunyaForms = (name: string) => [name, name.replace(/^أبو /, 'أبا '), name.replace(/^أبو /, 'أبي ')].map(bare);

  // Owner, 2026-11-21: who speaks comes from the source, never our reading of a bare «فقال».
  it.each(turned)('%s names each speaker as the text or a book does', (_, moment, report) => {
    for (const turn of moment.turns!.filter(turn => turn.speaker)) {
      const { name } = turn.speaker!;
      if (turn.witness) {
        const { source, volume, page, quote } = turn.witness;
        // A quote that skips words marks the gap with « … »: each part is on the page as printed.
        for (const part of quote.split(' … ')) expect(paragraphs(source, volume, page).join('\n')).toContain(part);
        // «ﷺ» is said of the Prophet alone, so a note that gives the answer as his names him.
        if (turn.speaker!.person === 'prophet-muhammad' && quote.includes('ﷺ')) continue;
        expect(kunyaForms(name).some(form => bare(quote).includes(form))).toBe(true);
      } else if (turn.teller) {
        // Owner, 2026-11-22: the teller's own «قلت» is his: the lead says «I said», and the chain names him as the one telling.
        expect(bare(turn.lead ?? '')).toMatch(/^(?:قالت?:? )?(?:ثم )?[فو]?قل(?:ت|نا)(?::? [^:]+)?:?$/);
        // «قلت في نفسي» was thought, not said.
        expect(bare(turn.lead ?? '')).not.toMatch(/نفسي/);
        expect(kunyaForms(name).some(form => bare(report.isnad ?? '').includes(form))).toBe(true);
      } else expect(bare(turn.lead ?? '')).toContain(bare(name));
    }
  });

  it('names only people the catalog has', () => {
    const people = new Set(readdirSync('data/catalog/people').map(file => file.replace(/\.ts$/, '')));
    const named = stories.flatMap(story => [...story.people.map(p => p.person), ...(story.ayat ?? []).flatMap(a => (a.about ? [a.about] : [])), ...story.reports!.flatMap(r => r.moments.flatMap(m => [...m.people, ...(m.turns ?? []).flatMap(t => (t.speaker?.person ? [t.speaker.person] : []))]))]);
    expect(named.filter(slug => !people.has(slug))).toEqual([]);
  });
});

// «قصص السيرة» (owner, 2026-11-23): a story is on a year only where a source gives it that year, and al-Bukhari's chapters keep his order.
const built = appStories(await loadCatalog());
describe('sira stories by year and chapter', () => {
  const slugs = new Set(built.map(story => story.slug));

  it('dates and places only stories that exist', () => {
    expect(Object.keys(STORY_WHEN).filter(slug => !slugs.has(slug))).toEqual([]);
    expect(Object.keys(CHAPTER_OF_STORY).filter(slug => !slugs.has(slug))).toEqual([]);
  });

  it('shows the quote that gives every year a story is on', () => {
    expect(built.filter(story => story.when?.pages.some(page => page !== 'before') && !story.when.refs.length).map(story => story.slug)).toEqual([]);
  });

  it('quotes a year heading of al-Dhahabi only where his page prints it', () => {
    for (const when of Object.values(STORY_WHEN)) {
      if (when.kind !== 'siyar') continue;
      expect(readFileSync(`${SOURCES}/siyar-alam-al-nubala-risalah/v${when.volume}/${when.page}.md`, 'utf8')).toContain(when.quote);
    }
  });

  it("takes a year from al-Bukhari's heading only where the heading names a year", () => {
    for (const when of Object.values(STORY_WHEN)) if (when.kind === 'bab') expect(siraBab(when.hadith)?.title).toContain('سنة');
  });

  it('has a chapter for every heading of the sira in al-Bukhari, from «باب مبعث النبي ﷺ» on', () => {
    type Kitab = { n: number; from: number; to: number; babs: { title: string; from: number }[] };
    const kitabs = (JSON.parse(readFileSync('shared/data/hadith/bukhari.json', 'utf8')) as { kitabs: Kitab[] }).kitabs;
    const start = kitabs.find(kitab => kitab.n === 63)!.babs.find(bab => plainName(bab.title).includes('مبعث'))!.from;
    const end = kitabs.find(kitab => kitab.n === 64)!.to;
    for (let hadith = start; hadith <= end; hadith++) {
      const bab = siraBab(hadith);
      if (bab) expect(() => chapterOfBab(bab.title), bab.title).not.toThrow();
    }
  });

  it('keeps each chapter whole, with the stories of no chapter last', () => {
    const runs = built.map(story => story.chapter).filter((chapter, i, all) => chapter !== all[i - 1]);
    expect(runs).toEqual([...new Set(runs)]);
    expect(runs.at(-1)).toBe(OTHER_CHAPTER);
  });
});
