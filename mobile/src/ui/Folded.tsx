import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

export default function Folded({ credit, children, palette, extra, startOpen = false, openCredit, bare = false }: { credit: string; children: ReactNode; palette: Palette; extra?: ReactNode;
  bare?: boolean;
  startOpen?: boolean;
  openCredit?: string }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <>
      <Tap onPress={() => setOpen(was => !was)} accessibilityRole="button" aria-expanded={open}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, ...(bare ? {} : { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule }) }}>
        {open ? <ChevronUp size={16} color={palette.muted} /> : <ChevronDown size={16} color={palette.muted} />}
        <Text style={{ flex: 1, color: palette.muted, fontSize: 14 }}>{open && openCredit ? openCredit : credit}</Text>
        {extra}
      </Tap>
      {open && <View style={{ gap: 4 }}>{children}</View>}
    </>
  );
}
