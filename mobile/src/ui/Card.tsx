import { View, type AccessibilityRole, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import { CARD, type Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

/**
 * The one card (owner: round 14, one card colour, a rule border, no card in a card): screens put their content in it and
 * never draw a box of their own. With `onPress` the whole card is one button (a scroll over it never presses, ui/Tap)
 * and dims while pressed; without it, it is a plain box, so a screen reader reaches the buttons inside it.
 * `style` is for the card's place only (width, height, flex, alignment), never for its look.
 */
export default function Card({ palette, pad = 14, gap, spine = false, dashed = false, outline, faded = false, clip = false, style, children,
  onPress, onLongPress, ref, accessibilityRole, accessibilityLabel, accessibilityState }: {
  palette: Palette;
  /** Room inside the card: 14, or 0 for content that runs to its edges (a mushaf slice, a list of rows). */
  pad?: number;
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
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  ref?: React.ComponentProps<typeof View>['ref'];
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: { selected?: boolean; disabled?: boolean; expanded?: boolean };
}) {
  const look: ViewStyle = {
    ...CARD, borderWidth: 1, borderColor: outline ?? palette.rule, backgroundColor: outline ? 'transparent' : palette.card, padding: pad, gap,
    ...(spine ? { borderStartWidth: 5 } : null), ...(dashed ? { borderStyle: 'dashed' } : null), ...(clip ? { overflow: 'hidden' } : null),
  };
  const a11y = { accessibilityRole, accessibilityLabel, accessibilityState };
  if (!onPress && !onLongPress) return <View ref={ref} {...a11y} style={[look, style, { opacity: faded ? 0.55 : 1 }]}>{children}</View>;
  return (
    <Tap ref={ref} {...a11y} accessibilityRole={accessibilityRole ?? 'button'} onPress={onPress} onLongPress={onLongPress}
      style={({ pressed }) => [look, style, { opacity: (faded ? 0.55 : 1) * (pressed ? 0.75 : 1) }]}>
      {children}
    </Tap>
  );
}
