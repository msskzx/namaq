// The phone app's sira stories (owner, 2026-11-18): events the catalog tells whole in reports. The app is offline, so
// scripts/battles/buildAppBattles.ts writes them to shared/data/events/stories.json.
import type { AppStory, AppTurn } from '@shared/stories/story';
import { quranpediaPage } from '@shared/readerBooks';
import { PROPHET_AGENT } from '@shared/hadith';
import { batchClaims, citeOf, citing } from './appBattles';
import { siraBab, storyChapter } from './storyChapters';
import { STORY_WHEN, type StoryWhen } from './storyWhen';
import { siyarSiraUrl } from './siyarPages';
import type { AppCite } from '@shared/battles/battle';
import type { StoryWhenApp } from '@shared/stories/story';
import type { Catalog, CatalogReportSource, CatalogStoryAyat, CatalogStoryEvidence, CatalogTurn } from './types';
import { isHadithSource, legacyUnreviewed, STORY_TAGS } from './types';

const digits = (text: string) => text.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
const SIRA = 'siyar-alam-al-nubala-risalah';

const HADITH_BOOKS: Record<string, string> = { 'sahih-al-bukhari': 'صحيح البخاري', 'sahih-muslim': 'صحيح مسلم' };
/** Each hadith book's page for one hadith, by the number the store files it under (sunnah.com's numbering). */
export const HADITH_URL: Record<string, (hadith: number) => string> = {
  'sahih-al-bukhari': hadith => `https://sunnah.com/bukhari:${hadith}`,
  // Abd al-Baqi's numbers, the ones the app's Sahih Muslim (data/hadith/sahih/muslim.json) and sunnah.com both use.
  'sahih-muslim': hadith => `https://sunnah.com/muslim:${hadith}`,
};

/** The books a turn's witness may cite, by slug, as a cite names them. */
const WITNESS_BOOKS: Record<string, string> = { 'kawkab-wahhaj': 'الكوكب الوهاج للهرري', 'fath-al-bari': 'فتح الباري لابن حجر' };

const appTurn = (turn: CatalogTurn): AppTurn => ({
  ...(turn.lead ? { lead: turn.lead } : {}),
  text: turn.lead ? turn.text.slice(turn.lead.length).trimStart() : turn.text,
  ...(turn.speaker ? { speaker: { name: turn.speaker.name, ...(turn.speaker.person ? { person: turn.speaker.person } : {}) } } : {}),
  ...(turn.witness
    ? { witness: { text: turn.witness.quote, cite: digits(`${WITNESS_BOOKS[turn.witness.source] ?? turn.witness.source}، ج ${turn.witness.volume}، ص ${turn.witness.page}`), url: turn.witness.url } }
    : {}),
});

/** «سير أعلام النبلاء، السيرة ١، ص ١٢٤–١٢٥» or «صحيح البخاري، رقم ٤٨٥٤». */
export const reportCite = (source: CatalogReportSource) =>
  isHadithSource(source)
    ? digits(`${HADITH_BOOKS[source.slug] ?? source.slug}، رقم ${source.hadith}`)
    : citeOf({ sourceSlug: source.slug, volume: source.volumeLabel, pageReference: source.endPage ? `${source.page}–${source.endPage}` : String(source.page) });

const refOf = (evidence: CatalogStoryEvidence) =>
  'hadith' in evidence
    ? { text: evidence.quote, cite: reportCite({ slug: evidence.source, hadith: evidence.hadith, url: evidence.url }), url: evidence.url }
    : evidence.source === SIRA
      ? { text: evidence.quote, cite: citeOf({ sourceSlug: SIRA, volume: evidence.volumeLabel, pageReference: String(evidence.page) }), url: evidence.url }
      : { text: evidence.quote, cite: digits(`تفسير السعدي، ص ${evidence.page}`), url: quranpediaPage('sadi', 1, evidence.page) };

/** Where a story sits: in the order al-Siyar tells it, and the stories from the hadith books after (al-Siyar has far fewer than 1000 volumes). */
const placeOf = (source: CatalogReportSource) => (isHadithSource(source) ? [1000, source.hadith] : [source.volume, source.page]);

const AYAT_KIND: Record<CatalogStoryAyat['kind'], string> = { RECITED: 'ما قرأه', REVEALED_ABOUT: 'نزل فيه' };

/**
 * A story's year pages and the quotes that give them (storyWhen.ts). It fails the build when a story's battle or event
 * has no cited year, or when its battle or event has another reading the book does not reject. A rejected reading
 * («وهذا لا يصح») stays in the quotes but gets no page.
 */
/** The battle a story is set in, from storyWhen.ts. */
const battleOf = (slug: string) => { const when = STORY_WHEN[slug]; return when?.kind === 'battle' ? when.slug : undefined; };

/** How al-Dhahabi rejects a reading: «وهذا لا يصح», «وهم بين». */
const REJECTED = /لا يصح|وهم بين/;

