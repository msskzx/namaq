// Every link the catalog holds, both ways, for the phone app (shared/links.ts). scripts/battles/buildAppBattles.ts writes
// it to shared/data/links.json with the other files built from the catalog.
import { HADITH_BOOKS, ID_KINDS, kindOf, LINK_TYPES, type Link, type LinkIndex } from '@shared/links';
import { MUSHAF } from '@shared/data/quran/mushaf';
import { ayahWordsOf } from '@shared/quran/quranText/ayahWords';
import { RECIPROCAL_INVERSES } from '@/lib/relationship/categories';
import { inverseOf, sexesOf } from './relations';
import { UNPROFILED_PEOPLE } from './unprofiled';
import { isHadithSource, legacyUnreviewed, type Catalog, type CatalogReportSource, type CatalogStoryEvidence, type Provenance } from './types';

/** A link as written on one record: from that record to another, with what says so. */
interface Written {
  readonly from: string;
  readonly t: string;
  readonly to: string;
  /** The type the other end reads; the same type unless both ends are people. */
  readonly back: string;
  readonly src: readonly string[];
  /** The record it is written on, when that is not `from` (a story naming the person an ayah came down about). */
  readonly at?: string;
}

export interface LinkProblem {
  readonly at: string;
  readonly message: string;
}

/** Relatives with no record of their own stay a plain name on the page that names them: the links leave them out. */
const UNPROFILED: ReadonlySet<string> = new Set([...UNPROFILED_PEOPLE].map(slug => `person:${slug}`));

/** Every ayah id in mushaf order, read from the Madina pages (the one Quran text). */
const AYAH_IDS = Object.keys(ayahWordsOf(MUSHAF)).map(key => `ayah:${key}`);
const AYAH_AT = new Map(AYAH_IDS.map((id, index) => [id, index]));

/** The ayat from one surah:ayah to another, both included, across a surah's end when the range runs on. */
function ayahRange(from: string, to: string): string[] | undefined {
  const first = AYAH_AT.get(`ayah:${from}`);
  const last = AYAH_AT.get(`ayah:${to}`);
  return first === undefined || last === undefined || last < first ? undefined : AYAH_IDS.slice(first, last + 1);
}

/** ayah:2:255 before ayah:12:1, as the mushaf orders them. */
const natural = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true });

const claimsSrc = (claims: Provenance) => (claims === legacyUnreviewed ? [legacyUnreviewed] : claims.map(key => `claim:${key}`));

const hadithId = (book: string, number: number) => `hadith:${HADITH_BOOKS[book] ?? book}:${number}`;

const reportSrc = (source: CatalogReportSource) =>
  isHadithSource(source) ? hadithId(source.slug, source.hadith) : `${source.slug}:${source.volume}:${source.page}`;

const evidenceSrc = (evidence: CatalogStoryEvidence) =>
  'hadith' in evidence
    ? hadithId(evidence.source, evidence.hadith)
    : [evidence.source, ...(evidence.volume === undefined ? [] : [evidence.volume]), evidence.page].join(':');

/**
 * What each record says, as written on it. Left out on purpose: a stated order of two events (CatalogOrdering), which
 * dates them rather than relating them, and a virtue's speaker, whom no record names by slug yet.
 */
function writtenLinks(catalog: Catalog, problems: LinkProblem[]): Written[] {
  const links: Written[] = [];
  const cross = (from: string, t: string, to: string, src: readonly string[], at?: string) => links.push({ from, t, to, back: t, src, at });
  const sexOf = sexesOf(catalog);

  for (const person of catalog.people) {
    const id = `person:${person.slug}`;
    for (const relation of person.relations) {
      const back = inverseOf(relation, sexOf) ?? '';
      links.push({ from: id, t: relation.type, to: `person:${relation.to}`, back, src: claimsSrc(relation.claims) });
    }
    for (const ayah of person.ayat ?? []) {
      const key = `ayah:${ayah.surah}:${ayah.ayah}`;
      cross(id, ayah.kind, key, claimsSrc(ayah.claims));
      // The others the source names with him (revealedAbout.with) are tied to the ayah on his record.
      for (const other of ayah.revealedAbout?.with ?? []) cross(`person:${other}`, ayah.kind, key, claimsSrc(ayah.claims), id);
    }
  }

  for (const battle of catalog.battles) {
    const id = `battle:${battle.slug}`;
    for (const participant of battle.participants)
      cross(id, participant.relation ?? 'PARTICIPATED_IN', `person:${participant.person}`, claimsSrc(participant.claims));
    for (const moment of battle.moments ?? [])
      for (const person of moment.people) cross(id, 'IN_MOMENT', `person:${person}`, [`${moment.source.slug}:${moment.source.volume}:${moment.source.page}`]);
  }

  for (const event of catalog.events) {
    const id = `event:${event.slug}`;
    const reports = event.reports ?? [];
    for (const report of reports) if (isHadithSource(report.source)) cross(id, 'TOLD_IN', reportSrc(report.source), [reportSrc(report.source)]);
    // A story's person stands on a claim, or on the reports whose moments name them (validateCatalog's rule).
    for (const { person, claims } of event.people) if (claims) cross(id, 'IN_EVENT', `person:${person}`, claimsSrc(claims));
    for (const report of reports)
      for (const moment of report.moments) {
        for (const person of moment.people) cross(id, 'IN_EVENT', `person:${person}`, [reportSrc(report.source)]);
        for (const turn of moment.turns ?? [])
          if (turn.speaker?.person) cross(id, 'SPEAKS_IN', `person:${turn.speaker.person}`, [reportSrc(report.source)]);
      }
    for (const ayat of event.ayat ?? []) {
      const src = ayat.evidence.map(evidenceSrc);
      const range = ayahRange(ayat.from, ayat.to);
      if (!range) problems.push({ at: id, message: `ayat ${ayat.from} to ${ayat.to} is no range of the mushaf` });
      for (const ayah of range ?? []) {
        cross(id, ayat.kind, ayah, src);
        if (ayat.about) cross(`person:${ayat.about}`, ayat.kind, ayah, src, id);
      }
    }
  }

  for (const utterance of catalog.utterances) {
    const id = `utterance:${utterance.slug}`;
    const src = claimsSrc(utterance.textArabic.claims);
    if (utterance.speaker) cross(id, 'SAID', `person:${utterance.speaker}`, src);
    if (utterance.subject) cross(id, 'ABOUT', `person:${utterance.subject}`, src);
    if (utterance.event) cross(id, 'SAID_AT', `event:${utterance.event}`, src);
    if (utterance.battle) cross(id, 'SAID_AT', `battle:${utterance.battle}`, src);
  }

  return links;
}

