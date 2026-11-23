import { useEffect, useState } from 'react';
import { OutsideCard } from '@/ui/cardContext';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import { COLUMN } from './column';
import { useKeyboardHeight } from '@/lib/keyboard';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import type { Palette } from '@/lib/theme';
import { Text } from '@/ui/Text';
import { SourceSlotContext } from '@/ui/sourceSlot';
import { AyahMenuContext } from './ayahMenuContext';
import IconButton from '@/ui/IconButton';

const OPEN_MS = 260;
/** How long a sheet takes to go; a sheet opened after another waits this long more than a plain modal. */
export const CLOSE_MS = 220;

/**
 * The website's phone sheet: rises from the bottom over a dimmed page; a tap outside or a swipe down closes it.
 * The sheet runs its own slide, so a sheet let go mid-drag keeps going down from where the finger left it.
 * `tall` keeps the sheet one height (for lists that shrink while searching) and lifts it above the keyboard.
 * `full` covers the whole screen (share as image, share as video), with its `title` and a close button on top; it rises
 * and goes the same way, and a swipe down on its top closes it. `onDismiss` runs once the sheet has gone (iOS opens
 * another sheet only then).
 */
export default function Sheet({ open, onClose, palette, tall, full, title, onDismiss, children }: { open: boolean; onClose: () => void; palette: Palette; tall?: boolean;
  full?: boolean; title?: string; onDismiss?: () => void; children: React.ReactNode }) {
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
  const handle = (
    <GestureDetector gesture={swipe}>
      {full
        ? <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, height: 52 }}>
          <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 16, fontWeight: '600', paddingHorizontal: 8 }}>{title}</Text>
          <IconButton label="إغلاق" onPress={onClose} Icon={X} tone="ink" />
        </View>
        : <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.rule }} />
        </View>}
    </GestureDetector>
  );
  const size = full ? { flex: 1, paddingTop: insets.top }
    : tall ? { height: Math.round((screen - keyboard) * 0.85) } : { maxHeight: '85%' as const };
  // On a tablet a sheet rises in the page's column (ui/column.ts), not across the whole screen.
  const edge = full ? {} : { borderTopWidth: 1, borderColor: palette.rule, borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%' as const, maxWidth: COLUMN, alignSelf: 'center' as const };
  return (
    <Modal visible={shown} transparent animationType="none" onRequestClose={onClose} onDismiss={onDismiss} statusBarTranslucent>
      {/* A sheet opened from a home card is not the card: its references draw in it (ui/sourceSlot.ts). */}
      <SourceSlotContext.Provider value={null}>
      {/* The ayah menu opens under a modal, so an ayah in a sheet opens none (ui/ayahMenuContext.ts). */}
      <AyahMenuContext.Provider value={null}>
      <GestureHandlerRootView style={{ flex: 1, paddingBottom: keyboard }}>
        {!full && <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }, dim]}>
          <Pressable accessibilityLabel="إغلاق" onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>}
        {!full && <View pointerEvents="none" style={{ flex: 1 }} />}
        <Animated.View style={[{ direction: 'rtl', ...size, backgroundColor: palette.paper, ...edge, paddingBottom: (keyboard ? 0 : insets.bottom) + 8 }, moved]}>
          {handle}
          <OutsideCard>{children}</OutsideCard>
        </Animated.View>
      </GestureHandlerRootView>
      </AyahMenuContext.Provider>
      </SourceSlotContext.Provider>
    </Modal>
  );
}
