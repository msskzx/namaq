import { View } from 'react-native';
import { Text } from '@/components/Text';
import { num } from '@shared/quran/arabicNumber';
import { QUIZ_LEAVES, type QuizTopic } from '@shared/quiz/settings';
import { DIFFICULTIES, DIFFICULTY_NAMES, DIFFICULTY_NOTES, type Difficulty } from '@shared/quiz/difficulty';
import Button, { Row } from './Button';
import { CARD, type Palette } from '@/lib/theme';

export function Section({ title, palette, children }: { title: string; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 14, gap: 10 }}>
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      {children}
    </View>
  );
}

/** How many leaves to type in each tree, 1 to 10. */
export function LeavesPicker({ value, onChange, palette }: { value: number; onChange: (value: number) => void; palette: Palette }) {
  return (
    <>
      <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'right', marginTop: 4 }}>عدد الإجابات في كل شجرة</Text>
      <Row>
        {QUIZ_LEAVES.map(leaves => (
          <Button key={leaves} label={num(leaves)} active={value === leaves} onPress={() => onChange(leaves)} />
        ))}
      </Row>
    </>
  );
}

/** Easy, medium or hard (shared/quiz/difficulty.ts), with what it changes in each kind of question asked. */
export function DifficultyPicker({ value, onChange, palette, kinds = ['BRANCHES'] }: { value: Difficulty; onChange: (value: Difficulty) => void; palette: Palette; kinds?: QuizTopic[] }) {
  return (
    <>
      <Row>{DIFFICULTIES.map(level => <Button key={level} label={DIFFICULTY_NAMES[level]} active={value === level} onPress={() => onChange(level)} />)}</Row>
      {kinds.flatMap(kind => DIFFICULTY_NOTES[kind] ? [<Text key={kind} style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' }}>{DIFFICULTY_NOTES[kind]!.ar}</Text>] : [])}
    </>
  );
}
