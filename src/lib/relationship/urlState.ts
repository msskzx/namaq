import { governingRelationType, RELATION_ORDER } from './categories';
import { ExpansionAction } from './exploration';
import { ExpansionRelationId } from './expansion';
import { NodeKind, SubjectId, parseSubjectId, subjectId } from './types';
import { ExplorationInput } from './exploration';

const KNOWN_KINDS: ReadonlySet<string> = new Set(['person', 'title', 'battle', 'event']);
const LINEAGE_RELATION_IDS: ReadonlySet<string> = new Set(['ANCESTORS', 'PATERNAL_LINEAGE', 'DESCENDANTS']);
const KNOWN_RELATION_TYPES: ReadonlySet<string> = new Set(RELATION_ORDER);

export const DEFAULT_FILTERS = RELATION_ORDER.filter(type => !['COMPANION_OF', 'PARTICIPATED_IN', 'INVOLVED_IN', 'PART_OF'].includes(governingRelationType(type)));

export interface ExplorationUrlState {
  subjects: string[];
  expands: string[];
  filters?: string[];
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

export function parseExplorationInput(state: ExplorationUrlState, targetSlug: string): ExplorationInput {
  const parsedRoots = Array.from(
    new Set(state.subjects.map(parseSubjectParam).filter((id): id is SubjectId => id !== null))
  );
  const roots = state.subjects.length > 0 ? parsedRoots : [subjectId('person', targetSlug)];
  const expansions = state.expands
    .map(parseExpandParam)
    .filter((action): action is ExpansionAction => action !== null);
  const governingFilters = new Set((state.filters ?? DEFAULT_FILTERS).map(governingRelationType));
  const globalFilters = RELATION_ORDER.filter(type => governingFilters.has(governingRelationType(type)));
  return { roots, expansions, globalFilters };
}

export function formatSubjectParam(id: SubjectId): string {
  return id;
}

export function formatExpandParam(action: ExpansionAction): string {
  return `${action.subject}:${action.relation}`;
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
