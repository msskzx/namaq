// Rules: docs/plans/tashkeel-and-literal-wording-audit.md; terms: CONTEXT.md (Seam, Quoted value, Known name).

import type { CitationRecord } from '@/lib/history/batchSchema';
import { pageAnchors } from '@/lib/history/sourceStore';
import { matchQuotedValue } from './quotedValue';
import { legacyUnreviewed, type Catalog, type Cited } from './types';

/** Shamela serves these two vowelled and the sira volumes without; see the plan's scope. */
const IN_SCOPE_VOLUMES = [4, 5];

const PERSON_TEXT_FIELDS = [
  'fullName',
  'kunya',
  'tribalAffiliation',
  'appearance',
  'placeOfBirthArabic',
  'placeOfDeathArabic',
] as const;

const UTTERANCE_TEXT_FIELDS = ['speakerName', 'grading', 'occasion'] as const;

const ANCHOR = /^(\d+)\/(\d+)-p\d+$/;

export interface QuotedValue {
  readonly subject: string;
  readonly path: string;
  readonly value: string;
  readonly claims: readonly string[];
  readonly kind: 'value' | 'name';
}

export type LoadPage = (sourceSlug: string, volume: number, printedPage: string) => string | null;

export type ReportStatus = 'pass' | 'fail' | 'out-of-scope' | 'no-evidence' | 'unresolved';

export interface ReportRow {
  readonly subject: string;
  readonly path: string;
  readonly kind: 'value' | 'name';
  readonly status: ReportStatus;
  readonly detail?: string;
}

export interface PassageGroups {
  readonly volumes: number[];
  readonly groups: string[][];
  readonly unresolved: string[];
}

/** Every text value the plan holds to the quoted-value rule; nothing structured or authored. */
export function collectQuotedValues(catalog: Catalog): QuotedValue[] {
  const values: QuotedValue[] = [];
  const add = (subject: string, path: string, cited: Cited<string> | undefined, kind: QuotedValue['kind'] = 'value') => {
    if (!cited || cited.claims === legacyUnreviewed) return;
    values.push({ subject, path, value: cited.value, claims: cited.claims, kind });
  };

  catalog.people.forEach((person) => {
    const at = `people/${person.slug}`;
    PERSON_TEXT_FIELDS.forEach((field) => add(at, `${at}.${field}`, person.fields[field]));
    (person.virtues ?? []).forEach((virtue, index) => add(at, `${at}.virtues[${index}]`, virtue));
    add(at, `${at}.name`, person.fields.fullName, 'name');
  });

  catalog.battles.forEach((battle) => {
    const at = `battles/${battle.slug}`;
    add(at, `${at}.location`, battle.fields?.location);
    battle.participants.forEach((entry) => add(at, `${at}.${entry.person}.summary`, entry.summary));
  });

  catalog.events.forEach((event) => {
    const at = `events/${event.slug}`;
    add(at, `${at}.location`, event.fields.location);
    add(at, `${at}.description`, event.fields.description);
  });

  catalog.utterances.forEach((utterance) => {
    const at = `utterances/${utterance.slug}`;
    add(at, `${at}.textArabic`, utterance.textArabic);
    UTTERANCE_TEXT_FIELDS.forEach((field) => add(at, `${at}.${field}`, utterance.fields[field]));
  });

  return values;
}

/**
 * One group per cited passage: the paragraphs of its page, plus the opening
 * paragraph of the next, so a name that runs over a page break matches whole.
 * The next paragraph is what the plan calls a seam.
 */
export function passageGroups(
  claims: readonly string[],
  citationsByClaim: ReadonlyMap<string, readonly CitationRecord[]>,
  loadPage: LoadPage,
): PassageGroups {
  const volumes = new Set<number>();
  const groups: string[][] = [];
  const unresolved: string[] = [];
  const seen = new Set<string>();
  const paragraphs = (sourceSlug: string, volume: number, printedPage: string) => {
    const body = loadPage(sourceSlug, volume, printedPage);
    return body === null ? [] : [...pageAnchors(volume, printedPage, body).values()];
  };

  claims.forEach((key) => {
    (citationsByClaim.get(key) ?? []).forEach((citation) => {
      const anchor = citation.passageAnchor ?? '';
      const parsed = ANCHOR.exec(anchor);
      if (!parsed) {
        unresolved.push(`unresolved «${citation.passageAnchor ?? key}»`);
        return;
      }
      const volume = Number(parsed[1]);
      const printed = parsed[2];
      volumes.add(volume);
      if (seen.has(anchor)) return;
      seen.add(anchor);
      const page = paragraphs(citation.sourceSlug, volume, printed);
      if (page.length === 0) {
        unresolved.push(`unresolved «${anchor}»`);
        return;
      }
      const next = String(Number(printed) + 1);
      groups.push([...page, ...paragraphs(citation.sourceSlug, volume, next).slice(0, 1)]);
    });
  });

  return { volumes: [...volumes].sort((a, b) => a - b), groups, unresolved };
}

export function checkQuotedValues(
  values: readonly QuotedValue[],
  citationsByClaim: ReadonlyMap<string, readonly CitationRecord[]>,
  loadPage: LoadPage,
): ReportRow[] {
  return values.map((value) => {
    const row = (status: ReportStatus, detail?: string): ReportRow => ({
      subject: value.subject,
      path: value.path,
      kind: value.kind,
      status,
      ...(detail === undefined ? {} : { detail }),
    });
    const claims = value.claims.flatMap((key) => citationsByClaim.get(key) ?? []);
    if (claims.length === 0) return row('no-evidence');

    const { volumes, groups, unresolved } = passageGroups(value.claims, citationsByClaim, loadPage);
    if (volumes.some((volume) => !IN_SCOPE_VOLUMES.includes(volume))) return row('out-of-scope');
    if (unresolved.length > 0) return row('unresolved', unresolved.join(', '));

    const match = matchQuotedValue(value.value, groups);
    if (match.ok) return row('pass');
    return row('fail', `matched «${match.matched}» | next «${match.next}» (${match.reason})`);
  });
}
