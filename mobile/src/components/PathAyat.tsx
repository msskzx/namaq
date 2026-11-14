import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { ayahOf, matrixOf, surahNames, type Presentation } from '@/lib/branches';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { openCompare } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import { Cell } from './MatrixCard';

/**
 * The ayat of the paths a tap lit, read in full under the tree, each as the matrix draws it (owner, 2026-11-14): the same card,
 * the tree's shared words coloured, with buttons to open the ayah in the mushaf and in compare.
 */
export default function PathAyat({ ayahKeys, presentation, palette, width, onLayout, maxHeight }: { ayahKeys: string[]; presentation: Presentation; palette: Palette; width: number;
  onLayout?: (height: number) => void;
  /** In a fixed frame: the cards keep within this height, and ayat that don't fit scroll. */
  maxHeight?: number }) {
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const matrix = useMemo(() => ayahKeys.length ? matrixOf(presentation, false) : null, [presentation, ayahKeys.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!matrix || ayahKeys.length === 0) return null;
  const starts = presentation.ayat.map(ayah => ayah.key);
  return (
    // Laid out as the matrix lays its cards out (ltr, its buttons at the end); dir is what the web build reads.
    <View {...({ dir: 'ltr' } as object)} onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: maxHeight ? 0 : -18, direction: 'ltr' }}>
      <ScrollView scrollEnabled={!!maxHeight} style={{ maxHeight }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
        {ayahKeys.map(key => {
          const ayah = ayahOf(key);
          const cell = matrix.rows[starts.indexOf(key)]?.ayah ?? (ayah ? { ayat: [{ key, page: ayah.page, words: ayah.words, exact: new Set<number>(), rooted: new Set<number>() }] } : null);
          if (!cell) return null;
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const targets = compareTargetsOfAyah(key);
          return <Cell key={key} cell={cell} at="ayah" palette={palette} width={width - 24} current
            tools={targets.length > 0 && <Pressable onPress={() => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets))}
              accessibilityRole="button" accessibilityLabel={`قارن ${place}`} hitSlop={8} style={{ padding: 4 }}>
              <ArrowLeftRight size={18} color={palette.muted} />
            </Pressable>} />;
        })}
      </ScrollView>
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </View>
  );
}
