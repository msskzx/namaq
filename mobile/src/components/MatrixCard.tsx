import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { Lane } from './TreeCard';
import { cardOf, matrixOf, surahNames, type MatrixAyah, type MatrixCell } from '@/lib/branches';
import type { ListState } from '@/lib/branchList';
import type { Size } from '@/lib/camera';
import { QURAN_FONT, type Palette } from '@/lib/theme';

type Props = { piece: BranchPiece; list: ListState; palette: Palette; view: Size; lane?: Lane; around: boolean; onTap: (ayahKeys: string[] | null) => void; onMove: () => void };

/** A column is most of the card wide, so the next one peeks in beside it (the website's 86%). */
const SHARE = 0.86;
const GAP = 8;
const SWIPE = 0.2;
const FLICK = 500;

function Ayah({ ayah, palette, muted }: { ayah: MatrixAyah; palette: Palette; muted: boolean }) {
  const [, number] = ayah.key.split(':').map(Number);
  return <>
    {ayah.words.map((word, i) => {
      const tone = ayah.rooted.has(i) ? palette.root : ayah.exact.has(i) ? palette.accent : undefined;
      return <Text key={i} style={tone ? { color: tone } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
    })}
    <Text style={{ color: muted ? palette.muted : palette.accent }}> ﴿{num(number)}﴾ </Text>
  </>;
}

function Cell({ cell, at, palette, width, current, onPress }: { cell: MatrixCell; at: 'before' | 'ayah' | 'after'; palette: Palette; width: number; current: boolean; onPress: () => void }) {
  if (!cell) return <View style={{ width }} />;
  const first = cell.ayat[0];
  const last = cell.ayat[cell.ayat.length - 1];
  const [surah, number] = first.key.split(':').map(Number);
  const [lastSurah, lastNumber] = last.key.split(':').map(Number);
  const range = first === last ? num(number) : `${num(number)}–${lastSurah === surah ? num(lastNumber) : `${surahNames[lastSurah]} ${num(lastNumber)}`}`;
  const muted = at !== 'ayah';
  const basmala = first.basmala && <Text style={{ fontFamily: QURAN_FONT, fontSize: 18, lineHeight: 36, color: palette.muted, textAlign: 'center' }}>{mushafText(first.basmala.join(' '))}</Text>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${surahNames[surah]} ${range}`}
      style={{ width, opacity: current ? 1 : 0.45, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <Text style={{ color: palette.ink, fontSize: 16, fontWeight: '600' }}>{surahNames[surah]}</Text>
        <Text style={{ color: palette.muted, fontSize: 13 }}>{first === last ? 'الآية' : 'الآيات'} {range}</Text>
      </View>
      {at === 'after' && basmala}
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 21, lineHeight: 44, color: muted ? palette.muted : palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
        {cell.ayat.map(ayah => <Ayah key={ayah.key} ayah={ayah} palette={palette} muted={muted} />)}
      </Text>
      {at === 'before' && basmala}
    </Pressable>
  );
}

/**
 * The website's ayah matrix: a row per ayah of the tree, coloured where every row shares a word. With the surrounding switch,
 * the ayah before and after each sit in columns either side; a sideways swipe steps a column, then on to the next tree.
 */
export default function MatrixCard({ piece, list, palette, view, lane, around, onTap, onMove }: Props) {
  const matrix = useMemo(() => matrixOf(cardOf(piece, list).presentation, around), [piece, list, around]);
  const count = matrix.columns.length;
  const width = Math.round(view.width * SHARE);
  const step = width + GAP;
  // Columns run right to left like the text: the ayah before on the right, the ayah after on the left.
  const xOf = (i: number) => (count - 1 - i) * step;
  const shiftOf = (i: number) => view.width / 2 - (xOf(i) + width / 2);
  const start = matrix.columns.indexOf('ayah');
  const [column, setColumn] = useState(start);
  const shift = useSharedValue(shiftOf(start));
  const base = useSharedValue(shiftOf(start));
  const at = useSharedValue(start);
  const mode = useSharedValue<'column' | 'swipe' | 'none'>('none');
  const from = useSharedValue(0);
  const shifts = matrix.columns.map((_, i) => shiftOf(i));
  // A new card width (the phone turned) keeps the same column in the middle.
  useEffect(() => {
    base.value = shifts[at.value];
    shift.value = shifts[at.value];
  }, [view.width]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number) => {
    at.value = i;
    base.value = shifts[i];
    shift.value = withTiming(shifts[i], { duration: 250 });
    setColumn(i);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onStart(event => {
      const forward = event.translationX > 0;
      const opens = forward ? at.value < count - 1 : at.value > 0;
      mode.value = opens ? 'column' : lane ? 'swipe' : 'none';
      cancelAnimation(shift);
      if (mode.value === 'swipe' && lane) {
        cancelAnimation(lane.offset);
        from.value = Math.round(lane.offset.value / lane.width);
      }
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      if (mode.value === 'column') shift.value = base.value + event.translationX;
      else if (mode.value === 'swipe' && lane) {
        const forward = event.translationX > 0;
        const open = forward ? from.value + 1 < lane.count : from.value > 0;
        lane.offset.value = from.value * lane.width + (open ? event.translationX : event.translationX / 4);
      }
    })
    .onEnd(event => {
      scheduleOnRN(onMove);
      if (mode.value === 'column') {
        const far = Math.abs(event.translationX) > view.width * SWIPE || Math.abs(event.velocityX) > FLICK;
        const next = far ? Math.min(count - 1, Math.max(0, at.value + (event.translationX > 0 ? 1 : -1))) : at.value;
        at.value = next;
        base.value = shifts[next];
        shift.value = withTiming(shifts[next], { duration: 250 });
        scheduleOnRN(setColumn, next);
      } else if (mode.value === 'swipe' && lane) {
        lane.settle(from.value, event.translationX, event.velocityX);
      }
      mode.value = 'none';
    });

  const lanes = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));
  const keysOf = (cell: MatrixCell) => cell?.ayat.map(ayah => ayah.key) ?? [];

  return (
    <GestureDetector gesture={pan}>
      <View collapsable={false} style={{ width: view.width, height: view.height, overflow: 'hidden', direction: 'ltr' }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={[{ width: count * step, gap: 10 }, lanes]}>
            {matrix.rows.map((row, r) => (
              <View key={r} style={{ flexDirection: 'row-reverse', gap: GAP, alignItems: 'stretch' }}>
                {matrix.columns.map((name, i) => (
                  <Cell key={name} cell={row[name]} at={name} palette={palette} width={width} current={i === column}
                    onPress={() => (i === column ? onTap(keysOf(row[name])) : goTo(i))} />
                ))}
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    </GestureDetector>
  );
}
