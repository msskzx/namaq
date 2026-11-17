import { ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { ayahOf, surahNames } from '@/lib/branches';
import { QURAN_FONT, usePalette, CARD } from '@/lib/theme';

/** The ayat under a tree node, opened by tapping it; the native back swipe returns to the same tree and zoom. */
export default function AyahScreen() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const { keys = '' } = useLocalSearchParams<{ keys?: string }>();
  const ayat = keys.split(',').flatMap(key => ayahOf(key) ?? []);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 14 }}>
        {ayat.map(ayah => {
          const [surah, number] = ayah.key.split(':').map(Number);
          return (
            <View key={ayah.key} style={{ backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 14 }}>
              <Text style={{ color: palette.muted, fontSize: 13, marginBottom: 4 }}>{surahNames[surah]} {num(number)}</Text>
              <Text style={{ fontFamily: QURAN_FONT, fontSize: 24, lineHeight: 48, color: palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
                {mushafText(ayah.words.join(' '))} <Text style={{ color: palette.accent }}>{num(number)}</Text>
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

