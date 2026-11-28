import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export default function Saying({ by, palette, size = 14, center = false, children }: { by?: string; palette: Palette;
  size?: number;
  center?: boolean; children: React.ReactNode }) {
  return (
    <View style={{ gap: 2, alignItems: center ? 'center' : undefined }}>
      {by ? <Text style={{ color: palette.muted, fontSize: size, textAlign: center ? 'center' : 'right' }}>{by}</Text> : null}
      {children}
    </View>
  );
}
