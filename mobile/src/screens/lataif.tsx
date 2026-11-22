import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { usePalette } from '@/lib/theme';
import { useTabRetap } from '@/lib/tabRetap';
import { DarkSeaCard, openDarkSea } from '@/components/DarkSea';

/**
 * «مشاهد» (owner, 2026-11-22: as a video list): a big card for each scene, about half the screen, with a picture that
 * invites a tap and, under it, the scene's title from its ayah, the surah and ayah, and its books. A tap opens the scene
 * itself (components/DarkSea), full screen. The first is an-Nur 40's sea.
 */
export default function LataifScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('lataif', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub />
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: bottom + 16, gap: 24 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>مشاهد</Text>
        <DarkSeaCard palette={palette} onPress={openDarkSea} />
      </ScrollView>
    </View>
  );
}
