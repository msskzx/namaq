// docs/plans/data-model/plan.md, sections 2.3 to 2.7
import { loadStorePage } from '../history/sourceStore';
import { HARAKAT, matchForm, renderSpan } from './span';
import {
  assertionStatuses,
  basisRoles,
  chainStates,
  genres,
  identificationStatuses,
  layers,
  mentionRoles,
  predicates,
  statementRoles,
  voices,
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

const TRANSMISSION_OPENING = /^و?(روى|قال|حدث|عن|قيل)(?=[\s:،]|$)/u;

function checkUnit(folder: WorkFolder, file: UnitFile, root: string, issues: string[]) {
  const where = `${folder.work.slug}/${file.unit.id}`;
  const fail = (message: string) => issues.push(`${where}: ${message}`);
  const oneOf = (owner: string, value: unknown, list: readonly string[]) => {
    if (!list.includes(value as string))
      fail(`${owner}: "${String(value)}" is not one of ${list.join(', ')}`);
  };
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
  const layerOf = new Map(file.spans.map((s) => [s.id, s.layer]));
  for (const span of file.spans) {
    oneOf(`span ${span.id} layer`, span.layer, layers);
    const witness = witnessOf.get(span.edition);
    if (!witness) {
      fail(`span ${span.id}: edition "${span.edition}" has no witness`);
      continue;
    }
    const page = loadStorePage(root, witness, span.volume, span.page);
    const body = span.layer === 'NOTES' ? page?.notes : page?.body;
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
    const owner = `mention ${mention.id}`;
    oneOf(`${owner} role`, mention.role, mentionRoles);
    needSpan(owner, mention.parent);
    const needle = matchForm(mention.exact ?? '');
    if (!needle) {
      fail(`${owner}: empty quote`);
      continue;
    }
    if (!Number.isInteger(mention.occurrence) || mention.occurrence < 1) {
      fail(`${owner}: occurrence must be a whole number from 1`);
      continue;
    }
    const text = rendered.get(mention.parent);
    if (text === undefined) continue;
    const count = text.split(needle).length - 1;
    if (mention.occurrence > count) {
      fail(`${owner}: "${mention.exact}" occurs ${count} times in its parent span`);
    }
  }

  for (const report of file.reports) {
    const owner = `report ${report.id}`;
    oneOf(`${owner} voice`, report.voice, voices);
    oneOf(`${owner} chainState`, report.chainState, chainStates);
    if (report.unit !== file.unit.id) fail(`${owner}: names unit "${report.unit}"`);
    if (report.voice === 'AUTHOR') {
      if (!report.voiceBasis) fail(`${owner}: AUTHOR voice needs a voiceBasis`);
      else needSpan(owner, report.voiceBasis);
    }
    if ('workAuthor' in report.origin && report.voice !== 'AUTHOR') {
      fail(`${owner}: only an AUTHOR report may name the work author as origin`);
    }
    if ('mention' in report.origin && !mentionIds.has(report.origin.mention)) {
      fail(`${owner}: unknown origin mention ${report.origin.mention}`);
    }
  }

  for (const statement of file.statements) {
    const owner = `statement ${statement.id}`;
    oneOf(`${owner} role`, statement.role, statementRoles);
    const report = reportById.get(statement.report);
    if (!report) fail(`${owner}: unknown report ${statement.report}`);
    else if (rolesByVoice[report.voice]?.includes(statement.role) === false) {
      fail(`${owner}: role ${statement.role} does not fit ${report.voice}`);
    }
    if (statement.spans.length === 0) fail(`${owner}: no spans`);
    if (new Set(statement.spans).size !== statement.spans.length) fail(`${owner}: repeats a span`);
    for (const id of statement.spans) needSpan(owner, id);
    const opening = rendered.get(statement.spans[0])?.replace(HARAKAT, '');
    if (report?.voice === 'AUTHOR' && opening && TRANSMISSION_OPENING.test(opening)) {
      fail(`${owner}: an AUTHOR statement opens with a transmission formula`);
    }
  }

  for (const identification of file.identifications) {
    const owner = `identification ${identification.id}`;
    oneOf(`${owner} status`, identification.status, identificationStatuses);
    const mention = file.mentions.find((m) => m.id === identification.mention);
    if (!mention) fail(`${owner}: unknown mention`);
    if (!identification.agent?.trim()) fail(`${owner}: no agent`);
    if (identification.basis.length === 0) fail(`${owner}: no basis`);
    for (const { span, role } of identification.basis) {
      needSpan(owner, span);
      oneOf(`${owner} basis role`, role, basisRoles);
      if (role === 'EDITOR_NOTE' && layerOf.get(span) !== 'NOTES') {
        fail(`${owner}: an EDITOR_NOTE basis must be a notes-layer span`);
      }
      if (
        mention &&
        (span === mention.parent || rendered.get(span) === rendered.get(mention.parent))
      ) {
        fail(`${owner}: the mention's own span is not a basis`);
      }
    }
  }

  for (const assertion of file.assertions) {
    const owner = `assertion ${assertion.id}`;
    oneOf(`${owner} status`, assertion.status, assertionStatuses);
    if (!mentionIds.has(assertion.subject)) fail(`${owner}: unknown subject`);
    oneOf(`${owner} predicate`, assertion.predicate, predicates);
    if (assertion.status !== 'LEGACY' && assertion.restsOn.length === 0) {
      fail(`${owner}: rests on no statement`);
    }
    for (const id of assertion.restsOn) {
      if (!statementIds.has(id)) fail(`${owner}: unknown statement ${id}`);
    }
    const { value } = assertion;
    if ('object' in value) {
      if (!mentionIds.has(value.object)) fail(`${owner}: unknown object mention`);
    } else if ('spans' in value) {
      if (value.spans.length === 0) fail(`${owner}: no value spans`);
      for (const id of value.spans) needSpan(owner, id);
      if ('parsed' in value && !Number.isFinite(value.parsed))
        fail(`${owner}: parsed is not a number`);
    } else {
      fail(`${owner}: value has no spans or object`);
    }
  }
}

export function checkModel(folders: WorkFolder[], root: string) {
  const issues: string[] = [];
  for (const folder of folders) {
    const slug = folder.work.slug;
    if (!genres.includes(folder.work.genre)) issues.push(`${slug}: genre "${folder.work.genre}"`);
    const editions = folder.witnesses.map((w) => w.edition);
    if (new Set(editions).size !== editions.length) {
      issues.push(`${slug}: an edition has more than one witness`);
    }
    for (const file of folder.units) checkUnit(folder, file, root, issues);
  }
  return issues;
}
