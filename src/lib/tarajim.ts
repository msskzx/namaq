// The app's Tarajim on the website (owner, 2026-11-19: parity): the converted people of shared/data/tarajim/people.json,
// read on the server only (the file is big), and the views the app draws from them worked out here: a person's ties round
// him (mobile/src/components/TiesRing.tsx), the nasab tree (mobile/src/screens/nasab.tsx), the virtues (person.tsx), and
// the «من التراجم» and «صلة» feed cards. The client parts in src/components/tarajim draw what these return.
import peopleJson from '@shared/data/tarajim/people.json';
import { pageLabel, sayerLine, sourcesOf, type AppPerson, type PersonFact } from '@shared/tarajim';
import { bareName, chainOf, foldTop, lineOf, meetingOf, nasabTree, type NasabNode } from '@shared/tarajimLine';
import { chainSentence, groupWord, linkedPairs, peopleGraph, stepClause, tieGroups, tieWord, type GraphNode, type TieKind } from '@shared/tarajimGraph';
import { allVirtues } from '@shared/homeFeed';
import { kunyaFacts, laqabFacts, type NameFact } from '@shared/tarajimNames';
import { sourceById } from '@shared/sources';
import lifeData from '@shared/data/events/life.json';
import battlesData from '@shared/data/battles/battles.json';
import type { AppLife } from '@shared/events/life';
import type { AppBattle } from '@shared/battles/battle';
import { lifeColumns, personLifeItems, type LifeItem } from '@shared/events/lifeTimeline';

export const PROPHET = 'prophet-muhammad';

/** The Prophet ﷺ first, then the book's order, as the app lists them (mobile/src/lib/tarajim.ts). */
export const PEOPLE: AppPerson[] = (peopleJson as AppPerson[]).slice().sort((a, b) =>
  Number(b.slug === PROPHET) - Number(a.slug === PROPHET) || a.entry.volume - b.entry.volume || Number(a.entry.from) - Number(b.entry.from));
const bySlug = new Map(PEOPLE.map(person => [person.slug, person]));
export const findPerson = (slug: string) => bySlug.get(slug);
export const GRAPH = peopleGraph(PEOPLE);

/** The name to show: the Prophet with ﷺ, everyone else as the catalog names them. */
export const personName = (person: { slug: string; name: string }) =>
  (person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);
export const unvowelled = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
/** The name before «بن» or «بنت», for the short clause on a chain's line: «الزبير ابنُ صفية». */
const firstName = (node: GraphNode) => personName(node).split(/\s+بنت?\s+/u)[0];
/** A node's name on the ring: a long nasab after «بن» left out. */
const ringName = (node: GraphNode) => personName(node).replace(/\s+بن\s+.*$/u, rest => (rest.length > 18 ? '' : rest));

/** People whose name, full name, kunya or laqab holds the words typed, ignoring vowels and hamza forms (the app's searchPeople). */
export function searchPeople(query: string) {
  const words = bareName(query).split(/\s+/u).filter(Boolean);
  return PEOPLE.filter(person => {
    const hay = bareName([person.name, person.fullName?.text, ...person.kunya.map(k => k.text), ...person.laqab.map(l => l.text)].filter(Boolean).join(' '));
    return words.every(word => hay.includes(word));
  });
}

/** The pages a part rests on, with each book's edition and link (the Siyar, and Zad al-Ma'ad where it is cited): the app's Credit. */
export type Credit = { pages: string; label: string; books: { title: string; url: string; label: string }[]; quotes?: { text: string; pages: string }[] };
export function creditOf(facts: PersonFact[], quotes = false): Credit | undefined {
  const refs = facts.flatMap(fact => fact.refs);
  if (!refs.length) return undefined;
  const books = sourcesOf(refs).map(id => sourceById(id)).filter(book => book !== undefined)
    .map(book => ({ title: `${book.title.ar}، ${book.edition ?? ''}`, url: book.link.url, label: `${book.title.ar}، ${book.author?.ar ?? ''}` }));
  return {
    pages: pageLabel(refs), books, label: books.map(book => book.label).join(' · '),
    ...(quotes ? { quotes: facts.filter(fact => fact.text).map(fact => ({ text: fact.text!, pages: pageLabel(fact.refs) })) } : {}),
  };
}

export type PersonHead = { slug: string; name: string; sex?: 'MALE' | 'FEMALE' };
const head = (person: AppPerson): PersonHead => ({ slug: person.slug, name: personName(person), sex: person.sex });

/** A tie on the ring: what the person is to the one in the middle, and the book's sentence that states it. */
export type RingTie = { to: string; kind: TieKind; word: string; name: string; short: string; inApp: boolean; says: string; pages: string; reversed?: true };
export type RingGroup = { kind: TieKind; word: string; ties: RingTie[] };
export type TiesView = PersonHead & { groups: RingGroup[]; credit?: Credit };

