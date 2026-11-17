import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePalette } from '@/lib/theme';

/** A floating bar's height: one icon button tall, and a little room around it. */
export const GLASS_BAR = 52;

/**
 * A floating see-through bar of buttons, frosted like the tab bar (owner: floating bars frosted): recite mode's bar.
 * `label` names it as a toolbar for screen readers.
 */
export default function GlassBar({ label, style, children }: { label: string; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const palette = usePalette();
  return (
    <View accessibilityRole="toolbar" accessibilityLabel={label}
      style={[{ height: GLASS_BAR, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }, style]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      {children}
    </View>
  );
}
