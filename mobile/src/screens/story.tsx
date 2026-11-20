import { useRef, type ComponentRef } from 'react';
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
import { Report, StoryAyat, Tags } from '@/components/stories/StoryParts';

/** A report's book and page, for the line under its card. */
const reportSource = (report: AppReport) => sourcesOf([citeSource({ text: '', cite: report.cite, url: report.url })]);

/**
 * A story whole: its name and place, its tags, who is in it, the report, the ayat it turns on and the other reports folded,
 * each in the home card's shape with its books on the line under it (owner 2026-11-20). The story page draws it, and so
 * does a quiz that looks it up (`titled`, for the questions that ask by a moment's title).
 */
export function StoryView({ story, palette, titled }: { story: AppStory; palette: Palette; titled?: boolean }) {
  const [main, ...rest] = story.reports;
  const place = story.place ? sourcesOf(uniqueSources(story.place.refs.map(citeSource))) : [];
  return <>
    <View style={{ gap: 6 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{story.name}</Text>
      {story.place ? <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{story.place.value}</Text> : null}
      {place.length ? <SourceLine named={place} sources={place} palette={palette} /> : null}
      <Tags story={story} palette={palette} />
      {/* Who is in it, once, under the title (owner, 2026-11-19), not repeated under each moment. */}
      <People people={story.people} palette={palette} />
    </View>
    {main ? <CardWithRow palette={palette} pad={16} gap={0} source={reportSource(main)}><Report report={main} palette={palette} titled={titled} plain /></CardWithRow> : null}
    {story.ayat.map(ayat => <CardWithRow key={ayat.from} palette={palette}><StoryAyat ayat={ayat} palette={palette} /></CardWithRow>)}
    {rest.length ? (
      <View style={{ gap: 10 }}>
        <Folded credit={rest.length === 1 ? 'رواية أخرى في الكتاب' : 'روايات أخرى في الكتاب'} palette={palette}>
          <View style={{ gap: 10 }}>
            {rest.map(report => <CardWithRow key={report.url + (report.isnad ?? '')} palette={palette} pad={16} gap={0} source={reportSource(report)}><Report report={report} palette={palette} titled={titled} plain /></CardWithRow>)}
          </View>
        </Folded>
      </View>
    ) : null}
  </>;
}

/**
 * A sira story (owner, 2026-11-18): the report whole as the source tells it, in moments; the ayat it turns on in full; the
 * source's other reports of it, whole and folded; and who is in it.
 */
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
