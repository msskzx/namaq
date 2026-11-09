import { useMemo, type ReactNode } from 'react';
import { Modal, PanResponder, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePalette } from '@/lib/theme';

/** A bottom sheet: tap outside or drag the handle down to close it. */
export default function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const drag = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, move) => move.dy > 8 && Math.abs(move.dy) > Math.abs(move.dx),
    onPanResponderRelease: (_, move) => { if (move.dy > 50 || move.vy > 0.5) onClose(); },
  }), [onClose]);
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
        <Pressable onPress={onClose} accessibilityLabel="إغلاق" style={{ position: 'absolute', inset: 0, backgroundColor: '#0006' }} />
        <View style={{ maxHeight: '85%', backgroundColor: palette.paper, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: insets.bottom }}>
          <View {...drag.panHandlers} style={{ alignItems: 'center', paddingVertical: 10 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.rule }} />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
