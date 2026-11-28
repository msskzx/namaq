import peopleJsonFile from '../data/tarajim/people.json';
import { pageSources, type AppPerson } from '../tarajim';
import { bareName, boxName, chainOf, lineOf, sameName, type LineName } from '../tarajimLine';
import { genitive } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import { uniqueSources } from './sources';
import { BOX_ASKED as ASKED, BOX_BLANK as BLANK, type ChoiceKind, type ChoiceQuestion } from './choiceKinds';
import { dataOf } from '../appData';

const peopleJson = dataOf(peopleJsonFile);

export const TARAJIM_NASAB_FILL = 'TARAJIM_NASAB_FILL';
export const TARAJIM_NASAB_FILL_NAME = 'أكمل النسب';
const BOXES = 8;
const FEWEST = 4;
const CHOICES = 4;

const PEOPLE = peopleJson as AppPerson[];
const PROPHET = 'prophet-muhammad';
const nameOf = (person: AppPerson) => (person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);
export const ownName = (name: string) => name.split(/\s+(?:بن|بنت|ابن|ابنة)\s+/u)[0].trim();
const HIS = new Set(['محمد', 'احمد'].map(bareName));
const shape = (name: string) => `${/^(?:أبو|ذو|عبد|امرؤ) /u.exec(name)?.[0] ?? ''}${name.split(' ').length}`;
const same = (a: string, b: string) => a === b || ((a.length < b.length ? b.includes(a) : a.includes(b)) && sameName(a, b));
const skeleton = (bare: string) => bare.replace(/^ال/u, '').replace(/(?!^)[اويه]/gu, '');

function told(text: string, name: string) {
  const shown = bareName(boxName(text)).split(' ');
  const asked = bareName(boxName(name));
  if (` ${shown.join(' ')} `.includes(` ${asked} `)) return true;
  const stem = skeleton(asked);
  return !asked.includes(' ') && stem.length > 1 && shown.some(word => /^ال.+ي$/u.test(word) && skeleton(word.slice(0, -1)) === stem);
}

function agreed(line: string[], k: number, others: string[][]) {
  if (k < 2) return true;
  const [a, b, c] = [line[k - 2], line[k - 1], line[k]];
  return others.every(other => other.every((name, j) => j + 2 >= other.length || name !== a || other[j + 1] !== b || same(other[j + 2], c)));
}

function fathersOf(lines: Map<string, LineName[]>) {
  const all = new Map<string, { name: string; bare: string; depths: number[] }>();
  for (const line of lines.values()) line.slice(1).forEach((father, i) => {
    const name = boxName(father.name);
    const bare = bareName(name);
    if (HIS.has(bare)) return;
    const seen = all.get(bare) ?? { name, bare, depths: [] };
    if (!seen.depths.includes(i + 1)) seen.depths.push(i + 1);
    all.set(bare, seen);
  });
  return [...all.values()];
}

export function nasabFillQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const bySlug = new Map(people.map(person => [person.slug, person]));
  const lines = new Map(people.map(person => [person.slug, lineOf(person, people)]));
  const fathers = fathersOf(lines);
  const bareLines = new Map([...lines].map(([slug, line]) => [slug, line.map(father => bareName(boxName(father.name)))]));
  return people.flatMap(person => {
    const line = lines.get(person.slug)!.slice(0, BOXES);
    if (line.length < FEWEST) return [];
    const shown = nameOf(person);
    const names = line.map((father, i) => (i === 0 ? ownName(shown) : boxName(father.name)));
    const blank = names.map((name, i) => i % 2 === 1 && !told(shown, name));
    const asked = names.flatMap((name, k) => (blank[k] && !names.some((other, i) => !blank[i] && i !== k && same(bareName(other), bareName(name))) ? [k] : []));
    const sources = uniqueSources([...new Set(line.map(father => father.from))].flatMap(slug => {
      const entry = bySlug.get(slug)?.fullName;
      return entry ? pageSources(entry.refs, { text: entry.text }) : [];
    }));
    if (sources.length === 0) return [];
    const whole = bareLines.get(person.slug)!;
    const bares = whole.slice(0, BOXES);
    const otherLines = [...bareLines].filter(([slug]) => slug !== person.slug).map(([, other]) => other);
    const shownWords = new Set(bareName(boxName(shown)).split(' '));
    const others = fathers.filter(father => !whole.some(own => same(own, father.bare)) && !told(shown, father.name)
      && !(/^ابو /u.test(father.bare) && father.bare.split(' ').slice(1).some(word => shownWords.has(word))));
    return asked.flatMap(k => {
      const answer = names[k];
      if (!agreed(bares, k, otherLines)) return [];
      const ranked = shuffle(others.filter(father => shape(father.name) === shape(answer)), random)
        .map(father => ({ name: father.name, near: Math.min(...father.depths.map(depth => Math.abs(depth - k))) }))
        .sort((a, b) => a.near - b.near);
      const wrong: string[] = [];
      for (const { name } of ranked) if (wrong.length < CHOICES - 1 && !wrong.some(other => same(bareName(other), bareName(name)))) wrong.push(name);
      if (wrong.length < CHOICES - 1) return [];
      return [{
        key: `${TARAJIM_NASAB_FILL}:${person.slug}:${k}`,
        family: TARAJIM_NASAB_FILL,
        promptArabic: `أكمل نسب ${genitive(shown)}: من في موضع «${ASKED}»؟`,
        boxes: names.map((name, i) => (i === k ? ASKED : blank[i] ? BLANK : name)),
        choices: shuffle([answer, ...wrong], random).map(name => ({ value: name, labelArabic: name })),
        correctAnswer: answer,
        note: { label: 'النسب', text: chainOf(person, line, line.length - 1) },
        sources,
        look: { view: 'nasab' as const, slugs: [person.slug], text: true as const },
        evidence: { claimKeys: [] },
      }];
    });
  });
}

let built: ChoiceQuestion[] | undefined;
const all = () => (built ??= nasabFillQuestions());

export const tarajimNasabFill: ChoiceKind = {
  id: TARAJIM_NASAB_FILL,
  name: TARAJIM_NASAB_FILL_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(all(), random).slice(0, limit).map(q => ({ ...q, choices: shuffle(q.choices, random) })),
  count: () => all().length,
};
