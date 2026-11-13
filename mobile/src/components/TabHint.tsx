import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useIsFocused } from 'expo-router';
import { Pointer, X } from 'lucide-react-native';
import { Text } from './Text';
import { TAB_BAR, useTabBarSpace } from './tabBarSpace';
import { hintsSeen, tourSeen, type HintId } from '@/lib/settings';
import type { Palette } from '@/lib/theme';

/** One line per page, naming the touch the page hides (owner, 2026-11-13: minimal text, no counts). */
export const HINTS: Record<HintId, string> = {
  read: 'اضغط آية لتظلّلها، وأطل الضغط لتظهر أزرارها، واضغطها مرتين لحفظها.',
  branches: 'اضغط فرعًا ليضيء طريقه وتظهر آيته، واضغط الشجرة مرتين لحفظها.',
  compare: 'اضغط كلمة ملوّنة لتضيء نظيرتها.',
  prophets: 'اضغط دائرة لتقرأ آياتها في السورة.',
  utilities: 'بدّل من الأعلى بين المواقيت والقبلة والتقويم.',
};

/**
 * A one-time tip the first time a page opens: a see-through card just above the tab bar, like the bar itself.
 * A tap on it or its × puts it away for good; «الجولة التعريفية» in the settings brings every tip back.
 * It waits while the first-launch tour is still to come, and shows only on the page that is open.
 */
export default function TabHint({ id, palette, hidden }: { id: HintId; palette: Palette; hidden?: boolean }) {
  const [seen, setSeen] = hintsSeen.use();
  const [toured] = tourSeen.use();
  const focused = useIsFocused();
  const bottom = useTabBarSpace();
  if (hidden || !toured || !focused || seen.includes(id)) return null;
  const close = () => setSeen([...hintsSeen.get().filter(item => item !== id), id]);
  return (
    <Animated.View entering={FadeIn.duration(400).delay(600)} exiting={FadeOut.duration(200)} pointerEvents="box-none"
      style={{ position: 'absolute', left: TAB_BAR.side, right: TAB_BAR.side, bottom, borderRadius: 14, boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)' }}>
      <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={`${HINTS[id]} اضغط لإخفاء التلميح.`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingStart: 14, paddingEnd: 6, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
        <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
        {/* Wrapped, so the web paints the icon above the see-through layers as it does the text. */}
        <View><Pointer size={22} color={palette.accent} /></View>
        <Text style={{ flex: 1, color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>{HINTS[id]}</Text>
        <View style={{ padding: 8 }}><X size={18} color={palette.muted} /></View>
      </Pressable>
    </Animated.View>
  );
}
