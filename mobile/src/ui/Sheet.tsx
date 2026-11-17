import { useEffect, useState } from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { useKeyboardHeight } from '@/lib/keyboard';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Palette } from '@/lib/theme';

const OPEN_MS = 260;
const CLOSE_MS = 220;

/**
 * The website's phone sheet: rises from the bottom over a dimmed page; a tap outside or a swipe down closes it.
 * The sheet runs its own slide, so a sheet let go mid-drag keeps going down from where the finger left it.
 * `tall` keeps the sheet one height (for lists that shrink while searching) and lifts it above the keyboard.
 */
export default function Sheet({ open, onClose, palette, tall, children }: { open: boolean; onClose: () => void; palette: Palette; tall?: boolean; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { height: screen } = useWindowDimensions();
  const [shown, setShown] = useState(open);
  // How far the sheet sits below its open place: the screen height when hidden, 0 when open.
  const drag = useSharedValue(open ? 0 : screen);
  const keyboard = useKeyboardHeight(shown && !!tall);

  useEffect(() => {
    if (open) {
      setShown(true);
      drag.value = withTiming(0, { duration: OPEN_MS, easing: Easing.out(Easing.cubic) });
    } else {
      // From wherever the sheet is now (a finger may have pulled it half way), on down and out.
      drag.value = withTiming(screen, { duration: CLOSE_MS, easing: Easing.in(Easing.quad) }, done => { if (done) scheduleOnRN(setShown, false); });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const swipe = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate(event => { drag.value = Math.max(0, event.translationY); })
    .onEnd(event => {
      if (event.translationY > 100 || event.velocityY > 800) scheduleOnRN(onClose);
      else drag.value = withTiming(0, { duration: 180 });
    });
  const moved = useAnimatedStyle(() => ({ transform: [{ translateY: drag.value }] }));
  const dim = useAnimatedStyle(() => ({ opacity: interpolate(drag.value, [0, screen * 0.6], [1, 0], 'clamp') }));
  return (
    <Modal visible={shown} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1, paddingBottom: keyboard }}>
        <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }, dim]}>
          <Pressable accessibilityLabel="إغلاق" onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
        <View pointerEvents="none" style={{ flex: 1 }} />
        <Animated.View style={[{ direction: 'rtl', ...(tall ? { height: Math.round((screen - keyboard) * 0.85) } : { maxHeight: '85%' }), backgroundColor: palette.paper, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: (keyboard ? 0 : insets.bottom) + 8 }, moved]}>
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
