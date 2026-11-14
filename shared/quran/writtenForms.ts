import type { Branch } from './branches';

export type WrittenForm = { word: string; keys: string[] };

const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');

// docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md
const chosenForms = (node: Pick<Branch, 'forms'>, index: number, lit?: ReadonlySet<string>) => {
  const all = Object.entries(node.forms ?? {}).filter(([, words]) => words[index] !== undefined);
  return lit && all.some(([key]) => lit.has(key)) ? all.filter(([key]) => lit.has(key)) : all;
};

export function writtenForms(node: Pick<Branch, 'forms'>, index: number, shared: string, lit?: ReadonlySet<string>): WrittenForm[] {
  const chosen = chosenForms(node, index, lit);
  const found = new Map<string, string[]>();
  for (const [key, words] of chosen) found.set(words[index], [...(found.get(words[index]) ?? []), key]);
  const forms = [...found].map(([word, keys]) => ({ word, keys })).sort((a, b) => b.keys.length - a.keys.length);
  if (forms.length === 0 || (forms.length > 1 && forms.every(form => isEnd(form.word)))) return [{ word: shared, keys: chosen.map(([key]) => key) }];
  return forms;
}

export type WrittenStrand = { words: string[]; keys: string[] };

/** The ways a node's ayat write its words `from` up to `to`, one strand per way, most ayat first: a braid where neighbouring words differ together. */
export function writtenStrands(node: Pick<Branch, 'forms'>, from: number, to: number, lit?: ReadonlySet<string>): WrittenStrand[] {
  const found = new Map<string, WrittenStrand>();
  for (const [key, words] of chosenForms(node, from, lit)) {
    const run = words.slice(from, to);
    const id = run.join(' ');
    found.set(id, { words: run, keys: [...(found.get(id)?.keys ?? []), key] });
  }
  return [...found.values()].sort((a, b) => b.keys.length - a.keys.length);
}

/** A node's words in order: single words, and runs of neighbouring words its ayat write differently, drawn as one braid. */
export type WrittenPiece = { kind: 'word'; index: number } | { kind: 'braid'; from: number; to: number };
export function writtenPieces(count: number, differs: (index: number) => boolean): WrittenPiece[] {
  const pieces: WrittenPiece[] = [];
  for (let i = 0; i < count; i++) {
    const last = pieces[pieces.length - 1];
    if (!differs(i)) pieces.push({ kind: 'word', index: i });
    else if (last?.kind === 'braid' && last.to === i) last.to = i + 1;
    else pieces.push({ kind: 'braid', from: i, to: i + 1 });
  }
  return pieces;
}
