import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, CircleHelp } from 'lucide-react-native';
import ProphetStory from '@/components/ProphetStory';
import { usePalette } from '@/lib/theme';
import { toTab } from '@/lib/ways';

/** A prophet's story opened by link (/prophets/[slug]), under a back bar. */
export default function ProphetScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const { slug = '', event, surah } = useLocalSearchParams<{ slug?: string; event?: string; surah?: string }>();
  const back = (help: () => void) => (
    <View style={{ paddingTop: insets.top, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : toTab('/prophets')} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ padding: 6 }}>
          <ChevronRight size={28} color={palette.ink} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={help} accessibilityRole="button" accessibilityLabel="شرح الصفحة" hitSlop={10} style={{ padding: 6 }}>
          <CircleHelp size={22} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
  return <ProphetStory slug={slug} header={back} startEvent={event !== undefined && /^\d+$/.test(event) ? Number(event) : undefined}
    startSurah={surah !== undefined && /^\d+$/.test(surah) ? Number(surah) : undefined} />;
}

