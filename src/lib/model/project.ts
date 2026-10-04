// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import type { Inference } from './inference';
import { profilesFromModel, type Origin, type ProfileEntry } from './profile';
import { locateSpanRecord } from './render';
import { revisionOf, unitLookup, type ReviewRecord } from './review';
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

function witnessOf(folder: WorkFolder, edition: string) {
  const witness = folder.witnesses.find((w) => w.edition === edition);
  if (!witness) throw new Error(`${folder.work.slug}: edition ${edition} has no witness`);
  return witness.slug;
}

function toRow(e: ProfileEntry, agent: string, reviewed: Set<string>): EntryRow {
  return {
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
  };
}

export function projectionRows(
  folders: WorkFolder[],
  root: string,
  reviews: ReviewRecord[] = [],
  inferences: Inference[] = [],
  source: WorkFolder[] = folders,
) {
  const lookup = unitLookup(source);
  const reviewed = new Set<string>();
  for (const folder of folders) {
    for (const file of folder.units) {
      const home = lookup(file.unit.id);
      for (const assertion of file.assertions) {
        const revision =
          home && revisionOf(home.folder, home.file, assertion, root, inferences, lookup);
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
        witness: witnessOf(folder, span.edition),
        volume: span.volume,
        page: span.page,
        layer: span.layer,
        text: locateSpanRecord(folder, span, root).text,
      })),
    ),
  );
  const keyed = new Map<string, EntryRow>();
  for (const [agent, list] of profilesFromModel(folders, root)) {
    for (const e of list)
      keyed.set(`${e.unit}/${e.assertionId}/${agent}`, toRow(e, agent, reviewed));
  }
  return { spans, entries: [...keyed.values()] };
}
