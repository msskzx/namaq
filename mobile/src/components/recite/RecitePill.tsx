import type { StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft, ChevronsLeft, Minimize2, PenLine, RotateCcw, Undo2, X, type LucideProps } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import ActButton from '@/ui/ActButton';
import GlassBar from '@/ui/GlassBar';
import type { Palette } from '@/lib/theme';
import type { Recite } from './useRecite';

export const RECITE_BAR = 60;

type Icon = (props: LucideProps) => React.ReactNode;

function Control({ Icon, label, name, onPress, disabled, on, muted, small, palette }: {
  Icon: Icon; label: string; name: string; onPress: () => void; disabled?: boolean; on?: boolean; muted?: boolean; small: boolean; palette: Palette;
}) {
  return small
    ? <IconButton Icon={Icon} label={label} size="small" tone={muted ? 'muted' : 'ink'} on={on} disabled={disabled} onPress={onPress} />
    : <ActButton Icon={Icon} label={label} name={name} palette={palette} color={muted ? palette.muted : palette.ink} on={on} disabled={disabled} onPress={onPress} shrink />;
}

export default function RecitePill({ recite, writing, onWriting, onClose, onRestart, after, more = false, lead, style, onFold, small = false, palette }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  onRestart?: () => void;
  small?: boolean;
  onFold?: () => void;
  after?: { Icon: Icon; label: string; name: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية', name: 'آية' };
  const look = { small, palette };
  return (
    <GlassBar label="أدوات التسميع" style={[small ? null : { height: RECITE_BAR, paddingHorizontal: 4 }, style]} small={small}>
      {lead}
      <Control {...look} Icon={ChevronLeft} label="أظهر الكلمة التالية" name="كلمة" disabled={recite.done} onPress={recite.nextWord} />
      {!recite.party && <Control {...look} Icon={next.Icon} label={next.label} name={next.name} disabled={ended && !more} onPress={recite.nextAyah} />}
      <Control {...look} Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} name="القلم" on={writing} disabled={recite.party} onPress={onWriting} />
      <Control {...look} Icon={Undo2} label="ارجع خطوة" name="تراجع" disabled={recite.atStart} onPress={recite.back} />
      {onRestart && <Control {...look} Icon={RotateCcw} label="أخفِ الصفحة وسمّع من أولها" name="أعد الصفحة" onPress={onRestart} />}
      {onClose && <Control {...look} Icon={X} label="إنهاء التسميع" name="إنهاء" onPress={onClose} />}
      {onFold && <Control {...look} Icon={Minimize2} label="اطوِ الشريط في دائرة" name="اطوِ" muted onPress={onFold} />}
    </GlassBar>
  );
}
