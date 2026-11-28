import { useContext, useId, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type AccessibilityRole, type GestureResponderEvent, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CARD_CAP_SHARE } from '@shared/homeFeed';
import { CARD, type Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';
import OpenButton from '@/ui/OpenButton';
import Sheet from '@/ui/Sheet';
import MoreMenu, { type MoreItem } from '@/ui/MoreMenu';
import { SourceSlotContext, type Source } from '@/ui/sourceSlot';
import SourceLine from '@/ui/SourceLine';
import Reference from '@/ui/Reference';
import { InsideCard, RowSlot, type Slot } from '@/ui/cardContext';

export { OutsideCard, useCardRow, useInsideCard } from '@/ui/cardContext';

export function UnderCard({ children }: { children: React.ReactNode }) {
  const slot = useContext(RowSlot);
  const id = useId();
  useLayoutEffect(() => { slot?.set(id, children); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
  return slot ? null : <>{children}</>;
}

function useLifted() {
  const [lifted, setLifted] = useState<[string, React.ReactNode][]>([]);
  const slot = useMemo<Slot>(() => ({ set: (id, node) => setLifted(now => keyed(now, id, node)) }), []);
  return [lifted, slot] as const;
}

const NO_SOURCES = { set: () => {} };

const FADE = 72;

export function CardWithRow({ lead, row, menu, cap = false, source, sourceLine, bar, children, ...card }: Omit<React.ComponentProps<typeof Card>, 'children'> & {
  lead?: React.ReactNode;
  row?: React.ReactNode;
  menu?: MoreItem[];
  cap?: boolean;
  source?: Source[];
  sourceLine?: (named: Source[], all: Source[]) => React.ReactNode;
  bar?: React.ReactNode; children: React.ReactNode }) {
  const [lifted, slot] = useLifted();
  const [liftedWhole, slotWhole] = useLifted();
  const [handed, setHanded] = useState<[string, Source | null][]>([]);
  const sourceSlot = useMemo(() => ({ set: (id: string, given: Source | null) => setHanded(now => keyed(now, id, given)) }), []);
  const inner = handed.map(([, given]) => given).filter((given): given is Source => !!given);
  const own = source ?? [];
  const { height: screen } = useWindowDimensions();
  const most = Math.round(screen * CARD_CAP_SHARE);
  const [tall, setTall] = useState(0);
  const capped = cap && tall > most;
  const [whole, setWhole] = useState(false);
  const { palette } = card;
  const inside = useContext(InsideCard);
  const buttonRow = (handedUp: [string, React.ReactNode][], more?: MoreItem[], first: React.ReactNode = lead) => (bar || first || row || handedUp.length > 0 || !!more?.length) && (<>
    {bar && <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 4 }}>{bar}</View>}
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
      {first}{handedUp.map(([id, node]) => <View key={id} style={{ flexDirection: 'row', alignItems: 'center' }}>{node}</View>)}{row}
      {more?.length ? <><View style={{ flex: 1 }} /><MoreMenu items={more} /></> : null}
    </View>
  </>);
  const named = own.length ? own : inner;
  if (inside) return <>{children}<UnderCard>{lead}{row}</UnderCard>{own.map(given => <Reference key={given.line} title={given.line} quotes={given.quotes} links={given.links} places={given.places} editions={given.editions} palette={palette} />)}</>;
  const sources = own.length + inner.length > 0 && (sourceLine ? sourceLine(named, [...own, ...inner]) : <SourceLine named={named} sources={[...own, ...inner]} palette={palette} />);
  return (
    <View style={{ gap: 4 }}>
      <SourceSlotContext.Provider value={sourceSlot}>
        <RowSlot.Provider value={slot}>
          <Card testID="feed-card" {...card}>
            {cap ? (
              <View style={capped ? { maxHeight: most, overflow: 'hidden' } : undefined}>
                <View onLayout={event => setTall(event.nativeEvent.layout.height)}>{children}</View>
                {capped && <Svg pointerEvents="none" width="100%" height={FADE} style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                  <Defs><LinearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={palette.card} stopOpacity={0} /><Stop offset="1" stopColor={palette.card} stopOpacity={1} /></LinearGradient></Defs>
                  <Rect width="100%" height={FADE} fill="url(#cap)" />
                </Svg>}
              </View>
            ) : children}
          </Card>
        </RowSlot.Provider>
      </SourceSlotContext.Provider>
      {buttonRow(lifted, menu, capped && !lead ? <OpenButton label="اقرأ البطاقة كاملة" onPress={() => setWhole(true)} /> : lead)}
      {sources}
      {(capped || whole) && <Sheet open={whole} onClose={() => setWhole(false)} palette={palette}>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12, gap: 4 }}>
          <SourceSlotContext.Provider value={NO_SOURCES}>
            <RowSlot.Provider value={slotWhole}><Card palette={palette} pad={card.pad} gap={card.gap} clip={card.clip}>{children}</Card></RowSlot.Provider>
          </SourceSlotContext.Provider>
          {buttonRow(liftedWhole)}
          {sources}
        </ScrollView>
      </Sheet>}
    </View>
  );
}

