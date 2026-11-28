import { useEffect, useState } from 'react';
import { OutsideCard } from '@/ui/cardContext';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Palette } from '@/lib/theme';

export type MenuAt = { x: number; y: number };

export default function FloatingMenu({ at, label, onClose, overlay = false, top: clear, palette, groups, bubble = false, span = 0, children }: {
  at: MenuAt | null; label: string; onClose: () => void; overlay?: boolean;
  groups?: React.ReactNode[]; bubble?: boolean; span?: number;
  top?: number; palette: Palette; children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [measured, setMeasured] = useState<{ at: MenuAt; width: number; height: number } | null>(null);
  const size = measured && at && measured.at.x === at.x && measured.at.y === at.y ? measured : null;
  useEffect(() => { if (!at) setMeasured(null); }, [at]);
  if (!at && !overlay) return null;
  const gap = bubble ? 6 : 20;
  const above = at && size ? at.y - gap - size.height : 0;
  const top = (clear ?? insets.top) + 8;
  const place = !at || !size ? 0 : above >= top ? above : at.y + span + gap + size.height <= height - insets.bottom - 8 ? at.y + span + gap : top;
  const left = at && size ? Math.min(width - size.width - 8, Math.max(8, at.x - size.width / 2)) : 8;
  const tipDown = !!at && !!size && place < at.y;
  const tip = bubble && at && size && (
    <View pointerEvents="none" style={{ position: 'absolute', left: Math.min(size.width - 22, Math.max(10, at.x - left - 6)), width: 12, height: 12, backgroundColor: palette.paper,
      transform: [{ rotate: '45deg' }], borderColor: palette.accent, ...(tipDown ? { bottom: -7, borderRightWidth: 1, borderBottomWidth: 1 } : { top: -7, borderLeftWidth: 1, borderTopWidth: 1 }) }} />
  );
  const bar = at && (
    <View accessibilityRole="toolbar" accessibilityLabel={label} pointerEvents={size ? 'auto' : 'none'} accessibilityElementsHidden={!size} importantForAccessibility={size ? 'auto' : 'no-hide-descendants'} onLayout={event => setMeasured({ at, width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}
      style={{
        position: 'absolute', opacity: size ? 1 : 0, maxWidth: width - 16,
        top: size ? place : at.y + 20,
        left,
        padding: 5, gap: 4, borderRadius: bubble ? 36 : 12, borderWidth: 1, borderColor: bubble ? palette.accent : palette.rule,
        backgroundColor: palette.paper, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
      }}>
      {tip}
      {(groups ?? [children]).map((group, at) => (
        <View key={at} style={{ flexDirection: 'row', flexWrap: 'wrap', ...(at > 0 ? { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.rule, paddingTop: 4 } : {}) }}>{group}</View>
      ))}
    </View>
  );
  if (!overlay) return bar || null;
  return (
    <Modal visible={!!at} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.18)' }]} onPress={onClose} accessibilityLabel="أغلق" accessibilityRole="button" />
      <OutsideCard>{bar}</OutsideCard>
    </Modal>
  );
}
