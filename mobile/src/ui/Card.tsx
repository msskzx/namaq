import { useContext, useId, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type AccessibilityRole, type GestureResponderEvent, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { CARD_CAP_SHARE } from '@shared/homeFeed';
import { CARD, type Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import MoreMenu, { type MoreItem } from '@/ui/MoreMenu';
import { SourceSlotContext, type Source } from '@/ui/sourceSlot';
import SourceLine from '@/ui/SourceLine';
import Reference from '@/ui/Reference';
import { InsideCard, RowSlot, type Slot } from '@/ui/cardContext';

export { OutsideCard, useCardRow, useInsideCard } from '@/ui/cardContext';

/**
 * A feature's own buttons (a quiz's hint, a checked tree's save and share): in the row under the card when the card has one
 * (a feed post, owner 2026-11-18 and 2026-11-19: buttons sit under the card, never in it), else where they are drawn.
 */
export function UnderCard({ children }: { children: React.ReactNode }) {
  const slot = useContext(RowSlot);
  const id = useId();
  // Each render hands the row the buttons as they are now; the card's content does not draw again for it (same elements).
  useLayoutEffect(() => { slot?.set(id, children); });
  useLayoutEffect(() => () => slot?.set(id, null), [slot, id]);
  return slot ? null : <>{children}</>;
}

/** What a feature hands up with `UnderCard`, by id, and the slot that takes it. */
function useLifted() {
  const [lifted, setLifted] = useState<[string, React.ReactNode][]>([]);
  const slot = useMemo<Slot>(() => ({ set: (id, node) => setLifted(now => keyed(now, id, node)) }), []);
  return [lifted, slot] as const;
}

/** In the sheet that shows a capped card whole, the card's references stay on the source line at the sheet's foot. */
const NO_SOURCES = { set: () => {} };

/** How tall the fade at the foot of a capped card is. */
const FADE = 72;

/**
 * A card with the row of buttons under it (the feed post's shape): `row` is the post's own buttons, after what its content
 * hands up with `UnderCard`. The row starts on the right, as across the app, and the «⋯» of `menu` sits alone at its far left.
 * With `cap`, content taller than CARD_CAP_SHARE of the screen stops there with a fade, and «اقرأ كاملًا» under the card
 * opens it whole in a sheet with the same buttons and source line at its foot (owner, 2026-11-20). Every feed card and every
 * section of a page (owner, 2026-11-20: one look).
 */
export function CardWithRow({ lead, row, menu, cap = false, source, sourceLine, bar, children, ...card }: Omit<React.ComponentProps<typeof Card>, 'children'> & {
  /** The button that opens the item in its own reader, first in the row before the card's own tools (owner 2026-11-20). */
  lead?: React.ReactNode;
  row?: React.ReactNode;
  /** The choices of the «⋯» alone at the row's far left (owner 2026-11-20: «ليس من اهتماماتي»); none, no «⋯». */
  menu?: MoreItem[];
  /** Content that can run long stops at CARD_CAP_SHARE of the screen, the rest one tap away in a sheet. */
  cap?: boolean;
  /** The card's sources, named on the line under its buttons (owner 2026-11-20); a `Reference` inside the card joins the sheet. */
  source?: Source[];
  /**
   * Draws the source line (ui/SourceLine.tsx unless given): `named` are the card's own sources, or what its content handed
   * up when it gives none; `all` are both, for the sheet.
   */
  sourceLine?: (named: Source[], all: Source[]) => React.ReactNode;
  /** A bar of the feature's own leading the row (recite mode's small bar, on the recall card). */
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
  const buttonRow = (handedUp: [string, React.ReactNode][], more?: MoreItem[]) => (bar || lead || row || handedUp.length > 0 || !!more?.length) && (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: bar ? 4 : 0, marginTop: bar ? 4 : 0 }}>
      {bar}{lead}{handedUp.map(([id, node]) => <View key={id} style={{ flexDirection: 'row', alignItems: 'center' }}>{node}</View>)}{row}
      {more?.length ? <><View style={{ flex: 1 }} /><MoreMenu items={more} /></> : null}
    </View>
  );
  const named = own.length ? own : inner;
  // Drawn inside another card (a page's section in a quiz's look-up, a feed post): no second card and no second row; its
  // buttons join that card's row and its books that card's line, or show as collapsed references where it has none.
  if (inside) return <>{children}<UnderCard>{lead}{row}</UnderCard>{own.map(given => <Reference key={given.line} title={given.line} quotes={given.quotes} links={given.links} palette={palette} />)}</>;
  const sources = own.length + inner.length > 0 && (sourceLine ? sourceLine(named, [...own, ...inner]) : <SourceLine named={named} sources={[...own, ...inner]} palette={palette} />);
  // One block, so a page's gaps part its sections, not a card from its own row and line.
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
      {capped && <Tap onPress={() => setWhole(true)} accessibilityRole="button" style={{ alignSelf: 'flex-start', paddingHorizontal: 12, minHeight: 32, justifyContent: 'center' }}>
        <Text style={{ color: palette.accent, fontSize: 15 }}>اقرأ كاملًا</Text>
      </Tap>}
      {buttonRow(lifted, menu)}
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

/** A list of entries by id, with one set (a new one last), changed in place or (null) taken out; the same list when nothing changes. */
function keyed<T>(now: [string, T][], id: string, value: T | null): [string, T][] {
  const rest = now.filter(([at]) => at !== id);
  if (value === null) return rest.length === now.length ? now : rest;
  const at = now.findIndex(([key]) => key === id);
  return at < 0 ? [...now, [id, value]] : now.map(entry => (entry[0] === id ? [id, value] : entry));
}

/**
 * The one card (owner: round 14, one card colour, a rule border, no card in a card): screens put their content in it and
 * never draw a box of their own. With `onPress` the whole card is one button (a scroll over it never presses, ui/Tap)
 * and dims while pressed; without it, it is a plain box, so a screen reader reaches the buttons inside it.
 * `style` is for the card's place only (width, height, flex, alignment), never for its look.
 */
export default function Card({ palette, pad = 14, gap, spine = false, picked = false, dashed = false, outline, faded = false, clip = false, node = false, style, children, testID,
  onPress, onLongPress, onLayout, ref, accessibilityRole, accessibilityLabel, accessibilityState }: {
  palette: Palette;
  /** Room inside the card: 14, 0 for content that runs to its edges (a mushaf slice, a list of rows), or [top and bottom, sides] for rows of text. */
  pad?: number | [number, number];
  /** The one picked among cards side by side (a place on the map, a paragraph): an ink border (same width, so nothing moves). */
  picked?: boolean;
  gap?: number;
  /** A thick start edge, like a book's spine (the saved and forgotten shelves). */
  spine?: boolean;
  /** A dashed border: an invitation, not content yet («ما أحفظه»). */
  dashed?: boolean;
  /** A coloured border and no fill, for a card that calls (an unfinished quiz). */
  outline?: string;
  /** Dimmed: a card that cannot open yet. */
  faded?: boolean;
  /** Clip what runs past the round corners. */
  clip?: boolean;
  /**
   * A box of a drawing (a narrator in an isnad, a book in «من أخرجه»): part of the drawing, not a card, so it keeps its frame
   * inside a card (owner, 2026-11-20: the isnad is boxes joined by lines).
   */
  node?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** Finds the card in a UI test (a feed post's card is `feed-card`). */
  testID?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  ref?: React.ComponentProps<typeof View>['ref'];
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean; expanded?: boolean };
}) {
  // A card in a card draws flat (owner: no card in a card): no fill, no round frame, a rule above to part it from what is before.
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
