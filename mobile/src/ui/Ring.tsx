import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { Palette } from '@/lib/theme';

export default function Ring({ tone, size = 28, palette, children }: { tone?: string; size?: number; palette: Palette; children: ReactNode }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: tone ?? palette.rule, backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
}
