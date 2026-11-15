import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Platform, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useIsFocused } from 'expo-router';
import TabHint from '@/components/TabHint';
import TopBar from '@/components/TopBar';
import Utilities, { UTILITY_VIEWS, UtilityPicker } from '@/components/Utilities';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import { utilityView, type UtilityView } from '@/lib/settings';
import { usePalette } from '@/lib/theme';

/**
 * The utilities tab: prayer times, the qibla and the Hijri calendar (owner, 2026-11-13), switched by three icons in the top bar
 * or by a swipe from one to the next (owner, 2026-11-15). Swiping right brings the next utility from the left, as Arabic reads.
 */
export default function UtilitiesTab() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  // The compass runs only while this tab, and the qibla's page, are on screen.
  const focused = useIsFocused();
  const [view, setView] = utilityView.use();
  const index = Math.max(0, UTILITY_VIEWS.indexOf(view));
  const list = useRef<FlatList<UtilityView>>(null);
  const pages = useRef(new Map<UtilityView, ComponentRef<typeof ScrollView> | null>());
  const shrink = useShrinkOnScroll();
  const [width, setWidth] = useState(0);
  useTabRetap('utilities', () => pages.current.get(view)?.scrollTo({ y: 0, animated: true }));

  // A tap on the picker's icon turns the pager to that page.
  const landed = useRef(index);
  useEffect(() => {
    if (!width || landed.current === index) return;
    landed.current = index;
    list.current?.scrollToIndex({ index, animated: true });
  }, [index, width]);

  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (at === landed.current || at < 0 || at >= UTILITY_VIEWS.length) return;
    landed.current = at;
    setCompact(false);
    setView(UTILITY_VIEWS[at]);
  }, [width, setView]);
  // The web build snaps with CSS and sends no momentum event, so it settles when scrolling stops.
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS !== 'web') return;
    const { nativeEvent } = event;
    clearTimeout(quiet.current);
    quiet.current = setTimeout(() => settle({ nativeEvent } as NativeSyntheticEvent<NativeScrollEvent>), 150);
  }, [settle]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar center hideOnScroll><UtilityPicker palette={palette} /></TopBar>
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 && <FlatList ref={list} data={UTILITY_VIEWS} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
          keyExtractor={item => item} initialScrollIndex={index} extraData={`${view}${focused}${palette.paper}`}
          getItemLayout={(_, at) => ({ length: width, offset: width * at, index: at })}
          onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={32} onScrollToIndexFailed={() => {}}
          renderItem={({ item }) => (
            <ScrollView ref={page => { pages.current.set(item, page); }} style={{ width, direction: 'rtl' }} onScroll={shrink} scrollEventThrottle={16}
              contentContainerStyle={{ padding: 16, paddingBottom: bottom }}>
              <Utilities palette={palette} view={item} focused={focused && item === view} />
            </ScrollView>
          )} />}
      </View>
      <TabHint id="utilities" palette={palette} />
    </View>
  );
}
