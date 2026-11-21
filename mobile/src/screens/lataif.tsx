import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { usePalette } from '@/lib/theme';
import { useTabRetap } from '@/lib/tabRetap';
import DarkSea, { DarkSeaActions, darkSeaName, darkSeaSourceList } from '@/components/DarkSea';

/**
 * «مشاهد» (owner, 2026-11-21: the chosen examples dropped, the page starts over with scenes): an ayah drawn as a scene the
 * reader walks through. The first is an-Nur 40's sea (components/DarkSea). The page does not scroll: a finger moving up
 * goes down through the scene's layers.
 */
export default function LataifScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const sources = darkSeaSourceList();
  // A retap on the tab takes the scene back to the surface.
  const [visit, setVisit] = useState(0);
  useTabRetap('lataif', () => setVisit(now => now + 1));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: bottom, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>مشاهد</Text>
          <Text style={{ color: palette.muted, fontSize: 16 }}>{darkSeaName()}</Text>
        </View>
        <DarkSea key={visit} palette={palette} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DarkSeaActions palette={palette} only="open" />
          <DarkSeaActions palette={palette} only="share" />
        </View>
        <SourceLine sources={sources} palette={palette} />
      </View>
    </View>
  );
}
