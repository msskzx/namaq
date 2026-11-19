import type { AppPerson } from './tarajim';
import slipsJson from './data/tarajim/nasabSlips.json';

/** Printing slips in a nasab (shared/data/tarajim/nasabSlips.json): the line stops before the slipped name. */
const SLIPS: Record<string, { at: string; note: string }> = slipsJson.slips;

/**
 * A person's line of fathers for the nasab tree (owner, 2026-11-18), read from the converted entries only.
 * Each entry prints the nasab as far as al-Dhahabi took it: al-Zubayr's stops at «غالب», al-Abbas's heading names no
 * father at all. Where a line stops, it is carried on by another entry that names the same fathers, so al-Zubayr reaches
 * «عدنان» through the Prophet's ﷺ nasab. Names stay as printed; matching ignores vowels and hamza forms.
 */
export interface LineName {
  /** The name as the entry prints it. */
  name: string;
  /** The name bare, for matching (bareName). */
  bare: string;
  /** The entry whose nasab gave this name. */
  from: string;
}

/** A name with no vowels, tatweel or hamza seat, for matching («عَمْرٍو» = «عَمْرِو», «أبي» = «ابي», «مرة» = «مره», «لؤي» = «لأي»). */
export function bareName(name: string) {
  return name.replace(/[ً-ْٰـ]/g, '').replace(/[أإآؤ]/g, 'ا').replace(/ئ/g, 'ي').replace(/ة/g, 'ه')
    .replace(/ى$/u, 'ي').replace(/\s+/g, ' ').trim();
}

/** Each word of a text bare, so a final «ى» inside a phrase («أبو يحيى بن») matches as it does at the end. */
const bareWords = (text: string) => text.split(/\s+/u).filter(Boolean).map(bareName);
/** What a people search looks in: the name, full name, kunyas and laqabs, bare. */
export const namesHay = (person: { name: string; fullName?: { text: string }; kunya: { text: string }[]; laqab: { text: string }[] }) =>
  bareWords([person.name, person.fullName?.text, ...person.kunya.map(k => k.text), ...person.laqab.map(l => l.text)].filter(Boolean).join(' ')).join(' ');
/** Whether a `namesHay` holds every word typed: the people search of the app and the website. */
export const matchesQuery = (hay: string, query: string) => bareWords(query).every(word => hay.includes(word));

/** The first word of a name of two words («عبد الله», «أبي طالب»), which is no name with a laqab after it. */
const COMPOUND = /^(?:عبد|ابي|ابو|ام|ذي|ذو|امري|امرئ)$/u;

/**
 * Two bare names for the same father: the same, or one the other with a laqab after it («مالك الأغر» is «مالك»).
 * Never for a name of two words («عبد الله» is not «عبد»), and the added word must be a laqab («ال…»). A kunya
 * before the name («أبي أحيحة سعيد» is «سعيد») is the same man too.
 */
export function sameName(a: string, b: string) {
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  const words = long.split(' ');
  // A kunya before the name is the same man: Sa'id ibn al-As's grandfather «أبي أحيحة سعيد» is Khalid's father «سعيد».
  if (words.length > 2 && /^اب[ويا]$/u.test(words[0]) && words.slice(2).join(' ') === short) return true;
  return words.length === 2 && words[0] === short && !COMPOUND.test(short) && words[1].startsWith('ال');
}

/** The father's name from a link's name: «عبد المطلب بن هاشم» → «عبد المطلب». */
const firstName = (name: string) => name.split(/\s+(?:بن|ابن|بنت)\s+/u)[0];
const link = (name: string, from: string): LineName => ({ name, bare: bareName(name), from });

