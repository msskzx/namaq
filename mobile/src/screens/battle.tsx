import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { Section } from '@/components/QuizForm';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { battleOf } from '@/lib/battles';
import type { AppBattle } from '@shared/battles/battle';
import BattleMap from '@/components/battles/BattleMap';
import { battleLine, Counts, Moment, People, Readings, Refs } from '@/components/battles/BattleParts';

const COURSE: Record<string, string> = { 'غزوة': 'مجرى الغزوة', 'سرية': 'مجرى السرية' };

/** A battle whole: its name, year and place with the readings, the map, the numbers, the moments and the people. The battle page draws it, and so does a quiz that looks it up. */
export function BattleView({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const heading = [battle.kind, battle.year, battle.location].flatMap(value => value?.refs ?? []);
  return <>
    <View style={{ gap: 4 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{battle.name}</Text>
      <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{battleLine(battle)}</Text>
      <Refs refs={heading} palette={palette} />
      <Readings values={[battle.kind, battle.year, battle.location]} palette={palette} />
    </View>
    {battle.place ? (
      <Card palette={palette} pad={0} clip gap={0}>
        <BattleMap place={battle.place} palette={palette} />
        <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', padding: 10 }}>موضع تقريبي على خريطة اليوم، من عندنا.</Text>
      </Card>
    ) : battle.location ? (
      <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{battle.location.value}</Text>
    ) : null}
    {Object.values(battle.counts).some(Boolean) ? <Section title="العدد" palette={palette}><Counts battle={battle} palette={palette} /></Section> : null}
    {battle.moments.length ? (
      <Section title={COURSE[battle.kind?.value ?? ''] ?? 'مجرى المعركة'} palette={palette}>
        {battle.moments.map((moment, i) => <Moment key={moment.title} moment={moment} n={i + 1} palette={palette} />)}
      </Section>
    ) : null}
    {battle.martyrs.length ? <Section title="من استشهد يومئذ" palette={palette}><People people={battle.martyrs} palette={palette} /></Section> : null}
    {battle.present.length ? <Section title="ممن شهدها" palette={palette}><People people={battle.present} palette={palette} /></Section> : null}
  </>;
}

/** A battle (owner, 2026-11-18): where it was on a still map, how many, how it went in the source's words, and who was there. */
export default function BattleScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const battle = battleOf(slug);
  if (!battle) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <BattleView battle={battle} palette={palette} />
      </ScrollView>
    </View>
  );
}
