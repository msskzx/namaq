// docs/plans/data-model/plan.md, sections 2.3 to 2.7
import { loadStorePage } from '../history/sourceStore';
import { matchForm, renderSpan } from './span';
import {
  basisRoles,
  predicates,
  type StatementRole,
  type UnitFile,
  type Voice,
  type WorkFolder,
} from './types';

const rolesByVoice: Record<Voice, StatementRole[]> = {
  AUTHOR: ['AUTHOR_REPORT', 'AUTHOR_SYNTHESIS'],
  TRANSMITTED: ['TRANSMITTED'],
  REPORTED_ANONYMOUS: ['TRANSMITTED'],
  EDITOR_NOTE: ['EDITOR_ANALYSIS'],
};

function checkUnit(folder: WorkFolder, file: UnitFile, root: string, issues: string[]) {
  const where = `${folder.work.slug}/${file.unit.id}`;
  const fail = (message: string) => issues.push(`${where}: ${message}`);
  const witnessOf = new Map(folder.witnesses.map((w) => [w.edition, w.slug]));

  const ids = new Set<string>();
  const all = [
    ...file.spans,
    ...file.reports,
    ...file.statements,
    ...file.mentions,
    ...file.identifications,
    ...file.assertions,
  ];
  for (const { id } of all) {
    if (ids.has(id)) fail(`duplicate id ${id}`);
    ids.add(id);
  }

  if (file.unit.work !== folder.work.slug) fail(`unit names work "${file.unit.work}"`);

  const rendered = new Map<string, string>();
  for (const span of file.spans) {
    const witness = witnessOf.get(span.edition);
    if (!witness) {
      fail(`span ${span.id}: edition "${span.edition}" has no witness`);
      continue;
    }
    const page = loadStorePage(root, witness, span.volume, span.page);
    const body = span.layer === 'MAIN' ? page?.body : page?.notes;
    if (body == null) {
      fail(`span ${span.id}: no ${span.layer} text for v${span.volume} page ${span.page}`);
      continue;
    }
    try {
      rendered.set(span.id, renderSpan(body, span));
    } catch (error) {
      fail(`span ${span.id}: ${(error as Error).message}`);
    }
  }

  const spanIds = new Set(file.spans.map((s) => s.id));
  const mentionIds = new Set(file.mentions.map((m) => m.id));
  const statementIds = new Set(file.statements.map((s) => s.id));
  const reportById = new Map(file.reports.map((r) => [r.id, r]));
  const needSpan = (owner: string, id: string) => {
    if (!spanIds.has(id)) fail(`${owner}: unknown span ${id}`);
  };

  for (const mention of file.mentions) {
    needSpan(`mention ${mention.id}`, mention.parent);
    const text = rendered.get(mention.parent);
    if (text === undefined) continue;
    const count = text.split(matchForm(mention.exact)).length - 1;
    if (mention.occurrence < 1 || mention.occurrence > count) {
      fail(`mention ${mention.id}: "${mention.exact}" occurs ${count} times in its parent span`);
    }
  }

  for (const report of file.reports) {
    if (report.voice === 'AUTHOR') {
      if (!report.voiceBasis) fail(`report ${report.id}: AUTHOR voice needs a voiceBasis`);
      else needSpan(`report ${report.id}`, report.voiceBasis);
    }
    if ('workAuthor' in report.origin && report.voice !== 'AUTHOR') {
      fail(`report ${report.id}: only an AUTHOR report may name the work author as origin`);
    }
    if ('mention' in report.origin && !mentionIds.has(report.origin.mention)) {
      fail(`report ${report.id}: unknown origin mention ${report.origin.mention}`);
    }
  }

  for (const statement of file.statements) {
    const report = reportById.get(statement.report);
    if (!report) fail(`statement ${statement.id}: unknown report ${statement.report}`);
    else if (!rolesByVoice[report.voice].includes(statement.role)) {
      fail(`statement ${statement.id}: role ${statement.role} does not fit ${report.voice}`);
    }
    if (statement.spans.length === 0) fail(`statement ${statement.id}: no spans`);
    for (const id of statement.spans) needSpan(`statement ${statement.id}`, id);
  }

  for (const identification of file.identifications) {
    const mention = file.mentions.find((m) => m.id === identification.mention);
    if (!mention) fail(`identification ${identification.id}: unknown mention`);
    if (identification.basis.length === 0) fail(`identification ${identification.id}: no basis`);
    for (const { span, role } of identification.basis) {
      needSpan(`identification ${identification.id}`, span);
      if (!basisRoles.includes(role)) fail(`identification ${identification.id}: role ${role}`);
      if (mention && span === mention.parent) {
        fail(`identification ${identification.id}: the mention's own span is not a basis`);
      }
    }
  }

  for (const assertion of file.assertions) {
    if (!mentionIds.has(assertion.subject)) fail(`assertion ${assertion.id}: unknown subject`);
    if (!predicates.includes(assertion.predicate)) {
      fail(`assertion ${assertion.id}: predicate ${assertion.predicate} is not in the closed list`);
    }
    if (assertion.status !== 'LEGACY' && assertion.restsOn.length === 0) {
      fail(`assertion ${assertion.id}: rests on no statement`);
    }
    for (const id of assertion.restsOn) {
      if (!statementIds.has(id)) fail(`assertion ${assertion.id}: unknown statement ${id}`);
    }
    const { value } = assertion;
    if ('object' in value && !mentionIds.has(value.object)) {
      fail(`assertion ${assertion.id}: unknown object mention`);
    }
    if ('spans' in value) for (const id of value.spans) needSpan(`assertion ${assertion.id}`, id);
  }
}

export function checkModel(folders: WorkFolder[], root: string) {
  const issues: string[] = [];
  for (const folder of folders) {
    for (const file of folder.units) checkUnit(folder, file, root, issues);
  }
  return issues;
}
