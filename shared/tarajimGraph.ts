import type { AppPerson, PersonLink } from './tarajim';

/**
 * The people graph (owner, 2026-11-18; sketch tarajim-app/graph/sketch-dark.png and sketch2-dark.png): built from the
 * ties the converted entries state, and nothing else. A person in the middle with his ties grouped by kind, and the
 * nearest chain of ties between people the reader picks. People the entries name who are not converted yet are nodes
 * too (they join two converted people), but they have no page.
 */
/**
 * `companion`: «to is my companion» (Abu Bakr to the Prophet ﷺ); `accompanied`: «to is the one I was a companion of» (the
 * Prophet ﷺ to Abu Bakr). An entry's «صاحب النبي» states the second, so companionship is one-way, unlike kinship.
 */
export type TieKind = 'parent' | 'child' | 'spouse' | 'sibling' | 'cousin' | 'companion' | 'accompanied';

/** The kinds in the order the person view draws them. */
export const TIE_KINDS: readonly TieKind[] = ['parent', 'spouse', 'child', 'sibling', 'cousin', 'companion', 'accompanied'];

/** A family tie is nearer than companionship, so the chain between two people prefers it (sketch, screen 2). */
const COST: Record<TieKind, number> = { parent: 1, child: 1, spouse: 1, sibling: 1, cousin: 2, companion: 3, accompanied: 3 };

/** The reverse of each kind: A is B's parent when B is A's child. */
const REVERSE: Record<TieKind, TieKind> = { parent: 'child', child: 'parent', spouse: 'spouse', sibling: 'sibling', cousin: 'cousin', companion: 'accompanied', accompanied: 'companion' };

/** The entry's field each kind is read from; `companion` is only ever read backwards from the companion's own entry. */
const FIELD: Partial<Record<TieKind, keyof Pick<AppPerson, 'parents' | 'children' | 'spouses' | 'siblings' | 'cousins' | 'companionOf'>>> = {
  parent: 'parents', child: 'children', spouse: 'spouses', sibling: 'siblings', cousin: 'cousins', accompanied: 'companionOf',
};

export interface GraphNode {
  slug: string;
  name: string;
  sex?: 'MALE' | 'FEMALE';
  /** Converted, so it has a page and its own ties. */
  inApp: boolean;
}

/** One tie from a node: `to` is the node's `kind` («to is my parent»), with the link that states it. */
export interface Tie {
  to: string;
  kind: TieKind;
  link: PersonLink;
  /** Stated in the other person's entry, read backwards («his son» in the father's entry is «his father» here). */
  reversed?: true;
}

export interface PeopleGraph {
  nodes: Map<string, GraphNode>;
  ties: Map<string, Tie[]>;
}

/** The graph of every tie the converted entries state, each tie both ways once. */
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

/** A person's ties by kind, in the drawing's order; a kind with none is left out. */
export function tieGroups(graph: PeopleGraph, slug: string): TieGroup[] {
  const mine = graph.ties.get(slug) ?? [];
  return TIE_KINDS.map((kind) => ({ kind, ties: mine.filter((tie) => tie.kind === kind) })).filter((group) => group.ties.length > 0);
}

/** One step of a chain: from `from`, `to` is his `kind`. */
export interface Step {
  from: string;
  to: string;
  kind: TieKind;
  link: PersonLink;
}

/** The nearest chain of ties from one person to another (family before companionship), or undefined when none is stated. */
export function chainBetween(graph: PeopleGraph, from: string, to: string): Step[] | undefined {
  if (from === to || !graph.nodes.has(from) || !graph.nodes.has(to)) return from === to ? [] : undefined;
  // Dijkstra over small integer costs: a list per cost is enough at a few thousand nodes.
  const best = new Map<string, number>([[from, 0]]);
  const back = new Map<string, Step>();
  const queue: string[][] = [[from]];
  for (let cost = 0; cost < queue.length; cost += 1) {
    for (const at of queue[cost] ?? []) {
      if (best.get(at)! < cost) continue;
      if (at === to) {
        const steps: Step[] = [];
        for (let node = to; node !== from; node = back.get(node)!.from) steps.unshift(back.get(node)!);
        return steps;
      }
      for (const tie of graph.ties.get(at) ?? []) {
        // A tie stated «على خلاف» or by an unnamed «قيل» is the far way round when a settled one joins them too.
        const next = cost + COST[tie.kind] + (tie.link.disputed || tie.link.anonymous ? 3 : 0);
        if (next >= (best.get(tie.to) ?? Infinity)) continue;
        best.set(tie.to, next);
        back.set(tie.to, { from: at, to: tie.to, kind: tie.kind, link: tie.link });
        (queue[next] ??= []).push(tie.to);
      }
    }
  }
  return undefined;
}

