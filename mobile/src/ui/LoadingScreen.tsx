import { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Text } from '@/ui/Text';
import Logo from '@/components/Logo';
import { dark, light } from '@/lib/theme';
import { APP_NAME, OPENING, SLOGAN } from '@shared/brand';

export const SPLASH_LOGO = 150;

export default function LoadingScreen({ words, done, onLayout, onGone }: { words: boolean; done: boolean; onLayout?: () => void; onGone: () => void }) {
  const palette = useColorScheme() === 'dark' ? dark : light;
  const opacity = useSharedValue(1);
  useEffect(() => {
    if (done) opacity.value = withTiming(0, { duration: 500 }, finished => { if (finished) scheduleOnRN(onGone); });
  }, [done, opacity, onGone]);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: palette.paper }, fade]} onLayout={onLayout} pointerEvents={done ? 'none' : 'auto'}>
      <View style={styles.centre}>
        <Logo size={SPLASH_LOGO} palette={palette} />
      </View>
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
