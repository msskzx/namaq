// «السيرة والغزوات» (owner, 2026-11-18: quizzes go beyond the battles, and every feature gets a quiz kind): questions made
// from the app's sira stories and battles (shared/data/events/stories.json, shared/data/battles/battles.json), each one
// only from what the source states and with its reference under the choices. Where the source has more than one reading,
// the right choice holds every reading in the source's words, and nothing next to it is offered as wrong (owner,
// 2026-11-18: «٤ أو ٥» with references; wrong choices clearly wrong).
import storiesData from '../data/events/stories.json';
import battlesData from '../data/battles/battles.json';
import type { AppBattle, AppCite, AppPersonLink } from '../battles/battle';
import { rangeName, type AppStory } from '../stories/story';
import { num } from '../quran/arabicNumber';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion, QuizLook } from './choiceKinds';

export const SIRA = 'SIRA';
export const SIRA_NAME = 'السيرة والغزوات';
const CHOICES = 4;

const STORIES = storiesData as AppStory[];
const BATTLES = battlesData as AppBattle[];

/** The surahs whose openings stand as wrong choices for ayat recited from a surah's opening: none of them was recited in a story. */
const OPENING_SURAHS = ['36:1', '40:1', '44:1', '45:1', '46:1', '50:1', '67:1', '32:1', '42:1', '43:1'];

const source = (refs: AppCite[]) => ({ label: 'المصدر', text: [...new Set(refs.map(ref => ref.cite))].join('؛ ') });
/** «كانت غزوة بدر» but «كان فتح مكة»: the verb follows the name's first word. */
const was = (name: string) => (/^(غزوة|سرية|معركة|بدر|وقعة)/.test(name) ? 'كانت' : 'كان');
const yearName = (year: number) => (year < 0 ? `${num(-year)} قبل الهجرة` : `السنة ${num(year)} للهجرة`);

function ask(key: string, promptArabic: string, right: string, wrong: string[], refs: AppCite[], look: QuizLook, random: Random): ChoiceQuestion | null {
  const others = [...new Set(wrong.filter(label => label !== right))];
  if (others.length < CHOICES - 1) return null;
  const choices = shuffle([right, ...shuffle(others, random).slice(0, CHOICES - 1)], random);
  return {
    key: `${SIRA}:${key}`,
    family: SIRA,
    promptArabic,
    choices: choices.map((label, i) => ({ value: String(i), labelArabic: label })),
    correctAnswer: String(choices.indexOf(right)),
    note: source(refs),
    look,
    evidence: { claimKeys: [] },
  };
}

/** «أي آيات قُرئت في …؟»: the ayat a story's people heard, as a range; the wrong ones are other surahs' openings of the same length. */
function recited(story: AppStory, random: Random) {
  return story.ayat.filter(ayat => ayat.label.startsWith('ما قرأه')).map(ayat => {
    const reading = ayat.label.replace(/^ما قرأه\s*/, '');
    const right = [`${rangeName(ayat.from, ayat.to)}${reading ? ` ${reading}` : ''}`, ...(ayat.others ?? []).map(other => other.text)].join('، ');
    const length = Number(ayat.to.split(':')[1]) - Number(ayat.from.split(':')[1]);
    const wrong = OPENING_SURAHS.filter(key => key.split(':')[0] !== ayat.from.split(':')[0]).map(key => rangeName(key, `${key.split(':')[0]}:${1 + length}`));
    return ask(`recited:${story.slug}:${ayat.from}`, `أي آيات قُرئت في قصة «${story.name}»؟`, right, wrong, [...ayat.refs, ...(ayat.others ?? []).flatMap(other => other.refs)], { view: 'story', slug: story.slug }, random);
  });
}

/** Everyone the stories and battles name, for «في من نزلت؟». */
const named = (): AppPersonLink[] => {
  const all = [...STORIES.flatMap(story => story.people), ...BATTLES.flatMap(battle => battle.moments.flatMap(moment => moment.people))];
  return [...new Map(all.map(person => [person.slug, person])).values()].filter(person => person.slug !== 'prophet-muhammad');
};

/** «في من نزلت …؟»: the ayat a story says were revealed about one of its people; the wrong ones are people of other stories and battles. */
function revealedAbout(story: AppStory, random: Random) {
  return story.ayat.filter(ayat => ayat.label.startsWith('نزل فيه')).map(ayat => {
    const about = ayat.about;
    if (!about) return null;
    const inStory = new Set(story.people.map(person => person.slug));
    const wrong = named().filter(person => !inStory.has(person.slug)).map(person => person.name);
    return ask(`revealed:${story.slug}:${ayat.from}`, `في من نزلت آيات ${rangeName(ayat.from, ayat.to)}؟`, about.name, wrong, ayat.refs, { view: 'story', slug: story.slug }, random);
  });
}

/**
 * «ما الذي جاء بعد …؟»: one report's moments in the order the report tells them; the wrong ones are its other moments.
 * Only within a report: a battle's moments are separate reports, and the source does not order them.
 */
function next(name: string, key: string, titles: string[], refs: AppCite[], random: Random) {
  return titles.slice(0, -1).map((title, i) =>
    ask(`next:${key}:${i}`, `في ${name}، ما الذي جاء بعد «${title}»؟`, titles[i + 1], titles.filter((_, at) => at !== i && at !== i + 1), refs, { view: 'story', slug: key }, random));
}

/** «في أي سنة كانت …؟»: a cited year; the wrong years are other battles' years, none next to it. */
function battleYear(battle: AppBattle, random: Random) {
  const year = battle.year;
  if (!year) return null;
  const right = [yearName(year.value), ...(year.others ?? []).map(other => other.text)].join('، ');
  const wrong = [...new Set(BATTLES.flatMap(other => (other.year ? [other.year.value] : [])))]
    .filter(other => Math.abs(other - year.value) > 1).map(yearName);
  return ask(`year:${battle.slug}`, `في أي سنة ${was(battle.name)} ${battle.name}؟`, right, wrong, [...year.refs, ...(year.others ?? []).flatMap(other => other.refs)], { view: 'battle', slug: battle.slug }, random);
}

/** «أين كانت …؟»: the place as the source names it; the wrong ones are the other battles' places. */
function battlePlace(battle: AppBattle, random: Random) {
  const place = battle.location;
  if (!place) return null;
  const wrong = BATTLES.flatMap(other => (other.location && other.slug !== battle.slug ? [other.location.value] : []));
  return ask(`place:${battle.slug}`, `أين ${was(battle.name)} ${battle.name}؟`, place.value, wrong, place.refs, { view: 'battle', slug: battle.slug }, random);
}

/** Every question the stories and battles hold, in random order. */
export function siraQuestions(random: Random): ChoiceQuestion[] {
  const all = [
    ...STORIES.flatMap(story => [
      ...recited(story, random),
      ...revealedAbout(story, random),
      ...story.reports.slice(0, 1).flatMap(report =>
        next(`قصة «${story.name}»`, story.slug, report.moments.map(moment => moment.title), [{ text: '', cite: report.cite, url: report.url }], random)),
    ]),
    ...BATTLES.flatMap(battle => [
      battleYear(battle, random),
      battlePlace(battle, random),
    ]),
  ];
  return shuffle(all.filter((question): question is ChoiceQuestion => question !== null), random);
}

export const siraQuiz: ChoiceKind = {
  id: SIRA,
  name: SIRA_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => siraQuestions(random).slice(0, limit),
  count: () => siraQuestions(Math.random).length,
};
