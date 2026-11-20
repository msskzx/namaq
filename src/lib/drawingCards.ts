// The website's cards of the drawings built for their pages (the app's NasabPost, TiesPost, BattlePost, HadithScenePost,
// OpeningCardPost, OathPost and EventPost in mobile/src/components/HomeFeed.tsx), worked out on the server: the items and
// their sources come from shared/drawingCards.ts, the views from each page's own builder.
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

export type DrawingCard = { slot: number; /** The card's lasting id, as the app's feed saves it. */ item: string; sources: QuizSource[] } & (
  | { kind: 'nasab'; person: PersonHead; nasab: NasabView }
  | { kind: 'ties'; person: PersonHead; ties: TiesView }
  | { kind: 'battle'; battle: AppBattle }
  | { kind: 'hadith-scene'; unit: { id: string; book: string; kitab?: string }; scenes: SceneView[]; at: number }
  | { kind: 'opening'; card: OpeningCard }
  | { kind: 'oath'; oath: OathView }
  | { kind: 'event'; slug: string; title: string; phase: string; event: EventView; places: Place[]; at: number });

const head = (slug: string): PersonHead => { const person = findPerson(slug)!; return { slug, name: personName(person), sex: person.sex }; };
const byKey = new Map(treeData.ayat.map(ayah => [ayah.key, ayah]));

let lists: Promise<Record<DrawingCardKind, string[]> & { openings: OpeningCard[]; oaths: OathView[] }> | undefined;
/** Every kind's items, worked out once. */
const listsOf = () => lists ??= loadReaderAyat().then(ayat => {
  const words = new Map(ayat.map(ayah => [ayah.key, ayah.words]));
  const openings = openingCards(key => byKey.get(key));
  const oaths = [...buildOaths('allah', key => words.get(key)), ...buildOaths('others', key => words.get(key))];
  return {
    openings, oaths,
    nasab: nasabPeople(PEOPLE), ties: tiesPeople(PEOPLE, GRAPH), battle: battleItems(BATTLES), 'hadith-scene': sceneItems(UNITS),
    opening: openingItems(openings), oath: oathItems(oaths), event: eventItems(STORIES),
  };
}).catch(error => { lists = undefined; throw error; });

/** A prophet's event as his story page shows it: the places the owner kept; null once none or one is left. */
function eventCard(slot: number, item: string): DrawingCard | null {
  const found = eventOf(STORIES, item);
  const prophet = found && findProphet(found.slug);
  if (!found || !prophet) return null;
  const all = withUnappliedStoryReviews(verdictData.places as PlaceVerdicts);
  const verdicts = Object.fromEntries(Object.entries(all).filter(([key]) => key.startsWith(`${found.slug}/`)));
  const event = keptViews(found.slug, buildStory(STORIES[found.slug].events, quranStoryText), verdicts).find(view => view.title === found.event.title);
  const places = event ? placesOf(event) : [];
  if (!event || places.length < 2) return null;
  return { slot, item, kind: 'event', slug: found.slug, title: storyTitle(prophet), phase: STORIES[found.slug].phases[event.phase], event, places, at: found.at, sources: eventSources(found.event) };
}

/** The card of `kind` for `item`, or null when the data no longer holds it. */
export async function drawingCardOf(kind: string, item: string, slot = 0): Promise<DrawingCard | null> {
  const list = await listsOf();
  if (!(DRAWING_CARD_KINDS as readonly string[]).includes(kind) || !list[kind as DrawingCardKind].includes(item)) return null;
  switch (kind as DrawingCardKind) {
    case 'nasab': return { slot, item, kind: 'nasab', person: head(item), nasab: nasabView([item], false), sources: nasabSources(findPerson(item)!, PEOPLE) };
    case 'ties': { const ties = tiesView(item); return ties ? { slot, item, kind: 'ties', person: head(item), ties, sources: tiesSources(GRAPH, item) } : null; }
    case 'battle': { const battle = BATTLES.find(each => each.slug === item)!; return { slot, item, kind: 'battle', battle: battleOnCard(battle), sources: battleHeadSources(battle) }; }
    case 'hadith-scene': {
      const { unit, report, at } = sceneOf(UNITS, item)!;
      return { slot, item, kind: 'hadith-scene', unit: { id: unit.id, book: unit.book, ...(unit.kitab && { kitab: unit.kitab }) }, scenes: report.scenes, at, sources: sceneSources(unit) };
    }
    case 'opening': { const card = list.openings.find(each => each.id === item)!; return { slot, item, kind: 'opening', card, sources: openingSources(card) }; }
    case 'oath': return { slot, item, kind: 'oath', oath: list.oaths.find(each => each.id === item)!, sources: oathSources(item) };
    case 'event': return eventCard(slot, item);
  }
}

/**
 * One card a batch, of the kinds the reader's interests show (`kinds`), in turn by the batch; each kind's item turns with
 * the day as the other website cards' do (src/lib/tarajim.ts tarajimCards).
 */
export async function drawingCards(day: number, slots: number[], kinds: string[]): Promise<DrawingCard[]> {
  const shown = DRAWING_CARD_KINDS.filter(kind => kinds.includes(kind));
  if (!shown.length) return [];
  const list = await listsOf();
  const cards = await Promise.all(slots.map(slot => {
    const kind = shown[slot % shown.length];
    const items = list[kind];
    const turn = Math.floor(slot / shown.length);
    return items.length ? drawingCardOf(kind, items[(((day * 41 + turn) % items.length) + items.length) % items.length], slot) : null;
  }));
  return cards.filter((card): card is DrawingCard => card !== null);
}
