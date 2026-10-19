// See docs/plans/nasab-plot.md for the layout contract.

export interface NasabPerson {
  slug: string;
  name: string;
  fathers: string[];
  isCompanion?: boolean;
  sex?: string | null;
}

export interface NasabNode {
  slug: string;
  name: string;
  isCompanion?: boolean;
  sex?: string | null;
  row: number;
  col: number;
  isSubject: boolean;
  isMeeting: boolean;
  fatherUnrecorded: boolean;
  otherFathers: string[];
}

export interface NasabLayout {
  nodes: NasabNode[];
  edges: { from: string; to: string }[];
  chains: { subject: string; slugs: string[] }[];
}

export const givenName = (name: string) => name.split(/ بنت? /)[0];

export function nasabHonorific(person: Pick<NasabPerson, 'isCompanion' | 'sex'>) {
  if (!person.isCompanion) return '';
  return person.sex === 'FEMALE' ? '﵂' : person.sex === 'MALE' ? '﵁' : '';
}

export function layoutNasab(people: NasabPerson[], subjects: string[]): NasabLayout {
  const bySlug = new Map(people.map((person) => [person.slug, person]));
  const subjectOrder = [...new Set(subjects)].filter((slug) => bySlug.has(slug));

  const parent = new Map<string, string>();
  const otherFathers = new Map<string, string[]>();
  for (const person of people) {
    const known = [...new Set(person.fathers)].filter((slug) => bySlug.has(slug) && slug !== person.slug).sort();
    const primary = known.find((candidate) => {
      for (let up: string | undefined = candidate; up !== undefined; up = parent.get(up)) {
        if (up === person.slug) return false;
      }
      return true;
    });
    if (primary) parent.set(person.slug, primary);
    otherFathers.set(person.slug, known.filter((slug) => slug !== primary));
  }

  const children = new Map<string, string[]>();
  for (const [child, father] of parent) children.set(father, [...(children.get(father) ?? []), child]);

  const below = new Map<string, Set<string>>();
  const collect = (slug: string): Set<string> => {
    const held = new Set<string>(subjectOrder.includes(slug) ? [slug] : []);
    for (const child of children.get(slug) ?? []) collect(child).forEach((subject) => held.add(subject));
    below.set(slug, held);
    return held;
  };
  const firstSubject = (slug: string) => Math.min(...[...(below.get(slug) ?? [])].map((s) => subjectOrder.indexOf(s)));

  const roots = people.map((person) => person.slug).filter((slug) => !parent.has(slug));
  roots.forEach(collect);
  const order = (slugs: string[]) => [...slugs].sort((a, b) => firstSubject(a) - firstSubject(b));

  const placed = new Map<string, NasabNode>();
  let nextCol = 0;
  const place = (slug: string, row: number): number => {
    const kids = order(children.get(slug) ?? []);
    const cols = kids.map((kid) => place(kid, row + 1));
    const col = kids.length === 0 ? nextCol++ : cols.reduce((sum, c) => sum + c, 0) / cols.length;
    const held = below.get(slug)!;
    placed.set(slug, {
      slug,
      name: bySlug.get(slug)!.name,
      isCompanion: bySlug.get(slug)!.isCompanion,
      sex: bySlug.get(slug)!.sex,
      row,
      col,
      isSubject: subjectOrder.includes(slug),
      isMeeting: held.size >= 2 && kids.every((kid) => below.get(kid)!.size < held.size),
      fatherUnrecorded: bySlug.get(slug)!.fathers.length === 0,
      otherFathers: otherFathers.get(slug) ?? [],
    });
    return col;
  };
  order(roots).forEach((root) => place(root, 0));

  const chains = subjectOrder.map((subject) => {
    const slugs: string[] = [];
    for (let up: string | undefined = subject; up !== undefined; up = parent.get(up)) slugs.push(up);
    return { subject, slugs };
  });

  return {
    nodes: [...placed.values()],
    edges: [...parent].map(([to, from]) => ({ from, to })),
    chains,
  };
}
