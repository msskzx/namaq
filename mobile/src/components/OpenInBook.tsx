import { Pressable } from 'react-native';
import { BookOpenText } from 'lucide-react-native';
import type { ReaderBookId } from '@shared/bookReader';
import { openBookAt } from '@/lib/ways';
import type { Palette } from '@/lib/theme';

/** A book sheet's way into the book itself: the book reader at its passage on the ayah (docs/plans/book-reader.md). */
/** Without `onClose` (inside a quiz, which leaving would end) there is no button. */
export default function OpenInBook({ book, ayah, onClose, palette }: { book: ReaderBookId; ayah: string; onClose?: () => void; palette: Palette }) {
  if (!onClose) return null;
  return (
    <Pressable onPress={() => { onClose(); openBookAt(book, ayah); }} accessibilityRole="link" accessibilityLabel="اقرأ في الكتاب" hitSlop={6}
      style={({ pressed }) => ({ width: 34, height: 30, borderRadius: 10, borderWidth: 1, borderColor: palette.accent, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
      <BookOpenText size={17} color={palette.accent} />
    </Pressable>
  );
}
