import type { AppPersonLink } from './battles/battle';
import { lifeColumns, type LifeItem } from './events/lifeTimeline';
import type { QuizSource } from './quiz/sources';
import { pageSources, type AppPerson } from './tarajim';
import { joining, tieGroups, type PeopleGraph, type Step, type Tie, type TieKind } from './tarajimGraph';
import { lineOf, meetingOf } from './tarajimLine';

const FAMILY: readonly TieKind[] = ['parent', 'child', 'spouse', 'sibling', 'cousin'];

export const GROUP_MOST = 5;

export type GroupSource = { id: string; name: string; slugs: string[] };

export function groupSources(stories: readonly { slug: string; name: string; people: { slug: string }[] }[],
  battles: readonly { slug: string; name: string; martyrs: AppPersonLink[]; present: AppPersonLink[] }[]): GroupSource[] {
  return [
    ...stories.map(story => ({ id: `story:${story.slug}`, name: `من ${story.name}`, slugs: story.people.map(person => person.slug) })),
    ...battles.flatMap(battle => [
      { id: `martyrs:${battle.slug}`, name: `من شهداء ${battle.name}`, slugs: battle.martyrs.map(person => person.slug) },
      { id: `present:${battle.slug}`, name: `ممن شهد ${battle.name}`, slugs: battle.present.map(person => person.slug) },
    ]),
  ];
}

export function groupJoin(graph: PeopleGraph, slugs: readonly string[]): { steps: Step[]; nodes: string[] } | null {
  const picked = [...new Set(slugs)].filter(slug => graph.nodes.has(slug));
  if (picked.length < 3 || picked.length > GROUP_MOST) return null;
  const joins = picked.map(first => joining(graph, [first, ...picked.filter(slug => slug !== first)]))
    .filter(join => !join.apart.length && join.steps.every(step => FAMILY.includes(step.kind) && !step.link.disputed && !step.link.anonymous))
    .sort((a, b) => a.nodes.length - b.nodes.length);
  return joins[0] && joins[0].nodes.length - picked.length <= 1 ? { steps: joins[0].steps, nodes: joins[0].nodes } : null;
}

export function inLaws(graph: PeopleGraph, slug: string): { steps: Step[]; nodes: string[] } | null {
  if (graph.nodes.get(slug)?.sex === 'FEMALE') return null;
  const steps = kinOf(graph, slug, 'spouse').sure.flatMap(wife => {
    const father = (graph.ties.get(wife.to) ?? []).find(tie => tie.kind === 'parent' && !tie.link.disputed && graph.nodes.get(tie.to)?.sex !== 'FEMALE' && graph.nodes.get(tie.to)?.inApp);
    return father ? [{ from: slug, to: wife.to, kind: wife.kind, link: wife.link }, { from: wife.to, to: father.to, kind: father.kind, link: father.link }] : [];
  });
  return new Set(steps.filter(step => step.kind === 'parent').map(step => step.to)).size >= 2 ? { steps, nodes: [...new Set([slug, ...steps.map(step => step.to)])] } : null;
}

export function groupOf(graph: PeopleGraph, sources: readonly GroupSource[], id: string) {
  if (id.startsWith('inlaws:')) {
    const join = inLaws(graph, id.slice('inlaws:'.length));
    return join && { id, name: 'أصهاره', slugs: [join.nodes[0]], ...join };
  }
  const source = sources.find(each => each.id === id);
  const join = source && groupJoin(graph, source.slugs);
  return source && join ? { ...source, ...join } : null;
}

export const groupItems = (graph: PeopleGraph, sources: readonly GroupSource[], people: readonly { slug: string }[]) => [
  ...people.filter(person => inLaws(graph, person.slug)).map(person => `inlaws:${person.slug}`),
  ...sources.filter(source => groupJoin(graph, source.slugs)).map(source => source.id),
];

