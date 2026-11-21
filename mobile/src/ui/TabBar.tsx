import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hiddenProps, useHidden, useSlideAway } from '@/ui/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useSegments } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BookOpenText, Feather, House, Landmark, ScrollText, type LucideProps } from 'lucide-react-native';
import { TAB_BAR, tabBarBottom } from '@/ui/tabBarSpace';
import { usePalette } from '@/lib/theme';
import { retapTab } from '@/lib/tabRetap';
import { setCompact, useCompact, useImmersive } from '@/lib/chrome';
import { openPage, tapOnOpen } from '@/lib/tabGroups';
import { toTab } from '@/lib/ways';
import { Tap } from '@/ui/Tap';

// Five buttons at most (owner, 2026-11-13). Arabic runs right to left, so the first sits on the right:
// Quran, hadith, home, tarajim, quizzes (owner, 2026-11-18). Keys are the tab routes; each but the quizzes holds a page stack (lib/tabGroups.ts).
// The mushaf opens from the Quran hub and from home's cards, and lights the Quran button; the library and the utilities open from home.
const BUTTONS: { key: string; label: string; Icon: (props: LucideProps) => React.ReactNode }[] = [
  // The mushaf, the tab's first tool, not the trees (owner, 2026-11-20).
  { key: '(quran)', label: 'القرآن', Icon: BookOpenText },
  { key: '(hadith)', label: 'الحديث', Icon: ScrollText },
  { key: '(home)', label: 'الرئيسية', Icon: House },
  { key: '(tarajim)', label: 'التراجم', Icon: Landmark },
  { key: 'quizzes', label: 'الاختبارات', Icon: Feather },
];

/** The button lit for a tab with no button of its own: the mushaf under the Quran, the library under home. */
const LIT_BY: Record<string, string> = { read: '(quran)', '(library)': '(home)' };

// Instagram-style (owner, 2026-11-10): while a page scrolls down the bar gets a little smaller, and it comes back on the way up.
const FULL = TAB_BAR.height;
const SMALL = 44;
const ICON_SMALL = 0.8;

export default function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const immersive = useImmersive();
  const compact = useCompact();
  const shrink = useHidden(compact);
  // A new tab starts with the bar at full size.
  const segments = useSegments();
  const open = state.routes[state.index]?.name ?? '(home)';
  const { page } = openPage(segments);
  useEffect(() => { setCompact(false); }, [page]);
  const row = useAnimatedStyle(() => ({ height: interpolate(shrink.value, [0, 1], [FULL, SMALL]) }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(shrink.value, [0, 1], [1, ICON_SMALL]) }] }));
  // A see-through pill floating over the page (owner, 2026-11-13); pages leave room for it with useTabBarSpace. On the mushaf it hides while reading.
  // Reading the mushaf, it slides down off the screen as every bar hides (ui/motion), and back up on a tap.
  const away = page === 'read' && immersive;
  const slide = useSlideAway(away, 'bottom', FULL + tabBarBottom(insets.bottom) + 24);
  return (
    <Animated.View {...hiddenProps(away, 'box-none')} style={[{ position: 'absolute', left: TAB_BAR.side, right: TAB_BAR.side, bottom: tabBarBottom(insets.bottom),
      borderRadius: 999, boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)' }, slide.content]}>
      <Animated.View style={[{ flexDirection: 'row', paddingHorizontal: 6, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }, row]}>
        <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
        {BUTTONS.map(({ key, label, Icon }) => {
          const active = open === key;
          const lit = active || LIT_BY[open] === key;
          // The open button tapped again: the open page goes to its top, then resets (lib/tabRetap.ts); from the search it goes home.
          // Another button opens its tab on the page that was open there last.
          const press = () => {
            if (active) {
              if (tapOnOpen(page) === 'retap') retapTab(page);
              else router.back();
              return;
            }
            // From the mushaf the lit Quran button goes to the hub, not to the tool last open under it; from the library, home goes home.
            if (lit) { toTab(key === '(quran)' ? '/quran' : '/'); return; }
            const route = state.routes.find(item => item.name === key);
            if (route) navigateToTab(route.key);
          };
          return (
            <Tap key={key} onPress={press} accessibilityRole="tab" accessibilityState={{ selected: lit }} aria-selected={lit} accessibilityLabel={label}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={icon}>
                <Icon size={26} color={lit ? palette.accent : palette.muted} strokeWidth={lit ? 2.25 : 1.75} />
              </Animated.View>
            </Tap>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}
