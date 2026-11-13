import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideProps } from 'lucide-react-native';
import type { Palette } from '@/lib/theme';
import { buzz } from '@/lib/haptics';

export type MenuItem = { id: string; Icon: (props: LucideProps) => React.ReactNode; label: string; on?: boolean; onPress: () => void };
export type MenuAt = { x: number; y: number };

const BUTTON = 48;

/** A homepage card's tap: a row of icons over the card, like a chat app's reaction menu and the reader's ayah buttons. A touch outside closes it. */
export default function CardMenu({ at, items, label, onClose, palette }: { at: MenuAt | null; items: MenuItem[]; label: string; onClose: () => void; palette: Palette }) {
  const insets = useSafeAreaInsets();
  useEffect(() => { if (at) buzz(); }, [at]);
  const { width } = useWindowDimensions();
  const barWidth = items.length * BUTTON + 12;
  const above = at ? at.y - BUTTON - 28 : 0;
  return (
    <Modal visible={!!at} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      {/* A light dim, so the card under the menu reads as behind it. */}
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.18)' }]} onPress={onClose} accessibilityLabel="أغلق" accessibilityRole="button" />
      {at && (
          <View accessibilityRole="toolbar" accessibilityLabel={label}
            style={{ position: 'absolute', top: above < insets.top + 8 ? at.y + 20 : above, left: Math.min(width - barWidth - 8, Math.max(8, at.x - barWidth / 2)), flexDirection: 'row', gap: 0, padding: 6, borderRadius: 999, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paper, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 }}>
            {items.map(({ id, Icon, label: itemLabel, on, onPress }) => (
              <Pressable key={id} onPress={() => { onClose(); onPress(); }} accessibilityRole="button" accessibilityLabel={itemLabel} accessibilityState={{ selected: !!on }} hitSlop={4}
                style={({ pressed }) => ({ width: BUTTON, height: BUTTON, alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: on ? palette.accent : pressed ? palette.paperDeep : 'transparent' })}>
                <Icon size={24} color={on ? palette.onAccent : palette.ink} />
              </Pressable>
            ))}
          </View>
      )}
    </Modal>
  );
}
