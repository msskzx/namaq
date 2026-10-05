// docs/plans/data-model/plan.md, sections 2.3 to 2.7
import { locateSpanRecord } from './render';
import { modeKeyOf } from './modes';
import { splitRef } from './refs';
import { HARAKAT, matchForm } from './span';
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
  type Chain,
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

function checkUnit(
  folder: WorkFolder,
  file: UnitFile,
  root: string,
  issues: string[],
  units: Map<string, { folder: WorkFolder; file: UnitFile }>,
) {
  const where = `${folder.work.slug}/${file.unit.id}`;
  const fail = (message: string) => issues.push(`${where}: ${message}`);
  const oneOf = (owner: string, value: unknown, list: readonly string[]) => {
    if (!list.includes(value as string))
      fail(`${owner}: "${String(value)}" is not one of ${list.join(', ')}`);
  };

  const ids = new Set<string>();
  const all = [
    ...file.spans,
    ...file.reports,
    ...file.statements,
    ...file.mentions,
    ...file.identifications,
    ...file.assertions,
    ...(file.sharhLinks ?? []),
    ...(file.eventLinks ?? []),
    ...file.reports.flatMap((r) => (r.scenes ?? []).flatMap((sc) => sc.turns)),
  ];
  for (const { id } of all) {
    if (ids.has(id)) fail(`duplicate id ${id}`);
    ids.add(id);
  }

  if (file.unit.work !== folder.work.slug) fail(`unit names work "${file.unit.work}"`);

  const rendered = new Map<string, string>();
  const placed = new Map<string, { key: string; start: number; end: number }>();
  const layerOf = new Map(file.spans.map((s) => [s.id, s.layer]));
  for (const span of file.spans) {
    oneOf(`span ${span.id} layer`, span.layer, layers);
    try {
      const found = locateSpanRecord(folder, span, root);
      rendered.set(span.id, found.text);
      placed.set(span.id, found);
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

  const within = (inner: string, outers: string[]) => {
    const a = placed.get(inner);
    return outers.some((id) => {
      const b = placed.get(id);
      return a && b && a.key === b.key && a.start >= b.start && a.end <= b.end;
    });
  };

  for (const report of file.reports) {
    const owner = `report ${report.id}`;
    oneOf(`${owner} voice`, report.voice, voices);
    oneOf(`${owner} chainState`, report.chainState, chainStates);
    if (report.unit !== file.unit.id) fail(`${owner}: names unit "${report.unit}"`);
    if (report.voice === 'AUTHOR') {
      if (!report.voiceBasis) fail(`${owner}: AUTHOR voice needs a voiceBasis`);
      else needSpan(owner, report.voiceBasis);
    }
    for (const id of report.frame ?? []) needSpan(owner, id);
    if (report.isnadSpan) needSpan(owner, report.isnadSpan);
    if ('workAuthor' in report.origin && report.voice !== 'AUTHOR') {
      fail(`${owner}: only an AUTHOR report may name the work author as origin`);
    }
    if ('mention' in report.origin && !mentionIds.has(report.origin.mention)) {
      fail(`${owner}: unknown origin mention ${report.origin.mention}`);
    }
    if (report.voice === 'TRANSMITTED' && report.chainState === 'COMPLETE' && !report.chain) {
      fail(`${owner}: a COMPLETE transmitted report needs a chain`);
    }
    if (report.chainState === 'DEFERRED' && report.chain) {
      fail(`${owner}: a DEFERRED report has no chain yet`);
    }
    if (report.chain) {
      const chainOwner = `${owner} chain`;
      if (report.voice !== 'TRANSMITTED')
        fail(`${chainOwner}: only a TRANSMITTED report has a chain`);
      if (!report.isnadSpan) fail(`${chainOwner}: a chain needs the report's isnadSpan`);
      const inIsnad = (id: string) =>
        !report.isnadSpan || !placed.has(id) || within(id, [report.isnadSpan]);
      const position = (mentionId: string): [number, number] | undefined => {
        const mention = file.mentions.find((m) => m.id === mentionId);
        const at = mention && placed.get(mention.parent);
        const text = mention && rendered.get(mention.parent);
        if (!mention || !at || text === undefined) return undefined;
        const needle = matchForm(mention.exact);
        let index = -1;
        for (let n = 0; n < mention.occurrence; n += 1) index = text.indexOf(needle, index + 1);
        return [at.start, index];
      };
      const ascending = (a: [number, number], b: [number, number]) =>
        a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
      const walk = (chain: Chain) => {
        const branches = chain.branches ?? [];
        if (chain.elements.length === 0 && branches.length < 2) {
          fail(`${chainOwner}: a chain needs links, or two branches`);
        }
        if (branches.length > 0 && (chain.tahwil ?? []).length === 0) {
          fail(`${chainOwner}: branches need the tahwil span that marks them`);
        }
        for (const id of chain.tahwil ?? []) {
          needSpan(chainOwner, id);
          if (!inIsnad(id)) fail(`${chainOwner}: span ${id} is outside the isnad`);
        }
        const seen = new Set<string>();
        let lastNarrator: [number, number] | undefined;
        let lastMode: number | undefined;
        for (const element of chain.elements) {
          if ('kind' in element) {
            for (const id of element.marker ?? []) needSpan(chainOwner, id);
            continue;
          }
          if (!mentionIds.has(element.narrator)) {
            fail(`${chainOwner}: unknown narrator ${element.narrator}`);
          } else {
            if (seen.has(element.narrator))
              fail(`${chainOwner}: ${element.narrator} appears twice in one route`);
            seen.add(element.narrator);
            const parent = file.mentions.find((m) => m.id === element.narrator)!.parent;
            if (placed.has(parent) && report.isnadSpan && !within(parent, [report.isnadSpan])) {
              fail(`${chainOwner}: narrator ${element.narrator} is named outside the isnad`);
            }
            const now = position(element.narrator);
            if (now && lastNarrator && !ascending(lastNarrator, now)) {
              fail(`${chainOwner}: narrator ${element.narrator} is out of reading order`);
            }
            lastNarrator = now ?? lastNarrator;
          }
          if (element.mode.length === 0) fail(`${chainOwner}: a link has no mode span`);
          for (const id of element.mode) {
            needSpan(chainOwner, id);
            if (!inIsnad(id)) fail(`${chainOwner}: span ${id} is outside the isnad`);
          }
          const modeStart = placed.get(element.mode[0] ?? '')?.start;
          if (modeStart !== undefined && lastMode !== undefined && modeStart <= lastMode) {
            fail(`${chainOwner}: the formula of ${element.narrator} is out of reading order`);
          }
          lastMode = modeStart ?? lastMode;
          const printed = element.mode.map((id) => rendered.get(id) ?? '').join(' ');
          const key = modeKeyOf(printed);
          if (key === undefined) {
            fail(`${chainOwner}: no mode key for the printed formula "${printed}"`);
          } else if (key !== element.modeKey) {
            fail(
              `${chainOwner}: mode key ${element.modeKey} does not match the printed "${printed}" (${key})`,
            );
          }
        }
        for (const branch of branches) walk(branch);
      };
      walk(report.chain);
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

  for (const report of file.reports) {
    const turnById = new Map<string, { spans: string[]; scene: number }>();
    const sceneOrdinals = (report.scenes ?? []).map((scene) => scene.ordinal);
    if (sceneOrdinals.some((o, i) => o !== i + 1)) {
      fail(`report ${report.id}: scene ordinals must run 1, 2, 3...`);
    }
    const statementSpans = file.statements
      .filter((s) => s.report === report.id)
      .flatMap((s) => s.spans);
    for (const scene of report.scenes ?? []) {
      for (const turn of scene.turns) {
        const owner = `turn ${turn.id} of report ${report.id}`;
        turnById.set(turn.id, { spans: turn.spans, scene: scene.ordinal });
        if (turn.spans.length === 0) fail(`${owner}: no spans`);
        for (const id of turn.spans) {
          needSpan(owner, id);
          if (placed.has(id) && !within(id, statementSpans)) {
            fail(`${owner}: span ${id} is outside the report's statements`);
          }
        }
        for (const id of [turn.speaker, turn.addressee]) {
          if (id !== undefined && !mentionIds.has(id)) fail(`${owner}: unknown mention ${id}`);
        }
      }
      const ordinals = scene.turns.map((t) => t.ordinal);
      if (ordinals.some((o, i) => o !== i + 1)) {
        fail(`report ${report.id} scene ${scene.ordinal}: turn ordinals must run 1, 2, 3...`);
      }
    }
    for (const scene of report.scenes ?? []) {
      if (scene.inTurn === undefined) continue;
      const outer = turnById.get(scene.inTurn);
      if (!outer || outer.scene >= scene.ordinal) {
        fail(
          `report ${report.id} scene ${scene.ordinal}: inTurn must name a turn of an earlier scene`,
        );
      } else {
        for (const turn of scene.turns) {
          for (const id of turn.spans) {
            if (placed.has(id) && !within(id, outer.spans)) {
              fail(`turn ${turn.id}: span ${id} is outside the turn it is quoted in`);
            }
          }
        }
      }
    }
  }

  const checkForeignBasis = (
    owner: string,
    foreignId: string,
    spanId: string,
    role: string,
    mention: { exact: string; parent: string } | undefined,
  ) => {
    const target = units.get(foreignId);
    const foreignSpan = target?.file.spans.find((s) => s.id === spanId);
    if (!target || !foreignSpan) {
      fail(`${owner}: unknown span ${foreignId}#${spanId}`);
      return;
    }
    const genre = target.folder.work.genre;
    if (role === 'COMMENTATOR_NOTE') {
      if (genre !== 'SHARH') fail(`${owner}: a COMMENTATOR_NOTE basis must be in a SHARH work`);
      if (!target.file.sharhLinks?.some((l) => l.explains === file.unit.id)) {
        fail(`${owner}: ${foreignId} has no sharh link to ${file.unit.id}`);
      }
    } else if (role === 'RIJAL_ENTRY') {
      if (genre !== 'TARAJEM') fail(`${owner}: a RIJAL_ENTRY basis must be in a TARAJEM work`);
    } else {
      fail(`${owner}: only a COMMENTATOR_NOTE or RIJAL_ENTRY basis may be in another unit`);
    }
    try {
      const text = locateSpanRecord(target.folder, foreignSpan, root).text;
      if (
        mention &&
        ((foreignId === file.unit.id && spanId === mention.parent) ||
          text === rendered.get(mention.parent))
      ) {
        fail(`${owner}: the mention's own span is not a basis`);
      }
      if (
        mention &&
        !text.replace(HARAKAT, '').includes(matchForm(mention.exact).replace(HARAKAT, ''))
      ) {
        fail(`${owner}: ${foreignId}#${spanId} does not name "${mention.exact}"`);
      }
    } catch (error) {
      fail(`${owner}: ${foreignId}#${spanId}: ${(error as Error).message}`);
    }
  };

  for (const identification of file.identifications) {
    const owner = `identification ${identification.id}`;
    oneOf(`${owner} status`, identification.status, identificationStatuses);
    const mention = file.mentions.find((m) => m.id === identification.mention);
    if (!mention) fail(`${owner}: unknown mention`);
    if (!identification.agent?.trim()) fail(`${owner}: no agent`);
    const twin = file.identifications.find(
      (i) =>
        i.id < identification.id &&
        i.mention === identification.mention &&
        i.agent === identification.agent &&
        i.status !== 'REJECTED' &&
        identification.status !== 'REJECTED',
    );
    if (twin)
      fail(`${owner}: ${twin.id} already identifies this mention as ${identification.agent}`);
    if (identification.basis.length === 0) fail(`${owner}: no basis`);
    for (const { span: ref, role } of identification.basis) {
      const { unit: foreignId, span } = splitRef(ref);
      if (foreignId !== undefined) {
        checkForeignBasis(owner, foreignId, span, role, mention);
        continue;
      }
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

function checkSharhLinks(folders: WorkFolder[], issues: string[]) {
  const units = new Map(folders.flatMap((f) => f.units.map((u) => [u.unit.id, u.unit] as const)));
  for (const folder of folders) {
    for (const file of folder.units) {
      const targets = (file.sharhLinks ?? []).map((l) => l.explains);
      for (const link of file.sharhLinks ?? []) {
        const fail = (message: string) =>
          issues.push(`${folder.work.slug}/${file.unit.id}: sharh link ${link.id}: ${message}`);
        if (folder.work.genre !== 'SHARH') fail(`work ${folder.work.slug} is not a SHARH`);
        const target = units.get(link.explains);
        if (!target) fail(`unknown unit ${link.explains}`);
        else if (target.type !== 'hadith')
          fail(`${link.explains} is a ${target.type}, not a hadith`);
        if (link.explains === file.unit.id) fail('a commentary cannot explain itself');
        if (targets.indexOf(link.explains) !== targets.lastIndexOf(link.explains)) {
          fail(`more than one link to ${link.explains}`);
        }
        if (link.basis.length === 0) fail('no basis span');
        for (const id of link.basis) {
          if (!file.spans.some((s) => s.id === id))
            fail(`basis span ${id} is not in the commentary unit`);
        }
      }
    }
  }
}

function checkEventLinks(folders: WorkFolder[], issues: string[]) {
  const units = new Map(folders.flatMap((f) => f.units.map((u) => [u.unit.id, u.unit] as const)));
  for (const folder of folders) {
    for (const file of folder.units) {
      for (const link of file.eventLinks ?? []) {
        const fail = (message: string) =>
          issues.push(`${folder.work.slug}/${file.unit.id}: event link ${link.id}: ${message}`);
        if (folder.work.genre !== 'SHARH') fail(`work ${folder.work.slug} is not a SHARH`);
        if (link.units.length < 2 || new Set(link.units).size !== link.units.length) {
          fail('needs two or more distinct units');
        }
        for (const id of link.units) {
          const target = units.get(id);
          if (!target) fail(`unknown unit ${id}`);
          else if (target.type !== 'hadith') fail(`${id} is a ${target.type}, not a hadith`);
        }
        if (link.basis.length === 0) fail('no basis span');
        for (const id of link.basis) {
          if (!file.spans.some((s) => s.id === id)) fail(`basis span ${id} is not in the unit`);
        }
      }
    }
  }
}

export function checkModel(folders: WorkFolder[], root: string) {
  const issues: string[] = [];
  const units = new Map(
    folders.flatMap((folder) =>
      folder.units.map((file) => [file.unit.id, { folder, file }] as const),
    ),
  );
  checkSharhLinks(folders, issues);
  checkEventLinks(folders, issues);
  for (const folder of folders) {
    const slug = folder.work.slug;
    if (!genres.includes(folder.work.genre)) issues.push(`${slug}: genre "${folder.work.genre}"`);
    const editions = folder.witnesses.map((w) => w.edition);
    if (new Set(editions).size !== editions.length) {
      issues.push(`${slug}: an edition has more than one witness`);
    }
    for (const file of folder.units) checkUnit(folder, file, root, issues, units);
  }
  return issues;
}
