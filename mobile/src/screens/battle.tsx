import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { CardWithRow } from '@/ui/Card';
import { sourcesOf } from '@/ui/SourceLine';
import { citeSource, uniqueSources } from '@shared/quiz/sources';
import { Section } from '@/components/QuizForm';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { battleOf } from '@/lib/battles';
import { courseTitle, type AppBattle } from '@shared/battles/battle';
import BattleMap from '@/components/battles/BattleMap';
import { battleLine, Counts, Moment, People, Readings, Refs } from '@/components/battles/BattleParts';

/** A section's name over its content, inside its card. */
function Title({ children, palette }: { children: string; palette: Palette }) {
  return <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{children}</Text>;
}

/**
 * A battle whole: its name, then each section in the home card's shape (owner 2026-11-20), its books on the line under the
 * card: the year and place with the other readings and the map, the numbers, the moments and the people. The battle page
 * draws it, and so does a quiz that looks it up.
 */
export function BattleView({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const heading = [battle.kind, battle.year, battle.location].flatMap(value => value?.refs ?? []);
  const moments = sourcesOf(uniqueSources(battle.moments.map(moment => citeSource({ text: '', cite: moment.cite, url: moment.url }))));
  return <>
    <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{battle.name}</Text>
    <CardWithRow palette={palette} pad={0} clip gap={0}>
      {battle.place ? <BattleMap place={battle.place} palette={palette} /> : null}
      <View style={{ padding: 14, gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{battleLine(battle)}</Text>
        {battle.place ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>موضع تقريبي على خريطة اليوم، من عندنا.</Text>
          : battle.location ? <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{battle.location.value}</Text> : null}
        <Refs refs={heading} palette={palette} />
        <Readings values={[battle.kind, battle.year, battle.location]} palette={palette} />
      </View>
    </CardWithRow>
    {Object.values(battle.counts).some(Boolean) ? <CardWithRow palette={palette} gap={10}><Title palette={palette}>العدد</Title><Counts battle={battle} palette={palette} /></CardWithRow> : null}
    {battle.moments.length ? (
      <CardWithRow palette={palette} gap={10} source={moments}>
        <Title palette={palette}>{courseTitle(battle.kind?.value)}</Title>
        {battle.moments.map((moment, i) => <Moment key={moment.title} moment={moment} n={i + 1} palette={palette} plain />)}
      </CardWithRow>
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
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('battle', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const battle = battleOf(slug);
  if (!battle) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <BattleView battle={battle} palette={palette} />
      </ScrollView>
    </View>
  );
}
