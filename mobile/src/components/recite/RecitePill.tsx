import type { StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronsLeft, PenLine, Undo2, X, type LucideProps } from 'lucide-react-native';
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
export default function RecitePill({ recite, writing, onWriting, onClose, after, more = false, lead, style, palette }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  after?: { Icon: Icon; label: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية' };
  return (
    <GlassBar label="أدوات التسميع" style={style}>
      {lead}
      <IconButton Icon={Undo2} label="ارجع خطوة" tone="ink" disabled={recite.atStart} onPress={recite.back} />
      <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" tone="ink" disabled={recite.done} onPress={recite.nextWord} />
      {/* In a party the next ayah waits for everyone, and the pen is on for all (owner, 2026-11-17). */}
      {!recite.party && <IconButton Icon={next.Icon} label={next.label} tone="ink" disabled={ended && !more} onPress={recite.nextAyah} />}
      <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} tone="ink" on={writing} disabled={recite.party} onPress={onWriting} />
      {onClose && <IconButton Icon={X} label="إنهاء التسميع" tone="ink" onPress={onClose} />}
    </GlassBar>
  );
}
