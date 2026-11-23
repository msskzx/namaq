// «الأطلس» (owner, 2026-11-23; sketch /mnt/project-files/atlas/sketch2-dark.png): one map of the battles we already have,
// in two layers. «في حياته ﷺ» holds the Prophet's ﷺ raids and expeditions, a year at a time from 1 to 11: the year's
// places lit, the years before it quiet. «بعده ﷺ» holds the battles after him, with no year bar, since most have no
// cited year in our data and none is made up. Every pin is a battle's own sourced place (shared/battles/places.ts): a
// battle no book pins is listed without one.
import type { AppBattle } from './battle';
import { frameOf, PIN_JOIN, projector, type Box, type LonLat } from './map';
import { MADINAH_YEARS } from './timeline';

export type AtlasLayer = 'life' | 'after';
export const LAYERS: { key: AtlasLayer; name: string }[] = [{ key: 'life', name: 'في حياته ﷺ' }, { key: 'after', name: 'بعده ﷺ' }];

/** A battle with its year in the Prophet's ﷺ life (1 to 11 after the Hijrah) is on the first layer; every other on the second. */
export const layerOf = (battle: Pick<AppBattle, 'year'>): AtlasLayer =>
  typeof battle.year?.value === 'number' && battle.year.value >= 1 && battle.year.value <= MADINAH_YEARS ? 'life' : 'after';

export const layerBattles = <B extends Pick<AppBattle, 'year'>>(battles: readonly B[], layer: AtlasLayer) => battles.filter(battle => layerOf(battle) === layer);

/** How tall the atlas's map is for its width: the Hijaz runs north to south, so the first layer is tall; the second is wide, so it stays inside the land the app carries (scripts/battles/buildLand.ts). */
export const LAYER_ASPECT: Record<AtlasLayer, number> = { life: 1.1, after: 0.6 };

/** The layer's still frame: every pinned place of it with room around, so the map does not move as the year changes. */
export function layerBox(battles: readonly AppBattle[], layer: AtlasLayer): Box {
  return frameOf(layerBattles(battles, layer).flatMap(battle => (battle.place ? [battle.place.at] : [])), LAYER_ASPECT[layer]);
}

export type AtlasPin = { name: string; at: LonLat; look: 'lit' | 'quiet' };

/**
 * The pins of a layer: on «في حياته ﷺ» the places of `year` lit and those of the years before it quiet (a place lit this
 * year is not drawn quiet again); on «بعده ﷺ» every place lit. Each place once.
 */
export function atlasPins(battles: readonly AppBattle[], layer: AtlasLayer, year?: number): AtlasPin[] {
  const pinned = layerBattles(battles, layer).filter(battle => battle.place);
  const lit = layer === 'after' ? pinned : pinned.filter(battle => battle.year!.value === year);
  const quiet = layer === 'after' ? [] : pinned.filter(battle => battle.year!.value < (year ?? 0));
  const pins = new Map<string, AtlasPin>();
  for (const battle of lit) pins.set(battle.place!.name, { name: battle.place!.name, at: battle.place!.at, look: 'lit' });
  for (const battle of quiet) if (!pins.has(battle.place!.name)) pins.set(battle.place!.name, { name: battle.place!.name, at: battle.place!.at, look: 'quiet' });
  return [...pins.values()];
}

/**
 * The battles of a layer at the named places (a pin may hold several): those of `year` first, then the earlier ones by
 * year; on «في حياته ﷺ» none after `year`, as the map hides them.
 */
export function battlesAt<B extends Pick<AppBattle, 'year' | 'place'>>(battles: readonly B[], layer: AtlasLayer, names: readonly string[], year?: number): B[] {
  const here = layerBattles(battles, layer).filter(battle => battle.place && names.includes(battle.place.name)
    && (layer === 'after' || year === undefined || battle.year!.value <= year));
  const rank = (battle: B) => (battle.year?.value === year ? -1 : battle.year?.value ?? Infinity);
  return here.sort((a, b) => rank(a) - rank(b));
}

/** The years of «في حياته ﷺ» that have a battle, for the year bar and the first year the atlas opens on. */
export const lifeYears = (battles: readonly Pick<AppBattle, 'year'>[]) =>
  [...new Set(layerBattles(battles, 'life').map(battle => battle.year!.value))].sort((a, b) => a - b);

/** The narrowest map a quiz draws (a 320-point phone less the card's and the screen's margins), in points. */
export const NARROWEST_MAP = 280;

/**
 * The places «أين كانت؟» can ask about on a layer: those whose pin stands alone on the layer's map at its narrowest
 * (`PIN_JOIN` points from any other), so the pin the reader taps is the place itself and never one shared with another
 * (Makkah, al-Hudaybiyah, Hunayn and Nakhlah; Damascus, al-Yarmuk and Fihl).
 */
export function lonePlaces(battles: readonly AppBattle[], layer: AtlasLayer): string[] {
  const { at } = projector(layerBox(battles, layer), NARROWEST_MAP);
  const places = [...new Map(layerBattles(battles, layer).flatMap(battle => (battle.place ? [[battle.place.name, at(battle.place.at)] as const] : []))).entries()];
  return places.filter(([name, [x, y]]) => places.every(([other, [ox, oy]]) => other === name || Math.hypot(x - ox, y - oy) >= PIN_JOIN)).map(([name]) => name);
}
