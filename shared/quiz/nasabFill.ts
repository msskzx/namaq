// «أكمل النسب» (owner 2026-11-20): a person's nasab as a row of boxes, every other box blank, and the reader fills one
// blank at a time from four names. The boxes are the fathers the nasab tree draws (shared/tarajimLine.ts lineOf), each
// in the nominative as a box shows it (boxName); the wrong names are other fathers the converted entries name, near the
// same depth of their own lines. Nothing is taught that the entries' nasabs do not print: the note after the answer is
// the chain as far as the boxes go, and the sources are the entries each name comes from.
import peopleJson from '../data/tarajim/people.json';
import { pageSources, type AppPerson } from '../tarajim';
import { bareName, boxName, chainOf, lineOf, sameName, type LineName } from '../tarajimLine';
import { genitive } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import { uniqueSources } from './sources';
import { BOX_ASKED as ASKED, BOX_BLANK as BLANK, type ChoiceKind, type ChoiceQuestion } from './choiceKinds';

export const TARAJIM_NASAB_FILL = 'TARAJIM_NASAB_FILL';
export const TARAJIM_NASAB_FILL_NAME = 'أكمل النسب';
/** The boxes a question shows: the person and his nearest fathers, so a nasab of twenty names stays one row. */
const BOXES = 8;
/** Fewer boxes than this leave nothing to fill between the names shown. */
const FEWEST = 4;
const CHOICES = 4;

const PEOPLE = peopleJson as AppPerson[];
const PROPHET = 'prophet-muhammad';
const nameOf = (person: AppPerson) => (person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);
/** A person's own name, without the fathers his name goes on to («حفصة بنت عمر» is «حفصة»). */
export const ownName = (name: string) => name.split(/\s+(?:بن|بنت|ابن|ابنة)\s+/u)[0].trim();
/** The Prophet's ﷺ own names are never a wrong choice (AGENTS.md "Quiz questions"). */
const HIS = new Set(['محمد', 'احمد'].map(bareName));
/** A name's shape, so the right one never stands out by its look: a kunya, «عبد …», «ذو …», or one name, by its words. */
const shape = (name: string) => `${/^(?:أبو|ذو|عبد|امرؤ) /u.exec(name)?.[0] ?? ''}${name.split(' ').length}`;
/** sameName, quick to say no: one bare name holds the other whenever they can be the same man. */
const same = (a: string, b: string) => a === b || ((a.length < b.length ? b.includes(a) : a.includes(b)) && sameName(a, b));
/** A name's letters without its long vowels and final «ة», so a nisba matches its name («أمية» and «الأموي», «عدي» and «العدوي»). */
const skeleton = (bare: string) => bare.replace(/^ال/u, '').replace(/(?!^)[اويه]/gu, '');

/**
 * Whether the name `text` tells `name`: it stands there as whole words, both bare and nominative («الأرقم بن أبي الأرقم»
 * tells «أبو الأرقم»), or the name holds his nisba («الغفاري» tells «غفار», «الأموي» «أمية», «الخدري» «خدرة»).
 */
function told(text: string, name: string) {
  const shown = bareName(boxName(text)).split(' ');
  const asked = bareName(boxName(name));
  if (` ${shown.join(' ')} `.includes(` ${asked} `)) return true;
  const stem = skeleton(asked);
  return !asked.includes(' ') && stem.length > 1 && shown.some(word => /^ال.+ي$/u.test(word) && skeleton(word.slice(0, -1)) === stem);
}

/** The father the other entries give after the two names before `k` («مخزوم بن يقظة»): a line that names another is not one answer. */
function agreed(line: string[], k: number, others: string[][]) {
  if (k < 2) return true;
  const [a, b, c] = [line[k - 2], line[k - 1], line[k]];
  return others.every(other => other.every((name, j) => j + 2 >= other.length || name !== a || other[j + 1] !== b || same(other[j + 2], c)));
}

/** Every father the converted entries name, as a box shows him, with how far up his line he stands. */
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

/**
 * The questions of one person's nasab: the person and his fathers up to BOXES, the odd boxes blank (the father, the
 * father's grandfather, …) unless the person's own name already tells that father («علي بن أبي طالب»), one question for
 * each blank. A blank whose name is also shown in another box, or in the question, is not asked, nor one where another
 * entry names a different father after the same two names.
 */
export function nasabFillQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const bySlug = new Map(people.map(person => [person.slug, person]));
  const lines = new Map(people.map(person => [person.slug, lineOf(person, people)]));
  const fathers = fathersOf(lines);
  // Each line's names bare, worked out once rather than again for every other person.
  const bareLines = new Map([...lines].map(([slug, line]) => [slug, line.map(father => bareName(boxName(father.name)))]));
  return people.flatMap(person => {
    const line = lines.get(person.slug)!.slice(0, BOXES);
    if (line.length < FEWEST) return [];
    const shown = nameOf(person);
    // His box is his own name only (owner, 2026-11-23): his father is the next box, «حفصة» then «عمر», not «حفصة بنت عمر».
    const names = line.map((father, i) => (i === 0 ? ownName(shown) : boxName(father.name)));
    const blank = names.map((name, i) => i % 2 === 1 && !told(shown, name));
    const asked = names.flatMap((name, k) => (blank[k] && !names.some((other, i) => !blank[i] && i !== k && same(bareName(other), bareName(name))) ? [k] : []));
    // The entries every box's name is printed in, each with its nasab and page.
    const sources = uniqueSources([...new Set(line.map(father => father.from))].flatMap(slug => {
      const entry = bySlug.get(slug)?.fullName;
      return entry ? pageSources(entry.refs, { text: entry.text }) : [];
    }));
    if (sources.length === 0) return [];
    const whole = bareLines.get(person.slug)!;
    const bares = whole.slice(0, BOXES);
    const otherLines = [...bareLines].filter(([slug]) => slug !== person.slug).map(([, other]) => other);
    // Wrong names: fathers no line of this person names, nor his shown name.
    // Nor a kunya after a word of his name («أبو سلمة» for أم سلمة, her husband): it only misleads.
    const shownWords = new Set(bareName(boxName(shown)).split(' '));
    const others = fathers.filter(father => !whole.some(own => same(own, father.bare)) && !told(shown, father.name)
      && !(/^ابو /u.test(father.bare) && father.bare.split(' ').slice(1).some(word => shownWords.has(word))));
    return asked.flatMap(k => {
      const answer = names[k];
      // An entry that names another father here (Khalid's «يقظة بن كعب», al-Arqam's «يقظة بن مرة»): not asked.
      if (!agreed(bares, k, otherLines)) return [];
      // Of the answer's shape only, the nearest in depth first: a choice that alone is a kunya, or alone of two words, would stand out.
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