/** What the build refuses: an end that names nothing, a type nobody defined, a link with no source. */
function problemsOf(links: readonly Written[], catalog: Catalog, unprofiled: ReadonlySet<string>): LinkProblem[] {
  const known = new Set([
    ...catalog.people.map(person => `person:${person.slug}`),
    ...catalog.battles.map(battle => `battle:${battle.slug}`),
    ...catalog.events.map(event => `event:${event.slug}`),
    ...catalog.utterances.map(utterance => `utterance:${utterance.slug}`),
    ...AYAH_IDS,
  ]);
  const books = new Set(Object.values(HADITH_BOOKS));
  const exists = (id: string) => {
    const [, book, number] = id.split(':');
    return kindOf(id) === 'hadith' ? books.has(book) && /^[1-9]\d*$/.test(number ?? '') : known.has(id);
  };
  const personTypes = new Set(Object.keys(RECIPROCAL_INVERSES));
  const problems: LinkProblem[] = [];
  for (const id of unprofiled) if (known.has(id)) problems.push({ at: id, message: 'has a record now: take it off UNPROFILED_PEOPLE' });
  for (const link of links) {
    if (unprofiled.has(link.from) || unprofiled.has(link.to)) continue;
    const at = `${link.from} ${link.t} ${link.to}`;
    for (const end of [link.from, link.to]) {
      if (!(ID_KINDS as readonly string[]).includes(kindOf(end))) problems.push({ at, message: `${end} has no known kind` });
      else if (!exists(end)) problems.push({ at, message: `${end} names no record` });
    }
    const people = kindOf(link.from) === 'person' && kindOf(link.to) === 'person';
    if (people ? !personTypes.has(link.t) : !(link.t in LINK_TYPES)) problems.push({ at, message: `${link.t} is not a link type` });
    if (people && !link.back) problems.push({ at, message: 'no inverse: name it, or record the other person\'s sex' });
    if (link.src.length === 0) problems.push({ at, message: 'no source' });
  }
  return problems;
}

/**
 * Every record's links both ways, sorted so each build writes the same file. The same link written twice (two records,
 * or two reports of one story) is kept once with every source behind it.
 */
export function appLinks(catalog: Catalog, unprofiled: ReadonlySet<string> = UNPROFILED): { links: LinkIndex; problems: LinkProblem[] } {
  const problems: LinkProblem[] = [];
  const all = writtenLinks(catalog, problems);
  problems.push(...problemsOf(all, catalog, unprofiled));
  const written = all.filter(link => !unprofiled.has(link.from) && !unprofiled.has(link.to));
  const byEnd = new Map<string, Map<string, { t: string; to: string; src: Set<string>; at: Set<string> }>>();
  const add = (end: string, t: string, to: string, src: readonly string[], at: string) => {
    const links = byEnd.get(end) ?? byEnd.set(end, new Map()).get(end)!;
    const key = `${t} ${to}`;
    const link = links.get(key) ?? links.set(key, { t, to, src: new Set(), at: new Set() }).get(key)!;
    src.forEach(each => link.src.add(each));
    link.at.add(at);
  };
  for (const link of written) {
    add(link.from, link.t, link.to, link.src, link.at ?? link.from);
    if (link.back) add(link.to, link.back, link.from, link.src, link.at ?? link.from);
  }
  const links: Record<string, Link[]> = {};
  for (const end of [...byEnd.keys()].sort(natural)) {
    links[end] = [...byEnd.get(end)!.values()]
      .map(link => ({ t: link.t, to: link.to, src: [...link.src].sort(), at: [...link.at].sort() }))
      .sort((a, b) => a.t.localeCompare(b.t) || natural(a.to, b.to));
  }
  return { links, problems };
}

/** One record a line, so a diff of the file shows which records' links changed. */
export const linksFile = (links: LinkIndex) =>
  `{\n${Object.entries(links)
    .map(([id, each]) => `${JSON.stringify(id)}: ${JSON.stringify(each)}`)
    .join(',\n')}\n}\n`;
