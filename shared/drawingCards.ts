// see docs/feed-cards.md
import { eventItem, lastNumber, sceneItem } from './feedItems';
import type { AppBattle, AppCite } from './battles/battle';
import { battleTimeline } from './battles/timeline';
import { layerBattles, type AtlasLayer } from './battles/atlas';
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

export function nasabSources(person: AppPerson, people: readonly AppPerson[]): QuizSource[] {
  const from = [...new Set(lineOf(person, people).map(name => name.from))];
  return pageSources(from.flatMap(slug => people.find(each => each.slug === slug)?.fullName?.refs ?? []));
}
export const nasabPeople = (people: readonly AppPerson[]) =>
  people.filter(person => lineOf(person, people).length > 1 && nasabSources(person, people).length > 0).map(person => person.slug);

export function ringGroups(graph: PeopleGraph, slug: string): TieGroup[] {
  const seen = new Set<string>();
  return tieGroups(graph, slug)
    .map(group => ({ ...group, ties: group.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
    .filter(group => group.ties.length > 0);
}
export const tiesSources = (graph: PeopleGraph, slug: string) =>
  pageSources(ringGroups(graph, slug).flatMap(group => group.ties.flatMap(tie => tie.link.refs)));
export const tiesPeople = (people: readonly AppPerson[], graph: PeopleGraph) =>
  people.filter(person => tiesSources(graph, person.slug).length > 0).map(person => person.slug);

export const FITNA_BATTLES: readonly string[] = ['jamal', 'siffin', 'nahrawan'];
export const battleOnCard = (battle: AppBattle): AppBattle => (FITNA_BATTLES.includes(battle.slug) ? { ...battle, counts: {}, moments: [] } : battle);
const hasCounts = (battle: AppBattle) => Object.values(battle.counts).some(Boolean);
const citedOf = (values: readonly ({ refs: AppCite[] } | undefined)[]) =>
  uniqueSources(values.flatMap(value => value?.refs ?? []).map(citeSource));
export const placeSources = (battles: readonly AppBattle[]) => citedOf(battles.map(battle => battle.place));
export const battleHeadSources = (battle: AppBattle) => citedOf([battle.kind, battle.year, battle.location]);
export const battleCardSources = (battle: AppBattle) => uniqueSources([...battleHeadSources(battle), ...citedOf([battle.place])]);
const countsSources = (battle: AppBattle) => {
  const { muslims, others, muslimsKilled, othersKilled } = battleOnCard(battle).counts;
  return citedOf([muslims, others, muslimsKilled, othersKilled]);
};
export const battleSources = (battle: AppBattle): QuizSource[] => uniqueSources([...battleCardSources(battle), ...countsSources(battle)]);
export const battleItems = (battles: readonly AppBattle[]) =>
  battles.filter(battle => (battle.place || hasCounts(battleOnCard(battle))) && battleSources(battle).length > 0).map(battle => battle.slug);

function scenesOf(unit: HadithUnitView) {
  return unit.reports.filter(report => report.voice !== 'AUTHOR').flatMap(report => report.scenes.map((scene, at) => ({ report, scene, at })));
}
const isChat = (scene: SceneView) => scene.lines.some(line => line.kind === 'turn');
export const sceneSources = (unit: HadithUnitView): QuizSource[] =>
  unit.compiler ? [{ book: unit.book, author: unit.compiler, ...(unit.kitab && { at: [unit.kitab, unit.bab].filter(Boolean).join('، ') }) }] : [];
export const sceneItems = (units: readonly HadithUnitView[]) =>
  units.flatMap(unit => (sceneSources(unit).length ? scenesOf(unit).flatMap(({ scene }, n) => (isChat(scene) ? [sceneItem(unit.id, n + 1)] : [])) : []));
export function sceneOf<U extends HadithUnitView>(units: readonly U[], item: string) {
  const split = lastNumber(item);
  const unit = split && units.find(each => each.id === split.head);
  const found = unit ? scenesOf(unit)[split!.n - 1] : undefined;
  return unit && found && isChat(found.scene) && sceneSources(unit).length ? { unit, ...found } : null;
}

export function authorCiteSource({ text, cite, url }: { text: string; cite: string; url?: string }): QuizSource {
  const comma = cite.indexOf('، ');
  if (comma < 0) return citeSource({ text, cite, url });
  const rest = cite.slice(comma + 2);
  const place = rest.match(/^(.*?)\s*((?:ص\s*)?[0-9٠-٩].*)$/u);
  return { book: place ? place[1] : rest, author: cite.slice(0, comma), ...(place && { at: place[2] }), ...(text && { quote: text }), ...(url && { url }) };
}

export const openingSources = (card: Pick<OpeningCard, 'refs'>) =>
  uniqueSources((card.refs ?? []).flatMap(ref => (ref.cite ? [authorCiteSource({ text: ref.text, cite: ref.cite, url: ref.url })] : [])));
export const openingItems = (cards: readonly OpeningCard[]) => cards.filter(card => openingSources(card).length > 0).map(card => card.id);

export const oathSources = (id: string) => uniqueSources((OATH_QUOTES[id] ?? []).map(authorCiteSource));
export const oathItems = (oaths: readonly Pick<OathView, 'id'>[]) => oaths.filter(oath => oathSources(oath.id).length > 0).map(oath => oath.id);

const toldInPlaces = (event: StoryEvent) => new Set(event.segments.map(segment => segment.surah)).size > 1;
export const eventItems = (stories: Record<string, { events: StoryEvent[] }>) =>
  Object.entries(stories).flatMap(([slug, story]) => story.events.flatMap((event, at) => (toldInPlaces(event) ? [eventItem(slug, at)] : [])));
export const eventSources = (event: StoryEvent): QuizSource[] => [storySource([event], event.phase)];
export function eventOf(stories: Record<string, { events: StoryEvent[] }>, item: string) {
  const split = lastNumber(item);
  const event = split ? stories[split.head]?.events[split.n] : undefined;
  return split && event && toldInPlaces(event) ? { slug: split.head, at: split.n, event } : null;
}

export function battleYearSlice(battles: readonly AppBattle[], year: number) {
  const { madinah, after } = battleTimeline([...battles]);
  const axis = madinah.some(column => column.year === year && column.dots.length) ? madinah : after;
  const at = axis.findIndex(column => column.year === year && column.dots.length);
  if (at < 0) return null;
  return { columns: axis.slice(Math.max(0, at - 1), at + 2), battles: battles.filter(battle => battle.year?.value === year) };
}
export function battleYearSources(battles: readonly AppBattle[], year: number): QuizSource[] {
  const slice = battleYearSlice(battles, year);
  const years = new Set(slice?.columns.map(column => column.year));
  return uniqueSources([
    ...citedOf(battles.filter(battle => years.has(battle.year?.value as number)).flatMap(battle => [battle.kind, battle.year])),
    ...citedOf(slice?.battles.map(battle => battle.place) ?? []),
  ]);
}
export function atlasSources(battles: readonly AppBattle[], layer: AtlasLayer, year?: number): QuizSource[] {
  const shown = layerBattles(battles, layer).filter(battle => layer === 'after' || (battle.year?.value ?? Infinity) <= (year ?? 0));
  const listed = layer === 'after' ? shown : shown.filter(battle => battle.year?.value === year);
  return uniqueSources([...citedOf(listed.flatMap(battle => [battle.kind, battle.year])), ...citedOf(shown.map(battle => battle.place))]);
}
export const battleYearItems = (battles: readonly AppBattle[]) =>
  [...new Set(battles.flatMap(battle => (typeof battle.year?.value === 'number' && battle.year.refs.length ? [battle.year.value] : [])))]
    .sort((a, b) => a - b).filter(year => battleYearSources(battles, year).length > 0).map(String);

export const ARMIES_TABS = ['field', 'killed'] as const;
export type ArmiesTab = (typeof ARMIES_TABS)[number];
export const armiesBattles = (battles: readonly AppBattle[]) =>
  battles.filter(battle => !FITNA_BATTLES.includes(battle.slug) && battle.counts.muslims && battle.counts.others)
    .sort((a, b) => (a.year?.value ?? Infinity) - (b.year?.value ?? Infinity));
export const armiesSources = (battles: readonly AppBattle[]) =>
  uniqueSources(armiesBattles(battles).flatMap(battle => [...battleHeadSources(battle), ...countsSources(battle)]));
export const armiesItems = (battles: readonly AppBattle[]): string[] =>
  armiesBattles(battles).length > 1 && armiesSources(battles).length ? [...ARMIES_TABS] : [];
