import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';

export default function SettingRow({ Icon, title, value, children, palette, onFold }: {
  Icon: LucideIcon; title: string; value: string; children: ReactNode; palette: Palette; onFold?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => { onFold?.(!open); setOpen(!open); };
  return (
    <>
      <Tap onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${title}: ${value}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
        <Icon size={20} color={palette.accent} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{title}</Text>
          <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{value}</Text>
        </View>
        {open ? <ChevronUp size={18} color={palette.muted} /> : <ChevronDown size={18} color={palette.muted} />}
      </Tap>
      {open && children}
    </>
  );
}
