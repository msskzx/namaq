import { Pressable, ScrollView, View } from 'react-native';
import { BookOpen, Check, Eye, X } from 'lucide-react-native';
import { Text } from '@/components/Text';
import Button from '@/components/Button';
import { alikeDiff, type ChoiceQuestion } from '@shared/quiz/choiceKinds';
import { num } from '@shared/quran/arabicNumber';
import { quranText } from '@/lib/quranText';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';

const SIZE = 24;

function Words({ words, marked, palette }: { words: string[]; marked?: number[]; palette: Palette }) {
  return <>{words.map((word, at) => <Text key={at} style={marked?.includes(at) ? { color: palette.accent } : undefined}>{quranText(word)}{at < words.length - 1 ? ' ' : ''}</Text>)}</>;
}

/**
 * A choice question (shared/quiz/choiceKinds.ts): the ayah in the mushaf's font, a recited snippet's rest behind a button,
 * then the choices. Once picked, the right one turns green and a wrong one red; a wrong surah with a look-alike shows it,
 * the words where the two part marked in both.
 */
export default function QuizChoice({ question, picked, shown, onPick, onReveal, onOpen, header, palette, scroll = true }: {
  question: ChoiceQuestion; picked?: string; shown: boolean; onPick?: (value: string) => void; onReveal?: () => void; onOpen: (key: string) => void;
  header?: React.ReactNode; palette: Palette;
  /** Inside a screen that already scrolls, it does not scroll on its own. */
  scroll?: boolean;
}) {
  const Box = scroll ? ScrollView : View;
  const answered = picked !== undefined;
  const revealed = shown || answered || !question.reveal;
  const alike = answered && picked !== question.correctAnswer ? question.alike?.[picked] : undefined;
  const diff = alike && question.quran ? alikeDiff(question.quran, alike.words) : undefined;
  const name = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? '';
  return (
    <Box {...(scroll ? { contentContainerStyle: { paddingBottom: 24, gap: 12 } } : { style: { gap: 12 } })}>
      {header}
      {question.quran && (
        <View style={{ marginHorizontal: 16, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, ...CARD, padding: 16 }}>
          <Text style={{ fontFamily: QURAN_FONT, fontSize: SIZE, lineHeight: SIZE * 1.9, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
            <Words words={question.quran} marked={diff?.a} palette={palette} />
            {question.reveal && (revealed ? <Text style={{ color: palette.accent }}>{' '}<Words words={question.reveal} palette={palette} /></Text> : ' …')}
          </Text>
        </View>
      )}
      {!revealed && onReveal && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button variant="primary" Icon={Eye} label="أظهر الآية" onPress={onReveal} /></View>}
      {revealed && (
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
      {answered && question.ayahKey && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button Icon={BookOpen} accessibilityLabel="في المصحف" onPress={() => onOpen(question.ayahKey!)} /></View>}
    </Box>
  );
}
