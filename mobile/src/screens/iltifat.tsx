import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { examples } from '@shared/quran/iltifat';
import { Text } from '@/components/Text';
import HelpSheet from '@/components/HelpSheet';
import { IltifatCard } from '@/components/Iltifat';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toQuranHub } from '@/lib/ways';
import { usePalette } from '@/lib/theme';

/** The website's /quran/iltifat (owner, 2026-11-13): seven examples, each card with its own picture, the explanation behind the help icon. */
export default function IltifatScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [help, setHelp] = useState(false);
  const views = useMemo(examples, []);
  useTabRetap('iltifat', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={toQuranHub} hideOnScroll help={() => setHelp(true)} />
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الالتفات</Text>
        {views.map(view => <IltifatCard key={view.key} view={view} palette={palette} />)}
      </ScrollView>
      <HelpSheet topic={help ? 'iltifat' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}

