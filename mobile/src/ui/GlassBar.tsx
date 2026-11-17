import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePalette } from '@/lib/theme';

/** A floating bar's height: one icon button tall, and a little room around it. */
export const GLASS_BAR = 52;
/** The small bar's height: small icon buttons, for a bar that shares its row with other buttons (the home recall card). */
export const GLASS_BAR_SMALL = 40;

/**
 * A floating see-through bar of buttons, frosted like the tab bar (owner: floating bars frosted): recite mode's bar.
 * `label` names it as a toolbar for screen readers; `alert` makes it a notice instead (the save notice), read out when it appears.
 * `small` is a shorter pill sized to its buttons, for a bar that shares its row with other buttons.
 */
export default function GlassBar({ label, style, alert, small, children }: { label: string; style?: StyleProp<ViewStyle>; alert?: boolean; small?: boolean; children: React.ReactNode }) {
  const palette = usePalette();
  return (
    <View accessibilityRole={alert ? 'alert' : 'toolbar'} accessibilityLabel={label} accessibilityLiveRegion={alert ? 'polite' : undefined} pointerEvents={alert ? 'none' : undefined}
      style={[{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge },
        // A notice is a card-round line of text that grows with it; a bar is a pill of buttons.
        alert ? { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 }
          : small ? { height: GLASS_BAR_SMALL, gap: 16, paddingHorizontal: 8, borderRadius: 999 }
          : { height: GLASS_BAR, justifyContent: 'space-evenly', borderRadius: 999 }, style]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      {children}
    </View>
  );
}
