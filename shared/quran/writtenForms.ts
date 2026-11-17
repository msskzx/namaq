import type { Branch } from './branches';
import { bare } from './quranText/ayahWords';

/** `faint`: the stop signs only some of the form's ayat carry, drawn faded after the word until a path picks one ayah. */
export type WrittenForm = { word: string; keys: string[]; faint?: string };

const TAIL = /[\u06D6-\u06DB\u06DE\u06E9]+$/;

/** One way of writing a word that its ayat stop on differently: the signs all of them carry stay in the word, the rest go faint. */
function blend(words: Set<string>, plain: string): { word: string; faint?: string } {
  const tails = [...words].map(word => word.match(TAIL)?.[0] ?? '');
  if ([...words].some((word, i) => word.slice(0, word.length - tails[i].length) !== plain)) return { word: plain };
  const signs = [...new Set(tails.join(''))];
  const firm = signs.filter(sign => tails.every(tail => tail.includes(sign))).join('');
  const faint = signs.filter(sign => !firm.includes(sign)).join('');
  return faint ? { word: plain + firm, faint } : { word: plain + firm };
}

const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');

// docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md
const chosenForms = (node: Pick<Branch, 'forms'>, index: number, lit?: ReadonlySet<string>) => {
  const all = Object.entries(node.forms ?? {}).filter(([, words]) => words[index] !== undefined);
  return lit && all.some(([key]) => lit.has(key)) ? all.filter(([key]) => lit.has(key)) : all;
};

export function writtenForms(node: Pick<Branch, 'forms'>, index: number, shared: string, lit?: ReadonlySet<string>): WrittenForm[] {
  const chosen = chosenForms(node, index, lit);
  // Ayat that write a word alike but stop on it differently (a waqf sign on one) write it the same; the shared word keeps a sign
  // where all of them carry it and shows the others faint (owner 2026-11-17).
  const found = new Map<string, { words: Set<string>; keys: string[] }>();
  for (const [key, words] of chosen) {
    const at = found.get(bare(words[index])) ?? { words: new Set<string>(), keys: [] };
    found.set(bare(words[index]), { words: at.words.add(words[index]), keys: [...at.keys, key] });
  }
  const forms = [...found].map(([plain, { words, keys }]) => ({ ...(words.size === 1 ? { word: [...words][0] } : blend(words, plain)), keys })).sort((a, b) => b.keys.length - a.keys.length);
  if (forms.length === 0 || (forms.length > 1 && forms.every(form => isEnd(form.word)))) return [{ word: shared, keys: chosen.map(([key]) => key) }];
  return forms;
}

export type WrittenStrand = { words: string[]; keys: string[] };

/** The ways a node's ayat write its words `from` up to `to`, one strand per way, most ayat first: a braid where neighbouring words differ together. */
export function writtenStrands(node: Pick<Branch, 'forms'>, from: number, to: number, lit?: ReadonlySet<string>): WrittenStrand[] {
  const found = new Map<string, WrittenStrand>();
  for (const [key, words] of chosenForms(node, from, lit)) {
    const run = words.slice(from, to);
    const id = run.map(bare).join(' ');
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