function ownLine(person: AppPerson): LineName[] {
  const line = person.nasab.map((name) => link(name, person.slug));
  // A heading that names him by his mother («صفوان ابن بيضاء», «ابن أم مكتوم») or a forefather, not his father: when
  // the entry names his father, his line goes on through him as the entry names him («وهب بن ربيعة بن هلال»).
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

/** How many of a line's last names must match another line's for the line to go on in it. */
const JOIN = 3;

/**
 * Where `line` can go on in `other`: the index in `other` just after the line's last name, when the line's last three
 * names are three names in a row in `other`. One or two common names («عبد مناف» is two men in the Prophet's ﷺ nasab,
 * «عبد الله» is many) never join two lines alone.
 */
function continuation(line: LineName[], other: LineName[]) {
  if (line.length < JOIN) return -1;
  const tail = line.slice(-JOIN).map((n) => n.bare);
  for (let j = JOIN - 1; j < other.length - 1; j += 1) {
    if (tail.every((bare, k) => sameName(other[j - (JOIN - 1) + k].bare, bare))) return j + 1;
  }
  return -1;
}

const fatherOf = (person: AppPerson) => person.parents.find((parent) => parent.sex === 'MALE')?.slug;

/** The people's own lines, once per list of people. */
const ownLines = new WeakMap<readonly AppPerson[], Map<string, LineName[]>>();
function ownLinesOf(people: readonly AppPerson[]) {
  let lines = ownLines.get(people);
  if (!lines) {
    lines = new Map(people.map((p) => [p.slug, ownLine(p)]));
    ownLines.set(people, lines);
  }
  return lines;
}

/**
 * The person's fathers from the person up, carried on through the other converted entries as far as they go. Kin the
 * entries name as the same man come first: the father's own entry always carries the line; else a brother whose entry
 * names the same father (by slug) carries it when his goes further (al-Abbas's heading names no father; Amr ibn Sa'id's
 * stops at «العاص»). Then three names in a row matching another entry's line carry it on.
 */
export function lineOf(person: AppPerson, people: readonly AppPerson[]): LineName[] {
  const own = ownLinesOf(people);
  const line = [...own.get(person.slug)!];
  const father = fatherOf(person);
  if (father && own.has(father)) {
    // The father's own entry carries the line, whatever the son's heading prints: a heading may shorten the nasab
    // («معاذ بن عمرو بن الجموح بن كعب» skips زيد and حرام, which his father's entry prints).
    line.splice(1, line.length - 1, ...own.get(father)!);
  } else if (father) {
    // A brother whose entry names the same father (by slug, so the same man) carries a line his own stops short of.
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

/** The fathers' chain from a person up to index `to`, unvowelled: «بنت» after a woman's name, «بن» between the rest. */
export function chainOf(person: { sex?: string }, line: LineName[], to: number) {
  return line.slice(0, to + 1).map((n) => n.name.replace(/[ً-ْٰـ]/g, ''))
    .reduce((text, name, k) => (k === 0 ? name : `${text} ${k === 1 && person.sex === 'FEMALE' ? 'بنت' : 'بن'} ${name}`), '');
}

/** How many fathers above a meeting must agree for two lines to meet there. */
const ABOVE = 2;

/**
 * Where two lines meet: the first father of `a` that `b` names too, with the next fathers above him the same in both
 * (two where both lines go that far, at least one). Only the nearest fathers are compared, so a spelling that differs
 * far up the line does not move the meeting. `a` and `b` are the indexes of that father in each line; undefined when
 * they do not meet in what the entries print.
 */
export function meetingOf(a: LineName[], b: LineName[]): { a: number; b: number } | undefined {
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      if (!sameName(b[j].bare, a[i].bare)) continue;
      const shared = Math.min(a.length - 1 - i, b.length - 1 - j, ABOVE);
      // One name alone with nothing above it to agree on is not a meeting.
      if (shared < 1) continue;
      let same = true;
      for (let k = 1; k <= shared; k += 1) if (!sameName(a[i + k].bare, b[j + k].bare)) same = false;
      if (same) return { a: i, b: j };
    }
  }
  return undefined;
}

/** One father in the nasab tree: his name, the people picked whose line ends at him (they are he), and his sons on the lines. */
export interface NasabNode {
  key: string;
  name: string;
  /** The picked people this node is. */
  people: string[];
  children: NasabNode[];
}

/**
 * The picked people's lines as one tree from the top father down (owner's sketch, screen 3): two lines share their
 * nodes from where meetingOf says they meet and up, so they part where the two nasabs part. A line that meets none
 * of the others before it is a root of its own, even when its top father has the same name as another's.
 */
export function nasabTree(picked: { slug: string; line: LineName[] }[]): NasabNode[] {
  const roots: NasabNode[] = [];
  const parentOf = new Map<NasabNode, NasabNode>();
  const placed: { line: LineName[]; nodes: NasabNode[] }[] = [];
  const node = (n: LineName): NasabNode => ({ key: n.bare, name: n.name, people: [], children: [] });
  const adopt = (parent: NasabNode, child: NasabNode) => {
    parent.children.push(child);
    parentOf.set(child, parent);
  };
  for (const { slug, line } of picked) {
    const nodes: NasabNode[] = new Array(line.length);
    // The nearest father this line shares with a line already in the tree.
    let best: { i: number; j: number; with: (typeof placed)[number] } | undefined;
    for (const other of placed) {
      const at = meetingOf(line, other.line);
      if (at && (!best || at.a < best.i)) best = { i: at.a, j: at.b, with: other };
    }
    let top: number;
    if (best) {
      // From the meeting up, the fathers already drawn above it (another line may have drawn them higher since); above
      // the tree's top, this line's own fathers, and the old top goes under them.
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

/**
 * Where the drawing starts: the top father who is a parting point or a picked person, so the long shared line above is
 * folded into one line of names. Returns the folded fathers (from the nearest up) and the node to draw from.
 */
export function foldTop(root: NasabNode): { above: string[]; start: NasabNode } {
  const above: string[] = [];
  let node = root;
  while (node.children.length === 1 && node.people.length === 0) {
    above.unshift(node.name);
    node = node.children[0];
  }
  return { above, start: node };
}
