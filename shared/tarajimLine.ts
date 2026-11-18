import type { AppPerson } from './tarajim';

/**
 * A person's line of fathers for the nasab tree (owner, 2026-11-18), read from the converted entries only.
 * Each entry prints the nasab as far as al-Dhahabi took it: al-Zubayr's stops at «غالب», al-Abbas's heading names no
 * father at all. Where a line stops, it is carried on by another entry that names the same fathers, so al-Zubayr reaches
 * «عدنان» through the Prophet's ﷺ nasab. Names stay as printed; matching ignores vowels and hamza forms.
 */
export interface LineName {
  /** The name as the entry prints it. */
  name: string;
  /** The entry whose nasab gave this name. */
  from: string;
}

/** A name with no vowels, tatweel or hamza seat, for matching («عَمْرٍو» = «عَمْرِو», «أبي» = «ابي»). */
export function bareName(name: string) {
  return name.replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى$/u, 'ي').trim();
}

/** The father's name from a link's name: «عبد المطلب بن هاشم» → «عبد المطلب». */
const firstName = (name: string) => name.split(/\s+(?:بن|ابن|بنت)\s+/u)[0];

function ownLine(person: AppPerson): LineName[] {
  const line = person.nasab.map((name) => ({ name, from: person.slug }));
  if (line.length === 0) line.push({ name: person.name, from: person.slug });
  if (line.length === 1) {
    const father = person.parents.find((parent) => parent.sex === 'MALE');
    if (father) line.push({ name: firstName(father.name), from: person.slug });
  }
  return line;
}

/**
 * Where `line` can go on in `other`: the index in `other` just after the line's last name, when the two agree on every
 * name they share up to it. The last two names must both match when the line has two to match, so one common name
 * («عبد مناف» is two men in the Prophet's ﷺ nasab) never joins two lines alone.
 */
function continuation(line: LineName[], other: LineName[]) {
  const last = bareName(line[line.length - 1].name);
  for (let j = 0; j < other.length - 1; j += 1) {
    if (bareName(other[j].name) !== last) continue;
    const before = line.length >= 2 ? bareName(line[line.length - 2].name) : undefined;
    const otherBefore = j > 0 ? bareName(other[j - 1].name) : undefined;
    // A line of two (a person and the father) joins wherever the father is; a longer one needs the pair.
    if (line.length > 2 && before !== otherBefore) continue;
    return j + 1;
  }
  return -1;
}

/** The person's fathers from the person up, carried on through the other converted entries as far as they go. */
export function lineOf(person: AppPerson, people: AppPerson[]): LineName[] {
  const line = ownLine(person);
  const others = people.filter((p) => p.slug !== person.slug).map(ownLine);
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

/**
 * Where two lines meet: the first father of `a` that `b` names too, with the same fathers above him as far as both go.
 * `a` and `b` are the indexes of that father in each line; undefined when they do not meet in what the entries print.
 */
export function meetingOf(a: LineName[], b: LineName[]): { a: number; b: number } | undefined {
  for (let i = 0; i < a.length; i += 1) {
    const name = bareName(a[i].name);
    for (let j = 0; j < b.length; j += 1) {
      if (bareName(b[j].name) !== name) continue;
      const shared = Math.min(a.length - i, b.length - j);
      let same = true;
      for (let k = 1; k < shared; k += 1) if (bareName(a[i + k].name) !== bareName(b[j + k].name)) same = false;
      // One name alone with nothing above it to agree on is not a meeting.
      if (same && shared > 1) return { a: i, b: j };
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
 * The picked people's lines as one tree from the top father down (owner's sketch, screen 3): lines that share their
 * fathers share their nodes, so two lines part where the two nasabs part. Lines that never meet are separate roots.
 */
export function nasabTree(picked: { slug: string; line: LineName[] }[]): NasabNode[] {
  const roots: NasabNode[] = [];
  for (const { slug, line } of picked) {
    let level = roots;
    let node: NasabNode | undefined;
    for (let i = line.length - 1; i >= 0; i -= 1) {
      const key = bareName(line[i].name);
      node = level.find((n) => n.key === key);
      if (!node) {
        node = { key, name: line[i].name, people: [], children: [] };
        level.push(node);
      }
      level = node.children;
    }
    if (node && !node.people.includes(slug)) node.people.push(slug);
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
