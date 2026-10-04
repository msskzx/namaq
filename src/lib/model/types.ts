// docs/plans/data-model/plan.md, section 2
import type { Span } from './span';

export const genres = ['TARAJEM', 'SIRA', 'HADITH', 'SHARH', 'TAFSIR', 'HISTORY'] as const;
export const voices = ['AUTHOR', 'TRANSMITTED', 'EDITOR_NOTE', 'REPORTED_ANONYMOUS'] as const;
export const statementRoles = [
  'AUTHOR_REPORT',
  'AUTHOR_SYNTHESIS',
  'TRANSMITTED',
  'EDITOR_ANALYSIS',
] as const;
export const basisRoles = [
  'EDITOR_NOTE',
  'RIJAL_ENTRY',
  'SAME_WORK_EXPLICIT',
  'NASAB',
  'COMMENTATOR_NOTE',
] as const;
export const predicates = [
  'name.full',
  'name.kunya',
  'name.laqab',
  'appearance',
  'virtue',
  'born.year',
  'died.year',
  'died.place',
  'islam.age',
  'CHILD_OF',
  'MARRIED',
  'PARTICIPATED_IN',
  'ABSENT_FROM',
  'title',
  'EXPLAINS_AYAH',
  'is-sahabi',
  'sex',
  'PATERNAL_COUSIN',
] as const;

export const mentionRoles = ['SPEAKER', 'NARRATOR', 'SUBJECT', 'REFERENT'] as const;
export const chainStates = ['COMPLETE', 'DEFERRED'] as const;
export const layers = ['MAIN', 'NOTES'] as const;
export const identificationStatuses = ['PROPOSED', 'DISPUTED', 'REJECTED'] as const;
export const assertionStatuses = ['LEGACY', 'PROPOSED', 'DISPUTED', 'REJECTED'] as const;

export type Genre = (typeof genres)[number];
export type Voice = (typeof voices)[number];
export type StatementRole = (typeof statementRoles)[number];
export type BasisRole = (typeof basisRoles)[number];
export type Predicate = (typeof predicates)[number];

export interface Work {
  slug: string;
  author: string;
  genre: Genre;
}

export interface Edition {
  slug: string;
  work: string;
  publisher: string;
  editors: string[];
  printing: string;
}

export interface Witness {
  slug: string;
  edition: string;
  vowelled: boolean;
  hasFootnotes: boolean;
  checkedAgainstPrint: boolean;
}

export interface SpanRecord extends Span {
  id: string;
  edition: string;
  volume: number;
  page: string;
  layer: 'MAIN' | 'NOTES';
}

export interface Unit {
  id: string;
  work: string;
  type: string;
  numbers: Record<string, string>;
}

export interface Turn {
  id: string;
  ordinal: number;
  speaker?: string;
  derivedBy?: string;
  addressee?: string;
  spans: string[];
}

export interface Scene {
  ordinal: number;
  inTurn?: string;
  turns: Turn[];
}

export interface Report {
  id: string;
  unit: string;
  ordinal: number;
  voice: Voice;
  voiceBasis?: string;
  frame?: string[];
  isnadSpan?: string;
  scenes?: Scene[];
  origin: { mention: string } | { workAuthor: true };
  chainState: 'COMPLETE' | 'DEFERRED';
}

export interface Statement {
  id: string;
  report: string;
  spans: string[];
  role: StatementRole;
}

export interface Mention {
  id: string;
  parent: string;
  exact: string;
  occurrence: number;
  role: 'SPEAKER' | 'NARRATOR' | 'SUBJECT' | 'REFERENT';
}

export interface Identification {
  id: string;
  mention: string;
  agent: string;
  basis: { span: string; role: BasisRole }[];
  status: 'PROPOSED' | 'DISPUTED' | 'REJECTED';
}

export type AssertionValue =
  | { spans: string[] }
  | { object: string }
  | { parsed: number; spans: string[] }
  | { classified: string; spans: string[] };

export interface Assertion {
  id: string;
  subject: string;
  predicate: Predicate;
  value: AssertionValue;
  restsOn: string[];
  status: 'LEGACY' | 'PROPOSED' | 'DISPUTED' | 'REJECTED';
}

export interface SharhLink {
  id: string;
  explains: string;
  basis: string[];
}

export interface UnitFile {
  unit: Unit;
  spans: SpanRecord[];
  reports: Report[];
  statements: Statement[];
  mentions: Mention[];
  identifications: Identification[];
  assertions: Assertion[];
  sharhLinks?: SharhLink[];
}

export interface WorkFolder {
  work: Work;
  editions: Edition[];
  witnesses: Witness[];
  units: UnitFile[];
}
