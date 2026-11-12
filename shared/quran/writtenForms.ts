import type { Branch } from './branches';

export type WrittenForm = { word: string; keys: string[] };

const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');

// docs/adr/0035-a-tree-node-shows-words-only-as-the-mushaf-writes-them.md
export function writtenForms(node: Pick<Branch, 'forms'>, index: number, shared: string, lit?: ReadonlySet<string>): WrittenForm[] {
  const all = Object.entries(node.forms ?? {}).filter(([, words]) => words[index] !== undefined);
  const chosen = lit && all.some(([key]) => lit.has(key)) ? all.filter(([key]) => lit.has(key)) : all;
  const found = new Map<string, string[]>();
  for (const [key, words] of chosen) found.set(words[index], [...(found.get(words[index]) ?? []), key]);
  const forms = [...found].map(([word, keys]) => ({ word, keys })).sort((a, b) => b.keys.length - a.keys.length);
  if (forms.length === 0 || (forms.length > 1 && forms.every(form => isEnd(form.word)))) return [{ word: shared, keys: chosen.map(([key]) => key) }];
  return forms;
}