/**
 * The small graph joining the people picked (sketch2, screen 7): the chains from the first to each of the others,
 * merged, so a person on two chains is drawn once. Those with no chain to the first come back in `apart`.
 */
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

/** What `to` is to `from`, in the words the sentence uses: «أبوه», «زوجته»… («ـه» or «ـها» after `from`'s sex). */
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
    // «صَحِبَه»: `from` was `to`'s companion, said from `from`'s side.
    case 'accompanied': return fromSex === 'FEMALE' ? `صَحِبَت${f ? 'ها' : 'ه'}` : `صَحِب${f ? 'ها' : 'ه'}`;
  }
}

/** The names of the groups in the person view: «أبواه», «أزواجه», «أولاده»… */
export function groupWord(kind: TieKind, sex: GraphNode['sex'], count = 2) {
  const s = sex === 'FEMALE' ? 'ها' : 'ه';
  switch (kind) {
    case 'parent': return `أبوا${s}`;
    case 'child': return `أولاد${s}`;
    case 'spouse': return sex === 'FEMALE' && count === 1 ? `زوج${s}` : `أزواج${s}`;
    case 'sibling': return `إخوت${s}`;
    case 'cousin': return `قرابت${s}`;
    case 'companion': return `صحب${s}`;
    case 'accompanied': return sex === 'FEMALE' ? 'صَحِبَت' : 'صَحِبَ';
  }
}

/** What `to` is to someone named after it: «أمُّ», «زوجُ», «ابنُ»… (the construct form, before a name). */
export function tieOf(kind: TieKind, toSex: GraphNode['sex']) {
  const f = toSex === 'FEMALE';
  switch (kind) {
    case 'parent': return f ? 'أمُّ' : 'أبو';
    case 'child': return f ? 'بنتُ' : 'ابنُ';
    case 'spouse': return f ? 'زوجةُ' : 'زوجُ';
    case 'sibling': return f ? 'أختُ' : 'أخو';
    case 'cousin': return f ? 'قريبةُ' : 'قريبُ';
    case 'companion': return f ? 'صاحبةُ' : 'صاحبُ';
    // Said the other way round in the sentence (chainSentence): «أبو بكر صاحبُ محمد ﷺ».
    case 'accompanied': return 'صاحبُ';
  }
}

/** A name after a word that governs it («أمُّ أبي العاص», «من أبي سفيان»): a leading kunya or «ذو» in the genitive. */
export const genitive = (name: string) => name.replace(/^أب[وا](?= )/u, 'أبي').replace(/^ذو(?= )/u, 'ذي');

/** A chain as one sentence, each step «صفية بنت عبد المطلب أمُّ الزبير بن العوام»: «… ، و…»; a disputed tie says so. */
export function chainSentence(graph: PeopleGraph, steps: readonly Step[], nameOf: (node: GraphNode) => string = (n) => n.name) {
  return steps.map((step) => {
    const from = graph.nodes.get(step.from)!;
    const to = graph.nodes.get(step.to)!;
    const doubt = step.link.disputed ? ' على خلاف' : step.link.anonymous ? ' فيما قيل' : '';
    // «to is the one `from` accompanied» reads from the companion's side: «أبو بكر صاحبُ محمد ﷺ».
    if (step.kind === 'accompanied') return `${nameOf(from)} ${tieOf('companion', from.sex)} ${genitive(nameOf(to))}${doubt}`;
    return `${nameOf(to)} ${tieOf(step.kind, to.sex)} ${genitive(nameOf(from))}${doubt}`;
  }).join('، و');
}

/**
 * The pairs of converted people the «صلة» feed card shows (owner, 2026-11-18): those joined through one or two others by
 * family ties, since a tie the person page already lists says nothing new. While no such pair exists, any longer chain,
 * then the direct ties.
 */
export function linkedPairs(graph: PeopleGraph): { a: string; b: string; steps: Step[] }[] {
  const people = [...graph.nodes.values()].filter((node) => node.inApp).map((node) => node.slug).sort();
  const pairs: { a: string; b: string; steps: Step[] }[] = [];
  people.forEach((a, i) => {
    for (const b of people.slice(i + 1)) {
      const steps = chainBetween(graph, a, b);
      if (steps && steps.length > 0) pairs.push({ a, b, steps });
    }
  });
  // Short family chains say something: two of the Prophet's ﷺ companions joined only through him say nothing new, and a
  // chain of six ties is too long to read on a card.
  const family = pairs.filter((pair) => pair.steps.length > 1 && pair.steps.length <= 3 && pair.steps.every((step) => step.kind !== 'companion' && step.kind !== 'accompanied'));
  const through = pairs.filter((pair) => pair.steps.length > 1);
  return family.length ? family : through.length ? through : pairs;
}
