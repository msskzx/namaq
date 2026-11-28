import { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ArrowLeftRight } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { aroundOf, ayahOf, matrixOf, rowOf, mixedBefore, NOTHING_SHARED, readId, surahNames, type Presentation } from '@/lib/branches';
import { compareTargetsOfAyah, type CompareTarget } from '@/lib/compare';
import { openCompare } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import CompareTargetsSheet from './CompareTargetsSheet';
import { Cell } from './MatrixCard';
import IconButton from '@/ui/IconButton';
import { useOnChange } from '@/lib/hooks/useOnChange';

export default function PathAyat({ ayahKeys, presentation, palette, width, onLayout, maxHeight, shown, around = false, reading, onContent }: {
  onContent?: (height: number) => void;
  reading?: Set<string>; ayahKeys: string[]; presentation: Presentation; palette: Palette; width: number;
  around?: boolean;
  shown?: number;
  onLayout?: (height: number) => void;
  maxHeight?: number }) {
  const [choosing, setChoosing] = useState<CompareTarget[] | null>(null);
  const withAround = around && shown === undefined;
  const matrix = useMemo(() => ayahKeys.length ? matrixOf(presentation, withAround) : null, [presentation, ayahKeys.length > 0, withAround]); // eslint-disable-line react-hooks/exhaustive-deps
  const rowFor = (key: string) => (matrix ? rowOf(matrix, key) : null);
  const mixed = mixedBefore(presentation);
  const context = useMemo(() => withAround && mixed ? aroundOf(presentation) : null, [presentation, withAround, mixed]);
  const scroller = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [heights, setHeights] = useState({ content: 0, view: 0 });
  const total = matrix && ayahKeys.length === 1 ? (rowFor(ayahKeys[0])?.row.ayah?.ayat ?? []).reduce((sum, ayah) => sum + ayah.words.length, 0) : 0;
  const readAt = useMemo(() => {
    if (!reading?.size || !matrix || ayahKeys.length !== 1) return undefined;
    const found = rowFor(ayahKeys[0]);
    const r = found?.r ?? -1;
    let at = 0;
    for (const ayah of found?.row.ayah?.ayat ?? []) for (let i = 0; i < ayah.words.length; i++, at++) if (reading.has(readId(r, ayah.key, i))) return at;
    return undefined;
  }, [reading, matrix, ayahKeys]); // eslint-disable-line react-hooks/exhaustive-deps
  const [wordsBefore, wordsAfter] = useMemo(() => {
    if (!withAround || !matrix || ayahKeys.length !== 1) return [0, 0];
    const row = rowFor(ayahKeys[0])?.row;
    const count = (ayat: { words: unknown[] }[]) => ayat.reduce((sum, ayah) => sum + ayah.words.length, 0);
    const earlier = mixed ? context?.earlier[ayahKeys[0]] : null;
    return [count([...(earlier ? [earlier] : []), ...row?.before?.ayat ?? []]), count(row?.after?.ayat ?? [])];
  }, [withAround, matrix, ayahKeys, mixed, context]); // eslint-disable-line react-hooks/exhaustive-deps
  const place = readAt ?? shown;
  useOnChange([place, total, wordsBefore, wordsAfter, maxHeight, heights], () => {
    if (!maxHeight || !total || heights.content <= heights.view) return;
    const along = Math.min(1, (wordsBefore + (place ?? 0)) / (wordsBefore + total + wordsAfter));
    scroller.current?.scrollTo({ y: Math.max(0, along * heights.content - heights.view * 0.75), animated: true });
  });
  if (!matrix || ayahKeys.length === 0) return null;
  return (
    <View {...({ dir: 'ltr' } as object)} onLayout={event => onLayout?.(event.nativeEvent.layout.height)} style={{ paddingHorizontal: 12, paddingBottom: 8, marginTop: maxHeight ? 0 : -18, direction: 'ltr' }}>
      <ScrollView ref={scroller} nestedScrollEnabled scrollEnabled={!!maxHeight && heights.content > heights.view + 1} style={{ maxHeight }}
        onLayout={event => { const view = event.nativeEvent.layout.height; setHeights(old => old.view === view ? old : { ...old, view }); }}
        onContentSizeChange={(_w, content) => { onContent?.(content); setHeights(old => old.content === content ? old : { ...old, content }); }} contentContainerStyle={{ gap: 8 }} showsVerticalScrollIndicator={false}>
        {ayahKeys.map(key => {
          const ayah = ayahOf(key);
          const found = rowFor(key);
          const row = found?.row;
          const cell = row?.ayah ?? (ayah ? { ayat: [{ key, page: ayah.page, words: ayah.words, ...NOTHING_SHARED }] } : null);
          const earlier = withAround && mixed ? context?.earlier[key] : null;
          const around = withAround ? { before: [...(earlier ? [{ ...earlier }] : []), ...row?.before?.ayat ?? []], after: row?.after?.ayat ?? [] } : undefined;
          if (!cell) return null;
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const targets = compareTargetsOfAyah(key);
          return <Cell key={key} cell={cell} at="ayah" palette={palette} width={width - 24} current shown={shown} around={around} read={reading ? { row: found?.r ?? -1, now: reading } : undefined}
            tools={targets.length > 0 && <IconButton Icon={ArrowLeftRight} label={`قارن ${place}`} onPress={() => (targets.length === 1 ? openCompare(targets[0]) : setChoosing(targets))} size="small" />} />;
        })}
      </ScrollView>
      <CompareTargetsSheet targets={choosing} onPick={target => { setChoosing(null); openCompare(target); }} onClose={() => setChoosing(null)} palette={palette} />
    </View>
  );
}
