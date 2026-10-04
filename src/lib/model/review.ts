// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Inference } from './inference';
import { standingAgent } from './referents';
import { splitRef } from './refs';
import { renderSpanRecord } from './render';
import type { Assertion, Chain, SharhLink, SpanRecord, UnitFile, WorkFolder } from './types';

export type UnitLookup = (unit: string) => { folder: WorkFolder; file: UnitFile } | undefined;

export function unitLookup(folders: WorkFolder[]): UnitLookup {
  const units = new Map(
    folders.flatMap((folder) =>
      folder.units.map((file) => [file.unit.id, { folder, file }] as const),
    ),
  );
  return (id) => units.get(id);
}

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

function chainParts(chain: Chain): { spans: string[]; mentions: string[] } {
  const own = chain.elements.map((element) =>
    'kind' in element
      ? { spans: element.marker ?? [], mentions: [] }
      : { spans: element.mode, mentions: [element.narrator] },
  );
  const inner = (chain.branches ?? []).map(chainParts);
  return {
    spans: [
      ...(chain.tahwil ?? []),
      ...own.flatMap((o) => o.spans),
      ...inner.flatMap((i) => i.spans),
    ],
    mentions: [...own.flatMap((o) => o.mentions), ...inner.flatMap((i) => i.mentions)],
  };
}

export function closureOf(
  file: UnitFile,
  assertion: Assertion,
  inferences: Inference[] = [],
  lookup?: UnitLookup,
) {
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
    if (report.chain) {
      const parts = chainParts(report.chain);
      spans(parts.spans);
      mentions(parts.mentions);
    }
    for (const turn of (report.scenes ?? []).flatMap((scene) => scene.turns)) {
      spans(turn.spans);
      mentions([turn.speaker, turn.addressee]);
    }
  }
  const turnIds = new Set(
    reports.flatMap((r) => (r.scenes ?? []).flatMap((scene) => scene.turns.map((t) => t.id))),
  );
  const approved = inferences.filter(
    (i) =>
      i.status === 'APPROVED' &&
      i.unit === file.unit.id &&
      i.value.kind === 'TURN_SPEAKER' &&
      turnIds.has(i.value.turn),
  );
  for (const inference of approved) {
    spans(inference.passage);
    spans(inference.premises.map((p) => ('span' in p ? p.span : undefined)));
    if (inference.value.kind === 'TURN_SPEAKER') mentions([inference.value.speaker]);
  }
  const mentionRecords = file.mentions.filter((m) => mentionIds.has(m.id));
  const identifications = file.identifications.filter(
    (i) => mentionIds.has(i.mention) && i.status !== 'REJECTED',
  );
  for (const mention of mentionRecords) spans([mention.parent]);
  for (const identification of identifications) {
    spans(
      identification.basis.map((b) => b.span).filter((ref) => splitRef(ref).unit === undefined),
    );
  }
  const foreign: { unit: string; span: SpanRecord; links: SharhLink[]; linkSpans: SpanRecord[] }[] =
    [];
  for (const identification of identifications) {
    for (const { span: ref } of identification.basis) {
      const { unit, span } = splitRef(ref);
      const target = unit === undefined ? undefined : lookup?.(unit);
      const found = target?.file.spans.find((s) => s.id === span);
      if (unit !== undefined && target && found) {
        const links = (target.file.sharhLinks ?? []).filter((l) => l.explains === file.unit.id);
        const linkSpans = target.file.spans.filter((s) =>
          links.some((l) => l.basis.includes(s.id)),
        );
        foreign.push({ unit, span: found, links, linkSpans });
      }
    }
  }
  const standing = Object.fromEntries(
    mentionRecords
      .filter((m) => !file.identifications.some((i) => i.mention === m.id))
      .flatMap((m) => {
        const agent = standingAgent(m.exact);
        return agent ? [[m.id, agent]] : [];
      }),
  );
  return {
    foreign,
    standing,
    inferences: approved,
    assertion,
    statements,
    reports,
    spans: file.spans.filter((s) => spanIds.has(s.id)),
    mentions: mentionRecords,
    identifications,
  };
}

