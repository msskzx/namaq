import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BookOpen, Compass, Feather, House, type LucideProps } from 'lucide-react-native';
import TreeIcon from './TreeIcon';
import { TAB_BAR, tabBarBottom } from './tabBarSpace';
import { usePalette } from '@/lib/theme';
import { retapTab } from '@/lib/tabRetap';
import { setCompact, useCompact, useImmersive } from '@/lib/chrome';
import { buttonOf, noteRoute, pageOf } from '@/lib/tabGroups';

/**
 * Utilities shows once its first tool lands (owner, 2026-11-13): the bar never opens an empty page.
 * The thread building prayer times, qibla and the Hijri calendar turns this on with its utilities page.
 */
export const SHOW_UTILITIES = true;

// Five buttons at most (owner, 2026-11-13). Arabic runs right to left, so the first sits on the right:
// read left to right they are utilities, quizzes, home, mushaf, Quran. The Quran button holds the Quran hub and its tools (lib/tabGroups.ts).
const BUTTONS: { key: string; label: string; Icon: (props: LucideProps) => React.ReactNode; hidden?: boolean }[] = [
  { key: 'quran', label: 'القرآن', Icon: TreeIcon },
  { key: 'read', label: 'المصحف', Icon: BookOpen },
  { key: 'index', label: 'الرئيسية', Icon: House },
  { key: 'quizzes', label: 'الاختبارات', Icon: Feather },
  { key: 'utilities', label: 'الأدوات', Icon: Compass, hidden: !SHOW_UTILITIES },
];

// Instagram-style (owner, 2026-11-10): while a page scrolls down the bar gets a little smaller, and it comes back on the way up.
const FULL = TAB_BAR.height;
const SMALL = 44;
const ICON_SMALL = 0.8;

export default function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const immersive = useImmersive();
  const compact = useCompact();
  const shrink = useSharedValue(0);
  useEffect(() => { shrink.value = withTiming(compact ? 1 : 0, { duration: 180 }); }, [compact, shrink]);
  // A new tab starts with the bar at full size.
  const current = state.routes[state.index]?.name ?? 'index';
  useEffect(() => { setCompact(false); noteRoute(current); }, [current]);
  const row = useAnimatedStyle(() => ({ height: interpolate(shrink.value, [0, 1], [FULL, SMALL]) }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(shrink.value, [0, 1], [1, ICON_SMALL]) }] }));
  // A see-through pill floating over the page (owner, 2026-11-13); pages leave room for it with useTabBarSpace. On the mushaf it hides while reading.
  const reading = state.routes[state.index]?.name === 'read';
  if (reading && immersive) return null;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: TAB_BAR.side, right: TAB_BAR.side, bottom: tabBarBottom(insets.bottom),
      borderRadius: 999, boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)' }}>
      <Animated.View style={[{ flexDirection: 'row', paddingHorizontal: 6, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }, row]}>
        <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
        {BUTTONS.filter(button => !button.hidden).map(({ key, label, Icon }) => {
          const active = buttonOf(current) === key;
          // The open button tapped again: the open page goes to its top, then resets (lib/tabRetap.ts).
          const press = () => {
            if (active) { retapTab(current); return; }
            const route = state.routes.find(item => item.name === pageOf(key));
            if (route) navigateToTab(route.key);
          };
          return (
            <Pressable key={key} onPress={press} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={label}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={icon}>
                <Icon size={26} color={active ? palette.accent : palette.muted} strokeWidth={active ? 2.25 : 1.75} />
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}
