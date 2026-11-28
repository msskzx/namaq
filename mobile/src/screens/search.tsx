import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import type { AppKind as SearchKind } from '@/lib/searchAll';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { back } from '@/lib/ways';
import { usePalette } from '@/lib/theme';
import { SearchResults, useAppSearch } from '@/components/SearchResults';
import { useAdjustOn } from '@/lib/hooks/useAdjustOn';

// see docs/plans/search-everything.md
export default function SearchScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const top = useRef(0);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<SearchKind | null>(null);
  useTabRetap('search', () => { if (top.current > 4) scroll.current?.scrollTo({ y: 0, animated: true }); else setQuery(''); });
  useAdjustOn([query], () => setOpen(null));
  const { found, waiting } = useAppSearch(query);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={() => (open ? setOpen(null) : back())} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث', label: 'ابحث في كل شيء' }} />
      <ScrollView ref={scroll} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: bottom, gap: 14 }}>
        {!waiting && found.query !== '' && !(open ? found.groups.some(group => group.kind === open) : found.groups.length) && <Empty text="لا توجد نتيجة مطابقة." palette={palette} />}
        <SearchResults groups={found.groups} open={open} onOpen={setOpen} palette={palette} />
      </ScrollView>
    </View>
  );
}
