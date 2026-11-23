import { useMemo } from 'react';
import Card from '@/ui/Card';
import { atlasPins, layerBox, type AtlasLayer } from '@shared/battles/atlas';
import { BATTLES } from '@/lib/battles';
import type { Palette } from '@/lib/theme';
import BattleMap, { type MapPlace } from './BattleMap';

/**
 * «أين كانت؟» on the atlas's own map (owner, 2026-11-23; atlas sketch, panel 4): each place of the layer a pin with no
 * name, the one tapped framed; once answered the right one green and named, a wrong tap framed in the accent and named.
 */
export default function AtlasQuizMap({ layer, choices, picked, right, onPick, palette }: {
  layer: AtlasLayer; choices: string[]; picked?: string; right?: string; onPick?: (name: string) => void; palette: Palette;
}) {
  const box = useMemo(() => layerBox(BATTLES, layer), [layer]);
  const at = useMemo(() => new Map(atlasPins(BATTLES, layer, Infinity).map(pin => [pin.name, pin.at])), [layer]);
  const places: MapPlace[] = choices.flatMap(name => {
    const where = at.get(name);
    if (!where) return [];
    const look = right !== undefined
      ? (name === right ? 'right' : name === picked ? 'wrong' : 'choice')
      : name === picked ? 'selected' : 'choice';
    return [{ name, at: where, look }];
  });
  return (
    <Card palette={palette} pad={0} clip gap={0} style={{ marginHorizontal: 16 }}>
      <BattleMap places={places} box={box} palette={palette} onPin={onPick ? names => onPick(names[0]) : undefined} />
    </Card>
  );
}
