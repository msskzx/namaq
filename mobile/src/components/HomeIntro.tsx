import { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { Easing, FadeOut, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Logo from './Logo';
import { readJson, writeJson } from '@/lib/storage';
import type { Palette } from '@/lib/theme';

const SEEN = 'home-intro-seen';
const HOLD = 2600;

/** The first visit opens on the logo growing in and the app's aim (the website's homepage opening); a tap skips it. */
export default function HomeIntro({ palette }: { palette: Palette }) {
  const still = useReducedMotion();
  const [shown, setShown] = useState(() => !readJson<boolean>(SEEN));
  const grow = useSharedValue(0);
  const words = useSharedValue(0);
  useEffect(() => {
    if (!shown) return;
    writeJson(SEEN, true);
    if (still) { setShown(false); return; }
    grow.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    words.value = withDelay(700, withTiming(1, { duration: 600 }));
    const timer = setTimeout(() => setShown(false), HOLD);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const logo = useAnimatedStyle(() => ({ opacity: grow.value, transform: [{ scale: 0.6 + grow.value * 0.4 }] }));
  const text = useAnimatedStyle(() => ({ opacity: words.value, transform: [{ translateY: (1 - words.value) * 8 }] }));
  if (!shown) return null;
  return (
    <Animated.View exiting={FadeOut.duration(400)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: palette.paper }}>
      <Pressable onPress={() => setShown(false)} accessibilityRole="button" accessibilityLabel="تخطَّ" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <Animated.View style={logo}><Logo size={140} /></Animated.View>
        <Animated.View style={[{ alignItems: 'center', gap: 6 }, text]}>
          <Text style={{ color: palette.ink, fontSize: 34, fontWeight: '700' }}>نمق</Text>
          <Text style={{ color: palette.muted, fontSize: 18 }}>تدبّر القرآن</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