export function storyYears(catalog: Catalog, claims = batchClaims()) {
  const { cited } = citing(claims);
  const fail = (slug: string, why: string): never => { throw new Error(`Story ${slug}: ${why}`); };
  return (slug: string, when: StoryWhen | undefined): StoryWhenApp | undefined => {
    if (!when) return undefined;
    switch (when.kind) {
      case 'before':
        return { pages: ['before'], refs: [] };
      case 'battle': {
        const year = cited(catalog.battles.find(battle => battle.slug === when.slug)?.fields?.hijriYear) ?? fail(slug, `battle ${when.slug} has no cited year`);
        // A story goes on one year only where the book itself rejects every other reading; the rejected quotes still show.
        const open = (year.others ?? []).filter(other => !other.refs.some(ref => REJECTED.test(ref.text)));
        if (open.length) fail(slug, `${when.slug}'s year has a reading the book does not reject: ${open[0].text}`);
        return { pages: [year.value], refs: [...year.refs, ...(year.others ?? []).flatMap(other => other.refs)] };
      }
      case 'event': {
        const year = cited(catalog.events.find(event => event.slug === when.slug)?.fields.hijriYear) ?? fail(slug, `event ${when.slug} has no cited year`);
        if (year.others?.length) fail(slug, `${when.slug}'s year has other readings`);
        return { pages: [year.value], refs: year.refs };
      }
      case 'siyar':
        return { pages: [when.year], refs: [{ text: when.quote, cite: citeOf({ sourceSlug: SIRA, volume: `السيرة ${when.volume}`, pageReference: String(when.page) }), url: siyarSiraUrl(when.volume, when.page) }] };
      case 'bab': {
        const bab = siraBab(when.hadith) ?? fail(slug, `no heading over al-Bukhari ${when.hadith}`);
        return { pages: [when.year], refs: [{ text: bab.title, cite: reportCite({ slug: 'sahih-al-bukhari', hadith: when.hadith, url: HADITH_URL['sahih-al-bukhari'](when.hadith) }), url: HADITH_URL['sahih-al-bukhari'](when.hadith) }] satisfies AppCite[] };
      }
    }
  };
}

export function appStories(catalog: Catalog, claims = batchClaims()): AppStory[] {
  const names = new Map(catalog.people.map(person => [person.slug, person.name]));
  const link = (slug: string) => ({ slug, name: names.get(slug) ?? slug });
  const yearsOf = storyYears(catalog, claims);
  const stories = catalog.events
    .filter(event => event.reports?.length)
    // In the order the source tells them.
    .sort((a, b) => {
      const [x, y] = [placeOf(a.reports![0].source), placeOf(b.reports![0].source)];
      return x[0] - y[0] || x[1] - y[1];
    })
    .map(event => {
      const location = event.fields.location;
      const placeRefs =
        location && location.claims !== legacyUnreviewed
          ? location.claims.flatMap(key => (claims.get(key)?.citations ?? []).filter(c => c.excerptArabic).map(c => ({ text: c.excerptArabic!, cite: citeOf(c), url: c.extractionUrl })))
          : [];
      const { chapter } = storyChapter(event.slug, event.reports!.map(report => report.source), battleOf(event.slug));
      const when = yearsOf(event.slug, STORY_WHEN[event.slug]);
      return {
        slug: event.slug,
        name: event.name,
        chapter,
        ...(when ? { when } : {}),
        ...(location && placeRefs.length ? { place: { value: location.value, refs: placeRefs } } : {}),
        tags: (event.tags ?? []).map(tag => STORY_TAGS[tag]),
        // The Prophet ﷺ first among a story's people (owner, 2026-11-21), the rest as the story names them.
        people: [...event.people].sort((a, b) => Number(b.person === PROPHET_AGENT) - Number(a.person === PROPHET_AGENT)).map(person => link(person.person)),
        reports: event.reports!.map(report => {
          // Drawn as a conversation only when every moment is split (owner, 2026-11-21: never half a drawing).
          const drawn = report.moments.every(moment => moment.turns?.length);
          return {
          ...(report.isnad ? { isnad: report.isnad } : {}),
          moments: report.moments.map(moment => ({ title: moment.title, text: moment.text, people: moment.people.map(link),
            ...(drawn ? { turns: moment.turns!.map(appTurn) } : {}) })),
          ...(report.grading ? { grading: report.grading } : {}),
          cite: reportCite(report.source),
          url: report.source.url,
          };
        }),
        ayat: (event.ayat ?? []).map(ayat => ({
          label: ayat.report ? `${AYAT_KIND[ayat.kind]} ${ayat.report}` : AYAT_KIND[ayat.kind],
          ...(ayat.about ? { about: link(ayat.about) } : {}),
          from: ayat.from,
          to: ayat.to,
          refs: ayat.evidence.map(refOf),
          ...(ayat.others?.length ? { others: ayat.others.map(other => ({ text: `${other.label}: «${other.evidence[0].quote}»`, refs: other.evidence.map(refOf) })) } : {}),
        })),
      };
    });
  // In al-Bukhari's order: each chapter where its first story stands in his book, then each story in it by its number.
  const at = new Map(catalog.events.filter(event => event.reports?.length).map(event => [event.slug, storyChapter(event.slug, event.reports!.map(report => report.source), battleOf(event.slug)).at]));
  const first = new Map<string, number>();
  for (const story of stories) first.set(story.chapter, Math.min(first.get(story.chapter) ?? Infinity, at.get(story.slug)!));
  const rank = (story: AppStory) => first.get(story.chapter)!;
  return stories
    .map((story, i) => ({ story, i }))
    .sort((a, b) => rank(a.story) - rank(b.story) || at.get(a.story.slug)! - at.get(b.story.slug)! || a.i - b.i)
    .map(({ story }) => story);
}
