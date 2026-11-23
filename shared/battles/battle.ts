// A battle as the phone app shows it (owner, 2026-11-18), written from the catalog by scripts/battles/buildAppBattles.ts
// into shared/data/battles/battles.json, since the app is offline.
import type { LonLat } from './map';
import { num } from '../quran/arabicNumber';
import { normalizeWord } from '../quran/normalize';

/** One quote a value stands on, with the page it cites. */
export type AppCite = { text: string; cite: string; url?: string };
/** Another reading of a value, as the source words it («وقيل …»), with its own quotes. */
export type AppReading = { text: string; refs: AppCite[] };
/**
 * A value with the quotes it stands on, and the other readings where the sources differ (owner, 2026-11-18: a disputed
 * point is shown with every reading, each attributed and referenced).
 */
export type AppCited<T> = { value: T; refs: AppCite[]; others?: AppReading[] };

export type AppPersonLink = { slug: string; name: string };

export type AppMoment = {
  title: string;
  /** Who the source has the report from, shown with its reference. */
  isnad?: string;
  /** The whole report, as the source prints it. */
  quote: string;
  grading: string;
  cite: string;
  url: string;
  people: AppPersonLink[];
};

export type AppBattle = {
  slug: string;
  name: string;
  /** غزوة, سرية or معركة. */
  kind?: AppCited<string>;
  year?: AppCited<number>;
  /** The source's own name for the place. */
  location?: AppCited<string>;
  /** Where it is pinned on the map, with the books that place it there (shared/battles/places.ts). */
  place?: { name: string; at: LonLat; refs: AppCite[] };
  counts: { muslims?: AppCited<number>; others?: AppCited<number>; muslimsKilled?: AppCited<number>; othersKilled?: AppCited<number> };
  moments: AppMoment[];
  martyrs: AppPersonLink[];
  present: AppPersonLink[];
};

export const KIND_NAMES: Record<string, string> = { GHAZWAH: 'غزوة', SARIYYAH: 'سرية', BATTLE: 'معركة' };

/** A battle with moments, as the home feed's moment card needs it. */
export type AppMomentBattle = Pick<AppBattle, 'slug' | 'name' | 'kind' | 'year' | 'moments'>;

/** The heading over a battle's moments: «مجرى الغزوة», «مجرى السرية», else «مجرى المعركة» (the app's and the website's battle pages). */
export const courseTitle = (kind?: string): string => ({ 'غزوة': 'مجرى الغزوة', 'سرية': 'مجرى السرية' } as Record<string, string>)[kind ?? ''] ?? 'مجرى المعركة';

/** «غزوة · السنة ٢ للهجرة»: a battle's kind and year in one line (the app's and the website's battle cards and pages). */
export const battleLine = (battle: Pick<AppBattle, 'kind' | 'year'>) =>
  [battle.kind?.value, battle.year && `السنة ${num(battle.year.value)} للهجرة`].filter(Boolean).join(' · ');

/** The references of a battle's pin, one group per book: the books that place it, then the GeoNames records of its coordinates. */
export function placeRefs(battle: Pick<AppBattle, 'place'>): AppCite[][] {
  const groups = new Map<string, AppCite[]>();
  for (const ref of battle.place?.refs ?? []) {
    const book = ref.cite.split('، ')[0];
    groups.set(book, [...(groups.get(book) ?? []), ref]);
  }
  return [...groups.values()];
}

/** A word as names are matched: bare letters, no article. */
const bare = (text: string) => normalizeWord(text).replace(/^ال/, '');

/**
 * The battles whose name, the source's place or the pinned place holds every word typed (owner, 2026-11-23: a search at
 * the top of the battles page and of the atlas), whatever the article, the hamza or the vowel marks.
 */
export function searchBattles<B extends Pick<AppBattle, 'name' | 'place' | 'location'>>(battles: readonly B[], query: string): B[] {
  const words = query.split(/\s+/).filter(Boolean).map(bare).filter(Boolean);
  if (!words.length) return [];
  return battles.filter(battle => {
    const said = [battle.name, battle.place?.name, battle.location?.value].filter(Boolean).join(' ').split(/\s+/).map(bare);
    return words.every(word => said.some(each => each.includes(word)));
  });
}

/** «مجرى الغزوة في ٧ مشاهد»: a battle's moments counted as Arabic counts them (one, two, three to ten, eleven on). */
export function courseLine(battle: Pick<AppBattle, 'kind' | 'moments'>): string {
  const n = battle.moments.length;
  const scenes = n === 1 ? 'مشهد واحد' : n === 2 ? 'مشهدين' : n <= 10 ? `${num(n)} مشاهد` : `${num(n)} مشهدًا`;
  return `${courseTitle(battle.kind?.value)} في ${scenes}`;
}

/**
 * A report whose first quoted words are the Prophet's ﷺ, split around them («… قال يوم بدر: "هذا جبريل…"»): the words
 * before them name him as the speaker, so the battle page can set his words apart (owner, 2026-11-23: his words as a
 * large quote). A report whose first quote is someone else's, or that has none, stays whole (undefined).
 */
export function prophetSaying(quote: string): { lead: string; saying: string; rest: string } | undefined {
  const open = quote.indexOf('"');
  const close = open < 0 ? -1 : quote.indexOf('"', open + 1);
  if (close < 0) return undefined;
  const lead = quote.slice(0, open).trim();
  // The speaker is named just before the quote: «قال النبي ﷺ …:» or «أن رسول الله ﷺ قال …:», not a later «قال» of another.
  const lastSpeaker = lead.split(/[.؟!]/).pop() ?? '';
  if (!/(النبي|رسول الله)/.test(lastSpeaker) || !lead.endsWith(':')) return undefined;
  // A question or exclamation mark printed after the closing quote is the saying's own («"ما ترون في هؤلاء"؟»).
  const mark = quote.slice(close + 1).match(/^[؟?!]/)?.[0] ?? '';
  return { lead, saying: quote.slice(open + 1, close).trim() + mark, rest: quote.slice(close + 1 + mark.length).replace(/^[\s.،]+/, '').trim() };
}

/** How many men a dot stands for, so the larger side of a battle stays under a hundred dots. */
export const UNITS = [1, 10, 50, 100, 500, 1000] as const;
export const unitFor = (most: number) => UNITS.find(unit => most / unit <= 100) ?? UNITS[UNITS.length - 1];
export const UNIT_WORDS: Record<(typeof UNITS)[number], string> = {
  1: 'رجل', 10: 'عشرة رجال', 50: 'خمسون رجلًا', 100: 'مئة رجل', 500: 'خمسمئة رجل', 1000: 'ألف رجل',
};
