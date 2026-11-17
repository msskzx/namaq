import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/ui/Text';
import GlassBar from '@/ui/GlassBar';
import { usePalette } from '@/lib/theme';
import { useUnsaved } from '@/lib/storage';

const NOTICE = 'لم يُحفظ آخر تعديل على الجهاز، وسيُحفظ حين يتّسع المكان.';

/**
 * A short line at the top while the phone refuses to save an edit (its storage full, owner 2026-11-17). The edit stays on
 * screen and is saved again every half minute and when the app goes to the background; the line goes once it is saved.
 */
export default function SaveNotice() {
  const unsaved = useUnsaved();
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  if (!unsaved) return null;
  return (
    <GlassBar label={NOTICE} alert style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16 }}>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{NOTICE}</Text>
    </GlassBar>
  );
}
