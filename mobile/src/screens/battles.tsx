import { useDeferredValue, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { battleTimeline, legendKinds } from '@shared/battles/timeline';
import { searchBattles } from '@shared/battles/battle';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import BattleLine from '@/components/battles/BattleLine';
import { Legend } from '@/components/battles/BattleTimeline';

/**
 * Every battle in the app as one line down the years (owner, 2026-11-23: BattleLine), undated last; each station opens its page.
 * Opened with `year` (the feed's year card), it scrolls to that year's group once it is laid out. The top bar holds a search,
 * named for the page, with no title beside it (owner, 2026-11-23, as on the Hadith and Tarajim tabs), that keeps the battles whose name or place holds every typed word (owner, 2026-11-23).
 */
export default function BattlesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const groupAt = useRef(new Map<number, number>());
  // The groups are measured inside the line, which sits under the legend: its own top adds to theirs.
  const lineAt = useRef<number | undefined>(undefined);
  const timeline = useMemo(() => battleTimeline(BATTLES), []);
  const { year: opened } = useLocalSearchParams<{ year?: string }>();
  const pending = useRef<number | undefined>(undefined);
  const [query, setQuery] = useState('');
  const searched = useDeferredValue(query);
  const groups = searched.trim()
    ? timeline.groups.map(group => ({ ...group, battles: searchBattles(group.battles, searched) })).filter(group => group.battles.length)
    : timeline.groups;
  useTabRetap('battles', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const toYear = (year: number) => {
    const y = groupAt.current.get(year);
    // On the web the groups report before the line does: the year waits for both.
    if (y === undefined || lineAt.current === undefined) { pending.current = year; return; }
    pending.current = undefined;
    scroll.current?.scrollTo({ y: lineAt.current + y, animated: true });
  };
  // The screen stays in its tab's stack, so a later card's year comes as a new param: scroll now if laid out, else once it is.
  useEffect(() => {
    const year = opened ? Number(opened) : undefined;
    if (year === undefined) return;
    toYear(year);
  }, [opened]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll
        search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الغزوات والمعارك', label: 'ابحث في الغزوات والمعارك' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Legend kinds={legendKinds([...timeline.madinah, ...timeline.after])} palette={palette} />
        {!groups.length && <Empty text="لا غزوة ولا معركة بهذا الاسم" palette={palette} />}
        <View onLayout={event => { lineAt.current = event.nativeEvent.layout.y; if (pending.current !== undefined) toYear(pending.current); }}>
          <BattleLine groups={groups} palette={palette} onGroup={(year, y) => {
            groupAt.current.set(year, y);
            if (pending.current === year) toYear(year);
          }} />
        </View>
      </ScrollView>
    </View>
  );
}
