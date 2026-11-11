import { View } from 'react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { ayahOf, surahNames } from '@/lib/branches';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** The ayat of the paths a tap lit, read in full under the tree: each one's text and where it is. */
export default function PathAyat({ ayahKeys, palette, onLayout }: { ayahKeys: string[]; palette: Palette; onLayout?: (height: number) => void }) {
  if (ayahKeys.length === 0) return null;
  const many = ayahKeys.length > 1;
  return (
    <View onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: -18 }}>
      <View style={{ borderWidth: 1, borderColor: palette.rule, borderRadius: 12, backgroundColor: palette.paperDeep, paddingHorizontal: 14, paddingVertical: many ? 4 : 10 }}>
        {ayahKeys.map((key, i) => {
          const ayah = ayahOf(key);
          const [surah, number] = key.split(':').map(Number);
          return (
            <View key={key} style={{ paddingVertical: many ? 6 : 0, borderTopWidth: i > 0 ? 1 : 0, borderColor: palette.rule }}>
              <Text style={{ fontFamily: QURAN_FONT, fontSize: many ? 18 : 21, lineHeight: many ? 34 : 40, color: palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>
                {ayah ? mushafText(ayah.words.join(' ')) : ''}
              </Text>
              <Text style={{ fontSize: 13, color: palette.muted, textAlign: 'center' }}>{`${surahNames[surah] ?? num(surah)} ${num(number)}`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
