import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import itqan from '@shared/data/quran/itqanBalagha';
import { TOPICS, topicOf, exampleReference } from '@shared/quran/lataif';
import { examples, type Voice } from '@shared/quran/iltifat';
import { Text } from '@/ui/Text';
import { IltifatCard, VOICE_NAME, voiceColor } from '@/components/Iltifat';
import Reference from '@/ui/Reference';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { ayahMushafWords } from '@/lib/mushaf';
import Chip from '@/ui/Chip';

/**
 * The website's /quran/lataif (owner, 2026-11-16): a curated list of examples, each card with its own picture, grouped
 * by topic with pills to pick one. Each topic and each card carries its reference (shared/quran/lataif.ts).
 */
export default function LataifScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const views = useMemo(() => examples(ayahMushafWords), []);
  const references = useMemo(() => Object.fromEntries(views.map(view => [view.key, exampleReference(view, itqan)])), [views]);
  useTabRetap('lataif', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const pill = (name: string | null, label: string) => <Chip key={label} role="tab" label={label} on={topic === name} onPress={() => setTopic(name)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll />
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>مشاهد</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="tablist">
          {pill(null, 'الكل')}
          {TOPICS.map(item => pill(item.name, item.name))}
        </View>
        {TOPICS.filter(item => topic === null || topic === item.name).map(item => (
          <View key={item.name} style={{ gap: 12 }}>
            <View style={{ gap: 4 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>{item.name}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16 }} accessibilityLabel="ألوان الضمائر">
                {(['he', 'we', 'you'] as Voice[]).map(voice => <Text key={voice} style={{ color: voiceColor(palette, voice), fontSize: 14 }}>{{ he: 'هو', we: 'نحن، أنا', you: 'أنت' }[voice]}: {VOICE_NAME[voice]}</Text>)}
              </View>
              <Reference title={item.reference.title} quotes={item.reference.quotes} palette={palette} />
            </View>
            {views.filter(view => topicOf(view).name === item.name).map(view => (
              <View key={view.key} style={{ gap: 6 }}>
                <IltifatCard view={view} palette={palette} />
                <View style={{ paddingHorizontal: 4 }}><Reference title={references[view.key].title} quotes={references[view.key].quotes} palette={palette} /></View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
