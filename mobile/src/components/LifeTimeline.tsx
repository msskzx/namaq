import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { lifeFilters, lifeRail, lifeStrip, openLabel, stripLabels, type LifeItem, type LifeKind } from '@shared/events/lifeTimeline';
import { Text } from '@/ui/Text';
import Svg, { Circle } from 'react-native-svg';
import TapRow from '@/ui/TapRow';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Sheet from '@/ui/Sheet';
import Button, { Row } from '@/ui/Button';
import ExternalLink from '@/ui/ExternalLink';
import type { Palette } from '@/lib/theme';
import { toTab } from '@/lib/ways';

/** Each kind's dot: raids the Prophet ﷺ led in the accent, those he sent blue, later battles purple, events and stories, the person's own fact amber. */
export const lifeColor = (palette: Palette, kind: LifeKind) =>
  ({ ghazwah: palette.accent, sariyyah: palette.path, battle: palette.root, event: palette.muted, story: palette.green, own: palette.amber })[kind];

/** «قبل الهجرة», «٢», or nothing for the undated rows. */
export const placeLabel = (place: { year?: number; before?: boolean }) => (place.before ? 'قبل الهجرة' : place.year !== undefined ? num(place.year) : 'بلا سنة');

/** A row's page: a battle or a story opens it; an event or the person's own fact shows its sentences instead. */
export function openItem(item: LifeItem, show: (item: LifeItem) => void) {
  if (item.open?.to === 'battle') toTab({ pathname: '/battle', params: { slug: item.open.slug } });
  else if (item.open?.to === 'story') router.push({ pathname: '/story', params: { slug: item.open.slug } });
  else show(item);
}

const DOT = 9;
/** Room a year's label takes under the strip: two digits at its size with a little air, so labels never touch. */
const LABEL_W = 22;

