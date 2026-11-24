// The phone app's battles (owner, 2026-11-18): the app is offline, so scripts/battles/buildAppBattles.ts writes them to
// shared/data/battles/battles.json and the app only draws them.
import { readdirSync, readFileSync } from 'node:fs';
import type { AppBattle, AppCite, AppCited, AppMomentBattle, AppPersonLink, AppReading } from '@shared/battles/battle';
import { KIND_NAMES } from '@shared/battles/battle';
import { BATTLE_PLACE, PLACES } from '@shared/battles/places';
import type { Catalog, Cited } from './types';
import { legacyUnreviewed } from './types';

type Citation = { volume?: string; pageReference?: string; excerptArabic?: string; extractionUrl?: string; sourceSlug?: string; passageAnchor?: string;
  /** The edition's volume, from the account the batch read (batchClaims): see citationVolume. */
  editionVolume?: number };
type Account = { sourceSlug?: string; volumeNumber?: number; pages: { printedPage?: string; volumeNumber?: number }[] };
export type Claim = { key: string; assertion?: string; disputed?: boolean; citations?: Citation[] };

const BOOKS: Record<string, string> = { 'siyar-alam-al-nubala-risalah': 'سير أعلام النبلاء' };
const SIRA_VOLUME = /^السيرة (\d)$/;
/** A claim's rival readings: the claims a batch records beside it as `<key>-alt…` or `<key>-other…` (the quiz generator shares it). */
export const RIVAL = (key: string) => new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(alt|other)(-|$)`);
const digits = (text: string) => text.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

/**
 * The edition's own volume a Siyar quote is on (1-2 the Sira, 3 the caliphs, 4 on the Siyar's parts). The `volume` a
 * batch wrote is sometimes Shamela's part label, which skips the first three volumes («1» for volume 4: AGENTS.md,
 * Content sources), and sometimes the edition's («5»); the account the batch read says which volume it is (its page's
 * `volumeNumber` where the entry crosses a binding). Only «السيرة N» names its volume outright, since the Sira account
 * runs over both Sira volumes.
 */
export function citationVolume(citation: Citation): number | undefined {
  const sira = SIRA_VOLUME.exec(citation.volume ?? '');
  return sira ? Number(sira[1]) : citation.editionVolume;
}

/** The account's volume for a page it cites: the page's own where the entry crosses a binding, else the account's. */
function editionVolume(citation: Citation, accounts: Account[]): number | undefined {
  const account = accounts.find(each => each.sourceSlug === citation.sourceSlug);
  const first = /\d+/.exec(citation.pageReference ?? '')?.[0];
  return account?.pages.find(page => page.printedPage === first)?.volumeNumber ?? account?.volumeNumber;
}

/** «سير أعلام النبلاء، السيرة ١، ص ٣٢٥», «سير أعلام النبلاء، ج ٢، ص ٨٢» (volume 5 of the edition, the Siyar's second part) */
export function citeOf(citation: Citation): string {
  const book = BOOKS[citation.sourceSlug ?? ''] ?? citation.sourceSlug ?? '';
  const edition = citation.sourceSlug === 'siyar-alam-al-nubala-risalah' ? citationVolume(citation) : undefined;
  const volume = edition !== undefined
    ? (edition <= 2 ? `السيرة ${edition}` : edition === 3 ? 'سيرة الخلفاء الراشدين' : `ج ${edition - 3}`)
    : citation.volume ? (SIRA_VOLUME.test(citation.volume) ? citation.volume : `ج ${citation.volume}`) : '';
  return digits([book, volume, citation.pageReference ? `ص ${citation.pageReference}` : ''].filter(Boolean).join('، '));
}

export function batchClaims(root = 'data/history/batches'): Map<string, Claim> {
  return new Map(readdirSync(root).flatMap(dir => {
    const { accounts = [], claims } = JSON.parse(readFileSync(`${root}/${dir}/batch.json`, 'utf8')) as { accounts?: Account[]; claims: Claim[] };
    return claims.map(claim => [claim.key, { ...claim, ...(claim.citations && { citations: claim.citations.map(cite => ({ ...cite, editionVolume: editionVolume(cite, accounts) })) }) }] as const);
  }));
}

/**
 * A value shows only with the quotes it stands on (owner, 2026-11-18: everything gets its reference); one whose evidence
 * is still owed waits until it is cited. Its rival readings are the claims a batch records beside it as `<key>-alt…` or
 * `<key>-other…`. Shared by the battles, the stories and a person's life (appLife.ts).
 */
export function citing(claims: Map<string, Claim>) {
  const refs = (keys: Cited<unknown>['claims']): AppCite[] =>
    keys === legacyUnreviewed
      ? []
      : keys.flatMap(key => (claims.get(key)?.citations ?? []).filter(c => c.excerptArabic).map(c => ({ text: c.excerptArabic!, cite: citeOf(c), url: c.extractionUrl })));
  const rivals = (keys: Cited<unknown>['claims']): AppReading[] =>
    keys === legacyUnreviewed
      ? []
      : keys.flatMap(key => [...claims.values()].filter(other => RIVAL(key).test(other.key)))
          .map(other => ({ text: other.assertion ?? '', refs: refs([other.key]) }))
          .filter(reading => reading.text && reading.refs.length);
  const cited = <T, U = T>(value: Cited<T> | undefined, as: (v: T) => U = v => v as unknown as U): AppCited<U> | undefined => {
    const quotes = value ? refs(value.claims) : [];
    if (!value || !quotes.length) return undefined;
    const others = rivals(value.claims);
    return { value: as(value.value), refs: quotes, ...(others.length ? { others } : {}) };
  };
  return { refs, cited };
}

export function appBattles(catalog: Catalog, claims = batchClaims()): AppBattle[] {
  const people = new Map(catalog.people.map(person => [person.slug, person.name]));
  const link = (slug: string): AppPersonLink => ({ slug, name: people.get(slug) ?? slug });
  const { cited, refs } = citing(claims);
  return catalog.battles
    .map(battle => {
      const fields = battle.fields ?? {};
      const place = BATTLE_PLACE[battle.slug];
      const muslims = battle.participants.filter(p => p.isMuslim && (p.relation ?? 'PARTICIPATED_IN') === 'PARTICIPATED_IN');
      return {
        slug: battle.slug,
        name: battle.name,
        order: fields.hijriYear?.value ?? 99,
        // غزوة, سرية or معركة is our grouping of the catalog's rows, so it shows with or without a quote.
        kind: fields.engagement && { value: KIND_NAMES[fields.engagement.value], refs: refs(fields.engagement.claims) },
        year: cited(fields.hijriYear),
        location: cited(fields.location),
        place: place ? { name: PLACES[place].name, at: PLACES[place].at, refs: PLACES[place].refs } : undefined,
        counts: {
          muslims: cited(fields.muslimForceCount),
          others: cited(fields.nonMuslimForceCount),
          muslimsKilled: cited(fields.muslimDeathCount),
          othersKilled: cited(fields.nonMuslimDeathCount),
        },
        moments: (battle.moments ?? []).map(moment => ({
          title: moment.title,
          ...(moment.isnad ? { isnad: moment.isnad } : {}),
          quote: moment.quote,
          grading: moment.grading,
          cite: citeOf({ sourceSlug: moment.source.slug, volume: moment.source.volumeLabel, pageReference: moment.source.endPage ? `${moment.source.page}–${moment.source.endPage}` : String(moment.source.page) }),
          url: moment.source.url,
          people: moment.people.map(link),
        })),
        martyrs: muslims.filter(p => p.status?.includes('MARTYRED')).map(p => link(p.person)),
        present: muslims.filter(p => !p.status?.includes('MARTYRED')).map(p => link(p.person)),
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ar'))
    .map(({ order: _order, ...battle }) => battle); // eslint-disable-line @typescript-eslint/no-unused-vars -- only for the order
}

/** What the home feed's moment card needs, so home does not load every battle (shared/data/battles/moments.json). */
export const appMoments = (battles: readonly AppBattle[]): AppMomentBattle[] =>
  battles.filter(battle => battle.moments.length).map(({ slug, name, kind, year, moments }) => ({ slug, name, kind, year, moments }));

