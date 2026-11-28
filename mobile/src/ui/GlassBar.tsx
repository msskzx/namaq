import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePalette } from '@/lib/theme';

export const GLASS_BAR = 52;
export const GLASS_BAR_SMALL = 40;

export default function GlassBar({ label, style, alert, small, plain, children }: { label: string; style?: StyleProp<ViewStyle>; alert?: boolean; small?: boolean;
  plain?: boolean; children: React.ReactNode }) {
  const palette = usePalette();
  return (
    <View accessibilityRole={plain ? undefined : alert ? 'alert' : 'toolbar'} accessibilityLabel={plain ? undefined : label} accessibilityLiveRegion={alert ? 'polite' : undefined} pointerEvents={alert ? 'none' : undefined}
      style={[{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge },
        alert ? { borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 }
          : small ? { height: GLASS_BAR_SMALL, gap: 16, paddingHorizontal: 8, borderRadius: 999 }
          : { height: GLASS_BAR, justifyContent: 'space-evenly', borderRadius: 999 }, style]}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      {children}
    </View>
  );
}
