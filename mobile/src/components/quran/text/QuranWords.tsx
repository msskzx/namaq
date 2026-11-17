import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { QURAN_FONT } from '@/lib/theme';

/** Page words set on their own in the mushaf font (a word list's chip, a picked word): the module's one way to set it inline. */
export default function QuranWords({ children, style }: { children: ReactNode; style?: TextStyle }) {
  return <Text style={{ ...style, fontFamily: QURAN_FONT }}>{children}</Text>;
}
