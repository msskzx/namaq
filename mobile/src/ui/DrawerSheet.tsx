import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, View } from 'react-native';
import { Tap } from '@/ui/Tap';
import { CARD, type Palette } from '@/lib/theme';

export default function DrawerSheet({ low, high, bottom = 0, lower = 0, raised = false, palette, children }: {
  low: number; high: number;
  raised?: boolean;
  lower?: number;
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
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom + (up ? 0 : travel), gap: 12 }}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}
