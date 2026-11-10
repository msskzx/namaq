import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import ProphetStory from '@/components/ProphetStory';
import { usePalette } from '@/lib/theme';

/** A prophet's story opened by link (/prophets/[slug]), under a back bar. */
export default function ProphetScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const back = (
    <View style={{ paddingTop: insets.top, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.navigate('/prophets')} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={10} style={{ padding: 6 }}>
          <ChevronRight size={28} color={palette.ink} />
        </Pressable>
      </View>
    </View>
  );
  return <ProphetStory slug={slug} header={back} />;
}
