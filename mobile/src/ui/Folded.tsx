import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

/**
 * A passage's credit under a rule at the foot of its card (the book and page), folded; a tap opens the edition and the
 * page's link. Also the list of ayat a balagha quote fits when its paragraph names none. The reader's book sheets share it (BalaghaSheet, GharibSheet); the website has src/components/common/Folded.tsx.
 */
export default function Folded({ credit, children, palette, extra, startOpen = false }: { credit: string; children: ReactNode; palette: Palette; extra?: ReactNode;
  /** Open at first (a story's recited ayat, owner 2026-11-18: shown, and folded at will). */
  startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <>
      <Tap onPress={() => setOpen(was => !was)} accessibilityRole="button" aria-expanded={open}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule, minHeight: 36 }}>
        {open ? <ChevronUp size={16} color={palette.muted} /> : <ChevronDown size={16} color={palette.muted} />}
        <Text style={{ flex: 1, color: palette.muted, fontSize: 14 }}>{credit}</Text>
        {extra}
      </Tap>
      {open && <View style={{ gap: 4 }}>{children}</View>}
    </>
  );
}
