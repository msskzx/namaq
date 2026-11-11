import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/Text';
import type { Visit } from '@shared/quran/compareCards';
import { curatedFor } from '@shared/quran/curatedComparisons';
import { cardsFor, visitKey } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import CompareCard from './CompareCard';

/** One page: the cards of a surah pair, scrolled up and down. */
const PairPage = memo(function PairPage({ visit, width, palette, savedOnly, savedIds }: { visit: Visit; width: number; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean }) {
  const all = cardsFor(visit.lead, visit.other);
  const cards = savedOnly ? all.filter(card => savedIds(card.id)) : all;
  const story = curatedFor(visit.lead, visit.other);
  return (
    <View style={{ width, flex: 1, direction: 'rtl' }}>
      <FlatList data={cards} keyExtractor={card => card.id} initialNumToRender={4} windowSize={5}
        contentContainerStyle={{ padding: 12, gap: 14, paddingBottom: 32 }}
        ListHeaderComponent={story ? <Text style={{ color: palette.accent, fontSize: 16, textAlign: 'right' }}>{story.name.ar}</Text> : undefined}
        ListEmptyComponent={<Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{savedOnly ? 'لا بطاقات محفوظة بين السورتين.' : 'لا آيات متشابهة بين السورتين.'}</Text>}
        renderItem={({ item }) => <CompareCard card={item} palette={palette} />} />
    </View>
  );
});

export type PagerHandle = { goTo: (index: number, animated?: boolean) => void };

/** The surah pairs side by side: swiping right brings the next pair from the left, as on the website in Arabic. */
const ComparePager = forwardRef<PagerHandle, { visits: Visit[]; index: number; onIndex: (index: number) => void; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean }>(
  function ComparePager({ visits, index, onIndex, palette, savedOnly, savedIds }, ref) {
    const list = useRef<FlatList<Visit>>(null);
    const [width, setWidth] = useState(0);
    useImperativeHandle(ref, () => ({ goTo: (to, animated = true) => list.current?.scrollToIndex({ index: to, animated }) }), []);
    const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!width) return;
      const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
      if (at !== index && at >= 0 && at < visits.length) onIndex(at);
    }, [width, index, visits.length, onIndex]);
    // The web build snaps with CSS and sends no momentum event, so it settles when scrolling stops.
    const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS !== 'web') return;
      const { nativeEvent } = event;
      clearTimeout(quiet.current);
      quiet.current = setTimeout(() => settle({ nativeEvent } as NativeSyntheticEvent<NativeScrollEvent>), 150);
    }, [settle]);
    const layout = useCallback((_: unknown, at: number) => ({ length: width, offset: width * at, index: at }), [width]);
    const extra = useMemo(() => ({ palette, savedOnly }), [palette, savedOnly]);
    return (
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && <FlatList ref={list} data={visits} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
          keyExtractor={visitKey} getItemLayout={layout} initialScrollIndex={Math.min(index, visits.length - 1)}
          initialNumToRender={1} maxToRenderPerBatch={2} windowSize={3} extraData={extra}
          onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={32} onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => <PairPage visit={item} width={width} palette={palette} savedOnly={savedOnly} savedIds={savedIds} />} />}
      </View>
    );
  });

export default ComparePager;
