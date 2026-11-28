import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useIsFocused } from 'expo-router';
import { Pointer, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR, tabBarBottom, useTabBarSpace } from '@/ui/tabBarSpace';
import { useImmersive } from '@/lib/chrome';
import { useColumnSide } from '@/ui/column';
import { hintsSeen, tourSeen, type HintId } from '@/lib/settings';
import { HINTS } from '@shared/tabHints';
import type { Palette } from '@/lib/theme';

export default function TabHint({ id, palette, hidden }: { id: HintId; palette: Palette; hidden?: boolean }) {
  const [seen, setSeen] = hintsSeen.use();
  const [toured] = tourSeen.use();
  const focused = useIsFocused();
  const space = useTabBarSpace();
  const insets = useSafeAreaInsets();
  const column = useColumnSide();
  const side = id === 'read' ? column : 0;
  const bottom = useImmersive() && id === 'read' ? tabBarBottom(insets.bottom) : space;
  if (hidden || !toured || !focused || seen.includes(id)) return null;
  const close = () => setSeen([...hintsSeen.get().filter(item => item !== id), id]);
  return (
    <Animated.View entering={FadeIn.duration(400).delay(600)} exiting={FadeOut.duration(200)} pointerEvents="box-none"
      style={{ position: 'absolute', left: TAB_BAR.side + side, right: TAB_BAR.side + side, bottom, borderRadius: 14, boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)' }}>
      <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={`${HINTS[id].ar} اضغط لإخفاء التلميح.`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingStart: 14, paddingEnd: 6, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
        <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
        <View><Pointer size={22} color={palette.accent} /></View>
        <Text style={{ flex: 1, color: palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>{HINTS[id].ar}</Text>
        <View style={{ padding: 8 }}><X size={18} color={palette.muted} /></View>
      </Pressable>
    </Animated.View>
  );
}
