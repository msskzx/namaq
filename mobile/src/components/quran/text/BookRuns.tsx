import type { TextStyle } from 'react-native';
import { Text } from '@/ui/Text';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import QuranWords from './QuranWords';

/** A book's own text with the Quran it quotes (﴿…﴾) in the mushaf font and `quran` colour: the exception of books (AGENTS.md, "Quran text"). */
export default function BookRuns({ text, quran, style }: { text: string; quran: string; style?: TextStyle }) {
  return (
    <Text selectable style={style}>
      {tafsirRuns(text).map((run, i) => (run.quran ? <QuranWords key={i} style={{ color: quran }}>{run.text}</QuranWords> : <Text key={i}>{run.text}</Text>))}
    </Text>
  );
}
