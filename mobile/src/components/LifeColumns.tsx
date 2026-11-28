import { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { lifeColumns, type LifeItem } from '@shared/events/lifeTimeline';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import { MIN_TAP } from '@/ui/tapSize';
import type { Palette } from '@/lib/theme';
import { findPerson, personName } from '@/lib/tarajim';
import { personLife } from '@/lib/life';
import { lifeColor, openItem, placeLabel } from './LifeTimeline';

function Cell({ item, palette, show }: { item?: LifeItem; palette: Palette; show: (item: LifeItem) => void }) {
  if (!item) return <View style={{ flex: 1 }} />;
  return (
    <View style={{ flex: 1 }}>
      <Card node palette={palette} pad={[6, 8]} onPress={() => openItem(item, show)} onLongPress={() => show(item)} accessibilityRole={item.open ? 'link' : 'button'}
        style={{ flexGrow: 1, minHeight: MIN_TAP, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Svg width={7} height={7}><Circle cx={3.5} cy={3.5} r={3.5} fill={lifeColor(palette, item.kind)} /></Svg>
        <Text style={{ flex: 1, color: item.kind === 'own' ? palette.muted : palette.ink, fontSize: 15, lineHeight: 22, textAlign: 'center' }}>{item.name}</Text>
      </Card>
    </View>
  );
}

export default function LifeColumns({ slugs, palette, show }: { slugs: readonly string[]; palette: Palette; show: (item: LifeItem) => void }) {
  const places = useMemo(() => lifeColumns(slugs.map(s => personLife(findPerson(s)!))), [slugs]);
  const join = { width: 8, height: 1.5, backgroundColor: palette.rule, alignSelf: 'center' as const };
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ width: 48 }} />
        {slugs.map(s => <Text key={s} numberOfLines={2} style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'center' }}>{personName(findPerson(s)!)}</Text>)}
      </View>
      {places.map(place => place.rows.map((row, i) => (
        <View key={`${place.key}:${row.key}`} style={{ flexDirection: 'row', alignItems: 'stretch' }}>
          <Text style={{ width: 48, marginEnd: 8, color: palette.accent, fontSize: 14, textAlign: 'center', alignSelf: 'center' }}>{i === 0 ? placeLabel(place) : ''}</Text>
          {row.cells.map((cell, c) => (
            <View key={c} style={{ flex: 1, flexDirection: 'row' }}>
              {c > 0 && (row.shared && cell && row.cells[c - 1] ? <View style={join} /> : <View style={{ width: 8 }} />)}
              <Cell item={cell} palette={palette} show={show} />
            </View>
          ))}
        </View>
      )))}
    </>
  );
}
