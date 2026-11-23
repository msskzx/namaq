import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { QUIZ_LEAVES, type QuizTopic } from '@shared/quiz/settings';
import { DIFFICULTIES, DIFFICULTY_NAMES, DIFFICULTY_NOTES, type Difficulty } from '@shared/quiz/difficulty';
import Button, { Row } from '@/ui/Button';
import { type Palette } from '@/lib/theme';
import { CardWithRow } from '@/ui/Card';
import { SharedCard } from '@/ui/CardShare';
import type { Source } from '@/ui/sourceSlot';

/** A titled section in the home card's shape (owner 2026-11-20): its own buttons in the `row` under the card, its books (`source`) on the line under them. */
export function Section({ title, palette, row, source, share, children }: { title: string; palette: Palette; row?: React.ReactNode; source?: Source[];
  /** Shares the section as a picture (ui/CardShare SharedCard), under this head naming its page. */
  share?: { head: React.ReactNode };
  children: React.ReactNode }) {
  const content = <>
    <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
    {children}
  </>;
  return share
    ? <SharedCard palette={palette} gap={10} row={row} source={source} shareHead={share.head} shareLabel={`شارك ${title}`}>{content}</SharedCard>
    : <CardWithRow palette={palette} gap={10} row={row} source={source}>{content}</CardWithRow>;
}

/** How many leaves to type in each tree, 1 to 10. */
export function LeavesPicker({ value, onChange, palette }: { value: number; onChange: (value: number) => void; palette: Palette }) {
  return (
    <>
      <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'right', marginTop: 4 }}>عدد الإجابات في كل سؤال</Text>
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
