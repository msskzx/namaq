import { createContext, useContext, useId, useLayoutEffect, useMemo, useState } from 'react';
import { View, type AccessibilityRole, type GestureResponderEvent, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { CARD, type Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

/** True inside a card: a box drawn there would be a card in a card, so the shared pieces draw flat instead. */
const InsideCard = createContext(false);

/**
 * Inside a card (owner, 2026-11-19: no box in a box): a piece that frames itself (the matrix, a quiz's ayah) asks this and
 * draws no frame of its own there. A `Card` inside a card already draws flat by itself.
 */
export const useInsideCard = () => useContext(InsideCard);

type Slot = { set: (id: string, node: React.ReactNode | null) => void };
/** Where `UnderCard` puts its buttons: the row under the card of a feed post (`CardWithRow`). */
const RowSlot = createContext<Slot | null>(null);

/** True where `UnderCard` puts its buttons in a card's row, so a piece can draw them the row's size (small, icon only). */
export const useCardRow = () => !!useContext(RowSlot);

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

/**
 * A card with the row of buttons under it (the feed post's shape): `row` is the post's own buttons, after what its content
 * hands up with `UnderCard`. The row starts on the right, as across the app.
 */
export function CardWithRow({ row, bar, children, ...card }: Omit<React.ComponentProps<typeof Card>, 'children'> & {
  row?: React.ReactNode;
  /** A bar of the feature's own leading the row (recite mode's small bar, on the recall card). */
  bar?: React.ReactNode; children: React.ReactNode }) {
  const [lifted, setLifted] = useState<[string, React.ReactNode][]>([]);
  const slot = useMemo<Slot>(() => ({
    set: (id, node) => setLifted(now => {
      const rest = now.filter(([at]) => at !== id);
      if (node === null) return rest.length === now.length ? now : rest;
      const at = now.findIndex(([key]) => key === id);
      return at < 0 ? [...now, [id, node]] : now.map(entry => (entry[0] === id ? [id, node] : entry));
    }),
  }), []);
  const buttons = lifted.length > 0 || !!row;
  return (
    <>
      <RowSlot.Provider value={slot}><Card testID="feed-card" {...card}>{children}</Card></RowSlot.Provider>
      {(bar || buttons) && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: bar ? 4 : 0, marginTop: bar ? 4 : 0 }}>
        {bar}{lifted.map(([id, node]) => <View key={id} style={{ flexDirection: 'row', alignItems: 'center' }}>{node}</View>)}{row}
      </View>}
    </>
  );
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

/** What opens over the screen (a sheet, a menu) starts outside every card, wherever it is drawn from. */
export function OutsideCard({ children }: { children: React.ReactNode }) {
  return <InsideCard.Provider value={false}><RowSlot.Provider value={null}>{children}</RowSlot.Provider></InsideCard.Provider>;
}
