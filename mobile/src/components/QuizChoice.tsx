import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BookOpen, Check, Eye, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import { alikeDiff, FORGOT, recited, RECITED, type ChoiceQuestion } from '@shared/quiz/choiceKinds';
import QuizPage from './QuizPage';
import type { WriteAsk } from '@shared/quiz/score';
import type { PenRule } from '@shared/quran/writeAyah';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';

const SIZE = 24;

/** A question's own line over its choices: tall enough lines and room above for the marks of a vowelled verse (the Tuhfa's). */
export const QuizPrompt = ({ text, palette }: { text: string; palette: Palette }) =>
  <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 32, textAlign: 'right', paddingHorizontal: 16, paddingTop: 8 }}>{text}</Text>;

function Words({ words, marked, palette }: { words: string[]; marked?: number[]; palette: Palette }) {
  return <>{words.map((word, at) => <Text key={at} style={marked?.includes(at) ? { color: palette.accent } : undefined}>{quranText(word)}{at < words.length - 1 ? ' ' : ''}</Text>)}</>;
}

/**
 * A choice question (shared/quiz/choiceKinds.ts): the ayah in the mushaf's font, or for a question asked on the page its whole
 * mushaf page (QuizPage, owner 2026-11-17), where what it asks to write is written in boxes and its grade picks حفظتها or نسيتها; a recited snippet's rest behind a button,
 * then the choices. Once picked, the right one turns green and a wrong one red; a wrong surah with a look-alike shows it,
 * the words where the two part marked in both.
 */
export default function QuizChoice({ question, picked, shown, onPick, onReveal, onOpen, header, palette, scroll = true, pen, onWrite, written }: {
  question: ChoiceQuestion; picked?: string; shown: boolean; onPick?: (value: string) => void; onReveal?: () => void;
  /** A party's recited ayah (`question.write`): the host's pen rule, what was written sent with `onWrite`, and once revealed, what was `written` (null for nothing). */
  pen?: PenRule; onWrite?: (answer: string[], done: boolean) => void; written?: string[] | null;
  /** The mushaf button under the answer. A card leaves it out and puts it in its own button row (owner, 2026-11-15). */
  onOpen?: (key: string) => void;
  header?: React.ReactNode; palette: Palette;
  /** Inside a screen that already scrolls, it does not scroll on its own. */
  scroll?: boolean;
}) {
  const Box = scroll ? ScrollView : View;
  const answered = picked !== undefined;
  // What is recited or written stays hidden until it is shown or answered; on the page, recite mode's bar shows it.
  const [pageShown, setPageShown] = useState<string | null>(null);
  const onPage = !!question.ayahKey && !!question.page;
  // A party grades a recited ayah by the words written, so it has no choices to pick.
  const write = (question as ChoiceQuestion & { write?: WriteAsk }).write;
  const revealed = shown || answered || !recited(question) || pageShown === question.key;
  const alike = answered && picked !== question.correctAnswer ? question.alike?.[picked] : undefined;
  const diff = alike && question.quran ? alikeDiff(question.quran, alike.words) : undefined;
  const name = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? '';
  return (
    <Box {...(scroll ? { contentContainerStyle: { paddingBottom: 24, gap: 12 } } : { style: { gap: 12 } })}>
      {header}
      {question.ayahKey && question.page ? (
        <View style={{ marginHorizontal: 16 }}>
          <QuizPage key={question.key} ayah={question.ayahKey} ask={question.page} palette={palette}
            shown={write ? written !== undefined : shown || answered || pageShown === question.key}
            party={write ? { pen: pen ?? 'whole', asked: write.asked, words: write.words, answer: written, onWrite: onWrite ?? (() => {}) } : undefined}
            onShown={() => { setPageShown(question.key); onReveal?.(); }}
            onWritten={!answered && onPick ? graded => onPick(graded.wrong.length ? FORGOT : RECITED) : undefined} />
        </View>
      ) : question.quran && (
        <View style={{ marginHorizontal: 16, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 16 }}>
          <Text style={{ fontFamily: QURAN_FONT, fontSize: SIZE, lineHeight: SIZE * 1.9, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
            <Words words={question.quran} marked={diff?.a} palette={palette} />
            {question.number !== undefined && <Text style={{ color: palette.accent }}>{' '}{num(question.number)}</Text>}
            {question.reveal && (revealed ? <Text style={{ color: palette.accent }}>{' '}<Words words={question.reveal} palette={palette} /></Text> : ' …')}
          </Text>
        </View>
      )}
      {!revealed && !onPage && onReveal && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button variant="primary" Icon={Eye} label="أظهر الآية" onPress={onReveal} /></View>}
      {revealed && !write && (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {question.choices.map(choice => {
            const right = answered && choice.value === question.correctAnswer;
            const wrong = answered && choice.value === picked && !right;
            const color = right ? palette.green : wrong ? palette.accent : palette.ink;
            return (
              <Pressable key={choice.value} disabled={answered || !onPick} onPress={() => onPick?.(choice.value)} accessibilityRole="button" accessibilityLabel={choice.labelArabic}
                accessibilityState={{ selected: choice.value === picked, disabled: answered }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: right || wrong ? 1.5 : 1, borderColor: right || wrong ? color : palette.rule, ...CARD, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: pressed ? palette.paperDeep : 'transparent' })}>
                <Text style={{ color, fontSize: 19, fontWeight: right ? '700' : '400' }}>{choice.labelArabic}</Text>
                {right ? <Check size={20} color={color} /> : wrong ? <X size={20} color={color} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
      {alike && diff && (
        <View style={{ marginHorizontal: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: palette.rule, paddingTop: 10, gap: 4 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`آية ${name(picked!)} التي تشبهها، ${num(Number(alike.key.split(':')[1]))}`}</Text>
          <Text style={{ fontFamily: QURAN_FONT, fontSize: SIZE - 3, lineHeight: (SIZE - 3) * 1.9, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
            <Words words={alike.words} marked={diff.b} palette={palette} />
          </Text>
        </View>
      )}
      {answered && question.note && (
        <View style={{ marginHorizontal: 16, gap: 2 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{question.note.label}</Text>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{question.note.text}</Text>
        </View>
      )}
      {answered && question.ayahKey && onOpen && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button Icon={BookOpen} accessibilityLabel="في المصحف" onPress={() => onOpen(question.ayahKey!)} /></View>}
    </Box>
  );
}
