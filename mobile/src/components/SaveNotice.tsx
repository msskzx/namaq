import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/ui/Text';
import { usePalette } from '@/lib/theme';
import { useUnsaved } from '@/lib/storage';

/**
 * A short line at the top while the phone refuses to save an edit (its storage full, owner 2026-11-17). The edit stays on
 * screen and is saved again every half minute and when the app goes to the background; the line goes once it is saved.
 */
export default function SaveNotice() {
  const unsaved = useUnsaved();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  if (!unsaved) return null;
  return (
    <View pointerEvents="none" accessibilityRole="alert" accessibilityLiveRegion="polite"
      style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge, paddingVertical: 10, paddingHorizontal: 14 }}>
      <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
      <Text style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>لم يُحفظ آخر تعديل على الجهاز، وسيُحفظ حين يتّسع المكان.</Text>
    </View>
  );
}
