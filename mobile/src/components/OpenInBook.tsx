import { Pressable } from 'react-native';
import { BookOpenText } from 'lucide-react-native';
import type { ReaderBookId } from '@shared/bookReader';
import { openBookAt, openBookPage } from '@/lib/ways';
import type { Palette } from '@/lib/theme';

// see docs/plans/book-reader.md
export default function OpenInBook({ book, ayah, printed, onClose, palette }: { book: ReaderBookId; onClose?: () => void; palette: Palette } & ({ ayah: string; printed?: never } | { printed: string; ayah?: never })) {
  if (!onClose) return null;
  return (
    <Pressable onPress={() => { onClose(); if (printed) openBookPage(book, printed); else openBookAt(book, ayah!); }} accessibilityRole="link" accessibilityLabel="اقرأ في الكتاب" hitSlop={6}
      style={({ pressed }) => ({ width: 34, height: 30, borderRadius: 10, borderWidth: 1, borderColor: palette.accent, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
      <BookOpenText size={17} color={palette.accent} />
    </Pressable>
  );
}
