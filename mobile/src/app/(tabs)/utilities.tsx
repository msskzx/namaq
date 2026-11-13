import { useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import TabHint from '@/components/TabHint';
import TopBar from '@/components/TopBar';
import Utilities, { UtilityPicker } from '@/components/Utilities';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';

/** The utilities tab: prayer times, the qibla and the Hijri calendar (owner, 2026-11-13), switched by three icons in the top bar. */
export default function UtilitiesTab() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  // The compass runs only while this tab is on screen.
  const focused = useIsFocused();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('utilities', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar center><UtilityPicker palette={palette} /></TopBar>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 16, paddingBottom: bottom }}>
        <Utilities palette={palette} focused={focused} />
      </ScrollView>
      <TabHint id="utilities" palette={palette} />
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
