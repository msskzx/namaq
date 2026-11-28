import type { AppPerson, PersonLink } from './tarajim';

export type TieKind = 'parent' | 'child' | 'spouse' | 'sibling' | 'cousin' | 'companion' | 'accompanied';

export const TIE_KINDS: readonly TieKind[] = ['parent', 'spouse', 'child', 'sibling', 'cousin', 'companion', 'accompanied'];

const COST: Record<TieKind, number> = { parent: 1, child: 1, spouse: 1, sibling: 1, cousin: 2, companion: 3, accompanied: 3 };

const REVERSE: Record<TieKind, TieKind> = { parent: 'child', child: 'parent', spouse: 'spouse', sibling: 'sibling', cousin: 'cousin', companion: 'accompanied', accompanied: 'companion' };

const FIELD: Partial<Record<TieKind, keyof Pick<AppPerson, 'parents' | 'children' | 'spouses' | 'siblings' | 'cousins' | 'companionOf'>>> = {
  parent: 'parents', child: 'children', spouse: 'spouses', sibling: 'siblings', cousin: 'cousins', accompanied: 'companionOf',
};

export interface GraphNode {
  slug: string;
  name: string;
  sex?: 'MALE' | 'FEMALE';
  inApp: boolean;
}

export interface Tie {
  to: string;
  kind: TieKind;
  link: PersonLink;
  reversed?: true;
}

export interface PeopleGraph {
  nodes: Map<string, GraphNode>;
  ties: Map<string, Tie[]>;
}

export function peopleGraph(people: readonly AppPerson[]): PeopleGraph {
  const nodes = new Map<string, GraphNode>();
  const ties = new Map<string, Tie[]>();
  for (const person of people) nodes.set(person.slug, { slug: person.slug, name: person.name, sex: person.sex, inApp: true });
  const add = (from: string, tie: Tie) => {
    const list = ties.get(from) ?? [];
    if (!list.some((t) => t.to === tie.to && t.kind === tie.kind)) list.push(tie);
    ties.set(from, list);
  };
  for (const person of people) {
    for (const kind of TIE_KINDS) {
      const field = FIELD[kind];
      if (!field) continue;
      for (const link of person[field]) {
        if (link.slug === person.slug) continue;
        if (!nodes.has(link.slug)) nodes.set(link.slug, { slug: link.slug, name: link.name, sex: link.sex, inApp: link.inApp });
        add(person.slug, { to: link.slug, kind, link });
        add(link.slug, { to: person.slug, kind: REVERSE[kind], link, reversed: true });
      }
    }
  }
  return { nodes, ties };
}

export interface TieGroup {
  kind: TieKind;
  ties: Tie[];
}

export function tieGroups(graph: PeopleGraph, slug: string): TieGroup[] {
  const mine = graph.ties.get(slug) ?? [];
  return TIE_KINDS.map((kind) => ({ kind, ties: mine.filter((tie) => tie.kind === kind) })).filter((group) => group.ties.length > 0);
}

export interface Step {
  from: string;
  to: string;
  kind: TieKind;
  link: PersonLink;
}

function nearestFrom(graph: PeopleGraph, from: string, to?: string): Map<string, Step> {
  const best = new Map<string, number>([[from, 0]]);
  const back = new Map<string, Step>();
  const queue: string[][] = [[from]];
  for (let cost = 0; cost < queue.length; cost += 1) {
    for (const at of queue[cost] ?? []) {
      if (best.get(at)! < cost) continue;
      if (at === to) return back;
      for (const tie of graph.ties.get(at) ?? []) {
        const next = cost + COST[tie.kind] + (tie.link.disputed || tie.link.anonymous ? 3 : 0);
        if (next >= (best.get(tie.to) ?? Infinity)) continue;
        best.set(tie.to, next);
        back.set(tie.to, { from: at, to: tie.to, kind: tie.kind, link: tie.link });
        (queue[next] ??= []).push(tie.to);
      }
    }
  }
  return back;
}

function chainTo(back: Map<string, Step>, from: string, to: string): Step[] | undefined {
  if (!back.has(to)) return undefined;
  const steps: Step[] = [];
  for (let node = to; node !== from; node = back.get(node)!.from) steps.unshift(back.get(node)!);
  return steps;
}

export function chainBetween(graph: PeopleGraph, from: string, to: string): Step[] | undefined {
  if (from === to || !graph.nodes.has(from) || !graph.nodes.has(to)) return from === to ? [] : undefined;
  return chainTo(nearestFrom(graph, from, to), from, to);
}

export function joining(graph: PeopleGraph, picked: readonly string[]): { steps: Step[]; nodes: string[]; apart: string[] } {
  const steps: Step[] = [];
  const nodes = new Set<string>(picked.slice(0, 1));
  const apart: string[] = [];
  for (const other of picked.slice(1)) {
    const chain = chainBetween(graph, picked[0], other);
    if (!chain) {
      apart.push(other);
      nodes.add(other);
      continue;
    }
    for (const step of chain) {
      nodes.add(step.from);
      nodes.add(step.to);
      if (!steps.some((s) => (s.from === step.from && s.to === step.to) || (s.from === step.to && s.to === step.from))) steps.push(step);
    }
  }
  return { steps, nodes: [...nodes], apart };
}

