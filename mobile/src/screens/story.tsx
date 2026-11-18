import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { Section } from '@/components/QuizForm';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { storyOf } from '@/lib/stories';
import { People, Refs } from '@/components/battles/BattleParts';
import Folded from '@/ui/Folded';
import { Report, StoryAyat, Tags } from '@/components/stories/StoryParts';

/**
 * A sira story (owner, 2026-11-18): the report whole as the source tells it, in moments; the ayat it turns on in full; the
 * source's other reports of it, whole and folded; and who is in it.
 */
export default function StoryScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const story = storyOf(slug);
  if (!story) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const [main, ...rest] = story.reports;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <View style={{ gap: 6 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{story.name}</Text>
          {story.place ? <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{story.place.value}</Text> : null}
          {story.place ? <Refs refs={story.place.refs} palette={palette} /> : null}
          <Tags story={story} palette={palette} />
        </View>
        {main ? <Card palette={palette} pad={16} gap={0}><Report report={main} palette={palette} /></Card> : null}
        {story.ayat.map(ayat => <StoryAyat key={ayat.from} ayat={ayat} palette={palette} />)}
        {rest.length ? (
          <View style={{ gap: 10 }}>
            <Folded credit={rest.length === 1 ? 'رواية أخرى في الكتاب' : 'روايات أخرى في الكتاب'} palette={palette}>
              <View style={{ gap: 10 }}>
                {rest.map(report => <Card key={report.url + (report.isnad ?? '')} palette={palette} pad={16} gap={0}><Report report={report} palette={palette} /></Card>)}
              </View>
            </Folded>
          </View>
        ) : null}
        <Section title="من في القصة" palette={palette}><People people={story.people} palette={palette} /></Section>
      </ScrollView>
    </View>
  );
}
