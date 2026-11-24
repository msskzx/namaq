import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Animated, FlatList, Platform, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useIsFocused } from 'expo-router';
import TabHint from '@/components/TabHint';
import TopBar from '@/ui/TopBar';
import { PlaceSheet, UTILITY_VIEWS, UtilityPage, UtilityPicker } from '@/components/Utilities';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { setCompact, useShrinkOnScroll } from '@/lib/chrome';
import { utilityView, type UtilityView } from '@/lib/settings';
import { usePalette, type Palette } from '@/lib/theme';

type Scroller = ComponentRef<typeof ScrollView>;

/** One utility, scrolled up and down on its own. */
function Page({ view, width, height, palette, on, current, bottom, onPlace, scrollers }: { view: UtilityView; width: number; height: number; palette: Palette; on: boolean; current: boolean; bottom: number; onPlace: () => void; scrollers: Map<UtilityView, Scroller> }) {
  const shrink = useShrinkOnScroll();
  // How far down the page has been seen, in steps of 50 so a scroll redraws it seldom: the qibla waits for it.
  const [reach, setReach] = useState(height);
  useEffect(() => { setReach(seen => Math.max(seen, height)); }, [height]);
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const bottom = Math.ceil((event.nativeEvent.contentOffset.y + height) / 50) * 50;
    setReach(seen => (bottom > seen ? bottom : seen));
  };
  return (
    <ScrollView ref={node => { if (node) scrollers.set(view, node); else scrollers.delete(view); }} onScroll={scrolled} scrollEventThrottle={16}
      importantForAccessibility={current ? 'auto' : 'no-hide-descendants'} accessibilityElementsHidden={!current}
      style={{ width, height, direction: 'rtl' }} contentContainerStyle={{ padding: 16, paddingBottom: bottom }}>
      <UtilityPage view={view} palette={palette} on={on} onPlace={onPlace} reach={reach} scrollTo={y => scrollers.get(view)?.scrollTo({ y, animated: view === 'tools' })} />
    </ScrollView>
  );
}

/**
 * The utilities tab: the tools (prayer times, the qibla and the Hijri calendar, owner 2026-11-13, on one page since 2026-11-23) and the adhkar (owner, 2026-11-17), side by side.
 * A sideways swipe follows the finger and shows the next one coming in (owner, 2026-11-15); the icons in the top bar jump to one.
 * As in the reading order, the first is on the right and swiping right brings the next from the left.
 */
export default function UtilitiesTab() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  // The compass runs only while this tab and its page are on screen.
  const focused = useIsFocused();
  const [view, setView] = utilityView.use();
  const index = Math.max(0, UTILITY_VIEWS.indexOf(view));
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
  const [picking, setPicking] = useState(false);
  const pick = useCallback(() => setPicking(true), []);
  const list = useRef<FlatList<UtilityView>>(null);
  // The pager's place, 0 on the first page, which the highlight on the top icons follows.
  const progress = useRef(new Animated.Value(index)).current;
  const scrollers = useRef(new Map<UtilityView, Scroller>()).current;
  // Where the pager rests, so a tap on an icon scrolls it and a swipe that lands does not scroll it again.
  const shown = useRef(index);
  // The page grows and shrinks as the top bar hides and comes back. On the web that can throw the pager back to its first
  // page with no finger on it, and settling there switched to the tools mid-count, which ended the adhkar count (the
  // adhkar test's flake, 2026-11-24). A rest the reader did not swipe to, right after such a change, goes back to the page.
  const resized = useRef(false);
  useEffect(() => {
    if (!width || shown.current === index) return;
    shown.current = index;
    setCompact(false);
    list.current?.scrollToIndex({ index, animated: true });
  }, [index, width]);
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (resized.current) {
      resized.current = false;
      if (at !== shown.current) { list.current?.scrollToIndex({ index: shown.current, animated: false }); return; }
    }
    if (at === shown.current || at < 0 || at >= UTILITY_VIEWS.length) return;
    shown.current = at;
    // Each page has its own scroll, so the bars come back with the next one.
    setCompact(false);
    setView(UTILITY_VIEWS[at]);
  }, [width, setView]);
  // The web build snaps with CSS and sends no momentum event, so it settles when scrolling stops.
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event;
    if (width) progress.setValue(Math.abs(nativeEvent.contentOffset.x) / width);
    if (Platform.OS !== 'web') return;
    clearTimeout(quiet.current);
    quiet.current = setTimeout(() => settle({ nativeEvent } as NativeSyntheticEvent<NativeScrollEvent>), 150);
  }, [settle, width, progress]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar center back={back} hideOnScroll><UtilityPicker palette={palette} progress={progress} /></TopBar>
      <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => {
        const layout = event.nativeEvent.layout;
        if (layout.width === width && layout.height !== height) resized.current = true;
        setSize({ width: layout.width, height: layout.height });
      }}>
        {width > 0 && (
          <FlatList ref={list} data={UTILITY_VIEWS} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={id => id} initialScrollIndex={index} getItemLayout={(_, at) => ({ length: width, offset: width * at, index: at })}
            extraData={{ palette, focused, view, bottom }} onMomentumScrollEnd={settle} onScroll={scrolled} onTouchStart={() => { resized.current = false; }} scrollEventThrottle={16} onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => <Page view={item} width={width} height={height} palette={palette} on={focused && item === view} current={item === view} bottom={bottom} onPlace={pick} scrollers={scrollers} />} />
        )}
      </View>
      <PlaceSheet open={picking} onClose={() => setPicking(false)} palette={palette} />
      <TabHint id="utilities" palette={palette} />
    </View>
  );
}
