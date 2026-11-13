import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { treeSurahs } from '@shared/quran/treeSurahs';
import { surahNames } from '@/lib/branches';
import type { Palette } from '@/lib/theme';

export const CHIPS_HEIGHT = 40;
/** How far the chips rise into the bookmark row's spare room (kept for the studio's bar, which hides them). */
export const TUCK = 30;

/** The surahs a tree's ayat come from, as tags under its buttons: on a tree, a tap lights that surah's ayat. */
export default function SurahChips({ ayahKeys, palette, lit, onToggle, tuck }: { ayahKeys: string[]; tuck?: boolean; palette: Palette; lit?: (surah: number, ayahKeys: string[]) => boolean; onToggle?: (surah: number, ayahKeys: string[]) => void }) {
  const surahs = treeSurahs(ayahKeys);
  return (
    <View style={{ height: CHIPS_HEIGHT, marginTop: tuck ? -TUCK : 0, marginBottom: tuck ? 18 : 0, direction: 'rtl' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 5, paddingHorizontal: 12, alignItems: 'center', flexDirection: 'row' }}>
        {surahs.map(({ surah, ayahKeys: keys }) => {
          const on = lit?.(surah, keys) ?? false;
          const name = surahNames[surah] ?? num(surah);
          return (
            <Pressable key={surah} disabled={!onToggle} onPress={() => onToggle?.(surah, keys)} hitSlop={6} accessibilityRole={onToggle ? 'button' : 'text'} accessibilityState={onToggle ? { selected: on } : undefined} accessibilityLabel={`سورة ${name}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: on ? palette.path : palette.rule, backgroundColor: on ? palette.paperDeep : 'transparent' }}>
              <Text style={{ color: on ? palette.path : palette.ink, fontSize: 14 }}>{name}</Text>
              {keys.length > 1 && <Text style={{ color: on ? palette.path : palette.muted, fontSize: 11 }}>{num(keys.length)}</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
