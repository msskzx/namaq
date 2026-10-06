// docs/plans/data-model/plan.md, sections 2.5a, 2.6, 2.13 and 2.14
import { conversationOf } from './conversation';
import { applyApprovedInferences, loadInferences } from './inference';
import { loadModel } from './load';
import { locateSpanRecord, renderSpanRecord } from './render';
import { standingAgent } from './referents';
import { matchForm } from './span';
import type { Chain, Link, UnitFile, WorkFolder } from './types';

export const fixturesRoot = 'src/lib/model/fixtures/jibril';

export type ChainLink =
  | { gap: true }
  | { gap?: false; narrator: string; agent?: string; mode: string; modeKey: string; text?: string };

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
  fullText?: string;
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

export interface ReaderPage {
  label: string;
  parts: { text: string; mark: boolean }[];
}

export interface HadithUnitView {
  book: string;
  compiler?: string;
  kitab?: string;
  bab?: string;
  reader?: ReaderPage[];
  id: string;
  work: string;
  author: string;
  type: string;
  reports: ReportView[];
  notes: { text: string; narrator?: string }[];
  explains: { unit: string; basis: string; book: string }[];
  explainedBy: { unit: string; texts: string[] }[];
  sameEvent: { unit: string; book: string; basis: string; source: string }[];
}