/** A person's ties by kind, each person once, under the nearest kind (the app's tiesOf), ready to draw. */
export function tiesView(slug: string): TiesView | undefined {
  const person = findPerson(slug);
  if (!person) return undefined;
  const seen = new Set<string>();
  const groups = tieGroups(GRAPH, slug)
    .map(g => ({ ...g, ties: g.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
    .filter(g => g.ties.length > 0);
  return {
    ...head(person),
    groups: groups.map(g => ({
      kind: g.kind, word: groupWord(g.kind, person.sex, g.ties.length),
      ties: g.ties.map(tie => {
        const node = GRAPH.nodes.get(tie.to)!;
        return { to: tie.to, kind: tie.kind, word: tieWord(tie.kind, node.sex, person.sex), name: personName(node), short: ringName(node), inApp: node.inApp,
          says: tie.link.text || personName(node), pages: pageLabel(tie.link.refs), ...(tie.reversed ? { reversed: true as const } : {}) };
      }),
    })),
    credit: creditOf(groups.flatMap(g => g.ties.map(tie => tie.link))),
  };
}

/** One father in the tree, as nasabTree gives it, with the name to show and whether it is a picked person. */
export type NasabBox = { key: string; name: string; slug?: string; children: NasabBox[] };
export type NasabView = {
  people: PersonHead[];
  /** Each tree: the shared fathers above folded into a line (several people), and the tree from where they part. */
  trees: { key: string; above: string[]; start: NasabBox }[];
  /** Where the first person's line meets each other's, with both chains written out; none when they never meet. */
  meetings: { slug: string; at?: string; chains: string[]; apart: string }[];
  credit?: Credit;
};

const box = (node: NasabNode): NasabBox => ({
  key: node.key, name: unvowelled(node.name) + (node.people[0] === PROPHET ? ' ﷺ' : ''), ...(node.people[0] ? { slug: node.people[0] } : {}),
  children: node.children.map(box),
});

/** The nasab tree of `slugs` (the app's NasabTree): one person's line, or several that part where their nasabs part. */
export function nasabView(slugs: string[], meetings = true): NasabView {
  const lines = [...new Set(slugs)].filter(slug => findPerson(slug)).map(slug => ({ slug, line: lineOf(findPerson(slug)!, PEOPLE) }));
  const trees = nasabTree(lines).map((root, r) => {
    const { above, start } = lines.length > 1 ? foldTop(root) : { above: [], start: root };
    return { key: `${r}:${root.key}`, above: above.map(unvowelled), start: box(start) };
  });
  const first = lines[0];
  return {
    people: lines.map(({ slug }) => head(findPerson(slug)!)),
    trees,
    meetings: meetings && first ? lines.slice(1).map(other => {
      const at = meetingOf(first.line, other.line);
      return {
        slug: other.slug, ...(at ? { at: unvowelled(first.line[at.a].name) } : {}),
        chains: at ? [chainOf(findPerson(first.slug)!, first.line, at.a), chainOf(findPerson(other.slug)!, other.line, at.b)] : [],
        apart: `لا يلتقي ${personName(findPerson(first.slug)!)} و${personName(findPerson(other.slug)!)} فيما نقلته التراجم المضافة من نسبيهما.`,
      };
    }) : [],
    // Every entry a name on the page comes from: a line carried on through another entry rests on that entry's nasab too.
    credit: creditOf([...new Set(lines.flatMap(({ line }) => line.map(n => n.from)))].map(s => findPerson(s)?.fullName).filter(f => !!f)),
  };
}

/** One virtue as the entry gives it, with who says it (the app's Quote and Sayer). */
export type VirtueLine = { text: string; by?: string };
export type VirtuesView = PersonHead & { virtues: VirtueLine[]; credit?: Credit };

const sayerOf = (fact: PersonFact) => (fact.anonymous ? 'قيل' : fact.by.length ? sayerLine(fact) : undefined);
export function virtuesView(slug: string): VirtuesView | undefined {
  const person = findPerson(slug);
  if (!person) return undefined;
  return { ...head(person), virtues: person.virtues.map(fact => ({ text: fact.text ?? '', ...(sayerOf(fact) ? { by: sayerOf(fact) } : {}) })), credit: creditOf(person.virtues) };
}

/** A chain of ties between two people, as TiesChain draws it: the people and each line's clause. */
export type ChainView = { nodes: { slug: string; name: string; inApp: boolean }[]; steps: { from: string; to: string; kind: TieKind; clause: string }[]; first: string; picked: string[] };

/** The «من التراجم» card (a virtue) and the «صلة» card (two people and the chain that joins them), one a batch in turn. */
export type TarajimCard =
  | { slot: number; kind: 'tarajim'; person: PersonHead; virtue: VirtueLine; pages: string }
  | { slot: number; kind: 'tie'; a: PersonHead; b: PersonHead; chain: ChainView; sentence: string; pages: string };

let virtues: ReturnType<typeof allVirtues<AppPerson>> | undefined;
let pairs: ReturnType<typeof linkedPairs> | undefined;
const turnOf = (day: number, at: number, count: number) => ((((day * 41 + at) % count) + count) % count);

export function tarajimCards(day: number, slots: number[]): TarajimCard[] {
  virtues ??= allVirtues(PEOPLE);
  pairs ??= linkedPairs(GRAPH);
  return slots.flatMap((slot): TarajimCard[] => {
    const turn = Math.floor(slot / 2);
    if (slot % 2 === 0) {
      if (!virtues!.length) return [];
      const { person, index } = virtues![turnOf(day, turn, virtues!.length)];
      const fact = person.virtues[index];
      return [{ slot, kind: 'tarajim', person: head(person), virtue: { text: fact.text ?? '', ...(sayerOf(fact) ? { by: sayerOf(fact) } : {}) }, pages: pageLabel(fact.refs) }];
    }
    if (!pairs!.length) return [];
    const pair = pairs![turnOf(day, turn, pairs!.length)];
    const nodes = [...new Set(pair.steps.flatMap(step => [step.from, step.to]))];
    const node = (slug: string) => GRAPH.nodes.get(slug)!;
    return [{
      slot, kind: 'tie',
      a: { slug: pair.a, name: personName(node(pair.a)), sex: node(pair.a).sex }, b: { slug: pair.b, name: personName(node(pair.b)), sex: node(pair.b).sex },
      chain: {
        nodes: nodes.map(slug => ({ slug, name: personName(node(slug)), inApp: node(slug).inApp })),
        steps: pair.steps.map(step => ({ from: step.from, to: step.to, kind: step.kind, clause: stepClause(GRAPH, step, firstName) })),
        first: pair.a, picked: [pair.a, pair.b],
      },
      sentence: `${chainSentence(GRAPH, pair.steps, personName)}.`,
      pages: [...new Set(pair.steps.map(step => pageLabel(step.link.refs)))].join(' · '),
    }];
  });
}

/** A person's «حياته» rows (shared/events/lifeTimeline.ts), as the app's lib/life.ts reads them. */
export const personLife = (person: AppPerson): LifeItem[] => personLifeItems(person, (lifeData as AppLife)[person.slug] ?? [], slug => battleKinds.get(slug));
const battleKinds = new Map((battlesData as AppBattle[]).map(battle => [battle.slug, battle.kind?.value]));

/** What the person page draws for someone whose entry is converted: his name as the book writes it, his nasab tree, his life and his ties. */
export type DrawingsView = PersonHead & { fullName?: string; nasab: NasabView; life: LifeItem[]; ties?: TiesView };
export function drawingsView(slug: string): DrawingsView | undefined {
  const person = findPerson(slug);
  if (!person) return undefined;
  return { ...head(person), fullName: person.fullName?.text, nasab: nasabView([slug], false), life: personLife(person), ties: tiesView(slug) };
}

/** Lives side by side, for the website's «حياتهما» page. */
export function lifeCompare(slugs: string[]) {
  const people = slugs.map(findPerson).filter((p): p is AppPerson => !!p);
  return { people: people.map(head), places: lifeColumns(people.map(personLife)) };
}

/**
 * The «الألقاب» and «الكنى» cards (the app's NamePost), one of each a batch: a person's laqab or kunya, the person, the
 * book's words when they say more than the name, and the person page's folded reference.
 */
export type NameCard = { slot: number; kind: 'laqab' | 'kunya'; person: PersonHead; name: string; quote?: string; by?: string; credit?: Credit };
let nameLists: { laqab: NameFact[]; kunya: NameFact[] } | undefined;
const bare = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '').trim();
export function nameCards(day: number, slots: number[]): NameCard[] {
  nameLists ??= { laqab: laqabFacts(PEOPLE), kunya: kunyaFacts(PEOPLE) };
  return slots.flatMap(slot => (['laqab', 'kunya'] as const).flatMap((kind): NameCard[] => {
    const list = nameLists![kind];
    if (!list.length) return [];
    const { person, name, fact } = list[turnOf(day * 2 + (kind === 'kunya' ? 1 : 0), slot, list.length)];
    const quote = bare(fact.text) !== name ? { quote: fact.text, ...(fact.by.length ? { by: sayerLine(fact) } : {}) } : {};
    return [{ slot, kind, person: head(person), name, ...quote, credit: creditOf([fact]) }];
  }));
}
