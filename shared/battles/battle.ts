import type { LonLat } from './map';
import { num } from '../quran/arabicNumber';
import { normalizeWord } from '../quran/normalize';

export type AppCite = { text: string; cite: string; url?: string };
export type AppReading = { text: string; refs: AppCite[] };
export type AppCited<T> = { value: T; refs: AppCite[]; others?: AppReading[] };

export type AppPersonLink = { slug: string; name: string };

export type AppMoment = {
  title: string;
  isnad?: string;
  quote: string;
  grading: string;
  cite: string;
  url: string;
  people: AppPersonLink[];
};

export type AppBattle = {
  slug: string;
  name: string;
  kind?: AppCited<string>;
  year?: AppCited<number>;
  location?: AppCited<string>;
  place?: { name: string; at: LonLat; refs: AppCite[] };
  counts: { muslims?: AppCited<number>; others?: AppCited<number>; muslimsKilled?: AppCited<number>; othersKilled?: AppCited<number> };
  moments: AppMoment[];
  martyrs: AppPersonLink[];
  present: AppPersonLink[];
};

export const KIND_NAMES: Record<string, string> = { GHAZWAH: 'غزوة', SARIYYAH: 'سرية', BATTLE: 'معركة' };

export type AppMomentBattle = Pick<AppBattle, 'slug' | 'name' | 'kind' | 'year' | 'moments'>;

export const courseTitle = (kind?: string): string => ({ 'غزوة': 'مجرى الغزوة', 'سرية': 'مجرى السرية' } as Record<string, string>)[kind ?? ''] ?? 'مجرى المعركة';

export const battleLine = (battle: Pick<AppBattle, 'kind' | 'year'>) =>
  [battle.kind?.value, battle.year && `السنة ${num(battle.year.value)} للهجرة`].filter(Boolean).join(' · ');

export function placeRefs(battle: Pick<AppBattle, 'place'>): AppCite[][] {
  const groups = new Map<string, AppCite[]>();
  for (const ref of battle.place?.refs ?? []) {
    const book = ref.cite.split('، ')[0];
    groups.set(book, [...(groups.get(book) ?? []), ref]);
  }
  return [...groups.values()];
}

const bare = (text: string) => normalizeWord(text).replace(/^ال/, '');

export function searchBattles<B extends Pick<AppBattle, 'name' | 'place' | 'location'>>(battles: readonly B[], query: string): B[] {
  const words = query.split(/\s+/).filter(Boolean).map(bare).filter(Boolean);
  if (!words.length) return [];
  return battles.filter(battle => {
    const said = [battle.name, battle.place?.name, battle.location?.value].filter(Boolean).join(' ').split(/\s+/).map(bare);
    return words.every(word => said.some(each => each.includes(word)));
  });
}

export function courseLine(battle: Pick<AppBattle, 'kind' | 'moments'>): string {
  const n = battle.moments.length;
  const scenes = n === 1 ? 'مشهد واحد' : n === 2 ? 'مشهدين' : n <= 10 ? `${num(n)} مشاهد` : `${num(n)} مشهدًا`;
  return `${courseTitle(battle.kind?.value)} في ${scenes}`;
}

export function prophetSaying(quote: string): { lead: string; saying: string; rest: string } | undefined {
  const open = quote.indexOf('"');
  const close = open < 0 ? -1 : quote.indexOf('"', open + 1);
  if (close < 0) return undefined;
  const lead = quote.slice(0, open).trim();
  const lastSpeaker = lead.split(/[.؟!]/).pop() ?? '';
  if (!/(النبي|رسول الله)/.test(lastSpeaker) || !lead.endsWith(':')) return undefined;
  const mark = quote.slice(close + 1).match(/^[؟?!]/)?.[0] ?? '';
  return { lead, saying: quote.slice(open + 1, close).trim() + mark, rest: quote.slice(close + 1 + mark.length).replace(/^[\s.،]+/, '').trim() };
}

export const UNITS = [1, 10, 50, 100, 500, 1000] as const;
export const unitFor = (most: number) => UNITS.find(unit => most / unit <= 100) ?? UNITS[UNITS.length - 1];
export const UNIT_WORDS: Record<(typeof UNITS)[number], string> = {
  1: 'رجل', 10: 'عشرة رجال', 50: 'خمسون رجلًا', 100: 'مئة رجل', 500: 'خمسمئة رجل', 1000: 'ألف رجل',
};