export function revisionOf(
  folder: WorkFolder,
  file: UnitFile,
  assertion: Assertion,
  root: string,
  inferences: Inference[] = [],
  lookup?: UnitLookup,
) {
  const closure = closureOf(file, assertion, inferences, lookup);
  const editions = new Set(closure.spans.map((span) => span.edition));
  const spans = closure.spans.map(({ exact, prefix, suffix, ...place }) => ({
    ...place,
    render: sha(renderSpanRecord(folder, { exact, prefix, suffix, ...place }, root)),
  }));
  const foreign = closure.foreign.map(({ unit, span, links, linkSpans }) => {
    const place = {
      id: span.id,
      edition: span.edition,
      volume: span.volume,
      page: span.page,
      layer: span.layer,
    };
    const target = lookup?.(unit);
    return {
      unit,
      links,
      linkRenders: linkSpans.map((s) =>
        target ? sha(renderSpanRecord(target.folder, s, root)) : undefined,
      ),
      span: place,
      render: target ? sha(renderSpanRecord(target.folder, span, root)) : undefined,
      work: target?.folder.work,
    };
  });
  return sha(
    stable({
      ...closure,
      foreign,
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

export function lapsedReviews(
  folders: WorkFolder[],
  reviews: ReviewRecord[],
  root: string,
  inferences: Inference[] = [],
) {
  const current = new Map<string, string>();
  const lookup = unitLookup(folders);
  for (const folder of folders) {
    for (const file of folder.units) {
      for (const assertion of file.assertions) {
        current.set(assertion.id, revisionOf(folder, file, assertion, root, inferences, lookup));
      }
    }
  }
  return reviews.filter((r) => current.get(r.record) !== r.revision);
}

export function selectForProd(
  folders: WorkFolder[],
  reviews: ReviewRecord[],
  root: string,
  inferences: Inference[] = [],
) {
  const reviewed = reviewedRevisions(reviews);
  const lookup = unitLookup(folders);
  const extra = new Map<string, Map<string, UnitFile>>();
  const out: WorkFolder[] = folders
    .map((folder) => ({
      ...folder,
      units: folder.units.flatMap((file) => {
        const kept = file.assertions.filter(
          (a) =>
            a.status !== 'LEGACY' &&
            a.status !== 'REJECTED' &&
            reviewed.get(a.id)?.has(revisionOf(folder, file, a, root, inferences, lookup)),
        );
        if (kept.length === 0) return [];
        const closures = kept.map((a) => closureOf(file, a, inferences, lookup));
        for (const { unit, span, links, linkSpans } of closures.flatMap((c) => c.foreign)) {
          const target = lookup(unit)!;
          const slices = extra.get(target.folder.work.slug) ?? new Map<string, UnitFile>();
          const slice = slices.get(unit) ?? {
            unit: target.file.unit,
            spans: [],
            reports: [],
            statements: [],
            mentions: [],
            identifications: [],
            assertions: [],
            sharhLinks: [],
          };
          for (const kept of [span, ...linkSpans]) {
            if (!slice.spans.some((s) => s.id === kept.id)) slice.spans.push(kept);
          }
          for (const link of links) {
            if (!slice.sharhLinks!.some((l) => l.id === link.id)) slice.sharhLinks!.push(link);
          }
          slices.set(unit, slice);
          extra.set(target.folder.work.slug, slices);
        }
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
  for (const [slug, slices] of extra) {
    const home = out.find((f) => f.work.slug === slug);
    const original = folders.find((f) => f.work.slug === slug)!;
    const folder = home ?? { ...original, units: [] };
    for (const [id, slice] of slices) {
      const present = folder.units.find((u) => u.unit.id === id);
      if (present) {
        for (const span of slice.spans)
          if (!present.spans.some((s) => s.id === span.id)) present.spans.push(span);
        present.sharhLinks = [...(present.sharhLinks ?? []), ...(slice.sharhLinks ?? [])];
      } else {
        folder.units.push(slice);
      }
    }
    if (!home) out.push(folder);
  }
  return out;
}
