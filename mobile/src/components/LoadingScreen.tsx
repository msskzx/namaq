import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Text } from '@/components/Text';
import Logo from './Logo';
import { usePalette } from '@/lib/theme';
import { APP_NAME, OPENING, SLOGAN } from '@shared/brand';

/** The native splash draws the logo this wide (app.json, expo-splash-screen imageWidth), centred on the whole screen. */
export const SPLASH_LOGO = 150;

/**
 * Shown while the app loads, over everything. It starts exactly as the phone's own splash (the logo alone, same size and
 * place), so a real build hands over without a jump; in Expo Go, where there is no native splash, it is the first thing seen.
 * The name and slogan fade in under the logo as at the end of the videos (shared/brand.ts OPENING); when home is drawn
 * (`done`) the whole screen fades away slowly and calls `onGone`.
 */
export default function LoadingScreen({ words, done, onLayout, onGone }: { words: boolean; done: boolean; onLayout?: () => void; onGone: () => void }) {
  const palette = usePalette();
  const opacity = useSharedValue(1);
  useEffect(() => {
    if (done) opacity.value = withTiming(0, { duration: 500 }, finished => { if (finished) scheduleOnRN(onGone); });
  }, [done, opacity, onGone]);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: palette.paper }, fade]} onLayout={onLayout} pointerEvents={done ? 'none' : 'auto'}>
      <View style={styles.centre}>
        <Logo size={SPLASH_LOGO} />
      </View>
      {/* Hangs under the logo so the logo itself never moves from where the splash put it. */}
      {words && (
        <Animated.View entering={FadeIn.duration(600)} style={[styles.words, { top: '50%', marginTop: SPLASH_LOGO / 2 + OPENING.gap, gap: OPENING.nameGap }]}>
          <Text style={{ color: palette.ink, fontSize: OPENING.name, fontWeight: '700' }}>{APP_NAME}</Text>
          <Text style={{ color: palette.muted, fontSize: OPENING.slogan }}>{SLOGAN}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centre: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  words: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
});
