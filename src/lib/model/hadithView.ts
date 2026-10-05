// docs/plans/data-model/plan.md, sections 2.5a, 2.6, 2.13 and 2.14
import { conversationOf } from './conversation';
import { applyApprovedInferences, loadInferences } from './inference';
import { loadModel } from './load';
import { locateSpanRecord, renderSpanRecord } from './render';
import { matchForm } from './span';
import type { Chain, UnitFile, WorkFolder } from './types';

export const fixturesRoot = 'src/lib/model/fixtures/jibril';

export type ChainLink = { gap: true } | { gap?: false; narrator: string; mode: string; modeKey: string };

export interface ChainView {
  links: ChainLink[];
  tahwil?: string;
  branches?: ChainView[];
}

export interface ReportView {
  id: string;
  voice: string;
  origin: string;
  chainState: string;
  frame?: string;
  statements: string[];
  chain?: ChainView;
  scenes: SceneView[];
}

export interface SceneLine {
  kind: 'turn' | 'narration';
  speaker?: string;
  text: string;
}

export interface SceneView {
  ordinal: number;
  inTurn?: string;
  lines: SceneLine[];
}

export interface HadithUnitView {
  id: string;
  work: string;
  author: string;
  type: string;
  reports: ReportView[];
  explains: { unit: string; basis: string }[];
  explainedBy: { unit: string; texts: string[] }[];
}

const LEAD = /(?:[فو][\u064B-\u0652]*)?قَالَ\s*["“]?\s*$/;
const TRAIL = /^\s*["”]?\s*[.،]?\s*/;
const PUNCT_ONLY = /^[\s.،"“”:]*$/;

function sceneLines(
  folder: WorkFolder,
  file: UnitFile,
  report: UnitFile['reports'][number],
  sceneIndex: number,
  narrator: string,
  root: string,
): SceneLine[] {
  const scene = report.scenes![sceneIndex];
  const conversation = conversationOf(folder, file, report.id, root).scenes[sceneIndex];
  const located = scene.turns.map((turn) =>
    turn.spans.map((id) => locateSpanRecord(folder, file.spans.find((s) => s.id === id)!, root)),
  );
  const single = located.every((l) => l.length === 1);
  const sameBody = single && located.every((l) => l[0].key === located[0][0].key);
  const ordered = sameBody && located.every((l, i) => i === 0 || l[0].start >= located[i - 1][0].end);
  if (!ordered) {
    return conversation.turns.map((turn) => ({
      kind: 'turn' as const,
      speaker: turn.speaker?.mention,
      text: turn.parts.join(' … '),
    }));
  }
  const body = located[0][0].body;
  const statement = file.statements.find((st) => st.report === report.id);
  const bounds = statement
    ? locateSpanRecord(folder, file.spans.find((s) => s.id === statement.spans[0])!, root)
    : undefined;
  const from = !scene.inTurn && bounds ? bounds.start : located[0][0].start;
  const lines: SceneLine[] = [];
  let cursor = from;
  scene.turns.forEach((turn, i) => {
    const { start, end } = located[i][0];
    let before = body.slice(cursor, start);
    const lead = before.match(LEAD);
    const leadText = lead?.[0] ?? '';
    if (lead) before = before.slice(0, lead.index);
    if (!PUNCT_ONLY.test(matchForm(before))) {
      lines.push({ kind: 'narration', speaker: narrator, text: matchForm(before).trim() });
    }
    const next = i + 1 < scene.turns.length ? located[i + 1][0].start : undefined;
    const after = body.slice(end, next ?? Math.min(body.length, end + 4));
    const closing = after.match(TRAIL)?.[0] ?? '';
    lines.push({
      kind: 'turn',
      speaker: conversation.turns[i].speaker?.mention,
      text: matchForm(leadText + body.slice(start, end) + closing).trim(),
    });
    cursor = end + closing.length;
  });
  const tail = bounds && !scene.inTurn ? body.slice(cursor, bounds.end) : '';
  if (!PUNCT_ONLY.test(matchForm(tail))) lines.push({ kind: 'narration', speaker: narrator, text: matchForm(tail).trim() });
  return lines;
}

export function listUnits(root = fixturesRoot) {
  return loadModel(root).flatMap((folder) =>
    folder.units.map((file) => ({ id: file.unit.id, work: folder.work.slug, type: file.unit.type })),
  );
}

function chainView(folder: WorkFolder, file: UnitFile, chain: Chain, root: string): ChainView {
  const text = (spans: string[]) =>
    spans
      .map((id) => {
        const span = file.spans.find((s) => s.id === id)!;
        return renderSpanRecord(folder, span, root);
      })
      .join(' … ');
  const mention = (id: string) => file.mentions.find((m) => m.id === id)!.exact;
  return {
    links: chain.elements.map((el) =>
      'kind' in el
        ? { gap: true }
        : { narrator: mention(el.narrator), mode: text(el.mode), modeKey: el.modeKey },
    ),
    tahwil: chain.tahwil ? text(chain.tahwil) : undefined,
    branches: chain.branches?.map((b) => chainView(folder, file, b, root)),
  };
}

export function hadithView(unitId: string, root = fixturesRoot): HadithUnitView | null {
  const folders = applyApprovedInferences(loadModel(root), loadInferences(root));
  const folder = folders.find((f) => f.units.some((u) => u.unit.id === unitId));
  const file = folder?.units.find((u) => u.unit.id === unitId);
  if (!folder || !file) return null;
  const originText = (report: UnitFile['reports'][number]) =>
    'workAuthor' in report.origin
      ? folder.work.author
      : file.mentions.find((m) => m.id === (report.origin as { mention: string }).mention)!.exact;
  const spanText = (id: string) => renderSpanRecord(folder, file.spans.find((s) => s.id === id)!, root);
  return {
    id: file.unit.id,
    work: folder.work.slug,
    author: folder.work.author,
    type: file.unit.type,
    reports: file.reports.map((report) => ({
      id: report.id,
      voice: report.voice,
      origin:
        'workAuthor' in report.origin
          ? folder.work.author
          : file.mentions.find((m) => m.id === (report.origin as { mention: string }).mention)!.exact,
      chainState: report.chainState,
      frame: report.frame?.map(spanText).join(' … '),
      statements: file.statements
        .filter((st) => st.report === report.id)
        .map((st) => st.spans.map(spanText).join(' … ')),
      chain: report.chain ? chainView(folder, file, report.chain, root) : undefined,
      scenes: (report.scenes ?? []).map((scene, index) => ({
        ordinal: scene.ordinal,
        inTurn: scene.inTurn,
        lines: sceneLines(folder, file, report, index, originText(report), root),
      })),
    })),
    explains: (file.sharhLinks ?? []).map((l) => ({
      unit: l.explains,
      basis: l.basis.map(spanText).join(' … '),
    })),
    explainedBy: folders.flatMap((f) =>
      f.units
        .filter((u) => u.sharhLinks?.some((l) => l.explains === unitId))
        .map((u) => ({
          unit: u.unit.id,
          texts: u.statements.map((st) =>
            st.spans.map((id) => renderSpanRecord(f, u.spans.find((x) => x.id === id)!, root)).join(' … '),
          ),
        })),
    ),
  };
}
