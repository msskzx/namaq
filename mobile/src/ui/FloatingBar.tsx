import { useEffect, useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import type { LucideProps } from 'lucide-react-native';
import { clampBox, keepBarPlace, readBarPlaces, serverBarPlaces, subscribeBarPlaces } from '@shared/barPlaces';
import type { Palette } from '@/lib/theme';
import GlassBar from '@/ui/GlassBar';
import { Tap } from '@/ui/Tap';

/** A folded bar's circle. */
export const BAR_CIRCLE = 56;

/** How close to the screen's sides a bar may go. */
const SIDE = 8;

type Props = {
  /** Its own place is kept under this name (`recite`, `listen`). */
  id: string;
  /** Read out on the folded circle: «افتح …». */
  label: string;
  /** The bar's sign on its folded circle. */
  Icon: (props: LucideProps) => React.ReactNode;
  /** The screen it floats over. */
  screen: { width: number; height: number };
  /** How far from the screen's top and bottom it must stay (the status and top bars; the home indicator, the keyboard). */
  clear: { top: number; bottom: number };
  /** Where its centre sits until it is first dropped, in points from the screen's top left. */
  start: { x: number; y: number };
  palette: Palette;
  /** The bar, given the way to fold it: its last button calls `fold`. */
  children: (fold: () => void) => React.ReactNode;
};

/**
 * A bar that floats over the page (owner, 2026-11-19): the page under it keeps its full size. Dragged by any part that
 * is not a button, it goes anywhere on the screen and stays where it is let go, remembered for next time. Folded, it is a
 * small frosted circle with the bar's sign: a tap opens the bar again where the circle is, and a drag moves the circle.
 * The reader's recite bar and listen bar float with it.
 */
export default function FloatingBar({ id, label, Icon, screen, clear, start, palette, children }: Props) {
  const places = useSyncExternalStore(subscribeBarPlaces, readBarPlaces, serverBarPlaces);
  const saved = places[id];
  const folded = !!saved?.folded;
  const cx = useSharedValue(saved ? saved.x * screen.width : start.x);
  const cy = useSharedValue(saved ? saved.y * screen.height : start.y);
  const w = useSharedValue(0);
  const h = useSharedValue(0);
  const from = useSharedValue({ x: 0, y: 0 });
  const dragging = useSharedValue(false);
  // Its place follows the stored one (another launch, a turned phone); until dropped, the starting point the page gives.
  useEffect(() => {
    if (dragging.value) return;
    cx.value = saved ? saved.x * screen.width : start.x;
    cy.value = saved ? saved.y * screen.height : start.y;
  }, [saved?.x, saved?.y, screen.width, screen.height, start.x, start.y]); // eslint-disable-line react-hooks/exhaustive-deps

  const keep = (x: number, y: number, fold: boolean) => keepBarPlace(id, { x, y }, screen, fold);
  const fold = (on: boolean) => keep(cx.value, cy.value, on);

  const { width, height } = screen;
  const edges = { top: clear.top, bottom: clear.bottom, side: SIDE };
  /** Its top left, kept inside the screen between the bars it must clear. */
  const box = () => {
    'worklet';
    return clampBox({ x: cx.value, y: cy.value }, { width: w.value, height: h.value }, { width, height }, edges);
  };
  // Past Tap's 10 points, so a finger that moved enough to drag never also presses a button.
  const pan = Gesture.Pan().activeOffsetX([-12, 12]).activeOffsetY([-12, 12])
    .onBegin(() => { from.value = { x: cx.value, y: cy.value }; })
    .onStart(() => { dragging.value = true; })
    .onUpdate(event => { cx.value = from.value.x + event.translationX; cy.value = from.value.y + event.translationY; })
    .onEnd(() => {
      // It stays where it shows, so the stored place is the one inside the screen.
      const at = box();
      cx.value = at.left + w.value / 2;
      cy.value = at.top + h.value / 2;
      dragging.value = false;
      scheduleOnRN(keep, cx.value, cy.value, folded);
    })
    .onFinalize(() => { dragging.value = false; });
  // Moved by a transform, not by top and left: a transform is drawn on the UI thread every frame, while top and left
  // are layout and wait for a layout pass, so the bar only jumped to the finger once it was lifted (owner, 2026-11-19).
  const placed = useAnimatedStyle(() => {
    const at = box();
    return { transform: [{ translateX: at.left }, { translateY: at.top }] };
  });
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ position: 'absolute', left: 0, top: 0, maxWidth: width - SIDE * 2 }, placed]}
        onLayout={event => { w.value = event.nativeEvent.layout.width; h.value = event.nativeEvent.layout.height; }}>
        {folded ? (
          <GlassBar label={label} style={styles.circle} plain>
            <Tap onPress={() => fold(false)} accessibilityRole="button" accessibilityLabel={`افتح ${label}`} style={styles.fill}>
              <View><Icon size={24} color={palette.ink} strokeWidth={2} /></View>
            </Tap>
          </GlassBar>
        ) : children(() => fold(true))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  circle: { width: BAR_CIRCLE, height: BAR_CIRCLE, justifyContent: 'center' },
  fill: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
});
