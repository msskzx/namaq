import { useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import type { LucideProps } from 'lucide-react-native';
import { clampBox, keepBarPlace, readBarPlaces, serverBarPlaces, subscribeBarPlaces } from '@shared/barPlaces';
import type { Palette } from '@/lib/theme';
import GlassBar from '@/ui/GlassBar';
import { Tap } from '@/ui/Tap';
import { useOnChange } from '@/lib/hooks/useOnChange';

export const BAR_CIRCLE = 56;

const SIDE = 8;

type Props = {
  id: string;
  label: string;
  Icon: (props: LucideProps) => React.ReactNode;
  screen: { width: number; height: number };
  clear: { top: number; bottom: number };
  start: { x: number; y: number };
  palette: Palette;
  children: (fold: () => void) => React.ReactNode;
};

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
  useOnChange([saved?.x, saved?.y, screen.width, screen.height, start.x, start.y], () => {
    if (dragging.value) return;
    cx.value = saved ? saved.x * screen.width : start.x;
    cy.value = saved ? saved.y * screen.height : start.y;
  });

  const keep = (x: number, y: number, fold: boolean) => keepBarPlace(id, { x, y }, screen, fold);
  const fold = (on: boolean) => keep(cx.value, cy.value, on);

  const { width, height } = screen;
  const edges = { top: clear.top, bottom: clear.bottom, side: SIDE };
  const box = () => {
    'worklet';
    return clampBox({ x: cx.value, y: cy.value }, { width: w.value, height: h.value }, { width, height }, edges);
  };
  const pan = Gesture.Pan().activeOffsetX([-12, 12]).activeOffsetY([-12, 12])
    .onBegin(event => { from.value = { x: cx.value - event.absoluteX, y: cy.value - event.absoluteY }; })
    .onStart(() => { dragging.value = true; })
    .onUpdate(event => { cx.value = from.value.x + event.absoluteX; cy.value = from.value.y + event.absoluteY; })
    .onEnd(() => {
      const at = box();
      cx.value = at.left + w.value / 2;
      cy.value = at.top + h.value / 2;
      dragging.value = false;
      scheduleOnRN(keep, cx.value, cy.value, folded);
    })
    .onFinalize(() => { dragging.value = false; });
  const placed = useAnimatedStyle(() => {
    const at = clampBox({ x: cx.value, y: cy.value }, { width: w.value, height: h.value }, { width, height }, edges);
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
