import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowLeftRight } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { aroundOf, ayahOf, matrixOf, mixedBefore, NOTHING_SHARED, readId, surahNames, type Presentation } from '@/lib/branches';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { openCompare } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import { Cell } from './MatrixCard';

/**
 * The ayat of the paths a tap lit, read in full under the tree, each as the matrix draws it (owner, 2026-11-14): the same card,
 * the tree's shared words coloured, with buttons to open the ayah in the mushaf and in compare.
 */
export default function PathAyat({ ayahKeys, presentation, palette, width, onLayout, maxHeight, shown, around = false, reading, onContent }: {
  /** The cards' whole height, scrolled or not: the frame sizes its room from it. */
  onContent?: (height: number) => void;
  /** The studio's tour: the word it reads now (readId), lit in the card. */
  reading?: Set<string>; ayahKeys: string[]; presentation: Presentation; palette: Palette; width: number;
  /** The surrounding ayat are on: the card reads the whole run the tree draws, from the ayah before to the one after (owner, 2026-11-15). */
  around?: boolean;
  /** In the studio, while the ayah grows: only its first `shown` words show, the rest keep their place unseen. */
  shown?: number;
  onLayout?: (height: number) => void;
  /** In a fixed frame: the cards keep within this height, and ayat that don't fit scroll. */
  maxHeight?: number }) {
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  // While an ayah grows (`shown`), its card counts from the ayah's own start, so the surrounding ayat join only once it has grown.
  const withAround = around && shown === undefined;
  const matrix = useMemo(() => ayahKeys.length ? matrixOf(presentation, withAround) : null, [presentation, ayahKeys.length > 0, withAround]); // eslint-disable-line react-hooks/exhaustive-deps
  const starts = presentation.ayat.map(ayah => ayah.key);
  const mixed = mixedBefore(presentation);
  const context = useMemo(() => withAround && mixed ? aroundOf(presentation) : null, [presentation, withAround, mixed]);
  // A growing ayah too long for the fixed frame scrolls along as its words appear, so the newest stay in sight.
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [heights, setHeights] = useState({ content: 0, view: 0 });
  const total = matrix && ayahKeys.length === 1 ? (matrix.rows[starts.indexOf(ayahKeys[0])]?.ayah?.ayat ?? []).reduce((sum, ayah) => sum + ayah.words.length, 0) : 0;
  // The tour's reading moves the same way, to the word it reads.
  const readAt = useMemo(() => {
    if (!reading?.size || !matrix || ayahKeys.length !== 1) return undefined;
    const r = starts.indexOf(ayahKeys[0]);
    let at = 0;
    for (const ayah of matrix.rows[r]?.ayah?.ayat ?? []) for (let i = 0; i < ayah.words.length; i++, at++) if (reading.has(readId(r, ayah.key, i))) return at;
    return undefined;
  }, [reading, matrix, ayahKeys]); // eslint-disable-line react-hooks/exhaustive-deps
  const place = readAt ?? shown;
  useEffect(() => {
    if (!maxHeight || !total || heights.content <= heights.view) return;
    const along = place === undefined ? 0 : Math.min(1, place / total);
    scroller.current?.scrollTo({ y: Math.max(0, along * heights.content - heights.view * 0.75), animated: true });
  }, [place, total, maxHeight, heights]);
  if (!matrix || ayahKeys.length === 0) return null;
  return (
    // Laid out as the matrix lays its cards out (ltr, its buttons at the end); dir is what the web build reads.
    <View {...({ dir: 'ltr' } as object)} onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: maxHeight ? 0 : -18, direction: 'ltr' }}>
      <ScrollView ref={scroller} scrollEnabled={!!maxHeight} style={{ maxHeight }}
        onLayout={event => { const view = event.nativeEvent.layout.height; setHeights(old => old.view === view ? old : { ...old, view }); }}
        onContentSizeChange={(_w, content) => { onContent?.(content); setHeights(old => old.content === content ? old : { ...old, content }); }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
        {ayahKeys.map(key => {
          const ayah = ayahOf(key);
          const row = matrix.rows[starts.indexOf(key)];
          const cell = row?.ayah ?? (ayah ? { ayat: [{ key, page: ayah.page, words: ayah.words, ...NOTHING_SHARED }] } : null);
          // As the tree draws the run: in a mixed tree one more ayah before, then the ayah before, this one, and the ayah after.
          const earlier = withAround && mixed ? context?.earlier[key] : null;
          const around = withAround ? { before: [...(earlier ? [{ ...earlier }] : []), ...row?.before?.ayat ?? []], after: row?.after?.ayat ?? [] } : undefined;
          if (!cell) return null;
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const targets = compareTargetsOfAyah(key);
          return <Cell key={key} cell={cell} at="ayah" palette={palette} width={width - 24} current shown={shown} around={around} read={reading ? { row: starts.indexOf(key), now: reading } : undefined}
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
