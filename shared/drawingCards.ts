// The feed cards of drawings built for their pages (owner, 2026-11-20: home was missing them; docs/feed-cards.md): each
// kind's items and the sources its card's line names. An item whose own data names no source is left out.
import { eventItem, lastNumber, sceneItem } from './feedItems';
import type { AppBattle, AppCite } from './battles/battle';
import type { HadithUnitView, SceneView } from './hadith';
import type { OathView } from './quran/oaths';
import { OATH_QUOTES } from './quran/oathSources';
import type { OpeningCard } from './quran/openingKinds';
import type { StoryEvent } from './quran/prophets/story';
import { storySource } from './quran/pieceSources';
import { citeSource, uniqueSources, type QuizSource } from './quiz/sources';
import { pageSources, type AppPerson } from './tarajim';
import { tieGroups, type PeopleGraph, type TieGroup } from './tarajimGraph';
import { lineOf } from './tarajimLine';

/** «نسبه»: the pages of every entry whose nasab a name of the tree comes from (the nasab page's own credit). */
export function nasabSources(person: AppPerson, people: readonly AppPerson[]): QuizSource[] {
  const from = [...new Set(lineOf(person, people).map(name => name.from))];
  return pageSources(from.flatMap(slug => people.find(each => each.slug === slug)?.fullName?.refs ?? []));
}
/** The people whose tree has a father to draw, with a page behind it. */
export const nasabPeople = (people: readonly AppPerson[]) =>
  people.filter(person => lineOf(person, people).length > 1 && nasabSources(person, people).length > 0).map(person => person.slug);

