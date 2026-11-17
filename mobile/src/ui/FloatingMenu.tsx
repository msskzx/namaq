import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Palette } from '@/lib/theme';

/** Where the finger pressed, in screen points. */
export type MenuAt = { x: number; y: number };

/**
 * The one floating menu (owner, 2026-11-17: shared first): a row of ActButtons over what was pressed, wrapping onto
 * more rows on a narrow phone. It sits just above the finger, or below it when there is no room above, and stays on
 * screen sideways. The mushaf's long press draws it in the page; a home card's tap passes `overlay`, which lays a light
 * dim behind it (the card reads as behind the menu) and a tap outside closes it.
 */
export default function FloatingMenu({ at, label, onClose, overlay = false, top: clear, palette, children }: {
  at: MenuAt | null; label: string; onClose: () => void; overlay?: boolean;
  /** What it must stay below (the mushaf's recite bar at the top); the status bar otherwise. */
  top?: number; palette: Palette; children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Measured once drawn, for the place it was opened at (another ayah may hold other buttons): hidden until then.
  const [measured, setMeasured] = useState<{ at: MenuAt; width: number; height: number } | null>(null);
  const size = measured && at && measured.at.x === at.x && measured.at.y === at.y ? measured : null;
  if (!at && !overlay) return null;
  const above = at && size ? at.y - 20 - size.height : 0;
  const bar = at && (
    <View accessibilityRole="toolbar" accessibilityLabel={label} onLayout={event => setMeasured({ at, width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
      style={{
        position: 'absolute', opacity: size ? 1 : 0, maxWidth: width - 16,
        top: above < (clear ?? insets.top) + 8 ? at.y + 20 : above,
        left: size ? Math.min(width - size.width - 8, Math.max(8, at.x - size.width / 2)) : 8,
        flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 5, borderRadius: 12, borderWidth: 1, borderColor: palette.rule,
        backgroundColor: palette.paper, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
      }}>
      {children}
    </View>
  );
  if (!overlay) return bar || null;
  return (
    <Modal visible={!!at} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.18)' }]} onPress={onClose} accessibilityLabel="أغلق" accessibilityRole="button" />
      {bar}
    </Modal>
  );
}
