import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { STORIES, STORY_TAGS } from '@/lib/stories';

/** «قصص السيرة» (owner, 2026-11-18): every story in the source's order, narrowed by a tag; each opens its page. */
export default function StoriesScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('stories', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? STORIES.filter(story => story.tags.includes(tag)) : STORIES;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>قصص السيرة</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {STORY_TAGS.map(name => <Chip key={name} label={name} on={tag === name} onPress={() => setTag(was => (was === name ? null : name))} small palette={palette} />)}
        </View>
        {shown.map(story => (
          <Card key={story.slug} palette={palette} pad={[10, 14]} gap={2} accessibilityRole="link" accessibilityLabel={story.name}
            onPress={() => router.push({ pathname: '/story', params: { slug: story.slug } })}>
            <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right' }}>{story.name}</Text>
            <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{story.tags.join(' · ')}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
