import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { ayahOf, matrixOf, NOTHING_SHARED, surahNames, type Presentation } from '@/lib/branches';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { openCompare } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import { Cell } from './MatrixCard';

/**
 * The ayat of the paths a tap lit, read in full under the tree, each as the matrix draws it (owner, 2026-11-14): the same card,
 * the tree's shared words coloured, with buttons to open the ayah in the mushaf and in compare.
 */
export default function PathAyat({ ayahKeys, presentation, palette, width, onLayout, maxHeight, shown }: { ayahKeys: string[]; presentation: Presentation; palette: Palette; width: number;
  /** In the studio, while the ayah grows: only its first `shown` words show, the rest keep their place unseen. */
  shown?: number;
  onLayout?: (height: number) => void;
  /** In a fixed frame: the cards keep within this height, and ayat that don't fit scroll. */
  maxHeight?: number }) {
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const matrix = useMemo(() => ayahKeys.length ? matrixOf(presentation, false) : null, [presentation, ayahKeys.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps
  const starts = presentation.ayat.map(ayah => ayah.key);
  // A growing ayah too long for the fixed frame scrolls along as its words appear, so the newest stay in sight.
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [heights, setHeights] = useState({ content: 0, view: 0 });
  const total = matrix && ayahKeys.length === 1 ? (matrix.rows[starts.indexOf(ayahKeys[0])]?.ayah?.ayat ?? []).reduce((sum, ayah) => sum + ayah.words.length, 0) : 0;
  useEffect(() => {
    if (!maxHeight || !total || heights.content <= heights.view) return;
    const along = shown === undefined ? 0 : Math.min(1, shown / total);
    scroller.current?.scrollTo({ y: Math.max(0, along * heights.content - heights.view * 0.75), animated: true });
  }, [shown, total, maxHeight, heights]);
  if (!matrix || ayahKeys.length === 0) return null;
  return (
    // Laid out as the matrix lays its cards out (ltr, its buttons at the end); dir is what the web build reads.
    <View {...({ dir: 'ltr' } as object)} onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: maxHeight ? 0 : -18, direction: 'ltr' }}>
      <ScrollView ref={scroller} scrollEnabled={!!maxHeight} style={{ maxHeight }}
        onLayout={event => { const view = event.nativeEvent.layout.height; setHeights(old => old.view === view ? old : { ...old, view }); }}
        onContentSizeChange={(_w, content) => setHeights(old => old.content === content ? old : { ...old, content })} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
        {ayahKeys.map(key => {
          const ayah = ayahOf(key);
          const cell = matrix.rows[starts.indexOf(key)]?.ayah ?? (ayah ? { ayat: [{ key, page: ayah.page, words: ayah.words, ...NOTHING_SHARED }] } : null);
          if (!cell) return null;
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const targets = compareTargetsOfAyah(key);
          return <Cell key={key} cell={cell} at="ayah" palette={palette} width={width - 24} current shown={shown}
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
