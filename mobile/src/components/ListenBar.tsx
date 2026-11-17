import { useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Pause, Play, Repeat, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { ONCE, reciterName, reciterOf } from '@shared/quran/recitation';
import { stopListening, togglePlaying, useListening } from '@/lib/listen';
import { readListenPlan, serverListenPlan, subscribeListenPlan } from '@shared/listenSettings';
import { surahNames } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { surahName } from '@shared/quran/surahNames';

export const LISTEN_BAR = 58;

const named = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${surahName(surah)} ${num(ayah)}`;
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
      <IconButton Icon={playing ? Pause : Play} label={playing ? 'إيقاف مؤقت' : 'استمع'} onPress={togglePlaying} round />
      <IconButton Icon={Repeat} label="التكرار والقارئ" onPress={onRepeat} on={repeating} tone="ink" />
      <Pressable onPress={onRepeat} accessibilityRole="button" accessibilityLabel={`${named(listening.key)}، ${reciterName(reciterOf(listening.reciter))}`} style={{ flex: 1, paddingHorizontal: 4 }}>
        <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{named(listening.key)}</Text>
        <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>
          {`${reciterOf(listening.reciter).name} · ${rangeText(listening.keys[0], listening.keys[listening.keys.length - 1])}`}
        </Text>
      </Pressable>
      <IconButton Icon={X} label="أوقف الاستماع" onPress={stopListening} />
    </View>
  );
}
