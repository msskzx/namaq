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
    if (last >= 0 && (last > 0 || !root) && current.ayat.length === 0 && current.children.length > 0 && differs(current, last)) {
      const taken = current.children.map(child => formFor(current, last, keys(child)));
      if (taken.every(Boolean)) {
        const children = current.children.map((child, i) => ({
          ...child,
          spelled: [...(last === 0 ? current.spelled ?? current.words : []), ...(child.spelled ?? child.words)],
          words: [taken[i]!, ...child.words],
          differs: [0, ...(child.differs ?? []).map(at => at + 1)],
          forms: sameForms(mapForms(child.forms, own => [taken[i]!, ...own])),
        }));
        if (last === 0) return children.flatMap(child => fold(child, false));
        current = { ...current, spelled: current.spelled ?? current.words, words: current.words.slice(0, last), forms: sameForms(mapForms(current.forms, own => own.slice(0, last))), differs: current.differs?.filter(at => at < last), children };
      }
    }
    return [{ ...current, children: current.children.flatMap(child => fold(child, false)) }];
  };
  const [tree] = fold(presentation.tree, true);
  return { ...presentation, tree, prefixes, offsets };
}
