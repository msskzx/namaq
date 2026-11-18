// The phone app's sira stories (owner, 2026-11-18): events the catalog tells whole in reports. The app is offline, so
// scripts/battles/buildAppBattles.ts writes them to shared/data/events/stories.json.
import type { AppStory } from '@shared/stories/story';
import { surahName } from '@shared/quran/surahNames';
import { quranpediaPage } from '@shared/readerBooks';
import { batchClaims, citeOf } from './appBattles';
import type { Catalog, CatalogStoryAyat, CatalogStoryEvidence } from './types';
import { legacyUnreviewed, STORY_TAGS } from './types';

const digits = (text: string) => text.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
const SIRA = 'siyar-alam-al-nubala-risalah';

/** «فصلت ١–١٣» */
export function ayatLabel(from: string, to: string): string {
  const [surah, first] = from.split(':');
  const last = to.split(':')[1];
  return digits(`${surahName(Number(surah))} ${first === last ? first : `${first}–${last}`}`);
}

const refOf = (evidence: CatalogStoryEvidence) =>
  evidence.source === SIRA
    ? { text: evidence.quote, cite: citeOf({ sourceSlug: SIRA, volume: evidence.volumeLabel, pageReference: String(evidence.page) }), url: evidence.url }
    : { text: evidence.quote, cite: digits(`تفسير السعدي، ص ${evidence.page}`), url: quranpediaPage('sadi', 1, evidence.page) };

const AYAT_KIND: Record<CatalogStoryAyat['kind'], string> = { RECITED: 'ما قرأه', REVEALED_ABOUT: 'نزل فيه' };

export function appStories(catalog: Catalog, claims = batchClaims()): AppStory[] {
  const names = new Map(catalog.people.map(person => [person.slug, person.name]));
  const link = (slug: string) => ({ slug, name: names.get(slug) ?? slug });
  return catalog.events
    .filter(event => event.reports?.length)
    // In the order the source tells them.
    .sort((a, b) => a.reports![0].source.volume - b.reports![0].source.volume || a.reports![0].source.page - b.reports![0].source.page)
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
        people: event.people.map(person => link(person.person)),
        reports: event.reports!.map(report => {
          const pages = report.source.endPage ? `${report.source.page}–${report.source.endPage}` : String(report.source.page);
          return {
            ...(report.isnad ? { isnad: report.isnad } : {}),
            moments: report.moments.map(moment => ({ title: moment.title, text: moment.text, people: moment.people.map(link) })),
            ...(report.grading ? { grading: report.grading } : {}),
            cite: citeOf({ sourceSlug: report.source.slug, volume: report.source.volumeLabel, pageReference: pages }),
            url: report.source.url,
          };
        }),
        ayat: (event.ayat ?? []).map(ayat => ({
          label: ayat.report ? `${AYAT_KIND[ayat.kind]} ${ayat.report}` : AYAT_KIND[ayat.kind],
          from: ayat.from,
          to: ayat.to,
          refs: ayat.evidence.map(refOf),
          ...(ayat.others?.length ? { others: ayat.others.map(other => ({ text: `${other.label}: «${other.evidence[0].quote}»`, refs: other.evidence.map(refOf) })) } : {}),
        })),
      };
    });
}
