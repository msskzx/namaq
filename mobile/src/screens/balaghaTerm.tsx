import { useMemo, useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { usePalette } from '@/lib/theme';
import { back } from '@/lib/ways';
import { TermExampleCard, TermQuotes } from '@/components/BalaghaTerm';
import terms from '@shared/data/quran/balaghaTerms';
import itqan from '@shared/data/quran/itqanBalagha';
import { num } from '@shared/quran/arabicNumber';
import { chapterTitle, plainName, examplesOf, termNamed } from '@shared/quran/balaghaTerms';

/**
 * A balagha term's page (owner, 2026-11-18): its definition in the scholars' words, each quote whole with its page, then
 * every paragraph of al-Suyuti's under it that quotes an ayah, the quoted words lit and the ayat a tap from the mushaf.
 */
export default function BalaghaTermScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('term', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { name = '' } = useLocalSearchParams<{ name?: string }>();
  const term = termNamed(terms, name);
  const examples = useMemo(() => (term ? examplesOf(itqan, term) : []), [term]);
  if (!term) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <View style={{ gap: 2 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{plainName(term.name)}</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`${chapterTitle(itqan, term.kind)} · الإتقان للسيوطي`}</Text>
        </View>
        <TermQuotes term={term} palette={palette} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: 4 }}>{`أمثلته في الإتقان (${num(examples.length)})`}</Text>
        {examples.map(example => <TermExampleCard key={example.entry} example={example} palette={palette} />)}
      </ScrollView>
    </View>
  );
}
