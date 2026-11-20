// The website's cards of the drawings built for their pages (the app's NasabPost, TiesPost, BattlePost, HadithScenePost,
// OpeningCardPost, OathPost and EventPost in mobile/src/components/HomeFeed.tsx), worked out on the server: the items
// (walked by the feed through src/lib/feedLists.ts) and their sources come from shared/drawingCards.ts, the views from each
// page's own builder.
import battlesJson from '@shared/data/battles/battles.json';
import unitsJson from '@shared/data/hadith/units.json';
import treeData from '@shared/quran/quranText/corpus';
import type { AppBattle } from '@shared/battles/battle';
import type { AppHadith, SceneView } from '@shared/hadith';
import { DRAWING_CARD_KINDS, type DrawingCardKind } from '@shared/interests';
import { openingCards, type OpeningCard } from '@shared/quran/openingKinds';
import { buildOaths, type OathView } from '@shared/quran/oaths';
import { findProphet, storyTitle } from '@shared/quran/prophets';
import { STORIES } from '@shared/quran/prophets/stories';
import { buildStory, placesOf, type EventView, type Place } from '@shared/quran/prophets/story';
import { quranStoryText } from '@shared/quran/prophets/storyText';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import verdictData from '@shared/quran/prophets/verdicts.json';
import type { QuizSource } from '@shared/quiz/sources';
import {
  battleHeadSources, battleItems, battleOnCard, eventItems, eventOf, eventSources, nasabPeople, nasabSources, oathItems, oathSources,
  openingItems, openingSources, sceneItems, sceneOf, sceneSources, tiesPeople, tiesSources,
} from '@shared/drawingCards';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import { findPerson, GRAPH, nasabView, PEOPLE, personName, tiesView, type NasabView, type PersonHead, type TiesView } from '@/lib/tarajim';

const BATTLES = battlesJson as AppBattle[];
const UNITS = (unitsJson as AppHadith).units;

export type DrawingCard = { /** The card's lasting id, as the app's feed saves it. */ item: string; sources: QuizSource[] } & (
  | { kind: 'nasab'; person: PersonHead; nasab: NasabView }
  | { kind: 'ties'; person: PersonHead; ties: TiesView }
  | { kind: 'battle'; battle: AppBattle }
  | { kind: 'hadith-scene'; unit: { id: string; book: string; kitab?: string }; scenes: SceneView[]; at: number }
  | { kind: 'opening'; card: OpeningCard }
  | { kind: 'oath'; oath: OathView }
  | { kind: 'event'; slug: string; title: string; phase: string; event: EventView; places: Place[]; at: number });

const head = (slug: string): PersonHead => { const person = findPerson(slug)!; return { slug, name: personName(person), sex: person.sex }; };
const byKey = new Map(treeData.ayat.map(ayah => [ayah.key, ayah]));

let openings: OpeningCard[] | undefined;
const openingList = () => (openings ??= openingCards(key => byKey.get(key)));
/** The oaths with the corpus's words: enough for their ids; a card draws the mushaf's words (`oathOf`). */
let oathIds: OathView[] | undefined;
const oathIdList = () => (oathIds ??= [...buildOaths('allah', key => byKey.get(key)?.words), ...buildOaths('others', key => byKey.get(key)?.words)]);
let oaths: Promise<OathView[]> | undefined;
const oathOf = (id: string) => (oaths ??= loadReaderAyat().then(ayat => {
  const words = new Map(ayat.map(ayah => [ayah.key, ayah.words]));
  return [...buildOaths('allah', key => words.get(key)), ...buildOaths('others', key => words.get(key))];
}).catch(error => { oaths = undefined; throw error; })).then(all => all.find(each => each.id === id));

const ITEMS: Record<DrawingCardKind, () => string[]> = {
  nasab: () => nasabPeople(PEOPLE), ties: () => tiesPeople(PEOPLE, GRAPH), battle: () => battleItems(BATTLES), 'hadith-scene': () => sceneItems(UNITS),
  opening: () => openingItems(openingList()), oath: () => oathItems(oathIdList()), event: () => eventItems(STORIES),
};
const items: Partial<Record<DrawingCardKind, string[]>> = {};
/** A drawing kind's items by their lasting ids, in the order the feed walks them. */
export const drawingItems = (kind: DrawingCardKind) => (items[kind] ??= ITEMS[kind]());

/** A prophet's event as his story page shows it: the places the owner kept; null once none or one is left. */
function eventCard(item: string): DrawingCard | null {
  const found = eventOf(STORIES, item);
  const prophet = found && findProphet(found.slug);
  if (!found || !prophet) return null;
  const all = withUnappliedStoryReviews(verdictData.places as PlaceVerdicts);
  const verdicts = Object.fromEntries(Object.entries(all).filter(([key]) => key.startsWith(`${found.slug}/`)));
  const event = keptViews(found.slug, buildStory(STORIES[found.slug].events, quranStoryText), verdicts).find(view => view.title === found.event.title);
  const places = event ? placesOf(event) : [];
  if (!event || places.length < 2) return null;
  return { item, kind: 'event', slug: found.slug, title: storyTitle(prophet), phase: STORIES[found.slug].phases[event.phase], event, places, at: found.at, sources: eventSources(found.event) };
}

/** The card of `kind` for `item`, or null when the data no longer holds it. */
export async function drawingCardOf(kind: string, item: string): Promise<DrawingCard | null> {
  if (!(DRAWING_CARD_KINDS as readonly string[]).includes(kind) || !drawingItems(kind as DrawingCardKind).includes(item)) return null;
  switch (kind as DrawingCardKind) {
    case 'nasab': return { item, kind: 'nasab', person: head(item), nasab: nasabView([item], false), sources: nasabSources(findPerson(item)!, PEOPLE) };
    case 'ties': { const ties = tiesView(item); return ties ? { item, kind: 'ties', person: head(item), ties, sources: tiesSources(GRAPH, item) } : null; }
    case 'battle': { const battle = BATTLES.find(each => each.slug === item)!; return { item, kind: 'battle', battle: battleOnCard(battle), sources: battleHeadSources(battle) }; }
    case 'hadith-scene': {
      const { unit, report, at } = sceneOf(UNITS, item)!;
      return { item, kind: 'hadith-scene', unit: { id: unit.id, book: unit.book, ...(unit.kitab && { kitab: unit.kitab }) }, scenes: report.scenes, at, sources: sceneSources(unit) };
    }
    case 'opening': { const card = openingList().find(each => each.id === item)!; return { item, kind: 'opening', card, sources: openingSources(card) }; }
    case 'oath': { const oath = await oathOf(item); return oath ? { item, kind: 'oath', oath, sources: oathSources(item) } : null; }
    case 'event': return eventCard(item);
  }
}
