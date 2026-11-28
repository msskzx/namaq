import type { AppPerson } from './tarajim';
import slipsJson from './data/tarajim/nasabSlips.json';

const SLIPS: Record<string, { at: string; note: string }> = slipsJson.slips;

export interface LineName {
  name: string;
  bare: string;
  from: string;
}

export function bareName(name: string) {
  let bare = bareNames.get(name);
  if (bare === undefined) {
    if (bareNames.size > 50_000) bareNames.clear();
    bare = bareOf(name);
    bareNames.set(name, bare);
  }
  return bare;
}
const bareNames = new Map<string, string>();
const bareOf = (name: string) =>
  name.replace(/[ً-ْٰـ]/g, '').replace(/[أإآؤ]/g, 'ا').replace(/ئ/g, 'ي').replace(/ة/g, 'ه')
    .replace(/ى$/u, 'ي').replace(/\s+/g, ' ').trim();

const bareWords = (text: string) => text.split(/\s+/u).filter(Boolean).map(bareName);
export const namesHay = (person: { name: string; fullName?: { text: string }; kunya: { text: string }[]; laqab: { text: string }[] }) =>
  bareWords([person.name, person.fullName?.text, ...person.kunya.map(k => k.text), ...person.laqab.map(l => l.text)].filter(Boolean).join(' ')).join(' ');
export const matchesQuery = (hay: string, query: string) => bareWords(query).every(word => hay.includes(word));

const COMPOUND = /^(?:عبد|ابي|ابو|ام|ذي|ذو|امري|امرئ)$/u;

export function sameName(a: string, b: string) {
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (!long.includes(short)) return false;
  const words = long.split(' ');
  if (words.length > 2 && /^اب[ويا]$/u.test(words[0]) && words.slice(2).join(' ') === short) return true;
  return words.length === 2 && words[0] === short && !COMPOUND.test(short) && words[1].startsWith('ال');
}

const firstName = (name: string) => name.split(/\s+(?:بن|ابن|بنت)\s+/u)[0];
const link = (name: string, from: string): LineName => ({ name, bare: bareName(name), from });

function ownLine(person: AppPerson): LineName[] {
  const line = person.nasab.map((name) => link(name, person.slug));
  const mother = person.parents.find((parent) => parent.sex === 'FEMALE');
  const father = person.parents.find((parent) => parent.sex === 'MALE');
  const notFather = line.length > 1 && father && !sameName(line[1].bare, bareName(firstName(father.name)));
  if (father && notFather && (line.length === 2 || (mother && sameName(line[1].bare, bareName(firstName(mother.name)))))) {
    line.splice(1, line.length - 1, ...father.name.split(/\s+(?:بن|ابن)\s+/u).map((name) => link(name, person.slug)));
  }
  const slip = SLIPS[person.slug];
  if (slip) {
    const at = line.findIndex((n, i) => i > 0 && n.bare === bareName(slip.at));
    if (at > 0) line.splice(at);
  }
  if (line.length === 0) line.push(link(person.name, person.slug));
  if (line.length === 1) {
    const father = person.parents.find((parent) => parent.sex === 'MALE');
    if (father) line.push(link(firstName(father.name), person.slug));
  }
  return line;
}

const JOIN = 3;

function continuation(line: LineName[], other: LineName[]) {
  if (line.length < JOIN) return -1;
  const tail = line.slice(-JOIN).map((n) => n.bare);
  for (let j = JOIN - 1; j < other.length - 1; j += 1) {
    if (tail.every((bare, k) => sameName(other[j - (JOIN - 1) + k].bare, bare))) return j + 1;
  }
  return -1;
}

const fatherOf = (person: AppPerson) => person.parents.find((parent) => parent.sex === 'MALE')?.slug;

const ownLines = new WeakMap<readonly AppPerson[], Map<string, LineName[]>>();
function ownLinesOf(people: readonly AppPerson[]) {
  let lines = ownLines.get(people);
  if (!lines) {
    lines = new Map(people.map((p) => [p.slug, ownLine(p)]));
    ownLines.set(people, lines);
  }
  return lines;
}

export function lineOf(person: AppPerson, people: readonly AppPerson[]): LineName[] {
  let lines = fullLines.get(people);
  if (!lines) fullLines.set(people, lines = new Map());
  let line = lines.get(person.slug);
  if (!line) lines.set(person.slug, line = fullLineOf(person, people));
  return [...line];
}
const fullLines = new WeakMap<readonly AppPerson[], Map<string, LineName[]>>();

function fullLineOf(person: AppPerson, people: readonly AppPerson[]): LineName[] {
  const own = ownLinesOf(people);
  const line = [...own.get(person.slug)!];
  const father = fatherOf(person);
  if (father && own.has(father)) {
    line.splice(1, line.length - 1, ...own.get(father)!);
  } else if (father) {
    const kin = people.filter((p) => p.slug !== person.slug && fatherOf(p) === father)
      .map((p) => own.get(p.slug)!.slice(1))
      .sort((x, y) => y.length - x.length)[0];
    if (kin && kin.length > line.length - 1) line.splice(1, line.length - 1, ...kin);
  }
  const others = people.filter((p) => p.slug !== person.slug).map((p) => own.get(p.slug)!);
  for (let guard = 0; guard < people.length; guard += 1) {
    let best: LineName[] = [];
    for (const other of others) {
      const at = continuation(line, other);
      if (at > 0 && other.length - at > best.length) best = other.slice(at);
    }
    if (best.length === 0) break;
    line.push(...best);
  }
  return line;
}