export function spread(ids: readonly string[]): string[] {
  const left = [...ids];
  const out: string[] = [];
  while (left.length) {
    const shown = new Set<string>();
    for (let i = 0; i < left.length;) {
      const slugs = left[i].split(',');
      if (slugs.some(slug => shown.has(slug))) { i++; continue; }
      slugs.forEach(slug => shown.add(slug));
      out.push(...left.splice(i, 1));
    }
  }
  return out;
}

export const stepSources = (steps: readonly Step[]): QuizSource[] => pageSources(steps.flatMap(step => step.link.refs));

export function livesPairs(lives: ReadonlyMap<string, LifeItem[]>): string[] {
  const slugs = [...lives.keys()].filter(slug => lives.get(slug)!.length);
  const pairs: { id: string; shared: number }[] = [];
  for (let i = 0; i < slugs.length; i++) for (let j = i + 1; j < slugs.length; j++) {
    const shared = lifeColumns([lives.get(slugs[i])!, lives.get(slugs[j])!]).flatMap(place => place.rows).filter(row => row.shared).length;
    if (shared) pairs.push({ id: `${slugs[i]},${slugs[j]}`, shared });
  }
  return spread(pairs.sort((a, b) => b.shared - a.shared).map(pair => pair.id));
}

export const CALIPHS_MEET = ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'ali-ibn-abi-talib'];

export function meetItems(people: readonly AppPerson[], asked: readonly (readonly [string, string])[]): string[] {
  const line = (slug: string) => { const person = people.find(each => each.slug === slug); return person ? lineOf(person, people) : []; };
  const meets = (slugs: readonly string[]) => slugs.slice(1).every(slug => meetingOf(line(slugs[0]), line(slug)));
  const [first, ...pairs] = [CALIPHS_MEET, ...asked].filter(meets).map(slugs => slugs.join(','));
  return first === CALIPHS_MEET.join(',') ? [first, ...spread(pairs)] : spread([first, ...pairs].filter(Boolean));
}

export const meetSources = (people: readonly AppPerson[], slugs: readonly string[]) =>
  slugs.flatMap(slug => { const person = people.find(each => each.slug === slug); return person?.fullName ? pageSources(person.fullName.refs) : []; });

export type Ring = { id: string; people: string[]; doubted: Tie[]; sources: QuizSource[]; note?: RingNote } & (
  | { by: 'kin'; slug: string; kind: TieKind }
  | { by: 'title'; title: string; name: string }
  | { by: 'hadith'; quote: string; book: 'bukhari' | 'muslim'; n: number; also?: { book: 'bukhari' | 'muslim'; n: number }; middle: string });

export type RingNote = { by: string; of: string; work: string; quote: string };

export const RING_NOTES: Record<string, RingNote> = {
  'kin:prophet-muhammad:child': { by: 'ابن القيم', of: 'abdullah-ibn-muhammad', work: 'zad-al-maad',
    quote: 'ثُمَّ وُلِدَ لَهُ عبد الله، وَهَلْ وُلِدَ بَعْدَ النُّبُوَّةِ أَوْ قَبْلَهَا؟ فِيهِ اخْتِلَافٌ، وَصَحَّحَ بَعْضُهُمْ أَنَّهُ وُلِدَ بَعْدَ النُّبُوَّةِ، وَهَلْ هُوَ الطيب والطاهر، أَوْ هُمَا غَيْرُهُ؟ عَلَى قَوْلَيْنِ. وَالصَّحِيحُ أَنَّهُمَا لَقَبَانِ لَهُ' },
};

export function settledTies<T extends { to?: string; slug?: string; disputed?: true; link?: { disputed?: true; text?: string }; text?: string }>(
  slug: string, kind: string, ties: readonly T[]): T[] {
  const note = RING_NOTES[`kin:${slug}:${kind}`];
  if (!note) return [...ties];
  const of = ties.find(tie => (tie.to ?? tie.slug) === note.of);
  if (!(of?.link?.text ?? of?.text)?.includes(note.quote)) return [...ties];
  return ties.filter(tie => !(tie.link?.disputed ?? tie.disputed));
}