export function tieWord(kind: TieKind, toSex: GraphNode['sex'], fromSex: GraphNode['sex']) {
  const f = toSex === 'FEMALE';
  const s = fromSex === 'FEMALE' ? 'ها' : 'ه';
  switch (kind) {
    case 'parent': return f ? `أم${s}` : `أبو${s}`;
    case 'child': return f ? `بنت${s}` : `ابن${s}`;
    case 'spouse': return f ? `زوجت${s}` : `زوج${s}`;
    case 'sibling': return f ? `أخت${s}` : `أخو${s}`;
    case 'cousin': return f ? `قريبت${s}` : `قريب${s}`;
    case 'companion': return f ? `صاحبت${s}` : `صاحب${s}`;
    case 'accompanied': return fromSex === 'FEMALE' ? `صَحِبَت${f ? 'ها' : 'ه'}` : `صَحِب${f ? 'ها' : 'ه'}`;
  }
}

export function lineWord(kind: TieKind, toSex: GraphNode['sex'], fromSex: GraphNode['sex']) {
  if (kind === 'companion') return toSex === 'FEMALE' ? 'صحابية' : 'صحابي';
  if (kind === 'accompanied') return fromSex === 'FEMALE' ? 'صحابية' : 'صحابي';
  return tieWord(kind, toSex, fromSex);
}

export function groupWord(kind: TieKind, sex: GraphNode['sex'], count = 2) {
  const s = sex === 'FEMALE' ? 'ها' : 'ه';
  switch (kind) {
    case 'parent': return `أبوا${s}`;
    case 'child': return `أولاد${s}`;
    case 'spouse': return sex === 'FEMALE' && count === 1 ? `زوج${s}` : `أزواج${s}`;
    case 'sibling': return `إخوت${s}`;
    case 'cousin': return `قرابت${s}`;
    case 'companion': return `صحابت${s}`;
    case 'accompanied': return sex === 'FEMALE' ? 'صحابية' : 'صحابي';
  }
}

export function tieOf(kind: TieKind, toSex: GraphNode['sex']) {
  const f = toSex === 'FEMALE';
  switch (kind) {
    case 'parent': return f ? 'أمُّ' : 'أبو';
    case 'child': return f ? 'بنتُ' : 'ابنُ';
    case 'spouse': return f ? 'زوجةُ' : 'زوجُ';
    case 'sibling': return f ? 'أختُ' : 'أخو';
    case 'cousin': return f ? 'قريبةُ' : 'قريبُ';
    case 'companion': return f ? 'صاحبةُ' : 'صاحبُ';
    case 'accompanied': return 'صاحبُ';
  }
}

export function tieName(graph: PeopleGraph, step: Step) {
  const from = graph.nodes.get(step.from)!;
  const to = graph.nodes.get(step.to)!;
  const [who, of] = step.kind === 'accompanied' ? [from, to] : [to, from];
  const f = who.sex === 'FEMALE';
  const kind = step.kind === 'accompanied' ? 'companion' : step.kind;
  const word = ({ parent: f ? 'أم' : 'أب', child: f ? 'بنت' : 'ابن', spouse: f ? 'زوجة' : 'زوج', sibling: f ? 'أخت' : 'أخ',
    cousin: f ? 'قريبة' : 'قريب', companion: f ? 'صحابية' : 'صحابي' } as const)[kind];
  const doubt = step.link.disputed ? ' على خلاف' : step.link.anonymous ? ' فيما قيل' : '';
  return { word: word + doubt, who: who.slug, of: of.slug };
}

export const genitive = (name: string) => name.replace(/^أب[وا](?= )/u, 'أبي').replace(/^ذو(?= )/u, 'ذي');

export function stepClause(graph: PeopleGraph, step: Step, nameOf: (node: GraphNode) => string = (n) => n.name) {
  const from = graph.nodes.get(step.from)!;
  const to = graph.nodes.get(step.to)!;
  const doubt = step.link.disputed ? ' على خلاف' : step.link.anonymous ? ' فيما قيل' : '';
  if (step.kind === 'accompanied') return `${nameOf(from)} ${tieOf('companion', from.sex)} ${genitive(nameOf(to))}${doubt}`;
  return `${nameOf(to)} ${tieOf(step.kind, to.sex)} ${genitive(nameOf(from))}${doubt}`;
}

export function chainSentence(graph: PeopleGraph, steps: readonly Step[], nameOf: (node: GraphNode) => string = (n) => n.name) {
  return [...steps].reverse().map((step) => stepClause(graph, step, nameOf)).join('، و');
}

export function linkedPairs(graph: PeopleGraph): { a: string; b: string; steps: Step[] }[] {
  const people = [...graph.nodes.values()].filter((node) => node.inApp).map((node) => node.slug).sort();
  const pairs: { a: string; b: string; steps: Step[] }[] = [];
  people.forEach((a, i) => {
    const back = nearestFrom(graph, a);
    for (const b of people.slice(i + 1)) {
      const steps = chainTo(back, a, b);
      if (steps && steps.length > 0) pairs.push({ a, b, steps });
    }
  });
  const family = pairs.filter((pair) => pair.steps.length > 1 && pair.steps.length <= 3 && pair.steps.every((step) => step.kind !== 'companion' && step.kind !== 'accompanied'));
  const through = pairs.filter((pair) => pair.steps.length > 1);
  return family.length ? family : through.length ? through : pairs;
}
