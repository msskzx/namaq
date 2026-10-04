// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import { profilesFromModel, type Origin } from './profile';
import { locateSpanRecord } from './render';
import { revisionOf, unitLookup, type ReviewRecord } from './review';
import type { Inference } from './inference';
import type { WorkFolder } from './types';

export interface SpanRow {
  unit: string;
  spanId: string;
  witness: string;
  volume: number;
  page: string;
  layer: string;
  text: string;
}

export interface EntryRow {
  unit: string;
  assertionId: string;
  agent: string;
  predicate: string;
  parts: string[];
  text: string;
  parsed: number | null;
  classified: string | null;
  object: string | null;
  objectMention: string | null;
  origins: Origin[];
  spanIds: string[];
  statementIds: string[];
  status: string;
  identification: string;
  reviewed: boolean;
}

export function projectionRows(
  folders: WorkFolder[],
  root: string,
  reviews: ReviewRecord[] = [],
  inferences: Inference[] = [],
) {
  const lookup = unitLookup(folders);
  const reviewed = new Set<string>();
  for (const folder of folders) {
    for (const file of folder.units) {
      for (const assertion of file.assertions) {
        const revision = revisionOf(folder, file, assertion, root, inferences, lookup);
        if (reviews.some((r) => r.record === assertion.id && r.revision === revision)) {
          reviewed.add(`${file.unit.id}/${assertion.id}`);
        }
      }
    }
  }
  const spans: SpanRow[] = folders.flatMap((folder) =>
    folder.units.flatMap((file) =>
      file.spans.map((span) => ({
        unit: file.unit.id,
        spanId: span.id,
        witness: folder.witnesses.find((w) => w.edition === span.edition)!.slug,
        volume: span.volume,
        page: span.page,
        layer: span.layer,
        text: locateSpanRecord(folder, span, root).text,
      })),
    ),
  );
  const entries: EntryRow[] = [...profilesFromModel(folders, root)].flatMap(([agent, list]) =>
    list.map((e) => ({
      unit: e.unit,
      assertionId: e.assertionId,
      agent,
      predicate: e.predicate,
      parts: e.parts,
      text: e.text,
      parsed: e.parsed ?? null,
      classified: e.classified ?? null,
      object: e.object ?? null,
      objectMention: e.objectMention ?? null,
      origins: e.origins,
      spanIds: e.spanIds,
      statementIds: e.statementIds,
      status: e.status,
      identification: e.identification,
      reviewed: reviewed.has(`${e.unit}/${e.assertionId}`),
    })),
  );
  return { spans, entries };
}
