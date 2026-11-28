import storiesDataFile from '../data/events/stories.json';
import battlesData from '../data/battles/battles.json';
import type { AppBattle, AppCite, AppPersonLink } from '../battles/battle';
import { rangeName, type AppStory } from '../stories/story';
import { num } from '../quran/arabicNumber';
import surahRows from '../data/quran/surahs.json';
import { SURAH_NAMES } from '../quran/surahNames';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion, QuizLook } from './choiceKinds';
import { citeSource, uniqueSources } from './sources';
import { dataOf } from '../appData';

const storiesData = dataOf(storiesDataFile);

export const SIRA = 'SIRA';
export const SIRA_NAME = 'السيرة والغزوات';
const CHOICES = 4;

const STORIES = storiesData as AppStory[];
const BATTLES = battlesData as AppBattle[];

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
    sources: uniqueSources(refs.map(citeSource)),
    look,
    evidence: { claimKeys: [] },
  };
}

const placeName = (value: string) => value.split('،')[0].trim();
const bareWord = (word: string) => word.replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/^ال/, '');

const RECITED_SURAHS = new Set(STORIES.flatMap(story => story.ayat.filter(ayat => ayat.label.startsWith('ما قرأه')).map(ayat => Number(ayat.from.split(':')[0]))));

function recited(story: AppStory, random: Random) {
  return story.ayat.filter(ayat => ayat.label.startsWith('ما قرأه')).map(ayat => {
    const [surah, from] = ayat.from.split(':').map(Number);
    const to = Number(ayat.to.split(':')[1]);
    const named = new Set(story.name.split(/\s+/).map(bareWord));
    if (SURAH_NAMES[surah].split(/\s+/).some(word => named.has(bareWord(word)))) return null;
    const openings = from === 1 && !!ayat.others?.length;
    const label = (n: number) => (openings ? `أوائل سورة ${SURAH_NAMES[n]}` : rangeName(`${n}:${from}`, `${n}:${to}`));
    const wrong = surahRows.filter(row => row.number !== surah && !RECITED_SURAHS.has(row.number) && row.numberOfAyat >= to).map(row => label(row.number));
    const refs = [...ayat.refs, ...(ayat.others ?? []).flatMap(other => other.refs)];
    const question = ask(`recited:${story.slug}:${ayat.from}`, `أي آيات قُرئت في قصة «${story.name}»؟`, label(surah), wrong, refs, { view: 'story', slug: story.slug }, random);
    const reading = ayat.label.replace(/^ما قرأه\s*/, '');
    const told = [`${rangeName(ayat.from, ayat.to)}${reading ? ` ${reading}` : ''}`, ...(ayat.others ?? []).map(other => other.text)].join('، ');
    return question && { ...question, note: { label: 'في القصة', text: told } };
  });
}

const named = (): AppPersonLink[] => {
  const all = [...STORIES.flatMap(story => story.people), ...BATTLES.flatMap(battle => battle.moments.flatMap(moment => moment.people))];
  return [...new Map(all.map(person => [person.slug, person])).values()].filter(person => person.slug !== 'prophet-muhammad');
};

function revealedAbout(story: AppStory, random: Random) {
  return story.ayat.filter(ayat => ayat.label.startsWith('نزل فيه')).map(ayat => {
    const about = ayat.about;
    if (!about) return null;
    const inStory = new Set(story.people.map(person => person.slug));
    const wrong = named().filter(person => !inStory.has(person.slug)).map(person => person.name);
    return ask(`revealed:${story.slug}:${ayat.from}`, `في من نزلت آيات ${rangeName(ayat.from, ayat.to)}؟`, about.name, wrong, ayat.refs, { view: 'story', slug: story.slug }, random);
  });
}

function next(name: string, key: string, titles: string[], refs: AppCite[], random: Random) {
  return titles.slice(0, -1).map((title, i) =>
    ask(`next:${key}:${i}`, `في ${name}، ما الذي جاء بعد «${title}»؟`, titles[i + 1], titles.filter((_, at) => at !== i && at !== i + 1), refs, { view: 'story', slug: key }, random));
}

function battleYear(battle: AppBattle, random: Random) {
  const year = battle.year;
  if (!year) return null;
  const right = yearName(year.value);
  const wrong = [...new Set(BATTLES.flatMap(other => (other.year ? [other.year.value] : [])))]
    .filter(other => Math.abs(other - year.value) > 1).map(yearName);
  return ask(`year:${battle.slug}`, `في أي سنة ${was(battle.name)} ${battle.name}؟`, right, wrong, year.refs, { view: 'battle', slug: battle.slug }, random);
}


function battlePlace(battle: AppBattle, random: Random) {
  const place = battle.location;
  if (!place) return null;
  const name = placeName(place.value);
  const said = new Set(battle.name.split(/\s+/).map(bareWord));
  if (name.split(/\s+/).some(word => said.has(bareWord(word)))) return null;
  const wrong = BATTLES.flatMap(other => (other.location && other.slug !== battle.slug ? [placeName(other.location.value)] : []));
  const question = ask(`place:${battle.slug}`, `أين ${was(battle.name)} ${battle.name}؟`, name, wrong, place.refs, { view: 'battle', slug: battle.slug }, random);
  return question && name !== place.value ? { ...question, note: { label: 'في المصدر', text: place.value } } : question;
}

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
