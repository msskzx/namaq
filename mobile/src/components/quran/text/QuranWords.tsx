import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';

export default function QuranWords({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={{ ...style, fontFamily: QURAN_FONT }}>{children}</Text>;
}
