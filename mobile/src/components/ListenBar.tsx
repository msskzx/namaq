import { useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Pause, Play, Repeat, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { ONCE, reciterName, reciterOf } from '@shared/quran/recitation';
import { stopListening, togglePlaying, useListening } from '@/lib/listen';
import { readListenPlan, serverListenPlan, subscribeListenPlan } from '@shared/listenSettings';
import { surahNames } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';

export const LISTEN_BAR = 58;

const named = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${plainName(surahNames[surah] ?? '').replace(/^سورة\s*/, '')} ${num(ayah)}`;
};
/** «من البقرة ٣ إلى ٥», or with the surah again when the range crosses into another. */
export const rangeText = (from: string, to: string) =>
  from.split(':')[0] === to.split(':')[0] ? `من ${named(from)} إلى ${num(Number(to.split(':')[1]))}` : `من ${named(from)} إلى ${named(to)}`;

/**
 * The recitation playing, as a frosted bar over the bottom of the mushaf (owner's sketch, 2026-11-17): pause or play, the
 * repeat settings, the ayah being read with its reciter and range, and stop. No counts.
 */
export default function ListenBar({ bottom, side, onRepeat, palette }: { bottom: number; side: number; onRepeat: () => void; palette: Palette }) {
  const listening = useListening();
  const plan = useSyncExternalStore(subscribeListenPlan, readListenPlan, serverListenPlan);
  if (!listening) return null;
  const repeating = plan.eachAyah !== ONCE.eachAyah || plan.rangeTimes !== ONCE.rangeTimes || plan.pause !== ONCE.pause;
  const playing = listening.playing;
  return (
    <View accessibilityRole="toolbar" accessibilityLabel="الاستماع"
      style={{ position: 'absolute', left: side, right: side, bottom, height: LISTEN_BAR, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      <Pressable onPress={togglePlaying} accessibilityRole="button" accessibilityLabel={playing ? 'إيقاف مؤقت' : 'استمع'} hitSlop={6}
        style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent }}>
        {playing ? <Pause size={22} color={palette.onAccent} fill={palette.onAccent} /> : <Play size={22} color={palette.onAccent} fill={palette.onAccent} />}
      </Pressable>
      <Pressable onPress={onRepeat} accessibilityRole="button" accessibilityLabel="التكرار والقارئ" accessibilityState={{ selected: repeating }} hitSlop={6}
        style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Repeat size={22} color={repeating ? palette.accent : palette.ink} />
      </Pressable>
      <Pressable onPress={onRepeat} accessibilityRole="button" accessibilityLabel={`${named(listening.key)}، ${reciterName(reciterOf(listening.reciter))}`} style={{ flex: 1, paddingHorizontal: 4 }}>
        <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{named(listening.key)}</Text>
        <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>
          {`${reciterOf(listening.reciter).name} · ${rangeText(listening.keys[0], listening.keys[listening.keys.length - 1])}`}
        </Text>
      </Pressable>
      <Pressable onPress={stopListening} accessibilityRole="button" accessibilityLabel="أوقف الاستماع" hitSlop={6} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <X size={22} color={palette.muted} />
      </Pressable>
    </View>
  );
}
