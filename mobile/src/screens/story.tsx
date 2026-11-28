import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { CardWithRow } from '@/ui/Card';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { citeSource, uniqueSources } from '@shared/quiz/sources';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { storyOf } from '@/lib/stories';
import type { AppReport, AppStory } from '@shared/stories/story';
import { People } from '@/components/battles/BattleParts';
import Folded from '@/ui/Folded';
import { Report, ReportScene, reportSource, StoryAyat, StoryShare, Tags } from '@/components/stories/StoryParts';
import Tabs from '@/ui/Tabs';
import { drawnReport, reportHadith, reportLines, reportSlots } from '@shared/stories/story';
import OpenButton from '@/ui/OpenButton';
import { openSahih } from './hadith';
import { DRAW_MODES, type DrawMode } from '@shared/hadith';



export function StoryView({ story, palette, titled }: { story: AppStory; palette: Palette; titled?: boolean }) {
  const [main, ...rest] = story.reports;
  const place = story.place ? sourcesOf(uniqueSources(story.place.refs.map(citeSource))) : [];
  const drawn = !titled && !!main && drawnReport(main);
  const [mode, setMode] = useState<DrawMode>('drawing');
  const lines = drawn ? reportLines(main) : [];
  const slots = reportSlots(lines, palette.slots.length);
  const colour = (speaker: string) => palette.slots[slots.get(speaker) ?? 0];
  const tints = new Map(lines.flatMap(line => (line.agent && line.speaker ? [[line.agent, colour(line.speaker)] as const] : [])));
  const more = [...new Set(lines.flatMap(line => (line.kind === 'turn' && line.speaker && !line.agent ? [line.speaker] : [])))]
    .map(name => ({ name, tint: colour(name) }));
  const drawing = drawn && mode === 'drawing';
  return <>
    <View style={{ gap: 6 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{story.name}</Text>
      {story.place ? <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{story.place.value}</Text> : null}
      {place.length ? <SourceLine named={place} sources={place} palette={palette} /> : null}
      <Tags story={story} palette={palette} />
      {drawing ? <People people={story.people} tints={tints} more={more} palette={palette} /> : <People people={story.people} palette={palette} />}
      {drawn ? <Tabs label="طريقة العرض" options={DRAW_MODES} value={mode} onChange={setMode} palette={palette} /> : null}
    </View>
    {main ? (
      <CardWithRow palette={palette} pad={16} gap={0} source={reportSource(main, drawing)} lead={<HadithOpen report={main} />} row={drawn ? <StoryShare story={story} report={main} palette={palette} /> : undefined}>
        {drawing ? <ReportScene report={main} slots={slots} palette={palette} /> : <Report report={main} palette={palette} titled={titled} plain />}
      </CardWithRow>
    ) : null}
    {story.ayat.map(ayat => <CardWithRow key={ayat.from} palette={palette}><StoryAyat ayat={ayat} palette={palette} /></CardWithRow>)}
    {rest.length ? (
      <View style={{ gap: 10 }}>
        <Folded credit={rest.length === 1 ? 'رواية أخرى في الكتاب' : 'روايات أخرى في الكتاب'} palette={palette}>
          <View style={{ gap: 10 }}>
            {rest.map(report => <CardWithRow key={report.url + (report.isnad ?? '')} palette={palette} pad={16} gap={0} source={reportSource(report)} lead={<HadithOpen report={report} />}><Report report={report} palette={palette} titled={titled} plain /></CardWithRow>)}
          </View>
        </Folded>
      </View>
    ) : null}
  </>;
}

function HadithOpen({ report }: { report: AppReport }) {
  const hadith = reportHadith(report);
  return hadith ? <OpenButton what="الحديث" label={`افتح ${report.cite}`} onPress={() => openSahih(hadith.book, hadith.n)} /> : null;
}

export default function StoryScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('story', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const story = storyOf(slug);
  if (!story) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <StoryView story={story} palette={palette} />
      </ScrollView>
    </View>
  );
}
