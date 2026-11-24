import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { usePalette } from '@/lib/theme';
import { useTabRetap } from '@/lib/tabRetap';
import SourceLine from '@/ui/SourceLine';
import { DarkSeaCard, darkSeaSourceList, openDarkSea } from '@/components/DarkSea';
import { RahmanCard, openRahman } from '@/components/RahmanScene';
import { usePageWidth } from '@/ui/column';

/**
 * «مشاهد» (owner, 2026-11-22: as a video list): each scene a tall cover, a real frame of the scene held still, about half
 * the screen so it invites a tap (owner, 2026-11-24); under it the ayah's opening words and one scholar's line with its
 * book, then the scene's source line. A tap opens the scene itself (components/DarkSea), full screen; the next scene's cover
 * peeks in under it. The first is an-Nur 40's sea; the second «الرحمن», still pages whose cover is its first page.
 */
export default function LataifScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const width = usePageWidth();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('lataif', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub />
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: bottom + 16, gap: 24 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>مشاهد</Text>
        <View style={{ gap: 6 }}>
          <DarkSeaCard cover palette={palette} onPress={openDarkSea} />
          <SourceLine sources={darkSeaSourceList()} palette={palette} />
        </View>
        <RahmanCard palette={palette} width={Math.min(width - 32, 440)} onPress={openRahman} sources />
      </ScrollView>
    </View>
  );
}
