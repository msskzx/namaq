import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings, CircleHelp } from 'lucide-react-native';
import Logo from './Logo';
import SettingsSheet from './SettingsSheet';
import { usePalette } from '@/lib/theme';
import { useCompact } from '@/lib/chrome';

const HEIGHT = 52;
const SIDE = 54; // the logo and its padding, kept clear on both sides so centred buttons stay centred

/**
 * The website's phone top bar: the logo (home) on the right, the page's own buttons, then the settings gear on the left.
 * The gear shows only on the homepage (owner, 2026-11-10); the logo shows everywhere and opens home.
 * With hideOnScroll (pages that scroll up and down) it slides away while the page scrolls down and comes back on the way up,
 * together with the bottom bar shrinking (owner, 2026-11-10).
 * See-through with no line under it, like the floating tab bar (owner, 2026-11-13): on the mushaf, where it floats over the page, the page shows blurred through it.
 * With center the page's buttons sit in the middle of the bar, clear of the logo (the compare dropdown, owner 2026-11-10).
 */
export default function TopBar({ children, settings: withSettings = false, hideOnScroll = false, center = false, help }: { children?: React.ReactNode; settings?: boolean; hideOnScroll?: boolean; center?: boolean;
  /** The page's help (rules and colour legend), in the gear's place at the bar's far end. */
  help?: () => void }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(false);
  const hidden = useCompact() && hideOnScroll;
  const away = useSharedValue(0);
  useEffect(() => { away.value = withTiming(hidden ? 1 : 0, { duration: 180 }); }, [hidden, away]);
  const row = useAnimatedStyle(() => ({ height: interpolate(away.value, [0, 1], [HEIGHT, 0]), opacity: interpolate(away.value, [0, 0.6], [1, 0], 'clamp') }));
  return (
    <View style={{ paddingTop: insets.top, overflow: 'hidden' }}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: `${palette.paper}b8` }]} />
      <Animated.View style={[{ overflow: 'hidden', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }, row]}>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button" accessibilityLabel="الصفحة الرئيسية" hitSlop={8}>
          <Logo size={34} />
        </Pressable>
        {center
          ? <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, bottom: 0, left: SIDE, right: SIDE, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>{children}</View>
          : <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>{children}</View>}
        {help && center && <View style={{ flex: 1 }} />}
        {help && <Pressable onPress={help} accessibilityRole="button" accessibilityLabel="مساعدة" hitSlop={4}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <CircleHelp size={22} color={palette.muted} />
        </Pressable>}
        {withSettings && <Pressable onPress={() => setSettings(true)} accessibilityRole="button" accessibilityLabel="الإعدادات" hitSlop={4}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={22} color={palette.muted} />
        </Pressable>}
      </Animated.View>
      {withSettings && <SettingsSheet open={settings} onClose={() => setSettings(false)} palette={palette} />}
    </View>
  );
}
