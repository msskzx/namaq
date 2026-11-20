import { useMemo, useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { battleTimeline } from '@shared/battles/timeline';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { BATTLES } from '@/lib/battles';
import { battleLine } from '@/components/battles/BattleParts';
import BattleTimeline from '@/components/battles/BattleTimeline';

/** Every battle in the app: the timeline over the years, then the list by year (undated last); each row opens its page. */
export default function BattlesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const groupAt = useRef(new Map<number, number>());
  const timeline = useMemo(() => battleTimeline(BATTLES), []);
  useTabRetap('battles', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const toYear = (year: number) => {
    const y = groupAt.current.get(year);
    if (y !== undefined) scroll.current?.scrollTo({ y, animated: true });
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الغزوات والمعارك</Text>
        <BattleTimeline madinah={timeline.madinah} after={timeline.after} palette={palette} onYear={toYear} />
        {timeline.groups.map(group => (
          <View key={group.title} style={{ gap: 10, paddingTop: 6 }}
            onLayout={group.year === undefined ? undefined : event => groupAt.current.set(group.year!, event.nativeEvent.layout.y)}>
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
