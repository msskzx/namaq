import translations from '@/components/language/translations';

export type NodeKind = 'person' | 'title' | 'battle' | 'event';
export type SubjectId = string;

export const ALL_KINDS = ['person', 'title', 'battle', 'event'] as const;

// Battle and Event nodes are the least central to a first-time visit (most
// people come here for the family tree), so on a general-purpose graph
// (GraphCanvas's showSearch on) they start off, opt-in via the Node Kinds
// panel -- or by searching one by name, which GraphSearch treats as intent
// enough to switch its kind on. A scoped embed keeps its own naturally
// single-kind data included by default.
export const DEFAULT_KINDS: readonly NodeKind[] = ['person', 'title'];

export function subjectId(kind: NodeKind, slug: string): SubjectId {
  return `${kind}:${slug}`;
}

export function parseSubjectId(id: SubjectId): { kind: NodeKind; slug: string } {
  const separatorIndex = id.indexOf(':');
  return { kind: id.slice(0, separatorIndex) as NodeKind, slug: id.slice(separatorIndex + 1) };
}

export type RelationType = keyof typeof translations.en.relationTypes;

export interface StoredEdge {
  source: SubjectId;
  target: SubjectId;
  type: RelationType;
  status?: string[];
}
