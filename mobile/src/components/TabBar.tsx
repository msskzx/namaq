import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ArrowLeftRight, BookOpen, Feather, ScrollText, type LucideProps } from 'lucide-react-native';
import TreeIcon from './TreeIcon';
import { usePalette } from '@/lib/theme';
import { setCompact, useCompact, useImmersive } from '@/lib/chrome';

// The website's phone tabs (src/lib/navigation.ts NAV_SECTIONS), icon only, plus the prophets timeline (owner, 2026-11-10).
// The homepage (index) has no tab: the logo in the top bar opens it, as on the website.
const TABS: Record<string, { label: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  branches: { label: 'متشابهات القرآن', Icon: TreeIcon },
  compare: { label: 'مقارنة السور', Icon: ArrowLeftRight },
  read: { label: 'المصحف', Icon: BookOpen },
  prophets: { label: 'قصص الأنبياء', Icon: ScrollText },
  quizzes: { label: 'الاختبارات', Icon: Feather },
};

// Instagram-style (owner, 2026-11-10): while a page scrolls down the bar gets a little smaller, and it comes back on the way up.
const FULL = 54;
const SMALL = 42;
const ICON_SMALL = 0.8;

export default function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const immersive = useImmersive();
  const compact = useCompact();
  const shrink = useSharedValue(0);
  useEffect(() => { shrink.value = withTiming(compact ? 1 : 0, { duration: 180 }); }, [compact, shrink]);
  // A new tab starts with the bar at full size.
  useEffect(() => { setCompact(false); }, [state.index]);
  const row = useAnimatedStyle(() => ({ height: interpolate(shrink.value, [0, 1], [FULL, SMALL]) }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(shrink.value, [0, 1], [1, ICON_SMALL]) }] }));
  // On the mushaf the bar floats over the page, so showing it does not move the lines; it hides while reading.
  const reading = state.routes[state.index]?.name === 'read';
  if (reading && immersive) return null;
  return (
    <View style={{ ...(reading ? { position: 'absolute', left: 0, right: 0, bottom: 0 } : null), paddingBottom: insets.bottom, backgroundColor: palette.paper, borderTopWidth: 1, borderColor: palette.rule }}>
      <Animated.View style={[{ flexDirection: 'row' }, row]}>
        {state.routes.map((route, i) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const active = state.index === i;
          const press = () => { if (!active) navigateToTab(route.key); };
          return (
            <Pressable key={route.key} onPress={press} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={tab.label}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={icon}>
                <tab.Icon size={26} color={active ? palette.accent : palette.muted} strokeWidth={active ? 2.25 : 1.75} />
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}
