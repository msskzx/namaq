import type { AppBattle } from './battle';
import { frameOf, PIN_JOIN, projector, type Box, type LonLat } from './map';
import { MADINAH_YEARS } from './timeline';

export type AtlasLayer = 'life' | 'after';
export const LAYERS: { key: AtlasLayer; name: string }[] = [{ key: 'life', name: 'في حياته ﷺ' }, { key: 'after', name: 'بعده ﷺ' }];

export const layerOf = (battle: Pick<AppBattle, 'year'>): AtlasLayer =>
  typeof battle.year?.value === 'number' && battle.year.value >= 1 && battle.year.value <= MADINAH_YEARS ? 'life' : 'after';

export const layerBattles = <B extends Pick<AppBattle, 'year'>>(battles: readonly B[], layer: AtlasLayer) => battles.filter(battle => layerOf(battle) === layer);

export const LAYER_ASPECT: Record<AtlasLayer, number> = { life: 1.1, after: 0.6 };

export function layerBox(battles: readonly AppBattle[], layer: AtlasLayer): Box {
  return frameOf(layerBattles(battles, layer).flatMap(battle => (battle.place ? [battle.place.at] : [])), LAYER_ASPECT[layer]);
}

export type AtlasPin = { name: string; at: LonLat; look: 'lit' | 'quiet' };

export function atlasPins(battles: readonly AppBattle[], layer: AtlasLayer, year?: number): AtlasPin[] {
  const pinned = layerBattles(battles, layer).filter(battle => battle.place);
  const lit = layer === 'after' ? pinned : pinned.filter(battle => battle.year!.value === year);
  const quiet = layer === 'after' ? [] : pinned.filter(battle => battle.year!.value < (year ?? 0));
  const pins = new Map<string, AtlasPin>();
  for (const battle of lit) pins.set(battle.place!.name, { name: battle.place!.name, at: battle.place!.at, look: 'lit' });
  for (const battle of quiet) if (!pins.has(battle.place!.name)) pins.set(battle.place!.name, { name: battle.place!.name, at: battle.place!.at, look: 'quiet' });
  return [...pins.values()];
}

export function battlesAt<B extends Pick<AppBattle, 'year' | 'place'>>(battles: readonly B[], layer: AtlasLayer, names: readonly string[], year?: number): B[] {
  const here = layerBattles(battles, layer).filter(battle => battle.place && names.includes(battle.place.name)
    && (layer === 'after' || year === undefined || battle.year!.value <= year));
  const rank = (battle: B) => (battle.year?.value === year ? -1 : battle.year?.value ?? Infinity);
  return here.sort((a, b) => rank(a) - rank(b));
}

export const lifeYears = (battles: readonly Pick<AppBattle, 'year'>[]) =>
  [...new Set(layerBattles(battles, 'life').map(battle => battle.year!.value))].sort((a, b) => a - b);

export const NARROWEST_MAP = 280;

export function lonePlaces(battles: readonly AppBattle[], layer: AtlasLayer): string[] {
  const { at } = projector(layerBox(battles, layer), NARROWEST_MAP);
  const places = [...new Map(layerBattles(battles, layer).flatMap(battle => (battle.place ? [[battle.place.name, at(battle.place.at)] as const] : []))).entries()];
  return places.filter(([name, [x, y]]) => places.every(([other, [ox, oy]]) => other === name || Math.hypot(x - ox, y - oy) >= PIN_JOIN)).map(([name]) => name);
}

export type AtlasScreen = { width: number; height: number; top: number; bottom: number };

export function screenBox(battles: readonly AppBattle[], layer: AtlasLayer, screen: AtlasScreen): Box {
  const band = Math.max(1, screen.bottom - screen.top);
  const [west, south, east, north] = frameOf(layerBattles(battles, layer).flatMap(battle => (battle.place ? [battle.place.at] : [])), band / screen.width);
  const perPoint = (north - south) / band;
  return [west, south - (screen.height - screen.bottom) * perPoint, east, north + screen.top * perPoint];
}
