import { useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import { SURAHS, nearestSurah, stepSurah } from '@shared/quran/words';
import type { Palette } from '@/lib/theme';

const HEIGHT = 96;
const LABEL = 120;

/**
 * Where a word gathers (owner, 2026-11-16): one bar per surah, al-Fatiha on the right to al-Nas on the left, as tall as
 * the word's count there, with no numbers. A tap or a drag picks the nearest surah that has the word and names it under its bar.
 * Twice as tall since the chart slides away while reading (owner, 2026-11-21). While the finger slides, the surah's name
 * rides in a pill above it, where the finger does not cover it; the name alone, as the count line gives the count.
 */
export default function SurahStrip({ counts, picked, onPick, onSliding, names, palette }: {
  counts: number[]; picked: number | null; onPick: (surah: number) => void; onSliding?: (sliding: boolean) => void; names: Record<number, string>; palette: Palette;
}) {
  const [width, setWidth] = useState(0);
  const [sliding, setSlidingState] = useState(false);
  const setSliding = (now: boolean) => { setSlidingState(now); onSliding?.(now); };
  const max = Math.max(1, ...counts);
  const bar = width / SURAHS;
  const pick = (event: GestureResponderEvent) => {
    if (!width) return;
    const surah = nearestSurah(counts, Math.floor((1 - event.nativeEvent.locationX / width) * SURAHS));
    if (surah !== picked) onPick(surah);
  };
  const step = (by: 1 | -1) => counts.some(Boolean) && onPick(picked === null ? counts.findIndex(Boolean) : stepSurah(counts, picked, by));
  const centre = picked === null ? 0 : (picked + 0.5) * bar;
  return (
    <View accessible onLayout={event => setWidth(event.nativeEvent.layout.width)} accessibilityLabel="عدد مرات ورودها في كل سورة"
      accessibilityRole="adjustable" accessibilityValue={picked === null ? undefined : { text: names[picked + 1] }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]} onAccessibilityAction={event => step(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
      onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => false}
      onResponderGrant={event => { setSliding(true); pick(event); }} onResponderMove={pick}
      onResponderRelease={() => setSliding(false)} onResponderTerminate={() => setSliding(false)} style={{ height: HEIGHT + 20, direction: 'ltr' }}>
      <View pointerEvents="none" style={{ height: HEIGHT, borderBottomWidth: 1, borderColor: palette.rule }}>
        {width > 0 && counts.map((count, i) => count > 0 && (
          <View key={i} style={{ position: 'absolute', bottom: 0, right: i * bar + bar * 0.15, width: Math.max(1, bar * 0.7),
            height: Math.max(2, (count / max) * (HEIGHT - 2)), borderRadius: 1, backgroundColor: i === picked ? palette.accent : palette.rule }} />
        ))}
      </View>
      {sliding && picked !== null && width > 0 && (
        <View pointerEvents="none" style={{ position: 'absolute', top: -34, zIndex: 1, width: LABEL, right: Math.min(width - LABEL, Math.max(0, centre - LABEL / 2)), alignItems: 'center' }}>
          <Chip label={names[picked + 1]} on role="text" small palette={palette} />
        </View>
      )}
      {!sliding && picked !== null && width > 0 && (
        <View pointerEvents="none" style={{ position: 'absolute', top: HEIGHT + 1, width: LABEL, right: Math.min(width - LABEL, Math.max(0, centre - LABEL / 2)) }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', color: palette.accent, fontSize: 13 }}>{names[picked + 1]}</Text>
        </View>
      )}
    </View>
  );
}
