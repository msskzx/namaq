import { useSyncExternalStore } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Minimize2, Pause, Play, Repeat, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { ONCE, reciterName, reciterOf } from '@shared/quran/recitation';
import { stopListening, togglePlaying, useListening } from '@/lib/listen';
import { readListenPlan, serverListenPlan, subscribeListenPlan } from '@shared/listenSettings';

import type { Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import { surahName } from '@shared/quran/surahNames';
import { useDebounced } from '@/lib/hooks/useDebounced';

export const LISTEN_BAR = 58;

const named = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${surahName(surah)} ${num(ayah)}`;
};
export const rangeText = (from: string, to: string) =>
  from.split(':')[0] === to.split(':')[0] ? `من ${named(from)} إلى ${num(Number(to.split(':')[1]))}` : `من ${named(from)} إلى ${named(to)}`;

export default function ListenBar({ width, onRepeat, onFold, palette }: { width: number; onRepeat: () => void; onFold: () => void; palette: Palette }) {
  const listening = useListening();
  const plan = useSyncExternalStore(subscribeListenPlan, readListenPlan, serverListenPlan);
  const loading = !!listening?.loading;
  const waitingFor = loading ? listening?.key ?? '' : null;
  const settled = useDebounced(waitingFor, 800);
  const slow = waitingFor !== null && settled === waitingFor;
  if (!listening) return null;
  const repeating = plan.eachAyah !== ONCE.eachAyah || plan.rangeTimes !== ONCE.rangeTimes || plan.pause !== ONCE.pause;
  const { playing, failed } = listening;
  const note = failed ? 'تعذّر تشغيل الآية' : slow && loading ? 'جارٍ التحميل…' : null;
  return (
    <View accessibilityRole="toolbar" accessibilityLabel="الاستماع"
      style={{ width, height: LISTEN_BAR, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      <IconButton Icon={playing ? Pause : Play} label={failed ? 'أعد المحاولة' : playing ? 'إيقاف مؤقت' : 'استمع'} onPress={togglePlaying} round />
      <IconButton Icon={Repeat} label="التكرار والقارئ" onPress={onRepeat} on={repeating} tone="ink" />
      <Tap onPress={onRepeat} accessibilityRole="button" accessibilityLabel={`${named(listening.key)}، ${reciterName(reciterOf(listening.reciter))}`} style={{ flex: 1, paddingHorizontal: 4 }}>
        <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{named(listening.key)}</Text>
        <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>
          {note ?? `${reciterOf(listening.reciter).name} · ${rangeText(listening.keys[0], listening.keys[listening.keys.length - 1])}`}
        </Text>
      </Tap>
      <IconButton Icon={Minimize2} label="اطوِ الشريط في دائرة" onPress={onFold} />
      <IconButton Icon={X} label="أوقف الاستماع" onPress={stopListening} />
    </View>
  );
}