const LEAD = /((?:[فو][\u064B-\u0652]*)?(?:قَالَ|قُلْتُ))(\s*["“]?\s*)$/;
const TRAIL = /^\s*["”]?\s*[.،]?\s*/;
const PUNCT_ONLY = /^[\s.،"“”:]*$/;

const withoutQuotes = (text: string) =>
  text.replace(/\s*["“”]\s*/g, ' ').replace(/\s+([.،])/g, '$1').replace(/\s+/g, ' ').trim();

const cutAfterFirstQala = (body: string, start: number, end: number) => {
  const m = body.slice(start, end).match(/قَالَ/);
  return m ? start + m.index! + m[0].length : end;
};

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
  const spans = located.map((l) => ({ ...l[0], end: l[l.length - 1].end }));
  const sameBody = spans.every((l) => l.key === spans[0].key);
  const ordered = sameBody && spans.every((l, i) => i === 0 || l.start >= spans[i - 1].end);
  if (!ordered) {
    return conversation.turns.map((turn) => ({
      kind: 'turn' as const,
      speaker: turn.speaker?.mention,
      text: turn.parts.join(' … '),
    }));
  }
  const body = spans[0].body;
  const statement = file.statements.find((st) => st.report === report.id);
  const statementAt = (id: string) => locateSpanRecord(folder, file.spans.find((s) => s.id === id)!, root);
  const bounds = statement
    ? {
        start: statementAt(statement.spans[0]).start,
        end: statementAt(statement.spans[statement.spans.length - 1]).end,
      }
    : undefined;
  const parentTurn = report.scenes!.flatMap((sc) => sc.turns).find((t) => t.id === scene.inTurn);
  const parentAt = parentTurn
    ? locateSpanRecord(folder, file.spans.find((x) => x.id === parentTurn.spans[0])!, root)
    : undefined;
  const parentStart =
    parentAt && parentAt.key === spans[0].key
      ? cutAfterFirstQala(parentAt.body, parentAt.start, parentAt.end)
      : undefined;
  const parents = new Set(report.scenes!.map((sc) => sc.inTurn));
  const links = (report.chain ? linkElements(report.chain) : [])
    .map((el) => ({
      el,
      at: locateSpanRecord(folder, file.spans.find((x) => x.id === el.mode[0])!, root),
    }))
    .filter(({ at }) => at.key === spans[0].key);
  const last = links.reduce<(typeof links)[number] | undefined>(
    (best, link) => (!best || link.at.start > best.at.start ? link : best),
    undefined,
  );
  const lastName = last && file.mentions.find((m) => m.id === last.el.narrator)?.exact;
  const nameAt = last && lastName ? body.indexOf(lastName, last.at.start) : -1;
  const lastLink =
    last && nameAt >= 0
      ? nameAt + lastName!.length + (body.slice(nameAt + lastName!.length).match(/^[\s،]*/)?.[0].length ?? 0)
      : last?.at.start;
  const from = parentStart ?? lastLink ?? (bounds ? bounds.start : spans[0].start);
  const lines: SceneLine[] = [];
  let cursor = from;
  scene.turns.forEach((turn, i) => {
    const { start, end } = spans[i];
    let before = body.slice(cursor, start);
    const lead = before.match(LEAD);
    const leadText = lead?.[1] ?? '';
    const opening = lead?.[2].trim() ?? '';
    if (lead) before = before.slice(0, lead.index);
    const narration = matchForm(before + leadText).trim();
    if (!PUNCT_ONLY.test(narration)) lines.push({ kind: 'narration', speaker: narrator, text: narration });
    const next = i + 1 < scene.turns.length ? spans[i + 1].start : undefined;
    const after = body.slice(end, next ?? Math.min(body.length, end + 4));
    const closing = after.match(TRAIL)?.[0] ?? '';
    const shownEnd = parents.has(turn.id) ? cutAfterFirstQala(body, start, end) : end;
    lines.push({
      kind: 'turn',
      speaker: conversation.turns[i].speaker?.mention,
      text: matchForm(`${opening} ${body.slice(start, shownEnd)}${parents.has(turn.id) ? '' : closing}`).trim(),
    });
    cursor = parents.has(turn.id) ? end : end + closing.length;
  });
  const tail = bounds && !scene.inTurn ? body.slice(cursor, bounds.end) : '';
  if (!PUNCT_ONLY.test(matchForm(tail))) lines.push({ kind: 'narration', speaker: narrator, text: matchForm(tail).trim() });
  return lines;
}

function fullTextOf(
  folder: WorkFolder,
  file: UnitFile,
  report: UnitFile['reports'][number],
  root: string,
) {
  const statement = file.statements.find((st) => st.report === report.id);
  if (!report.isnadSpan || !statement) return undefined;
  const find = (id: string) => locateSpanRecord(folder, file.spans.find((s) => s.id === id)!, root);
  const isnad = find(report.isnadSpan);
  const last = find(statement.spans[statement.spans.length - 1]);
  if (isnad.key !== last.key || isnad.start >= last.end) return undefined;
  const closing = last.body.slice(last.end).match(/^\s*["”]?\s*[.،]?/)?.[0] ?? '';
  return matchForm(last.body.slice(isnad.start, last.end + closing.length)).trim();
}

function readerPages(folder: WorkFolder, file: UnitFile, root: string): ReaderPage[] {
  const located = file.spans
    .filter((span) => span.layer === 'MAIN')
    .map((span) => ({ span, at: locateSpanRecord(folder, span, root) }));
  const keys = [...new Set(located.map((l) => l.at.key))];
  return keys.map((key) => {
    const marks = located
      .filter((l) => l.at.key === key)
      .sort((a, b) => a.at.start - b.at.start);
    const { body } = marks[0].at;
    const parts: ReaderPage['parts'] = [];
    let cursor = 0;
    for (const { at } of marks) {
      if (at.start < cursor) continue;
      parts.push({ text: matchForm(body.slice(cursor, at.start)), mark: false });
      parts.push({ text: matchForm(body.slice(at.start, at.end)), mark: true });
      cursor = at.end;
    }
    parts.push({ text: matchForm(body.slice(cursor)), mark: false });
    return { label: marks[0].span.page, parts: parts.filter((p) => p.text) };
  });
}

const BOOKS: Record<string, string> = {
  'test-bukhari': 'صحيح البخاري',
  'test-muslim': 'صحيح مسلم',
  'test-fath': 'فتح الباري بشرح صحيح البخاري',
};

const COMPILERS: Record<string, string> = {
  'test-bukhari': 'البخاري',
  'test-muslim': 'مسلم',
};

const BUKHARI_BAB =
  'بَاب سُؤَالِ جِبْرِيلَ النَّبِيَّ ﷺ عَنْ الْإِيمَانِ وَالْإِسْلَامِ وَالْإِحْسَانِ وَعِلْمِ السَّاعَةِ وَبَيَانِ النَّبِيِّ ﷺ لَهُ';

const PLACES: Record<string, { kitab: string; bab: string }> = {
  'bukhari-jibril': { kitab: 'كتاب الإيمان', bab: BUKHARI_BAB },
  'fath-iman-50': { kitab: 'كتاب الإيمان', bab: BUKHARI_BAB },
  'muslim-jibril': {
    kitab: 'كتاب الإيمان',
    bab: 'باب بيان الإيمان والإسلام والإحسان ووجوب الإيمان بإثبات قدر الله سبحانه وتعالى وبيان الدليل على التبري ممن لا يؤمن بالقدر وإغلاظ القول في حقه',
  },
};

export function listUnits(root = fixturesRoot) {
  return loadModel(root).flatMap((folder) =>
    folder.units.map((file) => ({ id: file.unit.id, book: BOOKS[folder.work.slug] ?? folder.work.slug })),
  );
}

function linkElements(chain: Chain): Link[] {
  return [
    ...chain.elements.filter((el): el is Link => !('kind' in el)),
    ...(chain.branches ?? []).flatMap(linkElements),
  ];
}

function linkTexts(
  folder: WorkFolder,
  file: UnitFile,
  report: UnitFile['reports'][number],
  root: string,
) {
  const texts = new Map<string, string>();
  if (!report.isnadSpan || !report.chain) return texts;
  const find = (id: string) => locateSpanRecord(folder, file.spans.find((s) => s.id === id)!, root);
  const isnad = find(report.isnadSpan);
  const links = linkElements(report.chain).map((el) => {
    const at = find(el.mode[0]);
    const conj = at.body.slice(Math.max(0, at.start - 2), at.start).match(/[وف][\u064B-\u0652]?$/);
    return { id: el.mode[0], at: { ...at, start: at.start - (conj?.[0].length ?? 0) } };
  });
  if (links.some((l) => l.at.key !== isnad.key)) return texts;
  const cuts = [
    ...links.map((l) => l.at.start),
    ...(report.chain.tahwil ?? []).map((id) => find(id).start),
  ];
  const ordered = [...links].sort((a, b) => a.at.start - b.at.start);
  let carry = '';
  for (const link of ordered) {
    const end = Math.min(...cuts.filter((c) => c > link.at.start), isnad.end);
    const raw = matchForm(isnad.body.slice(link.at.start, end)).trim();
    const lead = raw.match(/\s*قَالَ$/);
    const own = (lead ? raw.slice(0, lead.index) : raw).replace(/[\s،]+$/, '');
    texts.set(link.id, `${carry}${own}`);
    carry = lead && links.some((l) => l.at.start === end) ? 'قَالَ ' : '';
  }
  return texts;
}

function chainView(
  folder: WorkFolder,
  file: UnitFile,
  chain: Chain,
  root: string,
  texts: Map<string, string>,
): ChainView {
  const text = (spans: string[]) =>
    spans
      .map((id) => {
        const span = file.spans.find((s) => s.id === id)!;
        return renderSpanRecord(folder, span, root);
      })
      .join(' … ');
  const mention = (id: string) => file.mentions.find((m) => m.id === id)!.exact;
  const agentOf = (id: string) =>
    file.identifications.find((i) => i.mention === id && i.status !== 'REJECTED')?.agent ??
    standingAgent(mention(id));
  return {
    links: chain.elements.map((el) =>
      'kind' in el
        ? { gap: true }
        : {
            narrator: mention(el.narrator),
            agent: agentOf(el.narrator),
            mode: text(el.mode),
            modeKey: el.modeKey,
            text: texts.get(el.mode[0]),
          },
    ),
    tahwil: chain.tahwil ? text(chain.tahwil) : undefined,
    branches: chain.branches?.map((b) => chainView(folder, file, b, root, texts)),
  };
}

export function hadithView(unitId: string, root = fixturesRoot): HadithUnitView | null {
  const folders = applyApprovedInferences(
    loadModel(root),
    loadInferences(root).map((i) => ({ ...i, status: 'APPROVED' as const })),
  );
  const folder = folders.find((f) => f.units.some((u) => u.unit.id === unitId));
  const file = folder?.units.find((u) => u.unit.id === unitId);
  if (!folder || !file) return null;
  const mentionText = (id: string) => file.mentions.find((m) => m.id === id)!.exact;
  const originText = (report: UnitFile['reports'][number]) =>
    'workAuthor' in report.origin ? folder.work.author : mentionText(report.origin.mention);
  const spanText = (id: string) => renderSpanRecord(folder, file.spans.find((s) => s.id === id)!, root);
  return {
    id: file.unit.id,
    book: BOOKS[folder.work.slug] ?? folder.work.slug,
    compiler: COMPILERS[folder.work.slug],
    ...PLACES[unitId],
    work: folder.work.slug,
    author: folder.work.author,
    type: file.unit.type,
    reader: file.unit.type === 'commentary' ? readerPages(folder, file, root) : undefined,
    reports: file.reports.map((report) => ({
      id: report.id,
      voice: report.voice,
      origin: originText(report),
      chainState: report.chainState,
      frame: report.frame?.map(spanText).join(' … '),
      fullText: fullTextOf(folder, file, report, root),
      statements: file.statements
        .filter((st) => st.report === report.id)
        .map((st) => st.spans.map(spanText).join(' … ')),
      chain: report.chain
        ? chainView(folder, file, report.chain, root, linkTexts(folder, file, report, root))
        : undefined,
      scenes: (report.scenes ?? []).map((scene, index) => ({
        ordinal: scene.ordinal,
        inTurn: scene.inTurn,
        lines: sceneLines(
          folder,
          file,
          report,
          index,
          report.scenes![index].narrator
            ? mentionText(report.scenes![index].narrator!)
            : originText(report),
          root,
        ).map((line) => ({
          ...line,
          text: withoutQuotes(line.text),
        })),
      })),
    })),
    notes: (file.sharhLinks ?? []).length
      ? file.statements.map((st) => ({
          text: st.spans.map(spanText).join(' … '),
          narrator: folders
            .flatMap((f) => f.units)
            .flatMap((u) =>
              u.identifications
                .filter((i) => i.basis.some((b) => st.spans.some((id) => b.span === `${unitId}#${id}`)))
                .map((i) => u.mentions.find((m) => m.id === i.mention)?.exact),
            )
            .find(Boolean),
        }))
      : [],
    explains: (file.sharhLinks ?? []).map((l) => ({
      unit: l.explains,
      basis: l.basis.map(spanText).join(' … '),
      book: BOOKS[folders.find((f) => f.units.some((u) => u.unit.id === l.explains))!.work.slug] ?? '',
    })),
    sameEvent: folders.flatMap((f) =>
      f.units.flatMap((u) =>
        (u.eventLinks ?? [])
          .filter((l) => l.units.includes(unitId))
          .flatMap((l) =>
            l.units
              .filter((other) => other !== unitId)
              .map((other) => ({
                unit: other,
                book:
                  BOOKS[folders.find((g) => g.units.some((x) => x.unit.id === other))!.work.slug] ?? '',
                basis: l.basis
                  .map((id) => renderSpanRecord(f, u.spans.find((x) => x.id === id)!, root))
                  .join(' … '),
                source: BOOKS[f.work.slug] ?? f.work.slug,
              })),
          ),
      ),
    ),
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
