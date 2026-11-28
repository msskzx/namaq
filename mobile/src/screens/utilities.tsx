import { useCallback, useRef, useState, type ComponentRef } from 'react';
import { Animated, FlatList, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useIsFocused } from 'expo-router';
import TabHint from '@/components/TabHint';
import TopBar from '@/ui/TopBar';
import { PlaceSheet, UTILITY_VIEWS, UtilityPage, UtilityPicker } from '@/components/Utilities';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import { utilityView, type UtilityView } from '@/lib/settings';
import { usePalette, type Palette } from '@/lib/theme';
import { useWebScrollEnd } from '@/lib/hooks/useWebScrollEnd';
import { useOnChange } from '@/lib/hooks/useOnChange';

type Scroller = ComponentRef<typeof ScrollView>;

function Page({ view, width, height, palette, on, current, bottom, onPlace, scrollers, query }: { view: UtilityView; width: number; height: number; palette: Palette; on: boolean; current: boolean; bottom: number; onPlace: () => void; scrollers: Map<UtilityView, Scroller>; query: string }) {
  const shrink = useShrinkOnScroll();
  const [reach, setReach] = useState(height);
  useOnChange([height], () => setReach(seen => Math.max(seen, height)));
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const bottom = Math.ceil((event.nativeEvent.contentOffset.y + height) / 50) * 50;
    setReach(seen => (bottom > seen ? bottom : seen));
  };
  return (
    <ScrollView ref={node => { if (node) scrollers.set(view, node); else scrollers.delete(view); }} onScroll={scrolled} scrollEventThrottle={16}
      importantForAccessibility={current ? 'auto' : 'no-hide-descendants'} accessibilityElementsHidden={!current}
      style={{ width, height, direction: 'rtl' }} contentContainerStyle={{ padding: 16, paddingBottom: bottom }}>
      <UtilityPage view={view} palette={palette} on={on} onPlace={onPlace} reach={reach} query={query} scrollTo={y => scrollers.get(view)?.scrollTo({ y, animated: view === 'tools' })} />
    </ScrollView>
  );
}

export default function UtilitiesTab() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const focused = useIsFocused();
  const [view, setView] = utilityView.use();
  const index = Math.max(0, UTILITY_VIEWS.indexOf(view));
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState('');
  const pick = useCallback(() => setPicking(true), []);
  const list = useRef<FlatList<UtilityView>>(null);
  const progress = useRef(new Animated.Value(index)).current;
  const scrollers = useRef(new Map<UtilityView, Scroller>()).current;
  const shown = useRef(index);
  const resized = useRef(false);
  useOnChange([index, width], () => {
    if (!width || shown.current === index) return;
    shown.current = index;
    setCompact(false);
    list.current?.scrollToIndex({ index, animated: true });
  });
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (resized.current) {
      resized.current = false;
      if (at === 0 && at !== shown.current) { list.current?.scrollToIndex({ index: shown.current, animated: false }); return; }
    }
    if (at === shown.current || at < 0 || at >= UTILITY_VIEWS.length) return;
    shown.current = at;
    setCompact(false);
    setView(UTILITY_VIEWS[at]);
  }, [width, setView]);
  const settleOnWeb = useWebScrollEnd(settle);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width) progress.setValue(Math.abs(event.nativeEvent.contentOffset.x) / width);
    settleOnWeb(event);
  }, [settleOnWeb, width, progress]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {view === 'adhkar'
        ? <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأذكار', label: 'ابحث في الأذكار' }}><UtilityPicker palette={palette} progress={progress} /></TopBar>
        : <TopBar center back={back} hideOnScroll><UtilityPicker palette={palette} progress={progress} /></TopBar>}
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => {
        const layout = event.nativeEvent.layout;
        if (layout.width === width && layout.height !== height) resized.current = true;
        setSize({ width: layout.width, height: layout.height });
      }}>
        {width > 0 && (
          <FlatList ref={list} data={UTILITY_VIEWS} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={id => id} initialScrollIndex={index} getItemLayout={(_, at) => ({ length: width, offset: width * at, index: at })}
            extraData={{ palette, focused, view, bottom, query }} onMomentumScrollEnd={settle} onScroll={scrolled} onTouchMove={() => { resized.current = false; }} scrollEventThrottle={16} onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => <Page view={item} width={width} height={height} palette={palette} on={focused && item === view} current={item === view} bottom={bottom} onPlace={pick} scrollers={scrollers} query={query} />} />
        )}
      </View>
      <PlaceSheet open={picking} onClose={() => setPicking(false)} palette={palette} />
      <TabHint id="utilities" palette={palette} />
    </View>
  );
}
