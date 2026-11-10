import { useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Palette } from '@/lib/theme';

/** The website's phone sheet: rises from the bottom over a dimmed page; a tap outside or a swipe down closes it. */
export default function Sheet({ open, onClose, palette, children }: { open: boolean; onClose: () => void; palette: Palette; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const drag = useSharedValue(0);
  useEffect(() => { if (open) drag.value = 0; }, [open, drag]);
  const swipe = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate(event => { drag.value = Math.max(0, event.translationY); })
    .onEnd(event => {
      if (event.translationY > 100 || event.velocityY > 800) scheduleOnRN(onClose);
      else drag.value = withTiming(0, { duration: 180 });
    });
  const moved = useAnimatedStyle(() => ({ transform: [{ translateY: drag.value }] }));
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable accessibilityLabel="إغلاق" onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <Animated.View style={[{ direction: 'rtl', maxHeight: '85%', backgroundColor: palette.paper, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: insets.bottom + 8 }, moved]}>
          <GestureDetector gesture={swipe}>
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.rule }} />
            </View>
          </GestureDetector>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
