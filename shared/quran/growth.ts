import { keys, type Branch } from './branches';

export type GrowthStep = { key: string; nodes: number[]; fresh: number };

const position = (key: string) => key.split(':').map(Number);

export function byMushaf(a: string, b: string) {
  const [x, y] = [position(a), position(b)];
  return x[0] - y[0] || x[1] - y[1];
}

export function growthPlan(tree: Branch, starts: string[][] = []): GrowthStep[] {
  const index = new Map<Branch, number>();
  const visit = (node: Branch) => {
    index.set(node, index.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const holds = new Map<Branch, Set<string>>([...index.keys()].map(node => [node, new Set(keys(node))]));
  const drawn = new Set([-1]);
  const ordered = [...new Set([...index.keys()].flatMap(node => [...node.ayat].sort(byMushaf)))];
  const starting = starts.flatMap(group => ordered.filter(key => group.includes(key)));
  return [...new Set([...starting, ...ordered])].map(key => {
    const nodes = [-1];
    let node: Branch | undefined = tree;
    while ((node = node.children.find(child => holds.get(child)!.has(key)))) nodes.push(index.get(node)!);
    const fresh = nodes.findIndex(id => !drawn.has(id));
    nodes.forEach(id => drawn.add(id));
    return { key, nodes, fresh: fresh < 0 ? nodes.length : fresh };
  });
}

const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');
const letters = (word: string) => word.replace(/[أإآٱ]/g, 'ا').normalize('NFD').replace(/\u0640/g, '').replace(/[^\u0621-\u064A]/g, '');
const BASMALA = ['بسم', 'الله', 'الرحمن', 'الرحيم'];

export function cardWords(words: string[], afterEnd: boolean): { count: number; afterEnd: boolean } {
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    if (isEnd(words[i])) { afterEnd = true; continue; }
    if (afterEnd && BASMALA.every((word, j) => words[i + j] !== undefined && letters(words[i + j]) === word)) { i += BASMALA.length - 1; continue; }
    afterEnd = false;
    count++;
  }
  return { count, afterEnd };
}

export const ALL_WORDS = 10000;

export type StepWords = { start: number; prefix: number; nodes: number[] };
export function growthWords(tree: Branch, plan: GrowthStep[], { offsets = {}, prefixed = [] }: { offsets?: Record<string, number>; prefixed?: string[] } = {}): StepWords[] {
  const nodes = new Map<number, Branch>();
  const visit = (node: Branch) => { nodes.set(nodes.size - 1, node); node.children.forEach(visit); };
  visit(tree);
  return plan.map(step => {
    const prefix = offsets[step.key] ?? 0;
    let words = prefixed.includes(step.key) ? 0 : prefix;
    const start = words;
    words = prefix;
    let afterEnd = false;
    const counts = step.nodes.map(index => {
      const counted = cardWords(nodes.get(index)?.words ?? [], afterEnd);
      afterEnd = counted.afterEnd;
      return (words += counted.count);
    });
    return { start, prefix, nodes: counts };
  });
}
