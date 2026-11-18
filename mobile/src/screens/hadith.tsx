import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { LISTED } from '@/lib/hadith';

/** The hadith tab (owner, 2026-11-18): the hadith in the app, each a card that opens it with its isnad and its scenes. */
export default function HadithScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('hadith', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الحديث</Text>
        {LISTED.map(unit => {
          const report = unit.reports.find(item => item.voice !== 'AUTHOR');
          const opening = report?.fullText ?? report?.statements[0];
          return (
            <Card key={unit.id} palette={palette} pad={16} gap={6} accessibilityRole="link" accessibilityLabel={`${unit.book}، ${unit.bab ?? ''}`}
              onPress={() => router.push({ pathname: '/hadith-unit', params: { unit: unit.id } })}>
              <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{unit.book}</Text>
              {unit.kitab ? <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>{unit.kitab}، {unit.bab}</Text> : null}
              {opening ? <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{opening}</Text> : null}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
