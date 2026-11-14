import { useRef, useState, type ComponentRef } from 'react';
import { RefreshControl, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { newVisit } from '@shared/feedSeen';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import Tour from '@/components/Tour';
import { ContinueReading, Feed, Stories } from '@/components/HomeFeed';
import { MemorizedPrompt } from '@/components/Memorized';
import { toTab } from '@/lib/ways';
import { useShrinkOnScroll } from '@/lib/chrome';
import { tourSeen } from '@/lib/settings';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';

/**
 * Home (owner, 2026-11-13): reading and learning first, like a social app's home. Story circles, the page the mushaf was left on,
 * then a feed that loads more as it nears its end (owner, 2026-11-14: no «more» button and no tools below; prayer times live in
 * the utilities tab, saved cards behind their story circle). Pulled down at the top, it refreshes. Nothing about the reader is counted or shown.
 */
/** How close to the end (px) the feed asks for its next batch, about two cards ahead. */
const NEAR_END = 1200;

export default function HomeScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  // Near the end of the feed: ask it for the next batch, once for each new length of the page.
  const [nearEnd, setNearEnd] = useState(0);
  const askedAt = useRef(0);
  const seenTo = useRef({ y: 0, height: 0 });
  const check = (contentHeight: number) => {
    if (contentHeight !== askedAt.current && seenTo.current.height + seenTo.current.y > contentHeight - NEAR_END) {
      askedAt.current = contentHeight;
      setNearEnd(n => n + 1);
    }
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    seenTo.current = { y: contentOffset.y, height: layoutMeasurement.height };
    check(contentSize.height);
  };
  const bottom = useTabBarSpace();
  const [seen, setSeen] = tourSeen.use();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  // Pulled down at the top, as in a social app: a new visit, so the feed shows what was not seen yet.
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); askedAt.current = 0; newVisit(); setTimeout(() => setRefreshing(false), 400); };
  // The home button tapped again: back to the top.
  useTabRetap('index', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar settings search={() => toTab('/search')} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} onLayout={event => { seenTo.current.height = event.nativeEvent.layout.height; }}
        onContentSizeChange={(_w, h) => check(h)} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.accent} colors={[palette.accent]} progressBackgroundColor={palette.card} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 20 }}>
        <Stories palette={palette} />
        <ContinueReading palette={palette} />
        <MemorizedPrompt palette={palette} />
        <Feed palette={palette} nearEnd={nearEnd} />
      </ScrollView>
      {!seen && <Tour palette={palette} onDone={() => setSeen(true)} />}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
