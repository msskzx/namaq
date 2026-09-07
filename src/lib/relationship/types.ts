import translations from '@/components/language/translations';

export type NodeKind = 'person' | 'title' | 'battle' | 'event';
export type SubjectId = string;

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
