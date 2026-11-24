// A sira story as the phone app shows it (owner, 2026-11-18): an event told whole as the source tells it, in moments,
// written from the catalog by scripts/battles/buildAppBattles.ts into shared/data/events/stories.json.
import type { AppCite, AppPersonLink } from '../battles/battle';
import { sceneSlots, type SceneLine } from '../hadith';
import { num } from '../quran/arabicNumber';
import { surahName } from '../quran/surahNames';
import { plainName } from '../quran/normalize';
import surahRows from '../data/quran/surahs.json';

/**
 * One speaker's words, or the narrator's (no `speaker`): the bubble holds `text`, and `lead` («فقال:») is drawn above it.
 * `witness` is the book that says who speaks, where the lead does not name him.
 */
export type AppTurn = { lead?: string; text: string; speaker?: { name: string; person?: string }; witness?: AppCite };

export type AppStoryMoment = { title: string; text: string; people: AppPersonLink[];
  /** The moment split by speaker («الرسم»), when the story has it. */
  turns?: AppTurn[] };

/** One report, whole: its chain, its moments, and the source's words on who has it, with the page. */
export type AppReport = { isnad?: string; moments: AppStoryMoment[]; grading?: string; cite: string; url: string };

/** Ayat the story turns on, with the quotes that say so. */
export type AppStoryAyat = { label: string; from: string; to: string; refs: AppCite[];
  /** Who the ayat were revealed about, as the evidence names him. */
  about?: AppPersonLink;
  /** The source's other reports on it, each in its words and attributed («وفي رواية …»). */
  others?: { text: string; refs: AppCite[] }[] };

/** A year page of «قصص السيرة»: «قبل الهجرة», or a year after the hijra. */
export type StoryPage = 'before' | number;

/** When a story happened: its pages (two when the sources differ on the year) and the quotes that give the year. */
export type StoryWhenApp = { pages: StoryPage[]; refs: AppCite[] };

export type AppStory = {
  slug: string;
  name: string;
  /** Its chapter: the heading al-Bukhari files it under, by our short name (src/lib/catalog/storyChapters.ts). */
  chapter: string;
  /** None when no source sets it in a year: it is on the page «بلا سنة». */
  when?: StoryWhenApp;
  /** Where it was, as the source names it, with its quotes. */
  place?: { value: string; refs: AppCite[] };
  tags: string[];
  people: AppPersonLink[];
  /** The first report is the story; the others are the source's other reports of it, shown folded. */
  reports: AppReport[];
  ayat: AppStoryAyat[];
};

/** «فصلت ١–١٣»: surah name first, then the ayat. */
export function rangeName(from: string, to: string): string {
  const [surah, first] = from.split(':').map(Number);
  const last = Number(to.split(':')[1]);
  return `${surahName(surah)} ${num(first)}${last === first ? '' : `–${num(last)}`}`;
}

/** Whether a report can be drawn as a conversation: every moment split by speaker, each speaker named by the text or a book. */
export const drawnReport = (report: AppReport) => report.moments.every(moment => moment.turns?.length);

/** A drawn report's turns as the hadith scene's lines, so the story is drawn by the same scene (`HadithScene`). */
export const reportLines = (report: AppReport): SceneLine[] => report.moments.flatMap(moment => moment.turns ?? []).map(turn =>
  turn.speaker
    ? { kind: 'turn', speaker: turn.speaker.name, ...(turn.speaker.person ? { agent: turn.speaker.person } : {}), text: turn.text, ...(turn.lead ? { lead: turn.lead } : {}) }
    : { kind: 'narration', text: turn.text });

/**
 * A chain split at its last link (owner, 2026-11-23: «عَنْ أَنَسٍ رضي الله عنه قَالَ:» is the line, the rest opens from it):
 * `tail` from the last word that passes it on («عن», «حدثني», «أخبرنا», «سمعت», «أنّ», «قال» before a name …) as printed,
 * `head` before it. «عن النبي ﷺ» is no link of its own, and «عن أبيه» goes with the link that names the father.
 */
