// A sira story as the phone app shows it (owner, 2026-11-18): an event told whole as the source tells it, in moments,
// written from the catalog by scripts/battles/buildAppBattles.ts into shared/data/events/stories.json.
import type { AppCite, AppPersonLink } from '../battles/battle';
import { sceneSlots, type SceneLine } from '../hadith';
import { num } from '../quran/arabicNumber';
import { surahName } from '../quran/surahNames';

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

export type AppStory = {
  slug: string;
  name: string;
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

/** The report's last link, «عَنْ ابْنِ عَبَّاسٍ», whose telling the drawing is: the chain from its last «عن», as printed. */
export function narratorOf(isnad: string): string {
  const at = isnad.lastIndexOf('عَنْ ');
  return (at < 0 ? isnad : isnad.slice(at)).replace(/[؛،:,.\s]+$/, '');
}

/** A drawn report's colours: one scene, the Prophet ﷺ first, as the hadith scenes give them. */
export const reportSlots = (lines: SceneLine[], count: number) => sceneSlots([{ ordinal: 0, lines }], count)[0];
