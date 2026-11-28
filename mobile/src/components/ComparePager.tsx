import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import type { Visit } from '@shared/quran/compareCards';
import { cardsFor, focusIndex, visitKey } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import CompareCard from './CompareCard';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import PageVideo from './PageVideo';
import Empty from '@/ui/Empty';
import { Text } from '@/ui/Text';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { pairNote, tanasubSource } from '@shared/quran/tanasubCards';
import type { Link } from '@shared/quran/surahOrder';

const GAP = 14;

export type Focus = { visit: string; ayat: string[] };

function PairNote({ link, palette }: { link: Link; palette: Palette }) {
  const sources = sourcesOf([tanasubSource(link)]);
  return (
    <View accessibilityLabel="بين السورتين" style={{ borderStartWidth: 2, borderColor: palette.rule, paddingStart: 12, marginHorizontal: 4, gap: 2 }}>
      <Text style={{ color: palette.amber, fontSize: 14, textAlign: 'right' }}>بين السورتين</Text>
      <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'justify', writingDirection: 'rtl' }}>«{link.text}»</Text>
      <View style={{ marginStart: -12 }}><SourceLine named={sources} sources={sources} palette={palette} /></View>
    </View>
  );
}

const PairPage = memo(function PairPage({ visit, width, height, palette, savedOnly, savedIds, focus, onLanded }: { visit: Visit; width: number; height: number; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean; focus?: string[]; onLanded?: () => void }) {
  const all = cardsFor(visit.lead, visit.other);
  const cards = savedOnly ? all.filter(card => savedIds(card.id)) : all;
  const list = useRef<FlatList<(typeof cards)[number]>>(null);
  const note = savedOnly ? undefined : pairNote(visit.lead, visit.other);
  const target = focus ? focusIndex(cards, focus) : -1;
  const landed = useRef(onLanded);
  landed.current = onLanded;
  const pending = useRef(target);
  const heights = useRef<number[]>([]);
  const header = useRef(0);
  useEffect(() => {
    pending.current = target;
    if (target < 0) return;
    const timer = setTimeout(() => { pending.current = -1; landed.current?.(); }, 3000);
    return () => clearTimeout(timer);
  }, [target]);
  const land = useCallback(() => {
    const at = pending.current;
    if (at <= 0 || heights.current.slice(0, at).filter(Boolean).length < at) return;
    const offset = heights.current.slice(0, at).reduce((sum, height) => sum + height + GAP, header.current);
    list.current?.scrollToOffset({ offset, animated: false });
  }, []);
  const stop = useCallback(() => { pending.current = -1; landed.current?.(); }, []);
  const shrink = useShrinkOnScroll();
  const [video, setVideo] = useState(false);
  const pageVideo = useCallback(() => setVideo(true), []);
  return (
    <View style={{ width, height, direction: 'rtl' }}>
      <PageVideo lead={visit.lead} other={visit.other} cards={cards} open={video} onClose={() => setVideo(false)} palette={palette} />
      <FlatList ref={list} data={cards} keyExtractor={card => card.id} initialNumToRender={Math.max(4, target + 2)} windowSize={5} onContentSizeChange={land} onLayout={land} onScrollBeginDrag={stop} onScroll={shrink} scrollEventThrottle={16}
        contentContainerStyle={{ padding: 12, gap: GAP, paddingBottom: 32 }}
        ListHeaderComponent={note && <View onLayout={event => { header.current = event.nativeEvent.layout.height + GAP; land(); }}><PairNote link={note} palette={palette} /></View>}
        ListEmptyComponent={<Empty palette={palette} text={savedOnly ? 'لا بطاقات محفوظة بين السورتين.' : 'لا آيات متشابهة بين السورتين.'} />}
        renderItem={({ item, index }) => <View onLayout={event => { heights.current[index] = event.nativeEvent.layout.height; land(); }}><CompareCard card={item} palette={palette} onPageVideo={pageVideo} /></View>} />
    </View>
  );
});

export type PagerHandle = { goTo: (index: number, animated?: boolean) => void };

const ComparePager = forwardRef<PagerHandle, { visits: Visit[]; index: number; onIndex: (index: number) => void; palette: Palette; savedOnly: boolean; savedIds: (id: string) => boolean; focus?: Focus; onLanded?: () => void }>(
  function ComparePager({ visits, index, onIndex, palette, savedOnly, savedIds, focus, onLanded }, ref) {
    const list = useRef<FlatList<Visit>>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const { width, height } = size;
    useImperativeHandle(ref, () => ({ goTo: (to, animated = true) => list.current?.scrollToIndex({ index: to, animated }) }), []);
    const resized = useRef(0);
    const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!width) return;
      const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
      if (resized.current) {
        const fresh = Date.now() - resized.current < 600;
        resized.current = 0;
        if (fresh && at !== index) { list.current?.scrollToIndex({ index, animated: false }); return; }
      }
      if (at !== index && at >= 0 && at < visits.length) { setCompact(false); onIndex(at); }
    }, [width, index, visits.length, onIndex]);
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
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => {
        const next = event.nativeEvent.layout;
        if (next.width === width && next.height !== height) resized.current = Date.now();
        setSize({ width: next.width, height: next.height });
      }}>
        {width > 0 && <FlatList ref={list} data={visits} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
          keyExtractor={visitKey} getItemLayout={layout} initialScrollIndex={Math.min(index, visits.length - 1)}
          initialNumToRender={1} maxToRenderPerBatch={2} windowSize={3} extraData={extra}
          onMomentumScrollEnd={settle} onScroll={scrolled} onTouchMove={() => { resized.current = 0; }} scrollEventThrottle={32} onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => <PairPage visit={item} width={width} height={height} palette={palette} savedOnly={savedOnly} savedIds={savedIds} focus={focus?.visit === visitKey(item) ? focus.ayat : undefined} onLanded={onLanded} />} />}
      </View>
    );
  });

export default ComparePager;
