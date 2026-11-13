import { useRef, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight, BookMarked, ScrollText, type LucideProps } from 'lucide-react-native';
import { Text } from '@/components/Text';
import TopBar from '@/components/TopBar';
import TreeIcon from '@/components/TreeIcon';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toTab } from '@/lib/ways';
import { usePalette, CARD } from '@/lib/theme';

/** The Quran button's tools; each opens inside the tab, with a back arrow to this grid. */
export const QURAN_TILES: { route: string; label: string; Icon: (props: LucideProps) => React.ReactNode }[] = [
  { route: '/branches', label: 'متشابهات القرآن', Icon: TreeIcon },
  { route: '/compare', label: 'مقارنة السور', Icon: ArrowLeftRight },
  { route: '/prophets', label: 'قصص الأنبياء', Icon: ScrollText },
  { route: '/tuhfa', label: 'تحفة الأطفال', Icon: BookMarked },
];

/** The Quran tab (owner, 2026-11-13): a grid of the Quran tools, two to a row. The mushaf has its own button. */
export default function QuranHub() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('quran', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {QURAN_TILES.map(({ route, label, Icon }) => (
            <Pressable key={route} onPress={() => toTab(route as Parameters<typeof toTab>[0])} accessibilityRole="link" accessibilityLabel={label}
              style={({ pressed }) => ({ flexBasis: '47%', flexGrow: 1, height: 112, alignItems: 'center', justifyContent: 'center', gap: 10, ...CARD,
                backgroundColor: pressed ? palette.paperDeep : palette.card, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
              <Icon size={30} color={palette.accent} strokeWidth={1.75} />
              <Text style={{ color: palette.ink, fontSize: 17 }}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
