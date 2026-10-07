// docs/plans/data-model/plan.md, section 2.13
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { predicates, type Predicate, type UnitFile, type WorkFolder } from './types';

export const inferencesRoot = 'data/inferences';

export type Premise =
  { assertion: string } | { span: string } | { turn: string } | { agent: string };

export type DerivedValue =
  | { kind: 'TURN_SPEAKER'; turn: string; speaker: string }
  | { kind: 'RELATION'; predicate: Predicate; subject: string; object: string };

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
    .map((name) => {
      try {
        return JSON.parse(readFileSync(join(dir, name), 'utf8')) as Inference;
      } catch (error) {
        throw new Error(`${join(dir, name)}: ${(error as Error).message}`);
      }
    });
}

const unitFiles = (folders: WorkFolder[]) => folders.flatMap((folder) => folder.units);

const kinds = ['TURN_SPEAKER', 'RELATION'];

export function checkInferences(folders: WorkFolder[], inferences: Inference[]) {
  const issues: string[] = [];
  const files = new Map(unitFiles(folders).map((file) => [file.unit.id, file]));
  const seen = new Set<string>();
  const approvedTurns = new Set<string>();
  for (const inference of inferences) {
    const fail = (message: string) => issues.push(`inference ${inference.id}: ${message}`);
    if (seen.has(inference.id)) fail('duplicate id');
    seen.add(inference.id);
    if (
      !Array.isArray(inference.passage) ||
      !Array.isArray(inference.premises) ||
      typeof inference.value !== 'object' ||
      inference.value === null
    ) {
      fail('needs passage, premises and value');
      continue;
    }
    const file = files.get(inference.unit);
    if (!file) {
      fail(`unknown unit ${inference.unit}`);
      continue;
    }
    const spans = new Set(file.spans.map((s) => s.id));
    const mentions = new Set(file.mentions.map((m) => m.id));
    const assertions = new Set(file.assertions.map((a) => a.id));
    const turns = new Map(
      file.reports.flatMap((r) =>
        (r.scenes ?? []).flatMap((sc) => sc.turns.map((t) => [t.id, t] as const)),
      ),
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
      if ('agent' in premise && !premise.agent?.trim()) fail('premise agent is empty');
    }
    const { value } = inference;
    if (!kinds.includes(value.kind)) {
      fail(`value kind "${value.kind}" is not one of ${kinds.join(', ')}`);
    } else if (value.kind === 'TURN_SPEAKER') {
      const turn = turns.get(value.turn);
      if (!turn) fail(`unknown turn ${value.turn}`);
      if (!mentions.has(value.speaker)) fail(`unknown speaker ${value.speaker}`);
      if (inference.status === 'APPROVED' && turn) {
        const key = `${inference.unit}/${value.turn}`;
        if (approvedTurns.has(key)) fail(`a second approved inference for turn ${value.turn}`);
        approvedTurns.add(key);
        if (turn.speaker !== undefined) fail(`turn ${value.turn} already has a printed speaker`);
      }
    } else if (value.kind === 'RELATION') {
      for (const id of [value.subject, value.object]) {
        if (!mentions.has(id)) fail(`unknown mention ${id}`);
      }
      if (!predicates.includes(value.predicate))
        fail(`predicate ${value.predicate} is not in the closed list`);
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
