import { useCallback, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { RefreshControl, useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { newVisit } from '@shared/feedSeen';
import { interestsAsked } from '@shared/interests';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import Tour from '@/components/Tour';
import { ContinueReading, Feed } from '@/components/HomeFeed';
import HomeButtons from '@/components/HomeButtons';
import { MemorizedPrompt } from '@/components/Memorized';
import { InterestChips, InterestsWelcome, onlyOf, usePicked } from '@/components/Interests';
import { toTab } from '@/lib/ways';
import { useShrinkOnScroll } from '@/lib/chrome';
import { tourSeen } from '@/lib/settings';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { COLUMN_GAP, isWide, WIDE_COLUMN } from '@/ui/column';
import { useLater } from '@/lib/hooks/useLater';

const NEAR_END = 1200;
const KEPT_FEEDS = 3;

export default function HomeScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const [chosen, setOnly] = useState<string | null>(null);
  const picked = usePicked();
  const only = onlyOf(chosen, picked);
  const [nearEnd, setNearEnd] = useState<Record<string, number>>({});
  const askedAt = useRef(0);
  const seenTo = useRef({ y: 0, height: 0 });
  const check = (contentHeight: number) => {
    if (contentHeight !== askedAt.current && seenTo.current.height + seenTo.current.y > contentHeight - NEAR_END) {
      askedAt.current = contentHeight;
      setNearEnd(now => ({ ...now, [only ?? '']: (now[only ?? ''] ?? 0) + 1 }));
    }
  };
  const [kept, setKept] = useState<(string | null)[]>([null]);
  if (!kept.includes(only)) setKept([null, only, ...kept.filter(view => view !== null)].slice(0, KEPT_FEEDS + 1));
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    seenTo.current = { y: contentOffset.y, height: layoutMeasurement.height };
    check(contentSize.height);
  };
  const bottom = useTabBarSpace();
  const [seen, setSeen] = tourSeen.use();
  const asked = useSyncExternalStore(interestsAsked.subscribe, interestsAsked.read, interestsAsked.server);
  const screenBottom = useCallback(() => seenTo.current.y + seenTo.current.height, []);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [refreshing, setRefreshing] = useState(false);
  const later = useLater();
  const refresh = () => { setRefreshing(true); askedAt.current = 0; newVisit(); later.after(400, () => setRefreshing(false)); };
  useTabRetap('index', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { width, height } = useWindowDimensions();
  const column = isWide(width, height) ? (Math.min(width, WIDE_COLUMN) - 32 - COLUMN_GAP) / 2 : null;
  const lead = useMemo(() => <ContinueReading palette={palette} />, [palette]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar settings search={() => toTab('/search')} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} onLayout={event => { seenTo.current.height = event.nativeEvent.layout.height; }}
        onContentSizeChange={(_w, h) => check(h)} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.accent} colors={[palette.accent]} progressBackgroundColor={palette.card} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 20 }}>
        <HomeButtons palette={palette} />
        <InterestChips only={only} onOnly={id => { askedAt.current = 0; setOnly(id); }} palette={palette} />
        {kept.filter(view => onlyOf(view, picked) === view).map(view => (
          <View key={view ?? ''} style={view === only ? { gap: 20 } : { display: 'none' }}>
            {!view && !column && <ContinueReading palette={palette} />}
            {!view && <MemorizedPrompt palette={palette} />}
            <Feed palette={palette} nearEnd={nearEnd[view ?? ''] ?? 0} only={view} shown={view === only} column={column} lead={column && !view ? lead : null}
              screenBottom={screenBottom} />
          </View>
        ))}
      </ScrollView>
      <InterestsWelcome palette={palette} />
      {asked && !seen && <Tour palette={palette} onDone={() => setSeen(true)} />}
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
