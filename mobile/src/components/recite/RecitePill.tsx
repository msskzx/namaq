import type { StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronsLeft, Minimize2, PenLine, RotateCcw, Undo2, X, type LucideProps } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import GlassBar, { GLASS_BAR } from '@/ui/GlassBar';
import type { Palette } from '@/lib/theme';
import type { Recite } from './useRecite';

/** The bar's height. */
export const RECITE_BAR = GLASS_BAR;

type Icon = (props: LucideProps) => React.ReactNode;

/**
 * Recite mode's bar, the one every place recites with (owner, 2026-11-17): step back, the next word, the next ayah, the pen,
 * and in the mushaf the end of the recitation. See-through like the tab bar. A place leaves a button out by giving it no
 * handler (`onClose`), and says what the next-ayah button does once its ayat are done (`after`: the reader's next forgotten
 * ayah, or the next page) and whether there is anything after (`more`).
 */
export default function RecitePill({ recite, writing, onWriting, onClose, onRestart, after, more = false, lead, style, onFold, small = false }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  /** The mushaf's reset: the whole page hidden again, to recite it from its start once more (owner, 2026-11-20). */
  onRestart?: () => void;
  /** The small bar, sized to its buttons, so the card's own buttons fit beside it on one row (home's recall card, owner 2026-11-17). */
  small?: boolean;
  /** The reader's bar floats over the page (ui/FloatingBar): sized to its buttons, with a last button that folds it into a circle. */
  onFold?: () => void;
  after?: { Icon: Icon; label: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية' };
  const size = small ? 'small' : 'bar';
  return (
    // Floating, the bar hugs its buttons, each a full 44-point box side by side, so no touch between them is lost.
    <GlassBar label="أدوات التسميع" style={onFold ? { paddingHorizontal: 4 } : style} small={small}>
      {lead}
      {onRestart && <IconButton Icon={RotateCcw} label="أخفِ الصفحة وسمّع من أولها" size={size} tone="ink" onPress={onRestart} />}
      <IconButton Icon={Undo2} label="ارجع خطوة" size={size} tone="ink" disabled={recite.atStart} onPress={recite.back} />
      <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" size={size} tone="ink" disabled={recite.done} onPress={recite.nextWord} />
      {/* In a party the next ayah waits for everyone, and the pen is on for all (owner, 2026-11-17). */}
      {!recite.party && <IconButton Icon={next.Icon} label={next.label} size={size} tone="ink" disabled={ended && !more} onPress={recite.nextAyah} />}
      <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} size={size} tone="ink" on={writing} disabled={recite.party} onPress={onWriting} />
      {onClose && <IconButton Icon={X} label="إنهاء التسميع" size={size} tone="ink" onPress={onClose} />}
      {/* The far left, away from the buttons: fold the bar into a circle (owner, 2026-11-19). */}
      {onFold && <IconButton Icon={Minimize2} label="اطوِ الشريط في دائرة" size={size} onPress={onFold} />}
    </GlassBar>
  );
}
