import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ArrowLeftRight, BookOpen, Feather, ScrollText, type LucideProps } from 'lucide-react-native';
import TreeIcon from './TreeIcon';
import { usePalette } from '@/lib/theme';
import { useImmersive } from '@/lib/chrome';

// The website's phone tabs (src/lib/navigation.ts NAV_SECTIONS), icon only, plus the prophets timeline (owner, 2026-11-10).
const TABS: Record<string, { label: string; Icon: (props: LucideProps) => React.ReactNode }> = {
  index: { label: 'متشابهات القرآن', Icon: TreeIcon },
  compare: { label: 'مقارنة السور', Icon: ArrowLeftRight },
  read: { label: 'المصحف', Icon: BookOpen },
  prophets: { label: 'قصص الأنبياء', Icon: ScrollText },
  quizzes: { label: 'الاختبارات', Icon: Feather },
};

export default function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const immersive = useImmersive();
  // On the mushaf the bar floats over the page, so showing it does not move the lines; it hides while reading.
  const reading = state.routes[state.index]?.name === 'read';
  if (reading && immersive) return null;
  return (
    <View style={{ ...(reading ? { position: 'absolute', left: 0, right: 0, bottom: 0 } : null), flexDirection: 'row', paddingBottom: insets.bottom, backgroundColor: palette.paper, borderTopWidth: 1, borderColor: palette.rule }}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = state.index === i;
        const press = () => { if (!active) navigateToTab(route.key); };
        return (
          <Pressable key={route.key} onPress={press} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={tab.label}
            style={{ flex: 1, height: 54, alignItems: 'center', justifyContent: 'center' }}>
            <tab.Icon size={26} color={active ? palette.accent : palette.muted} strokeWidth={active ? 2.25 : 1.75} />
          </Pressable>
        );
      })}
    </View>
  );
}