function keyed<T>(now: [string, T][], id: string, value: T | null): [string, T][] {
  const rest = now.filter(([at]) => at !== id);
  if (value === null) return rest.length === now.length ? now : rest;
  const at = now.findIndex(([key]) => key === id);
  return at < 0 ? [...now, [id, value]] : now.map(entry => (entry[0] === id ? [id, value] : entry));
}

export const CARD_PAD = 14;

export default function Card({ palette, pad = CARD_PAD, gap, spine = false, picked = false, dashed = false, outline, faded = false, clip = false, node = false, style, children, testID,
  onPress, onLongPress, onLayout, ref, accessibilityRole, accessibilityLabel, accessibilityState }: {
  palette: Palette;
  pad?: number | [number, number];
  picked?: boolean;
  gap?: number;
  spine?: boolean;
  dashed?: boolean;
  outline?: string;
  faded?: boolean;
  clip?: boolean;
  node?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  testID?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  ref?: React.ComponentProps<typeof View>['ref'];
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean; expanded?: boolean };
}) {
  const inside = useContext(InsideCard);
  const look: ViewStyle = inside && !node ? {
    borderTopWidth: 1, borderColor: palette.rule, gap,
    ...(typeof pad === 'number' ? { padding: pad } : { paddingVertical: pad[0], paddingHorizontal: pad[1] }),
    ...(clip ? { overflow: 'hidden' } : null),
  } : {
    ...CARD, borderWidth: 1, borderColor: picked ? palette.ink : outline ?? palette.rule, backgroundColor: outline ? 'transparent' : palette.card, gap,
    ...(typeof pad === 'number' ? { padding: pad } : { paddingVertical: pad[0], paddingHorizontal: pad[1] }),
    ...(spine ? { borderStartWidth: 5 } : null), ...(dashed ? { borderStyle: 'dashed' } : null), ...(clip ? { overflow: 'hidden' } : null),
  };
  const a11y = { accessibilityRole, accessibilityLabel, accessibilityState, onLayout, testID };
  const inner = <InsideCard.Provider value>{children}</InsideCard.Provider>;
  if (!onPress && !onLongPress) return <View ref={ref} {...a11y} style={[look, style, { opacity: faded ? 0.55 : 1 }]}>{inner}</View>;
  return (
    <Tap ref={ref} {...a11y} accessibilityRole={accessibilityRole ?? 'button'} onPress={onPress} onLongPress={onLongPress}
      style={({ pressed }) => [look, style, { opacity: (faded ? 0.55 : 1) * (pressed ? 0.75 : 1) }]}>
      {inner}
    </Tap>
  );
}
