import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, View } from 'react-native';
import { Tap } from '@/ui/Tap';
import { CARD, type Palette } from '@/lib/theme';

/**
 * A sheet that stays on the page over a full-screen picture (owner, 2026-11-23: the atlas, as a maps app; sketch
 * tools-design/atlas sketch-v2): it rests at `low` (points from the top of its page) with the picture open above it, and
 * its handle, dragged or tapped, brings it up to `high` to read the whole list, and back. Its content scrolls inside it.
 * Unlike ui/Sheet it never closes and nothing behind it dims.
 */
export default function DrawerSheet({ low, high, bottom = 0, lower = 0, raised = false, palette, children }: {
  low: number; high: number;
  /** While true, the sheet stays up (search results, read over the keyboard); back to rest when it turns false. */
  raised?: boolean;
  /** Changed (a count), it brings the sheet down to rest: a second tap on the page's tab. */
  lower?: number;
  /** Room under the content for what floats over the page's foot (the tab bar). */
  bottom?: number; palette: Palette; children: React.ReactNode;
}) {
  const travel = Math.max(0, low - high);
  const y = useRef(new Animated.Value(travel)).current;
  const [up, setUp] = useState(false);
  const at = useRef(travel);
  useEffect(() => { y.setValue(up ? 0 : travel); at.current = up ? 0 : travel; }, [travel]); // eslint-disable-line react-hooks/exhaustive-deps
  const settle = (raised: boolean) => {
    at.current = raised ? 0 : travel;
    setUp(raised);
    Animated.timing(y, { toValue: at.current, duration: 260, useNativeDriver: false }).start();
  };
  useEffect(() => { if (lower) settle(false); }, [lower]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (raised) settle(true); else if (up) settle(false); }, [raised]); // eslint-disable-line react-hooks/exhaustive-deps
  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, move) => Math.abs(move.dy) > 6,
    onPanResponderMove: (_, move) => y.setValue(Math.min(travel, Math.max(0, at.current + move.dy))),
    onPanResponderRelease: (_, move) => settle(move.vy < -0.3 || (move.vy <= 0.3 && at.current + move.dy < travel / 2)),
  }), [travel]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: high, bottom: 0, transform: [{ translateY: y }],
      backgroundColor: palette.card, borderTopLeftRadius: CARD.borderRadius * 1.6, borderTopRightRadius: CARD.borderRadius * 1.6, borderTopWidth: 1, borderColor: palette.rule }}>
      <View {...pan.panHandlers}>
        <Tap onPress={() => settle(!up)} accessibilityRole="button" accessibilityLabel={up ? 'أنزل اللوح' : 'ارفع اللوح'} accessibilityState={{ expanded: up }}
          style={{ height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.rule }} />
        </Tap>
      </View>
      {/* At rest the sheet's foot is below the screen by its travel, so the list keeps that much room to scroll into view. */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom + (up ? 0 : travel), gap: 12 }}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}