const afterBin = (name: string) => name.replace(/(^|\s)أبو(?=\s)/gu, '$1أبي').replace(/(^|\s)ذو(?=\s)/gu, '$1ذي').replace(/(^|\s)امرؤ(?=\s)/gu, '$1امرئ');

export function chainOf(person: { sex?: string }, line: LineName[], to: number) {
  return line.slice(0, to + 1).map((n, k) => { const bare = n.name.replace(/[ً-ْٰـ]/g, ''); return k === 0 ? bare : afterBin(bare); })
    .reduce((text, name, k) => (k === 0 ? name : `${text} ${k === 1 && person.sex === 'FEMALE' ? 'بنت' : 'بن'} ${name}`), '');
}

const ABOVE = 2;

export function meetingOf(a: LineName[], b: LineName[]): { a: number; b: number } | undefined {
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      if (!sameName(b[j].bare, a[i].bare)) continue;
      const shared = Math.min(a.length - 1 - i, b.length - 1 - j, ABOVE);
      if (shared < 1) continue;
      let same = true;
      for (let k = 1; k <= shared; k += 1) if (!sameName(a[i + k].bare, b[j + k].bare)) same = false;
      if (same) return { a: i, b: j };
    }
  }
  return undefined;
}

export function boxName(name: string) {
  let box = boxNames.get(name);
  if (box === undefined) {
    if (boxNames.size > 50_000) boxNames.clear();
    boxNames.set(name, box = boxOf(name));
  }
  return box;
}
const boxNames = new Map<string, string>();
const boxOf = (name: string) =>
  name.replace(/[ً-ْٰـ]/g, '').trim()
    .replace(/(^|\s)(?:أبي|أبا)(?=\s)/gu, '$1أبو').replace(/(^|\s)(?:ذي|ذا)(?=\s)/gu, '$1ذو').replace(/(^|\s)امرئ(?=\s)/gu, '$1امرؤ');

export interface NasabNode {
  key: string;
  name: string;
  people: string[];
  children: NasabNode[];
}

export function nasabTree(picked: { slug: string; line: LineName[] }[]): NasabNode[] {
  const roots: NasabNode[] = [];
  const parentOf = new Map<NasabNode, NasabNode>();
  const placed: { line: LineName[]; nodes: NasabNode[] }[] = [];
  const node = (n: LineName): NasabNode => ({ key: n.bare, name: boxName(n.name), people: [], children: [] });
  const adopt = (parent: NasabNode, child: NasabNode) => {
    parent.children.push(child);
    parentOf.set(child, parent);
  };
  for (const { slug, line } of picked) {
    const nodes: NasabNode[] = new Array(line.length);
    let best: { i: number; j: number; with: (typeof placed)[number] } | undefined;
    for (const other of placed) {
      const at = meetingOf(line, other.line);
      if (at && (!best || at.a < best.i)) best = { i: at.a, j: at.b, with: other };
    }
    let top: number;
    if (best) {
      const { i, j, with: other } = best;
      let k = i;
      let at: NasabNode | undefined = other.nodes[j];
      for (; at && k < line.length; k += 1, at = parentOf.get(at)) nodes[k] = at;
      if (k < line.length) {
        const oldRoot = nodes[k - 1];
        let child = oldRoot;
        for (let up = k; up < line.length; up += 1) {
          nodes[up] = node(line[up]);
          adopt(nodes[up], child);
          child = nodes[up];
        }
        roots.splice(roots.indexOf(oldRoot), 1, nodes[line.length - 1]);
      }
      top = i;
    } else {
      top = line.length - 1;
      nodes[top] = node(line[top]);
      roots.push(nodes[top]);
    }
    for (let k = top - 1; k >= 0; k -= 1) {
      const parent = nodes[k + 1];
      const found = parent.children.find((c) => c.key === line[k].bare);
      nodes[k] = found ?? node(line[k]);
      if (!found) adopt(parent, nodes[k]);
    }
    if (!nodes[0].people.includes(slug)) nodes[0].people.push(slug);
    placed.push({ line, nodes });
  }
  return roots;
}

export function foldTop(root: NasabNode): { above: string[]; start: NasabNode } {
  const above: string[] = [];
  let node = root;
  while (node.children.length === 1 && node.people.length === 0) {
    above.unshift(node.name);
    node = node.children[0];
  }
  return { above, start: node };
}

export const FOLD_RUN = 3;

export function straightRun<T extends { children: T[] }>(node: T, picked: (node: T) => boolean): T[] {
  const run: T[] = [];
  for (let at = node; at.children.length === 1 && !picked(at) && !picked(at.children[0]); at = at.children[0]) run.push(at);
  return run;
}