export function isnadParts(isnad: string): { head: string; tail: string } {
  const text = isnad.replace(/\s+/g, ' ').trim();
  // Each word where it starts, read without its vowels and the stops around it.
  const words = [...text.matchAll(/\S+/g)].map(match => {
    const plain = plainName(match[0]).replace(/^[«(:،؛.]+|[:،؛.,)»]+$/g, '');
    // «فأخبرني», «وحدثني»: the same link after a joining letter.
    return { at: match.index, plain: /^[فو]/.test(plain) && [...LINK_WORDS, ...SAID].includes(plain.slice(1)) ? plain.slice(1) : plain };
  });
  const starts = words.flatMap((each, i) => {
    const next = words[i + 1]?.plain;
    // «قال الزبير:», «قالت عائشة:» pass it on; «قال: فلقيته», «قال: أتيت جابرا» tell what he did.
    if (SAID.includes(each.plain)) return next && !LINK_WORDS.includes(next) && !NOT_LINKS.includes(next) && !SAID.includes(next) && next !== 'لي' && !/^ف|^أ\S*ت$/.test(next) ? [i] : [];
    return LINK_WORDS.includes(each.plain) && !(each.plain === 'عن' && NOT_LINKS.includes(next ?? '')) ? [i] : [];
  });
  let last = starts.length - 1;
  // «حدثني أبي», «أخبرني جدي»: the speaker's own father; after «عن», «أبي» starts a kunya («عن أبي هريرة»).
  const kin = (i: number) => KIN.includes(words[i + 1]?.plain ?? '') || (OWN_KIN.includes(words[i + 1]?.plain ?? '') && words[i].plain !== 'عن');
  while (last > 0 && kin(starts[last])) last--;
  const from = last < 0 ? 0 : words[starts[last]].at;
  return { head: text.slice(0, from).trim(), tail: text.slice(from).trim() };
}

/** The words by which a chain passes a report on, unvowelled. */
const LINK_WORDS = ['حدثتني', 'حدثنا', 'حدثني', 'أخبرنا', 'أخبرني', 'أنبأنا', 'سمعت', 'سمع', 'أن', 'عن'];
/** What follows «عن» or «قال» where they pass nothing on: the Prophet ﷺ himself. */
const NOT_LINKS = ['النبي', 'رسول'];
/** «عن أبيه», «عن جده»: told by the one the link before names. */
const KIN = ['أبيه', 'أبيها', 'جده', 'عمه', 'أمه'];
const OWN_KIN = ['أبي', 'جدي'];
const SAID = ['قال', 'قالت'];

/** The report's last link, «عَنْ ابْنِ عَبَّاسٍ», whose telling the drawing is (the shared pictures' first line). */
export const narratorOf = (isnad: string) => isnadParts(isnad).tail.replace(/[؛،:,.\s]+$/, '');

/** A drawn report's colours: one scene, the Prophet ﷺ first, as the hadith scenes give them. */
export const reportSlots = (lines: SceneLine[], count: number) => sceneSlots([{ ordinal: 0, lines }], count)[0];

/** The hadith page a report opens: its book and number, from the page the catalog writes for it (src/lib/catalog/appStories.ts). */
export function reportHadith(report: { url?: string }): { book: 'bukhari' | 'muslim'; n: number } | undefined {
  const found = report.url ? /sunnah\.com\/(bukhari|muslim):(\d+)$/u.exec(report.url) : null;
  return found ? { book: found[1] as 'bukhari' | 'muslim', n: Number(found[2]) } : undefined;
}

/** When a story was, as its year pages name it («قبل الهجرة», «السنة ٨»), or nothing when no source sets it. */
export const whenName = (story: Pick<AppStory, 'when'>) =>
  story.when?.pages.map(page => (page === 'before' ? 'قبل الهجرة' : `السنة ${num(page)}`)).join(' أو ');

/** Whether ayat of a story are the ones revealed about it («نزل فيه», «نزل فيه في رواية أنس»), not ones recited in it. */
export const revealedIn = (ayat: Pick<AppStoryAyat, 'label'>) => ayat.label.startsWith('نزل فيه');

/** Every ayah from one key to another in the mushaf's order, across a surah's end: exactly the ayat a source names. */
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
