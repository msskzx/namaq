// The phone app's sira stories (owner, 2026-11-18): events the catalog tells whole in reports. The app is offline, so
// scripts/battles/buildAppBattles.ts writes them to shared/data/events/stories.json.
import type { AppStory, AppTurn } from '@shared/stories/story';
import { quranpediaPage } from '@shared/readerBooks';
import { PROPHET_AGENT } from '@shared/hadith';
import { batchClaims, citeOf } from './appBattles';
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
const WITNESS_BOOKS: Record<string, string> = { 'kawkab-wahhaj': 'الكوكب الوهاج للهرري' };

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

export function appStories(catalog: Catalog, claims = batchClaims()): AppStory[] {
  const names = new Map(catalog.people.map(person => [person.slug, person.name]));
  const link = (slug: string) => ({ slug, name: names.get(slug) ?? slug });
  return catalog.events
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
      return {
        slug: event.slug,
        name: event.name,
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
}
