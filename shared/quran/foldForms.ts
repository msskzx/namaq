import { keys, type Branch, type Variant } from './branches';
import { writtenForms } from './writtenForms';

type Presentation = { tree: Branch; prefixes: Variant[]; offsets: Record<string, number> };

const differs = (node: Branch, index: number) => writtenForms(node, index, node.words[index]).length > 1;

/** The one way `ayahKeys` write word `index` of `node`, or undefined when they write it differently. */
function formFor(node: Branch, index: number, ayahKeys: string[]) {
  const words = new Set(ayahKeys.map(key => node.forms?.[key]?.[index]));
  return words.size === 1 ? [...words][0] : undefined;
}

function sameForms(forms: Record<string, string[]> | undefined) {
  if (!forms) return undefined;
  return new Set(Object.values(forms).map(words => words.join(' '))).size > 1 ? forms : undefined;
}

const mapForms = (forms: Record<string, string[]> | undefined, change: (words: string[]) => string[]) =>
  forms && Object.fromEntries(Object.entries(forms).map(([key, words]) => [key, change(words)]));

/**
 * A word the node's ayat write differently moves into the neighbouring nodes when they already part the ayat the same way: the
 * first word of the trunk into the words before it, the last word of a node into its children. Each neighbour then shows its own
 * ayat's form, amber. A word the neighbours cannot take stays and is drawn as a braid. docs/adr/0036-a-word-written-differently-moves-to-its-neighbour.md
 */
export function foldForms<P extends Presentation>(presentation: P): P {
  let { prefixes, offsets } = presentation;
  const fold = (node: Branch, root: boolean): Branch[] => {
    let current: Branch = node;
    if (root && current.words.length > 1 && differs(current, 0) && prefixes.length > 0) {
      const taken = prefixes.map(prefix => formFor(current, 0, prefix.keys));
      if (taken.every(Boolean)) {
        prefixes = prefixes.map((prefix, i) => {
          const words = [...(prefix.words ?? (prefix.word ? prefix.word.split(' ') : [])), taken[i]!];
          return { ...prefix, words, word: words.join(' '), differs: [...(prefix.differs ?? []), words.length - 1], forms: sameForms(mapForms(prefix.forms, own => [...own, taken[i]!])) };
        });
        offsets = Object.fromEntries(Object.entries(offsets).map(([key, at]) => [key, at + 1]));
        current = { ...current, spelled: current.spelled ?? current.words, words: current.words.slice(1), forms: sameForms(mapForms(current.forms, own => own.slice(1))), differs: current.differs?.flatMap(at => at > 0 ? [at - 1] : []) };
      }
    }
    const last = current.words.length - 1;
    // A node that ends its ayat ends on the ayah's sign: the word written differently is the one before it, and moves with the sign
    // (owner, 2026-11-15: «ولهم عذاب أليم», 2:174 and 3:77, where أليم reads into the next ayah differently).
    const signed = last > 0 && (current.words[last] === '۝' || current.words[last].startsWith('﴿'));
    const from = signed ? last - 1 : last;
    if (from >= 0 && (from > 0 || !root) && current.ayat.length === 0 && current.children.length > 0 && differs(current, from)) {
      const taken = current.children.map(child => formFor(current, from, keys(child)));
      // The sign moves with it: a child whose ayat share one number shows that number; each ayah keeps its own forms.
      const moved = (child: Branch, i: number) => [taken[i]!, ...current.words.slice(from + 1).map((word, at) => formFor(current, from + 1 + at, keys(child)) ?? word)];
      const formsOf = (child: Branch, i: number) => sameForms(Object.fromEntries(keys(child).map(key => [key, [...(current.forms?.[key]?.slice(from) ?? moved(child, i)), ...(child.forms?.[key] ?? child.words)]])));
      if (taken.every(Boolean)) {
        const children = current.children.map((child, i) => ({
          ...child,
          spelled: [...(from === 0 ? current.spelled ?? current.words : []), ...(child.spelled ?? child.words)],
          words: [...moved(child, i), ...child.words],
          differs: [0, ...(child.differs ?? []).map(at => at + moved(child, i).length)],
          forms: formsOf(child, i),
        }));
        if (from === 0) return children.flatMap(child => fold(child, false));
        current = { ...current, spelled: current.spelled ?? current.words, words: current.words.slice(0, from), forms: sameForms(mapForms(current.forms, own => own.slice(0, from))), differs: current.differs?.filter(at => at < from), children };
      }
    }
    return [{ ...current, children: current.children.flatMap(child => fold(child, false)) }];
  };
  const [tree] = fold(presentation.tree, true);
  return { ...presentation, tree, prefixes, offsets };
}
