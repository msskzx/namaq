// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderSpanRecord } from './render';
import type { Assertion, UnitFile, WorkFolder } from './types';

export const reviewsRoot = 'data/reviews';

export interface ReviewRecord {
  record: string;
  revision: string;
  reviewer: string;
  qualification: string;
  date: string;
}

export function loadReviews(root: string): ReviewRecord[] {
  const dir = join(root, reviewsRoot);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .flatMap(
      (name) => (JSON.parse(readFileSync(join(dir, name), 'utf8')).reviews ?? []) as ReviewRecord[],
    );
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const sha = (text: string) => createHash('sha256').update(text).digest('hex');

export function closureOf(file: UnitFile, assertion: Assertion) {
  const statements = file.statements.filter((s) => assertion.restsOn.includes(s.id));
  const reports = file.reports.filter((r) => statements.some((s) => s.report === r.id));
  const spanIds = new Set<string>();
  const mentionIds = new Set<string>([assertion.subject]);
  const spans = (ids: (string | undefined)[]) => ids.forEach((id) => id && spanIds.add(id));
  const mentions = (ids: (string | undefined)[]) => ids.forEach((id) => id && mentionIds.add(id));

  if ('spans' in assertion.value) spans(assertion.value.spans);
  if ('object' in assertion.value) mentions([assertion.value.object]);
  for (const statement of statements) spans(statement.spans);
  for (const report of reports) {
    spans([report.voiceBasis, report.isnadSpan, ...(report.frame ?? [])]);
    if ('mention' in report.origin) mentions([report.origin.mention]);
    for (const turn of (report.scenes ?? []).flatMap((scene) => scene.turns)) {
      spans(turn.spans);
      mentions([turn.speaker, turn.addressee]);
    }
  }
  const mentionRecords = file.mentions.filter((m) => mentionIds.has(m.id));
  const identifications = file.identifications.filter(
    (i) => mentionIds.has(i.mention) && i.status !== 'REJECTED',
  );
  for (const mention of mentionRecords) spans([mention.parent]);
  for (const identification of identifications) spans(identification.basis.map((b) => b.span));
  return {
    assertion,
    statements,
    reports,
    spans: file.spans.filter((s) => spanIds.has(s.id)),
    mentions: mentionRecords,
    identifications,
  };
}

export function revisionOf(folder: WorkFolder, file: UnitFile, assertion: Assertion, root: string) {
  const closure = closureOf(file, assertion);
  const editions = new Set(closure.spans.map((span) => span.edition));
  const spans = closure.spans.map(({ exact, prefix, suffix, ...place }) => ({
    ...place,
    render: sha(renderSpanRecord(folder, { exact, prefix, suffix, ...place }, root)),
  }));
  return sha(
    stable({
      ...closure,
      spans,
      work: folder.work,
      unit: file.unit,
      editions: folder.editions.filter((e) => editions.has(e.slug)),
      witnesses: folder.witnesses.filter((w) => editions.has(w.edition)),
    }),
  );
}

const reviewedRevisions = (reviews: ReviewRecord[]) => {
  const byRecord = new Map<string, Set<string>>();
  for (const { record, revision } of reviews) {
    byRecord.set(record, (byRecord.get(record) ?? new Set()).add(revision));
  }
  return byRecord;
};

export function lapsedReviews(folders: WorkFolder[], reviews: ReviewRecord[], root: string) {
  const current = new Map<string, string>();
  for (const folder of folders) {
    for (const file of folder.units) {
      for (const assertion of file.assertions) {
        current.set(assertion.id, revisionOf(folder, file, assertion, root));
      }
    }
  }
  return reviews.filter((r) => current.get(r.record) !== r.revision);
}

export function selectForProd(folders: WorkFolder[], reviews: ReviewRecord[], root: string) {
  const reviewed = reviewedRevisions(reviews);
  return folders
    .map((folder) => ({
      ...folder,
      units: folder.units.flatMap((file) => {
        const kept = file.assertions.filter(
          (a) =>
            a.status !== 'LEGACY' &&
            a.status !== 'REJECTED' &&
            reviewed.get(a.id)?.has(revisionOf(folder, file, a, root)),
        );
        if (kept.length === 0) return [];
        const closures = kept.map((a) => closureOf(file, a));
        const ids = (pick: (c: (typeof closures)[number]) => { id: string }[]) =>
          new Set(closures.flatMap((c) => pick(c).map((r) => r.id)));
        const spans = ids((c) => c.spans);
        const mentions = ids((c) => c.mentions);
        const statements = ids((c) => c.statements);
        const reports = ids((c) => c.reports);
        const identifications = ids((c) => c.identifications);
        return [
          {
            unit: file.unit,
            spans: file.spans.filter((r) => spans.has(r.id)),
            reports: file.reports.filter((r) => reports.has(r.id)),
            statements: file.statements.filter((r) => statements.has(r.id)),
            mentions: file.mentions.filter((r) => mentions.has(r.id)),
            identifications: file.identifications.filter((r) => identifications.has(r.id)),
            assertions: kept,
          },
        ];
      }),
    }))
    .filter((folder) => folder.units.length > 0);
}
