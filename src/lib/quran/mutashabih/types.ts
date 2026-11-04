import type { WordFeatures } from '../branches';
import type { PhraseGroup, PhraseOccurrence } from '../phraseTrees';

export const TAGS = {
  inversion: { ar: 'على نظم وعكسه', en: 'Reversed arrangement' },
  addition_omission: { ar: 'زيادة ونقصان', en: 'Addition and omission' },
  order: { ar: 'تقديم وتأخير', en: 'Word order' },
  definiteness: { ar: 'تعريف وتنكير', en: 'Definiteness' },
  number: { ar: 'جمع وإفراد', en: 'Number' },
  particle: { ar: 'إبدال حرف', en: 'Particle replacement' },
  word: { ar: 'إبدال كلمة', en: 'Word replacement' },
  assimilation: { ar: 'إدغام وتركه', en: 'Assimilation' },
  gender: { ar: 'تذكير وتأنيث', en: 'Gender', extension: true },
  pronoun: { ar: 'إظهار وإضمار', en: 'Noun and pronoun', extension: true },
  case: { ar: 'رفع ونصب', en: 'Case', extension: true },
  frame: { ar: 'قالب واحد', en: 'Same frame', extension: true },
};

export const KINDS = {
  identical: { ar: 'تطابق تام', en: 'Identical' },
  shared_phrase: { ar: 'عبارة مشتركة', en: 'Shared phrase' },
  mutashabih_lafzi: { ar: 'متشابه لفظي', en: 'Verbal parallel' },
  same_frame: { ar: 'قالب واحد', en: 'Same frame' },
};

export type Tag = keyof typeof TAGS;
export type Kind = keyof typeof KINDS;
export type Level = 'exact' | 'letters' | 'lemma' | 'root';
export type Position = { key: string; index: number };
export type Word = Position & { features?: WordFeatures; text: string; letters: string; lemma?: string; root?: string; conj?: string; base: string };
export type Column = { a?: Position; b?: Position; level?: Level; tags: Tag[] };
export type Place = PhraseOccurrence & { through?: string };
export type Citation = { id: string; book: string; edition: string; locator: string; quote: string; url: string; places: string[]; tags: Tag[] };
export type Comparison = { columns: Column[]; tags: Tag[]; score: number; coverage: number; kind?: Kind; spans: [Place, Place] };

export type Group = {
  id: string;
  text: string;
  places: Place[];
  tree: PhraseGroup;
  kind: Kind;
  tags: Tag[];
  differences: Record<string, number[]>;
  score: number;
  citations: Citation[];
  detail?: string;
  columns: { a: string; b: string; columns: Column[] }[];
};

