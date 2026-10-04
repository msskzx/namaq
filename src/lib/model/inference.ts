// docs/plans/data-model/plan.md, section 2.13
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Predicate, UnitFile, WorkFolder } from './types';

export const inferencesRoot = 'data/inferences';

export type Premise =
  { assertion: string } | { span: string } | { turn: string } | { agent: string };

export type DerivedValue =
  | { kind: 'TURN_SPEAKER'; turn: string; speaker: string }
  | { kind: 'RELATION'; predicate: Predicate; subject: string; object: string }
  | { kind: 'TIMELINE_BETWEEN'; event: string; after: string; before: string };

export interface Inference {
  id: string;
  unit: string;
  passage: string[];
  value: DerivedValue;
  premises: Premise[];
  status: 'REPORTED' | 'APPROVED' | 'REJECTED';
  approvedInPr?: string;
}

export function loadInferences(root: string): Inference[] {
  const dir = join(root, inferencesRoot);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(dir, name), 'utf8')) as Inference);
}

const unitFiles = (folders: WorkFolder[]) => folders.flatMap((folder) => folder.units);

export function checkInferences(folders: WorkFolder[], inferences: Inference[]) {
  const issues: string[] = [];
  const files = new Map(unitFiles(folders).map((file) => [file.unit.id, file]));
  const seen = new Set<string>();
  for (const inference of inferences) {
    const fail = (message: string) => issues.push(`inference ${inference.id}: ${message}`);
    if (seen.has(inference.id)) fail('duplicate id');
    seen.add(inference.id);
    const file = files.get(inference.unit);
    if (!file) {
      fail(`unknown unit ${inference.unit}`);
      continue;
    }
    const spans = new Set(file.spans.map((s) => s.id));
    const mentions = new Set(file.mentions.map((m) => m.id));
    const assertions = new Set(file.assertions.map((a) => a.id));
    const turns = new Set(
      file.reports.flatMap((r) => (r.scenes ?? []).flatMap((sc) => sc.turns.map((t) => t.id))),
    );
    if (inference.passage.length === 0) fail('no passage');
    for (const id of inference.passage) if (!spans.has(id)) fail(`unknown passage span ${id}`);
    if (inference.premises.length === 0) fail('no premises');
    for (const premise of inference.premises) {
      if ('span' in premise && !spans.has(premise.span))
        fail(`unknown premise span ${premise.span}`);
      if ('turn' in premise && !turns.has(premise.turn))
        fail(`unknown premise turn ${premise.turn}`);
      if ('assertion' in premise && !assertions.has(premise.assertion)) {
        fail(`unknown premise assertion ${premise.assertion}`);
      }
    }
    const { value } = inference;
    if (value.kind === 'TURN_SPEAKER') {
      if (!turns.has(value.turn)) fail(`unknown turn ${value.turn}`);
      if (!mentions.has(value.speaker)) fail(`unknown speaker ${value.speaker}`);
    } else if (value.kind === 'RELATION') {
      for (const id of [value.subject, value.object]) {
        if (!mentions.has(id)) fail(`unknown mention ${id}`);
      }
    }
    if (inference.status === 'APPROVED' && !inference.approvedInPr)
      fail('APPROVED without approvedInPr');
    if (inference.status !== 'APPROVED' && inference.approvedInPr)
      fail('approvedInPr on an unapproved inference');
  }
  return issues;
}

export function applyApprovedInferences(folders: WorkFolder[], inferences: Inference[]) {
  const approved = inferences.filter(
    (i): i is Inference & { value: Extract<DerivedValue, { kind: 'TURN_SPEAKER' }> } =>
      i.status === 'APPROVED' && i.value.kind === 'TURN_SPEAKER',
  );
  return folders.map((folder) => ({
    ...folder,
    units: folder.units.map((file: UnitFile) => ({
      ...file,
      reports: file.reports.map((report) => ({
        ...report,
        scenes: report.scenes?.map((scene) => ({
          ...scene,
          turns: scene.turns.map((turn) => {
            const found = approved.find((i) => i.unit === file.unit.id && i.value.turn === turn.id);
            return found && turn.speaker === undefined
              ? { ...turn, speaker: found.value.speaker, derivedBy: found.id }
              : turn;
          }),
        })),
      })),
    })),
  }));
}
