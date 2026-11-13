import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { Text } from '@/components/Text';
import type { Visit } from '@shared/quran/compareCards';
import { curatedFor } from '@shared/quran/curatedComparisons';
import { cardsFor, focusIndex, visitKey } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import { Clapperboard } from 'lucide-react-native';
import CompareCard from './CompareCard';
import PageVideo from './PageVideo';
import { IconButton } from './Studio';

const GAP = 14;

/** A pair page to open on the card of these ayat (see focusIndex). */
export type Focus = { visit: string; ayat: string[] };

/** One page: the cards of a surah pair, scrolled up and down; `focus` scrolls to the card of those ayat. */
const PairPage = memo(function PairPage({ visit, width, height, palette, savedOnly, savedIds, focus, onLanded }: { visit: Visit; width: number; height: number; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean; focus?: string[]; onLanded?: () => void }) {
  const all = cardsFor(visit.lead, visit.other);
  const cards = savedOnly ? all.filter(card => savedIds(card.id)) : all;
  const story = curatedFor(visit.lead, visit.other);
  const list = useRef<FlatList<(typeof cards)[number]>>(null);
  const target = focus ? focusIndex(cards, focus) : -1;
  const landed = useRef(onLanded);
  landed.current = onLanded;
  // Cards differ in height, so the scroll waits for the cards above it to be drawn and adds up their heights,
  // and for the list to get its height on screen (before that it is as tall as its cards and cannot scroll).
  // They keep arriving for a moment after the page opens, so it lands again each time, until the reader scrolls or the moment passes.
  const pending = useRef(target);
  const heights = useRef<number[]>([]);
  const head = useRef(0);
  useEffect(() => {
    pending.current = target;
    if (target < 0) return;
    const timer = setTimeout(() => { pending.current = -1; landed.current?.(); }, 3000);
    return () => clearTimeout(timer);
  }, [target]);
  const land = useCallback(() => {
    const at = pending.current;
    if (at <= 0 || heights.current.slice(0, at).filter(Boolean).length < at) return;
    const offset = head.current + heights.current.slice(0, at).reduce((sum, height) => sum + height + GAP, 0);
    list.current?.scrollToOffset({ offset, animated: false });
  }, []);
  const stop = useCallback(() => { pending.current = -1; landed.current?.(); }, []);
  const [video, setVideo] = useState(false);
  return (
    <View style={{ width, height, direction: 'rtl' }}>
      <PageVideo lead={visit.lead} other={visit.other} cards={cards} open={video} onClose={() => setVideo(false)} palette={palette} />
      <FlatList ref={list} data={cards} keyExtractor={card => card.id} initialNumToRender={Math.max(4, target + 2)} windowSize={5} onContentSizeChange={land} onLayout={land} onScrollBeginDrag={stop}
        contentContainerStyle={{ padding: 12, gap: GAP, paddingBottom: 32 }}
        ListHeaderComponent={cards.length ? <View onLayout={event => { head.current = event.nativeEvent.layout.height + GAP; land(); }} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 40 }}>
          <Text style={{ flex: 1, color: palette.accent, fontSize: 16, textAlign: 'right' }}>{story?.name.ar ?? ''}</Text>
          <IconButton label="مشاركة الصفحة كفيديو" onPress={() => setVideo(true)} Icon={Clapperboard} color={palette.muted} size={22} />
        </View> : undefined}
        ListEmptyComponent={<Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{savedOnly ? 'لا بطاقات محفوظة بين السورتين.' : 'لا آيات متشابهة بين السورتين.'}</Text>}
        renderItem={({ item, index }) => <View onLayout={event => { heights.current[index] = event.nativeEvent.layout.height; land(); }}><CompareCard card={item} palette={palette} /></View>} />
    </View>
  );
});

export type PagerHandle = { goTo: (index: number, animated?: boolean) => void };

/** The surah pairs side by side: swiping right brings the next pair from the left, as on the website in Arabic. */
const ComparePager = forwardRef<PagerHandle, { visits: Visit[]; index: number; onIndex: (index: number) => void; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean; focus?: Focus; onLanded?: () => void }>(
  function ComparePager({ visits, index, onIndex, palette, savedOnly, savedIds, focus, onLanded }, ref) {
    const list = useRef<FlatList<Visit>>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { width, height } = size;
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
    const extra = useMemo(() => ({ palette, savedOnly, focus, height }), [palette, savedOnly, focus, height]);
    return (
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
        {width > 0 && <FlatList ref={list} data={visits} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
          keyExtractor={visitKey} getItemLayout={layout} initialScrollIndex={Math.min(index, visits.length - 1)}
          initialNumToRender={1} maxToRenderPerBatch={2} windowSize={3} extraData={extra}
          onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={32} onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => <PairPage visit={item} width={width} height={height} palette={palette} savedOnly={savedOnly} savedIds={savedIds} focus={focus?.visit === visitKey(item) ? focus.ayat : undefined} onLanded={onLanded} />} />}
      </View>
    );
  });

export default ComparePager;
