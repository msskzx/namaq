import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft, ChevronsLeft, PenLine, Undo2, X, type LucideProps } from 'lucide-react-native';
import type { Palette } from '@/lib/theme';
import type { Recite } from './useRecite';

/** The pill's height: one icon button tall, and a little room around it. */
export const RECITE_BAR = 52;

type Icon = (props: LucideProps) => React.ReactNode;

export function IconButton({ Icon, label, onPress, palette, on = false, disabled = false, color }: { Icon: Icon; label: string; onPress: () => void; palette: Palette; on?: boolean; disabled?: boolean; color?: string }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: on }} hitSlop={6}
      style={{ padding: 9, borderRadius: 999, backgroundColor: on ? palette.accent : 'transparent', opacity: disabled ? 0.35 : 1 }}>
      <Icon size={24} color={on ? palette.onAccent : color ?? palette.ink} />
    </Pressable>
  );
}

/**
 * Recite mode's bar, the one every place recites with (owner, 2026-11-17): step back, the next word, the next ayah, the pen,
 * and in the mushaf the end of the recitation. See-through like the tab bar. A place leaves a button out by giving it no
 * handler (`onClose`), and says what the next-ayah button does once its ayat are done (`after`: the reader's next forgotten
 * ayah, or the next page) and whether there is anything after (`more`).
 */
export default function RecitePill({ recite, writing, onWriting, onClose, after, more = false, lead, style, palette }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  after?: { Icon: Icon; label: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية' };
  return (
    <View accessibilityRole="toolbar" accessibilityLabel="أدوات التسميع"
      style={[{ height: RECITE_BAR, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }, style]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      {lead}
      <IconButton Icon={Undo2} label="ارجع خطوة" palette={palette} disabled={recite.atStart} onPress={recite.back} />
      <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" palette={palette} disabled={recite.done} onPress={recite.nextWord} />
      <IconButton Icon={next.Icon} label={next.label} palette={palette} disabled={ended && !more} onPress={recite.nextAyah} />
      <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} palette={palette} on={writing} onPress={onWriting} />
      {onClose && <IconButton Icon={X} label="إنهاء التسميع" palette={palette} onPress={onClose} />}
    </View>
  );
}
