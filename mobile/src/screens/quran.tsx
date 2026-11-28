import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { LayoutGrid, type LucideProps } from 'lucide-react-native';
import { normalizeWord } from '@shared/quran/normalize';
import type { AppKind as SearchKind } from '@/lib/searchAll';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toTab } from '@/lib/ways';
import { usePalette, type Palette } from '@/lib/theme';
import IconTile from '@/ui/IconTile';
import Empty from '@/ui/Empty';
import { SearchResults, useAppSearch } from '@/components/SearchResults';
import { FEATURE_ICON } from '@/components/featureIcons';
import { useAdjustOn } from '@/lib/hooks/useAdjustOn';

export const QURAN_TILES: { route: string; label: string; Icon: (props: LucideProps) => React.ReactNode }[] = [
  { route: '/read', label: 'المصحف', Icon: FEATURE_ICON.mushaf },
  { route: '/ayat', label: 'الآيات', Icon: FEATURE_ICON.ayat },
  { route: '/order', label: 'ترتيب السور', Icon: FEATURE_ICON.order },
  { route: '/openings', label: 'فواتح السور', Icon: FEATURE_ICON.openings },
  { route: '/branches', label: 'متشابهات القرآن', Icon: FEATURE_ICON.trees },
  { route: '/compare', label: 'مقارنة السور', Icon: FEATURE_ICON.compare },
  { route: '/words', label: 'ألفاظ القرآن', Icon: FEATURE_ICON.words },
  { route: '/terms', label: 'مصطلحات البلاغة', Icon: FEATURE_ICON.balagha },
  { route: '/qiraat', label: 'القراءات', Icon: FEATURE_ICON.qiraat },
  { route: '/prophets', label: 'قصص الأنبياء', Icon: FEATURE_ICON.prophets },
  { route: '/oaths', label: 'الأقسام', Icon: FEATURE_ICON.oaths },
  { route: '/tuhfa', label: 'تحفة الأطفال', Icon: FEATURE_ICON.tuhfa },
];

const ToolTile = ({ tile: { route, label, Icon }, palette }: { tile: (typeof QURAN_TILES)[number]; palette: Palette }) => (
  <IconTile label={label} Icon={Icon} palette={palette} onPress={() => toTab(route as Parameters<typeof toTab>[0])} />
);

const loose = (text: string) => normalizeWord(text).replace(/\s+/g, ' ').trim();

export const toolsNamed = (query: string) => { const typed = loose(query); return typed ? QURAN_TILES.filter(tile => loose(tile.label).includes(typed)) : []; };

const quranKind = (kind: SearchKind) => !['adhkar', 'person', 'battle', 'hadith'].includes(kind);

export default function QuranHub() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('quran', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<SearchKind | null>(null);
  useAdjustOn([query], () => setOpen(null));
  const { found, waiting } = useAppSearch(query, quranKind);
  const tools = useMemo(() => toolsNamed(found.query), [found.query]);
  const surahs = found.groups.filter(group => group.kind === 'surah');
  const rest = found.groups.filter(group => group.kind !== 'surah');
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث عن علم أو سورة أو آية', label: 'ابحث في علوم القرآن' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        {query.trim() ? <>
          {!waiting && found.query !== '' && !tools.length && !found.groups.length && <Empty text="لا توجد نتيجة مطابقة." palette={palette} />}
          <SearchResults groups={surahs} open={open} onOpen={setOpen} palette={palette} />
          {tools.length > 0 && !open && (
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40 }}>
                <LayoutGrid size={20} color={palette.accent} />
                <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700' }}>علوم القرآن</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {tools.map(tile => <ToolTile key={tile.route} tile={tile} palette={palette} />)}
              </View>
            </View>
          )}
          <SearchResults groups={rest} open={open} onOpen={setOpen} palette={palette} />
        </> : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {QURAN_TILES.map(tile => <ToolTile key={tile.route} tile={tile} palette={palette} />)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