/** A person's ties by kind, each person once under the nearest kind: what the ring draws (the app's tiesOf, the website's tiesView). */
export function ringGroups(graph: PeopleGraph, slug: string): TieGroup[] {
  const seen = new Set<string>();
  return tieGroups(graph, slug)
    .map(group => ({ ...group, ties: group.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
    .filter(group => group.ties.length > 0);
}
/** «صلاته»: the pages that state the ties on the ring. */
export const tiesSources = (graph: PeopleGraph, slug: string) =>
  pageSources(ringGroups(graph, slug).flatMap(group => group.ties.flatMap(tie => tie.link.refs)));
export const tiesPeople = (people: readonly AppPerson[], graph: PeopleGraph) =>
  people.filter(person => tiesSources(graph, person.slug).length > 0).map(person => person.slug);

/**
 * The battles among the Companions (owner, 2026-11-18/19): only their name, year, place and people show, as on the battle
 * page, whose data holds no numbers or moments for them.
 */
export const FITNA_BATTLES: readonly string[] = ['jamal', 'siffin', 'nahrawan'];
/** A battle as its card draws it: the map and the two sides' numbers, a fitna battle's numbers left out whatever the data holds. */
export const battleOnCard = (battle: AppBattle): AppBattle => (FITNA_BATTLES.includes(battle.slug) ? { ...battle, counts: {}, moments: [] } : battle);
const hasCounts = (battle: AppBattle) => Object.values(battle.counts).some(Boolean);
const citedOf = (values: readonly ({ refs: AppCite[] } | undefined)[]) =>
  uniqueSources(values.flatMap(value => value?.refs ?? []).map(citeSource));
/** The pages of the card's head: the battle's kind, year and place. */
export const battleHeadSources = (battle: AppBattle) => citedOf([battle.kind, battle.year, battle.location]);
/** The pages of everything the card shows: its head and the numbers. */
export function battleSources(battle: AppBattle): QuizSource[] {
  const { muslims, others, muslimsKilled, othersKilled } = battleOnCard(battle).counts;
  return uniqueSources([...battleHeadSources(battle), ...citedOf([muslims, others, muslimsKilled, othersKilled])]);
}
/** The battles with a map or numbers to draw, and a page behind them. */
export const battleItems = (battles: readonly AppBattle[]) =>
  battles.filter(battle => (battle.place || hasCounts(battleOnCard(battle))) && battleSources(battle).length > 0).map(battle => battle.slug);

/** A hadith's scenes as its page draws them: those of the reports the compiler transmits, numbered from 1 across them. */
function scenesOf(unit: HadithUnitView) {
  return unit.reports.filter(report => report.voice !== 'AUTHOR').flatMap(report => report.scenes.map((scene, at) => ({ report, scene, at })));
}
/** A scene drawn as a chat: someone speaks in it. */
const isChat = (scene: SceneView) => scene.lines.some(line => line.kind === 'turn');
/** The book that records the hadith, its kitab and bab. */
export const sceneSources = (unit: HadithUnitView): QuizSource[] =>
  unit.compiler ? [{ book: unit.book, author: unit.compiler, ...(unit.kitab && { at: [unit.kitab, unit.bab].filter(Boolean).join('، ') }) }] : [];
export const sceneItems = (units: readonly HadithUnitView[]) =>
  units.flatMap(unit => (sceneSources(unit).length ? scenesOf(unit).flatMap(({ scene }, n) => (isChat(scene) ? [sceneItem(unit.id, n + 1)] : [])) : []));
/** The unit, its report and the scene an item names, with the scene's place among the report's (for its speakers' colours). */
export function sceneOf<U extends HadithUnitView>(units: readonly U[], item: string) {
  const split = lastNumber(item);
  const unit = split && units.find(each => each.id === split.head);
  const found = unit ? scenesOf(unit)[split!.n - 1] : undefined;
  return unit && found && isChat(found.scene) && sceneSources(unit).length ? { unit, ...found } : null;
}

/** A Quran-sciences reference as its data writes it, the author first («السيوطي، الإتقان ٣/٣٦١»): the book, its author and where in it. */
export function authorCiteSource({ text, cite, url }: { text: string; cite: string; url?: string }): QuizSource {
  const comma = cite.indexOf('، ');
  if (comma < 0) return citeSource({ text, cite, url });
  const rest = cite.slice(comma + 2);
  const place = rest.match(/^(.*?)\s*((?:ص\s*)?[0-9٠-٩].*)$/u);
  return { book: place ? place[1] : rest, author: cite.slice(0, comma), ...(place && { at: place[2] }), ...(text && { quote: text }), ...(url && { url }) };
}

/** «فواتح السور»: the book that puts the card's surahs together; a card with none is our own grouping and stays out. */
export const openingSources = (card: Pick<OpeningCard, 'refs'>) =>
  uniqueSources((card.refs ?? []).flatMap(ref => (ref.cite ? [authorCiteSource({ text: ref.text, cite: ref.cite, url: ref.url })] : [])));
export const openingItems = (cards: readonly OpeningCard[]) => cards.filter(card => openingSources(card).length > 0).map(card => card.id);

/** «الأقسام»: the scholar's sentence on the oath. */
export const oathSources = (id: string) => uniqueSources((OATH_QUOTES[id] ?? []).map(authorCiteSource));
export const oathItems = (oaths: readonly Pick<OathView, 'id'>[]) => oaths.filter(oath => oathSources(oath.id).length > 0).map(oath => oath.id);

/** A prophet's event told in more than one surah: its places side by side are the drawing. */
const toldInPlaces = (event: StoryEvent) => new Set(event.segments.map(segment => segment.surah)).size > 1;
export const eventItems = (stories: Record<string, { events: StoryEvent[] }>) =>
  Object.entries(stories).flatMap(([slug, story]) => story.events.flatMap((event, at) => (toldInPlaces(event) ? [eventItem(slug, at)] : [])));
/** The event's ayat in the mushaf. */
export const eventSources = (event: StoryEvent): QuizSource[] => [storySource([event], event.phase)];
/** The prophet and the event an item names. */
export function eventOf(stories: Record<string, { events: StoryEvent[] }>, item: string) {
  const split = lastNumber(item);
  const event = split ? stories[split.head]?.events[split.n] : undefined;
  return split && event && toldInPlaces(event) ? { slug: split.head, at: split.n, event } : null;
}
