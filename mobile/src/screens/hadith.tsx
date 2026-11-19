import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { fromCompanion, sayingStart, type FortyEntry } from '@shared/hadith';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { FORTY } from '@/lib/hadith';

/** al-Nawawi's Forty (1–42), then the eight Ibn Rajab adds to them in his commentary (43–50). */
const nawawi = FORTY.entries.filter(entry => !entry.source);
const added = FORTY.entries.filter(entry => entry.source === 'ibnrajab');

/** One of the Forty in a list: his number, the Companion, the opening of his text and the books he names. */
export function FortyCard({ entry, palette, onPress }: { entry: FortyEntry; palette: Palette; onPress: () => void }) {
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} accessibilityRole="link" accessibilityLabel={`${entry.heading}، ${fromCompanion(entry.companion)}`} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text style={{ color: palette.accent, fontSize: 15 }}>{entry.heading}</Text>
        <Text style={{ flexShrink: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{entry.companion}</Text>
      </View>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{sayingStart(entry.text)}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {entry.named.map(book => <Chip key={book} label={book} on={false} small role="text" palette={palette} />)}
      </View>
    </Card>
  );
}

/**
 * The hadith tab (owner, 2026-11-18): al-Nawawi's Forty in his order, each card his number, the Companion, the opening of
 * his text and the books he names, then the eight Ibn Rajab adds; a card opens the hadith with the records it comes from.
 */
export default function HadithScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('hadith', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const card = (entry: FortyEntry) => <FortyCard key={entry.n} entry={entry} palette={palette} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الحديث</Text>
        <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -8 }}>{FORTY.books.nawawi.title}</Text>
        {nawawi.map(card)}
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, textAlign: 'right', marginTop: 8 }}>ما زاده ابن رجب</Text>
        <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -8 }}>{FORTY.books.ibnrajab.title}</Text>
        {added.map(card)}
      </ScrollView>
    </View>
  );
}
