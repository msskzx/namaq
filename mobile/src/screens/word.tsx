import { useRef } from 'react';
import { View } from 'react-native';
import { useTabRetap } from '@/lib/tabRetap';
import { useLocalSearchParams } from 'expo-router';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { setCompact, useCompact, useShrinkOnScroll } from '@/lib/chrome';
import { usePalette } from '@/lib/theme';
import { back } from '@/lib/ways';
import { words } from '@/lib/words';
import { WordView } from '@/components/WordSheet';

/**
 * A word's own page, opened from the words page (owner, 2026-11-21: a page, not a sheet): its ayat, Ibn Qutaybah on it
 * and al-Raghib's article (components/WordSheet.tsx WordView). Its top slides away with the top bar while reading down.
 */
export default function WordScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const hidden = useCompact();
  const bottom = useTabBarSpace();
  const toTop = useRef(() => {});
  useTabRetap('word', () => toTop.current());
  const { ids = '' } = useLocalSearchParams<{ ids?: string }>();
  const lemmas = ids.split(',').map(Number).filter(id => Number.isInteger(id) && id >= 0 && id < words.lemmas.length);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      {lemmas.length > 0 && <View style={{ flex: 1, paddingTop: 8 }}><WordView key={ids} lemmas={lemmas} toTop={toTop} hidden={hidden} onScroll={onScroll} reveal={() => setCompact(false)} bottom={bottom} palette={palette} /></View>}
    </View>
  );
}