export const TITLE_COUNTS: Record<string, number> = { 'the-ten-promised-paradise': 10, 'the-six-of-the-shura': 6, naqib: 12 };

export const HADITH_RINGS: readonly Extract<Ring, { by: 'hadith' }>[] = [
  { id: 'hadith:bukhari-3693', by: 'hadith', book: 'bukhari', n: 3693, also: { book: 'muslim', n: 2403 }, quote: 'افْتَحْ لَهُ وَبَشِّرْهُ بِالْجَنَّةِ',
    middle: 'prophet-muhammad', people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan'], doubted: [], sources: [] },
  { id: 'hadith:muslim-2417', by: 'hadith', book: 'muslim', n: 2417, quote: 'اسْكُنْ. حِرَاءُ! فَمَا عَلَيْكَ إِلَّا نَبِيٌّ أَوْ صِدِّيقٌ أَوْ شَهِيدٌ',
    middle: 'prophet-muhammad', people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'ali-ibn-abi-talib', 'talhah-ibn-ubaydullah', 'az-zubayr-ibn-al-awwam', 'saad-ibn-abi-waqqas'],
    doubted: [], sources: [] },
];

function noted(id: string, sure: readonly Tie[], sources: QuizSource[]): { note?: RingNote; sources: QuizSource[] } {
  const note = RING_NOTES[id];
  const tie = note && sure.find(each => each.to === note.of);
  if (!note || !tie?.link.text?.includes(note.quote)) return { sources };
  const [line] = pageSources(tie.link.refs.filter(ref => ref.work === note.work));
  return { note, sources: sources.map(each => (line && each.book === line.book && each.at === line.at ? { ...each, quote: note.quote, by: note.by } : each)) };
}

export function kinOf(graph: PeopleGraph, slug: string, kind: TieKind) {
  const seen = new Set<string>();
  const group = tieGroups(graph, slug).map(each => ({ ...each, ties: each.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) })).find(each => each.kind === kind);
  const ties = group?.ties ?? [];
  return { sure: ties.filter(tie => !tie.link.disputed), doubted: ties.filter(tie => tie.link.disputed) };
}

export function ringList(graph: PeopleGraph, people: readonly AppPerson[], folded: (slug: string) => readonly TieKind[], fits: (people: readonly string[]) => boolean): Ring[] {
  const kin: Ring[] = people.flatMap(person => folded(person.slug).flatMap(kind => {
    const { sure, doubted } = kinOf(graph, person.slug, kind);
    return sure.length > 1 && fits(sure.map(tie => tie.to))
      ? [{ id: `kin:${person.slug}:${kind}`, by: 'kin' as const, slug: person.slug, kind, people: sure.map(tie => tie.to), doubted,
        ...noted(`kin:${person.slug}:${kind}`, sure, pageSources([...sure, ...doubted].flatMap(tie => tie.link.refs))) }]
      : [];
  }));
  const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every(slug => b.includes(slug));
  const holders = new Map<string, { name: string; people: string[]; refs: AppPerson['titles'][number]['refs'] }>();
  for (const person of people) for (const title of person.titles) {
    if (!title.shared) continue;
    const entry = holders.get(title.title) ?? { name: title.name, people: [], refs: [] };
    if (!entry.people.includes(person.slug)) entry.people.push(person.slug);
    entry.refs.push(...title.refs);
    holders.set(title.title, entry);
  }
  const titles: Ring[] = [...holders].filter(([title, { people: held }]) => held.length > 1 && fits(held)
    && (TITLE_COUNTS[title] === undefined || TITLE_COUNTS[title] === held.length)
    && !kin.some(ring => same(ring.people, held)))
    .map(([title, { name, people: held, refs }]) => ({ id: `title:${title}`, by: 'title' as const, title, name, people: held, doubted: [], sources: pageSources(refs) }));
  const hadith = HADITH_RINGS.filter(ring => [ring.middle, ...ring.people].every(slug => graph.nodes.has(slug)) && fits(ring.people));
  return [...kin, ...titles, ...hadith];
}
