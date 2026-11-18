// The tarajim's question kinds (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screens 5 and 8), from the people
// whose Siyar entry is converted (shared/data/tarajim/people.json) and nothing else: where two nasabs meet, and whose
// virtue this is. Every value is the book's, and after answering the note says where it is, so the tree or the person's
// page is the way to check it.
import peopleJson from '../data/tarajim/people.json';
import { pageLabel, sayer, type AppPerson } from '../tarajim';
import { bareName, lineOf, meetingOf } from '../tarajimLine';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TARAJIM_NASAB = 'TARAJIM_NASAB';
export const TARAJIM_VIRTUE = 'TARAJIM_VIRTUE';
export const TARAJIM_NASAB_NAME = 'أين يلتقي النسبان؟';
export const TARAJIM_VIRTUE_NAME = 'صاحب المنقبة';

const PEOPLE = peopleJson as AppPerson[];
const plain = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

/**
 * Where two people's nasabs meet: the nearest father both lines name. The wrong choices are fathers below the meeting
 * on either line, so each is clearly one side's alone; a pair with fewer than three such fathers is not asked.
 */
export function nasabQuestions(people: AppPerson[] = PEOPLE): ChoiceQuestion[] {
  const lines = new Map(people.map(person => [person.slug, lineOf(person, people)]));
  const questions: ChoiceQuestion[] = [];
  for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) {
    const [a, b] = [people[i], people[j]];
    const [la, lb] = [lines.get(a.slug)!, lines.get(b.slug)!];
    const at = meetingOf(la, lb);
    if (!at) continue;
    const answer = plain(la[at.a].name);
    // One father from each side in turn, a name of one or two words (not «الصديق أبي بكر عبد الله», a kunya and a name).
    const sideA = la.slice(1, at.a).map(n => plain(n.name));
    const sideB = lb.slice(1, at.b).map(n => plain(n.name));
    const turns = Array.from({ length: Math.max(sideA.length, sideB.length) }, (_, k) => [sideB[sideB.length - 1 - k], sideA[sideA.length - 1 - k]]).flat();
    const below = turns.filter((name): name is string => !!name && name.split(/\s+/).length <= 2)
      .filter((name, k, all) => all.findIndex(other => bareName(other) === bareName(name)) === k && bareName(name) !== bareName(answer));
    if (below.length < 3) continue;
    const chain = (line: typeof la, to: number) => line.slice(0, to + 1).map(n => plain(n.name)).join(' بن ');
    questions.push({
      key: `${TARAJIM_NASAB}:${a.slug}:${b.slug}`,
      family: TARAJIM_NASAB,
      promptArabic: `أين يلتقي نسب ${nameOf(a)} ونسب ${nameOf(b)}؟`,
      choices: [answer, ...below.slice(0, 3)].map(name => ({ value: name, labelArabic: name })),
      correctAnswer: answer,
      note: { label: 'النسبان', text: `${chain(la, at.a)}\n${chain(lb, at.b)}\n(سير أعلام النبلاء، وشجرة النسب في التراجم)` },
      evidence: { claimKeys: [] },
    });
  }
  return questions;
}

/**
 * A virtue as the entry prints it, with who says it, and four people to pick from. A virtue that names its owner
 * (his name or kunya in the quote) gives the answer away, so it is not asked. The wrong choices are other people in the
 * app of the same sex; a virtue with fewer than three such people waits for more entries to be converted.
 */
export function virtueQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const questions: ChoiceQuestion[] = [];
  for (const person of people) {
    const names = [person.name.split(/\s+/)[0], ...person.kunya.map(k => k.text)].map(bareName);
    person.virtues.forEach((virtue, k) => {
      const quote = bareName(virtue.text);
      if (names.some(name => quote.includes(name))) return;
      // Others of the same sex, so the grammar of the quote gives nothing away, and no one the quote names or who says it.
      const others = shuffle(people.filter(p => p.slug !== person.slug && p.sex === person.sex
        && !quote.includes(bareName(p.name.split(/\s+/)[0]))
        && !virtue.by.some(by => bareName(by).startsWith(bareName(p.name.split(/\s+/)[0])))), random).slice(0, 3);
      if (others.length < 3) return;
      questions.push({
        key: `${TARAJIM_VIRTUE}:${person.slug}:${k}`,
        family: TARAJIM_VIRTUE,
        promptArabic: `«${virtue.text}»${virtue.by.length ? ` — ${sayer(virtue)}` : ''}\nفيمن قيل هذا؟`,
        choices: shuffle([person, ...others], random).map(p => ({ value: p.slug, labelArabic: nameOf(p) })),
        correctAnswer: person.slug,
        note: { label: 'المصدر', text: `${pageLabel(virtue.refs)}، في ترجمة ${nameOf(person)}` },
        evidence: { claimKeys: [] },
      });
    });
  }
  return questions;
}

const kind = (id: typeof TARAJIM_NASAB | typeof TARAJIM_VIRTUE, name: string, all: (random: Random) => ChoiceQuestion[]): ChoiceKind => ({
  id,
  name,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(all(random), random).slice(0, limit),
  count: () => all(Math.random).length,
});

export const tarajimNasab = kind(TARAJIM_NASAB, TARAJIM_NASAB_NAME, random => nasabQuestions().map(q => ({ ...q, choices: shuffle(q.choices, random) })));
export const tarajimVirtue = kind(TARAJIM_VIRTUE, TARAJIM_VIRTUE_NAME, random => virtueQuestions(PEOPLE, random));