/** A dot of the strip or the rail, filled, or a ring for a row of another kind than the one picked. */
function Dot({ color, hollow = false }: { color: string; hollow?: boolean }) {
  return (
    <Svg width={DOT} height={DOT} style={{ opacity: hollow ? 0.6 : 1 }}>
      <Circle cx={DOT / 2} cy={DOT / 2} r={DOT / 2 - 0.75} fill={hollow ? 'none' : color} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/** The strip (sketch screen 1): a column per year, a dot per thing in it, filled when it is of the kind picked. */
function Strip({ items, on, palette }: { items: LifeItem[]; on: (item: LifeItem) => boolean; palette: Palette }) {
  const [width, setWidth] = useState(0);
  const columns = lifeStrip(items);
  if (columns.length === 0) return null;
  // The before-hijra column is twice as wide as a year's.
  const named = stripLabels(columns, width / (columns.length + (columns[0].before ? 1 : 0)), LABEL_W);
  return (
    <Card palette={palette} pad={[10, 18]}>
      <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ flexDirection: 'row', alignItems: 'flex-end' }} accessible accessibilityLabel={`على سنوات الهجرة، من ${placeLabel(columns[0])} إلى ${placeLabel(columns[columns.length - 1])}`}>
        {columns.map(column => (
          <View key={column.key} style={{ flex: column.before ? 2 : 1, alignItems: 'center', gap: 3 }}>
            {column.items.slice().reverse().map(item => (
              <Dot key={item.key} color={on(item) ? lifeColor(palette, item.kind) : palette.muted} hollow={!on(item)} />
            ))}
            {/* A year with something in it is named where its label has room; an empty year keeps its place unnamed. */}
            <Text numberOfLines={1} style={{ width: 40, marginHorizontal: -20, color: palette.muted, fontSize: 12, marginTop: 2, minHeight: 16, textAlign: 'center' }}>
              {named.has(column.key) ? (column.before ? 'قبل' : num(column.year!)) : ''}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** One row on the rail: its dot on the line, its name; tapped it opens, held it shows the sentences that place the person there. */
function Item({ item, palette, show, last }: { item: LifeItem; palette: Palette; show: (item: LifeItem) => void; last: boolean }) {
  const color = lifeColor(palette, item.kind);
  return (
    <TapRow onPress={() => openItem(item, show)} onLongPress={() => show(item)} role={item.open ? 'link' : 'button'}>
      <View style={{ width: 18, alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: 0, bottom: last ? '50%' : 0, width: 1.5, backgroundColor: palette.rule }} />
        <View style={{ marginTop: 17 }}><Dot color={color} /></View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', paddingStart: 8 }}>
        <Text style={{ color: item.kind === 'own' ? palette.muted : palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>
          {item.name}
          {item.note ? <Text style={{ color: palette.muted, fontSize: 13 }}>{`  ${item.note}`}</Text> : null}
          {item.others.length ? <Text style={{ color: palette.muted, fontSize: 13 }}>{'  وقيل غير ذلك'}</Text> : null}
        </Text>
      </View>
    </TapRow>
  );
}

/** The sentences that place the person in a row, with their pages, and where the sources give its year otherwise. */
export function LifeSheet({ item, onClose, palette }: { item?: LifeItem; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!item} onClose={onClose} palette={palette} title={item?.name}>
      {item && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
          {item.refs.map((ref, i) => (
            <View key={i} style={{ gap: 2 }}>
              <Text numberOfLines={8} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>«{ref.text}»</Text>
              {ref.url ? <ExternalLink url={ref.url} color={palette.accent} size={13} style={{ textAlign: 'right' }}>{ref.cite}</ExternalLink>
                : <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ref.cite}</Text>}
            </View>
          ))}
          {item.others.map((reading, i) => (
            <View key={`o${i}`} style={{ gap: 2 }}>
              <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>وفي سنتها قول آخر</Text>
              <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>«{reading.text}»</Text>
              {reading.refs.map((ref, j) => <Text key={j} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{ref.cite}</Text>)}
            </View>
          ))}
          {item.open && <Row><Button label={openLabel(item)} onPress={() => { onClose(); openItem(item, () => undefined); }} /></Row>}
        </View>
      )}
    </Sheet>
  );
}

/**
 * A person's «حياته» drawn (owner, 2026-11-18; sketch timeline-events/sketch-dark.png, screen 1): the strip of years,
 * chips for the kinds he has and «+ قارن», then the rail by year. The person page draws it; `onCompare` opens the
 * «حياتهما» screen (screens/life.tsx) with him first.
 */
export default function LifeTimeline({ items, palette, onCompare }: { items: LifeItem[]; palette: Palette; onCompare?: () => void }) {
  const [filter, setFilter] = useState<number | undefined>();
  const [shown, setShown] = useState<LifeItem | undefined>();
  const filters = useMemo(() => lifeFilters(items), [items]);
  const picked = filter === undefined ? undefined : filters[filter];
  const on = (item: LifeItem) => !picked || picked.kinds.includes(item.kind) || item.kind === 'own';
  const rail = lifeRail(items.filter(on));
  if (items.length === 0) return null;
  return (
    <View style={{ gap: 12 }}>
      <Strip items={items} on={on} palette={palette} />
      {(filters.length > 0 || onCompare) && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {filters.length > 0 && <Chip label="الكل" on={filter === undefined} palette={palette} onPress={() => setFilter(undefined)} />}
          {filters.map((f, i) => <Chip key={f.label} label={f.label} on={filter === i} palette={palette} onPress={() => setFilter(filter === i ? undefined : i)} />)}
          {onCompare && <Chip Icon={Plus} label="قارن" on={false} palette={palette} onPress={onCompare} />}
        </View>
      )}
      <View>
        {rail.map((place, p) => (
          <View key={place.key} style={{ flexDirection: 'row' }}>
            <Text style={{ width: 52, color: place.year === undefined ? palette.muted : palette.accent, fontSize: 15, lineHeight: 20, paddingTop: 12, textAlign: 'center' }}>{placeLabel(place)}</Text>
            <View style={{ flex: 1 }}>
              {place.items.map((item, i) => <Item key={item.key} item={item} palette={palette} show={setShown} last={p === rail.length - 1 && i === place.items.length - 1} />)}
            </View>
          </View>
        ))}
      </View>
      <LifeSheet item={shown} onClose={() => setShown(undefined)} palette={palette} />
    </View>
  );
}
