import { useDeferredValue, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { battleTimeline } from '@shared/battles/timeline';
import { searchBattles } from '@shared/battles/battle';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Empty from '@/ui/Empty';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import { battleLine } from '@/components/battles/BattleParts';
import BattleTimeline from '@/components/battles/BattleTimeline';

/**
 * Every battle in the app: the timeline over the years, then the list by year (undated last); each row opens its page.
 * Opened with `year` (the feed's year card), it scrolls to that year's group once it is laid out. The top bar holds a search,
 * named for the page, with no title beside it (owner, 2026-11-23, as on the Hadith and Tarajim tabs), that keeps the battles whose name or place holds every typed word (owner, 2026-11-23).
 */
export default function BattlesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const groupAt = useRef(new Map<number, number>());
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
    if (y !== undefined) scroll.current?.scrollTo({ y, animated: true });
  };
  // The screen stays in its tab's stack, so a later card's year comes as a new param: scroll now if laid out, else once it is.
  useEffect(() => {
    const year = opened ? Number(opened) : undefined;
    if (year === undefined) return;
    if (groupAt.current.has(year)) toYear(year);
    else pending.current = year;
  }, [opened]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll
        search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الغزوات والمعارك', label: 'ابحث في الغزوات والمعارك' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        {!searched.trim() && <BattleTimeline madinah={timeline.madinah} after={timeline.after} palette={palette} onYear={toYear} />}
        {!groups.length && <Empty text="لا غزوة ولا معركة بهذا الاسم" palette={palette} />}
        {groups.map(group => (
          <View key={group.title} style={{ gap: 10, paddingTop: 6 }}
            onLayout={group.year === undefined ? undefined : event => {
              groupAt.current.set(group.year!, event.nativeEvent.layout.y);
              if (pending.current === group.year) { pending.current = undefined; toYear(group.year!); }
            }}>
            <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{group.title}</Text>
            {group.battles.map(battle => (
              <Card key={battle.slug} palette={palette} pad={[10, 14]} gap={2} accessibilityRole="link" accessibilityLabel={battle.name}
                onPress={() => router.push({ pathname: '/battle', params: { slug: battle.slug } })}>
                <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right' }}>{battle.name}</Text>
                <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{battleLine(battle)}</Text>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
