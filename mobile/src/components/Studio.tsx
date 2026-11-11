import { Pressable, Text, View } from 'react-native';
import { Clapperboard, Pause, Play, RotateCcw, Send, Timer, X, type LucideProps } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { closeStudio, openStudio, pause, play, setPrefs, SPEEDS, stop, TIMERS, useGrowth } from '@/lib/growPlayer';
import type { Palette } from '@/lib/theme';

export function IconButton({ label, onPress, Icon, color, size = 24, pressed }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; color: string; size?: number; pressed?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel={label} accessibilityState={pressed === undefined ? undefined : { selected: pressed }} style={{ padding: 8 }}>
      <Icon size={size} color={color} />
    </Pressable>
  );
}

function Chip({ label, text, onPress, palette, active }: { label: string; text: string; onPress: () => void; palette: Palette; active?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4}
      style={{ minWidth: 44, height: 36, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: active ? palette.accent : palette.rule }}>
      <Text style={{ color: active ? palette.accent : palette.ink, fontSize: 14, fontVariant: ['tabular-nums'], writingDirection: 'ltr' }}>{text}</Text>
    </Pressable>
  );
}

const next = <T,>(list: T[], value: T) => list[(list.indexOf(value) + 1) % list.length];

/** The studio button outside the studio; inside it, in place of save and share, the website's controls. */
export function StudioButton({ palette }: { palette: Palette }) {
  const growth = useGrowth();
  if (!growth.total) return null;
  return <IconButton label={growth.kind === 'matrix' ? 'استوديو الروابط' : 'استوديو النمو'} onPress={openStudio} Icon={Clapperboard} color={palette.ink} />;
}

export function StudioControls({ palette, onVideo }: { palette: Palette; onVideo?: () => void }) {
  const growth = useGrowth();
  const active = growth.status === 'playing' || growth.status === 'paused';
  const playing = growth.status === 'playing';
  const matrix = growth.kind === 'matrix';
  const label = playing ? 'إيقاف مؤقت' : growth.status === 'paused' ? 'متابعة' : growth.status === 'done' ? 'إعادة' : matrix ? 'شاهد الروابط' : 'شاهد الشجرة تنمو';
  const ask = growth.mode === 'ask';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 }}>
      <Chip label={`السرعة ${growth.speed}×`} text={`${growth.speed}×`} onPress={() => setPrefs({ speed: next(SPEEDS, growth.speed) })} palette={palette} />
      {ask && <Chip label={`مهلة السؤال ${growth.timer ? num(growth.timer) : '∞'}`} text={growth.timer ? `${growth.timer}s` : '∞'} onPress={() => setPrefs({ timer: next(TIMERS, growth.timer) })} palette={palette} active={!!growth.timer} />}
      <IconButton label={matrix ? 'تذكّر الرابط' : 'اكمل الآيات'} onPress={() => setPrefs({ mode: ask ? 'watch' : 'ask' })} Icon={Timer} color={ask ? palette.accent : palette.ink} pressed={ask} />
      <IconButton label={label} onPress={() => (active ? pause(playing) : void play())} Icon={playing ? Pause : Play} color={active ? palette.accent : palette.ink} />
      <IconButton label="إعادة ضبط" onPress={stop} Icon={RotateCcw} color={palette.ink} />
      {onVideo && <IconButton label="مشاركة كفيديو" onPress={onVideo} Icon={Send} color={palette.ink} />}
      <View style={{ flex: 1 }} />
      <IconButton label="إغلاق الاستوديو" onPress={closeStudio} Icon={X} color={palette.ink} />
    </View>
  );
}

/** A bar per ayah; a tap starts the growth from that ayah. */
export function StudioProgress({ palette }: { palette: Palette }) {
  const growth = useGrowth();
  if (!growth.studio || !growth.total) return null;
  return (
    <View style={{ direction: 'rtl', flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingTop: 6 }}>
      {Array.from({ length: growth.total }, (_, i) => {
        const done = growth.status === 'done' || (growth.status !== 'idle' && i <= growth.at);
        return (
          <Pressable key={i} onPress={() => void play(i)} accessibilityRole="button" accessibilityLabel={`${growth.kind === 'matrix' ? 'من الرابط' : 'من الآية'} ${num(i + 1)}`} style={{ flex: 1, height: 20, justifyContent: 'center' }}>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: done ? palette.green : palette.rule }} />
          </Pressable>
        );
      })}
    </View>
  );
}
