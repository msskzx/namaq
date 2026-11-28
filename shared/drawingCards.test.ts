import { describe, expect, it } from 'vitest';
import peopleJson from './data/tarajim/people.json';
import battlesJson from './data/battles/battles.json';
import unitsJson from './data/hadith/units.json';
import corpus from './quran/quranText/corpus';
import type { AppPerson } from './tarajim';
import type { AppBattle } from './battles/battle';
import type { AppHadith } from './hadith';
import { peopleGraph } from './tarajimGraph';
import { openingCards } from './quran/openingKinds';
import { buildOaths } from './quran/oaths';
import { STORIES } from './quran/prophets/stories';
import { lastNumber } from './feedItems';
import { MADINAH_YEARS } from './battles/timeline';
import {
  armiesBattles, armiesItems, armiesSources, authorCiteSource, battleItems, battleYearItems, battleYearSlice, battleYearSources, battleOnCard, battleSources, eventItems, eventOf, eventSources, FITNA_BATTLES, nasabPeople, nasabSources, oathItems, oathSources,
  openingItems, openingSources, sceneItems, sceneOf, sceneSources, tiesPeople, tiesSources,
} from './drawingCards';

const people = peopleJson as AppPerson[];
const graph = peopleGraph(people);
const battles = battlesJson as AppBattle[];
const units = (unitsJson as AppHadith).units;
const byKey = new Map(corpus.ayat.map(ayah => [ayah.key, ayah]));
const cards = openingCards(key => byKey.get(key));
const oaths = [...buildOaths('allah', key => byKey.get(key)?.words), ...buildOaths('others', key => byKey.get(key)?.words)];

describe('the drawing cards\' items', () => {
  const kinds: [string, string[], (item: string) => unknown[]][] = [
    ['nasab', nasabPeople(people), slug => nasabSources(people.find(person => person.slug === slug)!, people)],
    ['ties', tiesPeople(people, graph), slug => tiesSources(graph, slug)],
    ['battle', battleItems(battles), slug => battleSources(battles.find(battle => battle.slug === slug)!)],
    ['hadith-scene', sceneItems(units), item => sceneSources(sceneOf(units, item)!.unit)],
    ['opening', openingItems(cards), id => openingSources(cards.find(card => card.id === id)!)],
    ['oath', oathItems(oaths), oathSources],
    ['event', eventItems(STORIES), item => eventSources(eventOf(STORIES, item)!.event)],
    ['battle-year', battleYearItems(battles), year => battleYearSources(battles, Number(year))],
    ['battle-armies', armiesItems(battles), () => armiesSources(battles)],
  ];
  it.each(kinds)('every %s item names a source, and there is one', (_, items, sources) => {
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) expect(sources(item).length, item).toBeGreaterThan(0);
  });

  it('leaves out what its data gives no source for', () => {
    const ours = cards.find(card => !card.refs);
    if (ours) expect(openingItems(cards)).not.toContain(ours.id);
    expect(openingItems([{ ...cards[0], refs: undefined }])).toEqual([]);
    const unsourced = oaths.find(oath => !oathSources(oath.id).length);
    expect(unsourced && oathItems(oaths)).not.toContain(unsourced?.id);
    expect(sceneItems(units.map(unit => ({ ...unit, compiler: undefined })))).toEqual([]);
    const bare = (battle: AppBattle): AppBattle => ({ ...battle, kind: undefined, year: undefined, location: undefined, place: undefined, counts: {} });
    expect(battleItems(battles.map(bare))).toEqual([]);
  });

  it('draws a scene only where someone speaks, and an event only where more than one surah tells it', () => {
    for (const item of sceneItems(units)) expect(sceneOf(units, item)!.scene.lines.some(line => line.kind === 'turn')).toBe(true);
    for (const item of eventItems(STORIES)) {
      const { event } = eventOf(STORIES, item)!;
      expect(new Set(event.segments.map(segment => segment.surah)).size, item).toBeGreaterThan(1);
      expect(lastNumber(item)?.head).toBeTruthy();
    }
  });

  // see docs/ship-checklist.md
  it('never draws a fitna battle\'s numbers, even where its data holds some', () => {
    for (const slug of FITNA_BATTLES) {
      const battle = battles.find(each => each.slug === slug)!;
      const counted = { ...battle, counts: { muslims: { value: 1, refs: [{ text: 'x', cite: 'كتاب، ص ١' }] } } };
      expect(battleOnCard(counted).counts).toEqual({});
      expect(battleSources(counted).map(source => source.book)).not.toContain('كتاب');
    }
  });

  it('reads a Quran-sciences reference as its book, author and place', () => {
    expect(authorCiteSource({ text: 'نص', cite: 'السيوطي، تناسق الدرر ص٦٣', url: 'u' })).toEqual({ book: 'تناسق الدرر', author: 'السيوطي', at: 'ص٦٣', quote: 'نص', url: 'u' });
    expect(authorCiteSource({ text: '', cite: 'السيوطي، الإتقان ٣/٣٦١' })).toMatchObject({ book: 'الإتقان', author: 'السيوطي', at: '٣/٣٦١' });
    for (const card of cards) for (const source of openingSources(card)) expect(source.at, card.id).toBeTruthy();
    for (const id of oathItems(oaths)) for (const source of oathSources(id)) expect(source.at, id).toBeTruthy();
  });
});

describe('the battle cards', () => {
  it('draw a year with the year before and after it on its own axis, and list only that year\'s battles', () => {
    for (const item of battleYearItems(battles)) {
      const year = Number(item);
      const slice = battleYearSlice(battles, year)!;
      const years = slice.columns.map(column => column.year);
      expect(years, item).toContain(year);
      const at = years.indexOf(year);
      expect(years.length, item).toBeLessThanOrEqual(3);
      expect([...years].sort((a, b) => a - b), item).toEqual(years);
      if (year <= MADINAH_YEARS) years.forEach((each, i) => expect(each, item).toBe(year + i - at));
      expect(slice.battles.length, item).toBeGreaterThan(0);
      expect(slice.battles.every(battle => battle.year?.value === year), item).toBe(true);
    }
    expect(battleYearSlice(battles, 2)!.columns.map(column => column.year)).toEqual([1, 2, 3]);
  });

  it('set side by side only the battles whose data cites both sides in the field, never a fitna battle, by year', () => {
    const shown = armiesBattles(battles);
    expect(shown.length).toBeGreaterThan(1);
    for (const battle of shown) expect([battle.counts.muslims, battle.counts.others].every(Boolean), battle.slug).toBe(true);
    expect(shown.some(battle => FITNA_BATTLES.includes(battle.slug))).toBe(false);
    const years = shown.map(battle => battle.year!.value);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    const badr = battles.find(battle => battle.slug === 'badr')!;
    const oneSide = { ...badr, slug: 'one-side', counts: { muslims: badr.counts.muslims } };
    expect(armiesBattles([...battles, oneSide]).map(battle => battle.slug)).not.toContain('one-side');
  });
});
