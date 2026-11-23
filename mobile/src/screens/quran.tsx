import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toTab } from '@/lib/ways';
import { usePalette } from '@/lib/theme';
import IconTile from '@/ui/IconTile';
import { FEATURE_ICON } from '@/components/featureIcons';

/** The Quran button's tools; each opens inside the tab, with a back arrow to this grid. */
export const QURAN_TILES: { route: string; label: string; Icon: (props: LucideProps) => React.ReactNode }[] = [
  { route: '/read', label: 'المصحف', Icon: FEATURE_ICON.mushaf },
  { route: '/branches', label: 'متشابهات القرآن', Icon: FEATURE_ICON.trees },
  { route: '/compare', label: 'مقارنة السور', Icon: FEATURE_ICON.compare },
  { route: '/prophets', label: 'قصص الأنبياء', Icon: FEATURE_ICON.prophets },
  { route: '/tuhfa', label: 'تحفة الأطفال', Icon: FEATURE_ICON.tuhfa },
  { route: '/words', label: 'ألفاظ القرآن', Icon: FEATURE_ICON.words },
  { route: '/oaths', label: 'الأقسام', Icon: FEATURE_ICON.oaths },
  { route: '/lataif', label: 'مشاهد', Icon: FEATURE_ICON.scenes },
  { route: '/terms', label: 'مصطلحات البلاغة', Icon: FEATURE_ICON.balagha },
  { route: '/qiraat', label: 'القراءات', Icon: FEATURE_ICON.qiraat },
  { route: '/openings', label: 'افتتاح السور', Icon: FEATURE_ICON.openings },
  { route: '/order', label: 'ترتيب السور', Icon: FEATURE_ICON.order },
];

/** The Quran tab (owner, 2026-11-13): a grid of the Quran tools, two to a row, the mushaf first (owner, 2026-11-18: it lost its own button). */
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
            <IconTile key={route} label={label} Icon={Icon} palette={palette} onPress={() => toTab(route as Parameters<typeof toTab>[0])} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

