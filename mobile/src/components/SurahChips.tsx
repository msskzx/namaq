import { ScrollView, View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { treeSurahs } from '@shared/quran/treeSurahs';
import { surahNames } from '@/lib/branches';
import type { Palette } from '@/lib/theme';
import Chip from '@/ui/Chip';

export const CHIPS_HEIGHT = 40;
export const TUCK = 30;

export default function SurahChips({ ayahKeys, palette, lit, onToggle, tuck }: { ayahKeys: string[]; tuck?: boolean; palette: Palette; lit?: (surah: number, ayahKeys: string[]) => boolean; onToggle?: (surah: number, ayahKeys: string[]) => void }) {
  const surahs = treeSurahs(ayahKeys);
  return (
    <View style={{ height: CHIPS_HEIGHT, marginTop: tuck ? -TUCK : 0, marginBottom: tuck ? 18 : 0, direction: 'rtl' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingHorizontal: 12, alignItems: 'center', flexDirection: 'row' }}>
        {surahs.map(({ surah, ayahKeys: keys }) => {
          const on = lit?.(surah, keys) ?? false;
          const name = surahNames[surah] ?? num(surah);
          return (
            <Chip key={surah} small lit tint={palette.path} role={onToggle ? 'button' : 'text'} label={name} count={keys.length > 1 ? keys.length : undefined} on={on}
              onPress={onToggle && (() => onToggle(surah, keys))} accessibilityLabel={`سورة ${name}`} palette={palette} />
          );
        })}
      </ScrollView>
    </View>
  );
}
