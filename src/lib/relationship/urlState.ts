import { RELATION_ORDER } from './categories';
import { capKey, ExpansionAction, ExplorationCap, ExplorationInput } from './exploration';
import { ExpansionRelationId } from './expansion';
import { NodeKind, RelationType, SubjectId, parseSubjectId, subjectId } from './types';

const KNOWN_KINDS: ReadonlySet<string> = new Set(['person', 'title', 'battle', 'event']);
const LINEAGE_RELATION_IDS: ReadonlySet<string> = new Set(['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS']);
const KNOWN_RELATION_TYPES: ReadonlySet<string> = new Set(RELATION_ORDER);

export interface ExplorationUrlState {
  subjects: string[];
  expands: string[];
  filters: string[];
  caps?: string[];
  removed?: string[];
}

function parseSubjectParam(raw: string): SubjectId | null {
  const separatorIndex = raw.indexOf(':');
  if (separatorIndex === -1) return null;
  const kind = raw.slice(0, separatorIndex);
  const slug = raw.slice(separatorIndex + 1);
  if (!KNOWN_KINDS.has(kind) || !slug) return null;
  return subjectId(kind as NodeKind, slug);
}

function parseExpandParam(raw: string): ExpansionAction | null {
  const parts = raw.split(':');
  if (parts.length !== 3) return null;
  const [kind, slug, relation] = parts;
  if (!KNOWN_KINDS.has(kind) || !slug) return null;
  if (!LINEAGE_RELATION_IDS.has(relation) && !KNOWN_RELATION_TYPES.has(relation)) return null;
  return { subject: subjectId(kind as NodeKind, slug), relation: relation as ExpansionRelationId };
}

function parseCapParam(raw: string): ExplorationCap | null {
  const separatorIndex = raw.lastIndexOf(':');
  if (separatorIndex === -1) return null;
  const subject = parseSubjectParam(raw.slice(0, separatorIndex));
  const relation = raw.slice(separatorIndex + 1);
  if (!subject || !KNOWN_RELATION_TYPES.has(relation)) return null;
  return { subject, relation: relation as RelationType };
}

export function parseExplorationInput(state: ExplorationUrlState, targetSlug: string): ExplorationInput {
  const parsedRoots = Array.from(
    new Set(state.subjects.map(parseSubjectParam).filter((id): id is SubjectId => id !== null))
  );
  const roots = state.subjects.length > 0 ? parsedRoots : [subjectId('person', targetSlug)];
  const expansions = state.expands
    .map(parseExpandParam)
    .filter((action): action is ExpansionAction => action !== null);
  const globalFilters = Array.from(
    new Set(state.filters.filter((type): type is RelationType => KNOWN_RELATION_TYPES.has(type)))
  );
  const caps = dedupeBy(
    (state.caps ?? []).map(parseCapParam).filter((cap): cap is ExplorationCap => cap !== null),
    capKey
  );
  const removed = Array.from(
    new Set((state.removed ?? []).map(parseSubjectParam).filter((id): id is SubjectId => id !== null))
  );
  return { roots, expansions, globalFilters, caps, removed };
}

function dedupeBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const itemKey = key(item);
    if (seen.has(itemKey)) return false;
    seen.add(itemKey);
    return true;
  });
}

export function formatSubjectParam(id: SubjectId): string {
  return id;
}

export function formatExpandParam(action: ExpansionAction): string {
  return `${action.subject}:${action.relation}`;
}

export function formatCapParam(cap: ExplorationCap): string {
  return `${cap.subject}:${cap.relation}`;
}

export interface RouteFetchParams {
  ancestorsOf: string[];
  ancestorsOfBothParents: string[];
  descendantsOf: string[];
  relationSubjects: string[];
  relationTypes: string[];
}

export function buildRouteFetchParams(subjects: SubjectId[], expansions: ExpansionAction[]): RouteFetchParams {
  const ancestorsOf = new Set<string>();
  const ancestorsOfBothParents = new Set<string>();
  const descendantsOf = new Set<string>();
  const relationSubjects = new Set<SubjectId>(subjects);

  for (const action of expansions) {
    relationSubjects.add(action.subject);
    const { kind, slug } = parseSubjectId(action.subject);
    if (kind !== 'person') continue;
    if (action.relation === 'ANCESTORS') ancestorsOfBothParents.add(slug);
    else if (action.relation === 'PATERNAL_LINEAGE') ancestorsOf.add(slug);
    else if (action.relation === 'DESCENDANTS') descendantsOf.add(slug);
  }

  return {
    ancestorsOf: Array.from(ancestorsOf),
    ancestorsOfBothParents: Array.from(ancestorsOfBothParents),
    descendantsOf: Array.from(descendantsOf),
    relationSubjects: Array.from(relationSubjects),
    relationTypes: relationSubjects.size > 0 ? [...RELATION_ORDER] : [],
  };
}
