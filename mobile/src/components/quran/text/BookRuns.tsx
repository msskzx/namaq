import type { TextStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import QuranWords from './QuranWords';

export default function BookRuns({ text, quran, style, lines }: { text: string; quran: string; style?: TextStyle;
  lines?: number }) {
  return (
    <Text selectable={!lines} numberOfLines={lines} style={style}>
      {tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: quran }}>{run.text}</QuranWords> : <Text key={i}>{run.text}</Text>))}
    </Text>
  );
}
