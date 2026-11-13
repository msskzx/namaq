import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowLeftRight, BookOpen } from 'lucide-react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { ayahOf, surahNames } from '@/lib/branches';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { readAyah } from '@/lib/openReader';
import { openCompare } from '@/lib/ways';
import { QURAN_FONT, type Palette, CARD } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';

/**
 * The ayat of the paths a tap lit, read in full under the tree: each one's text and where it is,
 * with buttons on the right of that line to open the ayah in the mushaf and in compare (owner, 2026-11-13).
 */
export default function PathAyat({ ayahKeys, palette, onLayout }: { ayahKeys: string[]; palette: Palette; onLayout?: (height: number) => void }) {
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  if (ayahKeys.length === 0) return null;
  const many = ayahKeys.length > 1;
  return (
    <View onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: -18 }}>
      <View style={{ borderWidth: 1, borderColor: palette.rule, ...CARD, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: many ? 4 : 10 }}>
        {ayahKeys.map((key, i) => {
          const ayah = ayahOf(key);
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const targets = compareTargetsOfAyah(key);
          return (
            <View key={key} style={{ paddingVertical: many ? 6 : 0, borderTopWidth: i > 0 ? 1 : 0, borderColor: palette.rule }}>
              <Text style={{ fontFamily: QURAN_FONT, fontSize: many ? 18 : 21, lineHeight: many ? 34 : 40, color: palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>
                {ayah ? mushafText(ayah.words.join(' ')) : ''}
              </Text>
              {/* The place stays centred under the ayah; its buttons sit on the line's right edge, where the thumb is. */}
              <View style={{ justifyContent: 'center', minHeight: 30 }}>
                <Text style={{ fontSize: 13, color: palette.muted, textAlign: 'center' }}>{place}</Text>
                <View style={{ position: 'absolute', right: -6, top: 0, bottom: 0, flexDirection: 'row-reverse', alignItems: 'center' }}>
                  <Pressable onPress={() => readAyah(key)} accessibilityRole="button" accessibilityLabel={`افتح ${place} في المصحف`} hitSlop={6} style={{ padding: 5 }}>
                    <BookOpen size={18} color={palette.muted} />
                  </Pressable>
                  {targets.length > 0 && <Pressable onPress={() => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets))}
                    accessibilityRole="button" accessibilityLabel={`قارن ${place}`} hitSlop={6} style={{ padding: 5 }}>
                    <ArrowLeftRight size={18} color={palette.muted} />
                  </Pressable>}
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </View>
  );
}
