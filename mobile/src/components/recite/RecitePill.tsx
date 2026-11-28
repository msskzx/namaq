import type { StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronsLeft, Minimize2, PenLine, RotateCcw, Undo2, X, type LucideProps } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import GlassBar, { GLASS_BAR } from '@/ui/GlassBar';
import type { Palette } from '@/lib/theme';
import type { Recite } from './useRecite';

export const RECITE_BAR = GLASS_BAR;

type Icon = (props: LucideProps) => React.ReactNode;

export default function RecitePill({ recite, writing, onWriting, onClose, onRestart, after, more = false, lead, style, onFold, small = false }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  onRestart?: () => void;
  small?: boolean;
  onFold?: () => void;
  after?: { Icon: Icon; label: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية' };
  const size = small ? 'small' : 'bar';
  return (
    <GlassBar label="أدوات التسميع" style={onFold ? { paddingHorizontal: 4 } : style} small={small}>
      {lead}
      {onRestart && <IconButton Icon={RotateCcw} label="أخفِ الصفحة وسمّع من أولها" size={size} tone="ink" onPress={onRestart} />}
      <IconButton Icon={Undo2} label="ارجع خطوة" size={size} tone="ink" disabled={recite.atStart} onPress={recite.back} />
      <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" size={size} tone="ink" disabled={recite.done} onPress={recite.nextWord} />
      {!recite.party && <IconButton Icon={next.Icon} label={next.label} size={size} tone="ink" disabled={ended && !more} onPress={recite.nextAyah} />}
      <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} size={size} tone="ink" on={writing} disabled={recite.party} onPress={onWriting} />
      {onClose && <IconButton Icon={X} label="إنهاء التسميع" size={size} tone="ink" onPress={onClose} />}
      {onFold && <IconButton Icon={Minimize2} label="اطوِ الشريط في دائرة" size={size} onPress={onFold} />}
    </GlassBar>
  );
}
