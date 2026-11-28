import type { AppCite, AppPersonLink } from '../battles/battle';
import { sceneSlots, type SceneLine } from '../hadith';
import { num } from '../quran/arabicNumber';
import { surahName } from '../quran/surahNames';
import { plainName } from '../quran/normalize';
import surahRows from '../data/quran/surahs.json';

export type AppTurn = { lead?: string; text: string; speaker?: { name: string; person?: string }; witness?: AppCite };

export type AppStoryMoment = { title: string; text: string; people: AppPersonLink[];
  turns?: AppTurn[] };

export type AppReport = { isnad?: string; moments: AppStoryMoment[]; grading?: string; cite: string; url: string };

export type AppStoryAyat = { label: string; from: string; to: string; refs: AppCite[];
  about?: AppPersonLink;
  others?: { text: string; refs: AppCite[] }[] };

export type StoryPage = 'before' | number;

export type StoryWhenApp = { pages: StoryPage[]; refs: AppCite[] };

export type AppStory = {
  slug: string;
  name: string;
  chapter: string;
  when?: StoryWhenApp;
  place?: { value: string; refs: AppCite[] };
  tags: string[];
  people: AppPersonLink[];
  reports: AppReport[];
  ayat: AppStoryAyat[];
};

export function rangeName(from: string, to: string): string {
  const [surah, first] = from.split(':').map(Number);
  const last = Number(to.split(':')[1]);
  return `${surahName(surah)} ${num(first)}${last === first ? '' : `–${num(last)}`}`;
}

export const drawnReport = (report: AppReport) => report.moments.every(moment => moment.turns?.length);

export const reportLines = (report: AppReport): SceneLine[] => report.moments.flatMap(moment => moment.turns ?? []).map(turn =>
  turn.speaker
    ? { kind: 'turn', speaker: turn.speaker.name, ...(turn.speaker.person ? { agent: turn.speaker.person } : {}), text: turn.text, ...(turn.lead ? { lead: turn.lead } : {}) }
    : { kind: 'narration', text: turn.text });

export function isnadParts(isnad: string): { head: string; tail: string } {
  const text = isnad.replace(/\s+/g, ' ').trim();
  const words = [...text.matchAll(/\S+/g)].map(match => {
    const plain = plainName(match[0]).replace(/^[«(:،؛.]+|[:،؛.,)»]+$/g, '');
    return { at: match.index, plain: /^[فو]/.test(plain) && [...LINK_WORDS, ...SAID].includes(plain.slice(1)) ? plain.slice(1) : plain };
  });
  const starts = words.flatMap((each, i) => {
    const next = words[i + 1]?.plain;
    if (SAID.includes(each.plain)) return next && !LINK_WORDS.includes(next) && !NOT_LINKS.includes(next) && !SAID.includes(next) && next !== 'لي' && !/^ف|^أ\S*ت$/.test(next) ? [i] : [];
    return LINK_WORDS.includes(each.plain) && !(each.plain === 'عن' && NOT_LINKS.includes(next ?? '')) ? [i] : [];
  });
  let last = starts.length - 1;
  const kin = (i: number) => KIN.includes(words[i + 1]?.plain ?? '') || (OWN_KIN.includes(words[i + 1]?.plain ?? '') && words[i].plain !== 'عن');
  while (last > 0 && kin(starts[last])) last--;
  const from = last < 0 ? 0 : words[starts[last]].at;
  return { head: text.slice(0, from).trim(), tail: text.slice(from).trim() };
}

const LINK_WORDS = ['حدثتني', 'حدثنا', 'حدثني', 'أخبرنا', 'أخبرني', 'أنبأنا', 'سمعت', 'سمع', 'أن', 'عن'];
const NOT_LINKS = ['النبي', 'رسول'];
const KIN = ['أبيه', 'أبيها', 'جده', 'عمه', 'أمه'];
const OWN_KIN = ['أبي', 'جدي'];
const SAID = ['قال', 'قالت'];

export const narratorOf = (isnad: string) => isnadParts(isnad).tail.replace(/[؛،:,.\s]+$/, '');

export const reportSlots = (lines: SceneLine[], count: number) => sceneSlots([{ ordinal: 0, lines }], count)[0];

export function reportHadith(report: { url?: string }): { book: 'bukhari' | 'muslim'; n: number } | undefined {
  const found = report.url ? /sunnah\.com\/(bukhari|muslim):(\d+)$/u.exec(report.url) : null;
  return found ? { book: found[1] as 'bukhari' | 'muslim', n: Number(found[2]) } : undefined;
}

export const whenName = (story: Pick<AppStory, 'when'>) =>
  story.when?.pages.map(page => (page === 'before' ? 'قبل الهجرة' : `السنة ${num(page)}`)).join(' أو ');

export const revealedIn = (ayat: Pick<AppStoryAyat, 'label'>) => ayat.label.startsWith('نزل فيه');

export function ayatOf(from: string, to: string): string[] {
  let [surah, ayah] = from.split(':').map(Number);
  const keys = [from];
  while (keys[keys.length - 1] !== to && surah <= 114) {
    if (ayah < (surahRows.find(row => row.number === surah)?.numberOfAyat ?? 0)) ayah++;
    else { surah++; ayah = 1; }
    keys.push(`${surah}:${ayah}`);
  }
  return keys;
}
