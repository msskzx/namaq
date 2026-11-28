import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hiddenProps, useHidden, useSlideAway } from '@/ui/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useSegments } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BookOpenText, Feather, House, Milestone, ScrollText, type LucideProps } from 'lucide-react-native';
import { TAB_BAR, tabBarBottom } from '@/ui/tabBarSpace';
import { usePalette } from '@/lib/theme';
import { retapTab } from '@/lib/tabRetap';
import { setCompact, useCompact, useImmersive } from '@/lib/chrome';
import { openPage, tapOnOpen } from '@/lib/tabGroups';
import { toTab } from '@/lib/ways';
import { Tap } from '@/ui/Tap';
import { useColumnSide } from '@/ui/column';
import { useOnChange } from '@/lib/hooks/useOnChange';
import { Text, UI_SCALE } from '@/ui/Text';

const BUTTONS: { key: string; label: string; Icon: (props: LucideProps) => React.ReactNode }[] = [
  { key: '(quran)', label: 'القرآن', Icon: BookOpenText },
  { key: '(hadith)', label: 'الحديث', Icon: ScrollText },
  { key: '(home)', label: 'الرئيسية', Icon: House },
  { key: '(tarajim)', label: 'التراجم', Icon: Milestone },
  { key: 'quizzes', label: 'الاختبارات', Icon: Feather },
];

const LIT_BY: Record<string, string> = { read: '(quran)', '(library)': '(home)' };

const FULL = TAB_BAR.height;
const SMALL = 44;
const ICON_SMALL = 0.8;
const LABEL = 16;
const LABEL_BOX = Math.ceil(LABEL * UI_SCALE);

export default function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const side = useColumnSide();
  const immersive = useImmersive();
  const compact = useCompact();
  const shrink = useHidden(compact);
  const segments = useSegments();
  const open = state.routes[state.index]?.name ?? '(home)';
  const { page } = openPage(segments);
  useOnChange([page], () => setCompact(false));
  const row = useAnimatedStyle(() => ({ height: interpolate(shrink.value, [0, 1], [FULL, SMALL]) }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(shrink.value, [0, 1], [1, ICON_SMALL]) }] }));
  const name = useAnimatedStyle(() => ({ height: interpolate(shrink.value, [0, 1], [LABEL_BOX, 0]), opacity: interpolate(shrink.value, [0, 0.5], [1, 0], 'clamp') }));
  const away = page === 'read' && immersive;
  const slide = useSlideAway(away, 'bottom', FULL + tabBarBottom(insets.bottom) + 24);
  return (
    <Animated.View {...hiddenProps(away, 'box-none')} style={[{ position: 'absolute', left: TAB_BAR.side + side, right: TAB_BAR.side + side, bottom: tabBarBottom(insets.bottom),
      borderRadius: 999, boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)' }, slide.content]}>
      <Animated.View style={[{ flexDirection: 'row', paddingHorizontal: 6, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }, row]}>
        <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
        {BUTTONS.map(({ key, label, Icon }) => {
          const active = open === key;
          const lit = active || LIT_BY[open] === key;
          const press = () => {
            if (active) {
              if (tapOnOpen(page) === 'retap') retapTab(page);
              else router.back();
              return;
            }
            if (lit) { toTab(key === '(quran)' ? '/quran' : '/'); return; }
            const route = state.routes.find(item => item.name === key);
            if (route) navigateToTab(route.key);
          };
          return (
            <Tap key={key} onPress={press} accessibilityRole="tab" accessibilityState={{ selected: lit }} aria-selected={lit} accessibilityLabel={label}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Animated.View style={icon}>
                <Icon size={24} color={lit ? palette.accent : palette.muted} strokeWidth={lit ? 2.25 : 1.75} />
              </Animated.View>
              <Animated.View style={[{ overflow: 'hidden', marginTop: 3 }, name]}>
                <Text numberOfLines={1} style={{ color: lit ? palette.accent : palette.muted, fontSize: 11, lineHeight: LABEL }}>{label}</Text>
              </Animated.View>
            </Tap>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}
