import { useState } from 'react';
import Card from '@/ui/Card';
import { Pressable, ScrollView, View } from 'react-native';
import { BookOpen, Check, Eye, Square, SquareCheck, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import { alikeDiff, FORGOT, isRightChoice, orders, PICKS, picksOf, recited, RECITED, ticks, type ChoiceQuestion } from '@shared/quiz/choiceKinds';
import OrderRows from '@/ui/OrderRows';
import QuizPage from './QuizPage';
import QuranWords from './quran/text/QuranWords';
import BookRuns from './quran/text/BookRuns';
import TermChips from './TermSheet';
import QuizSources from './QuizSources';
import { LookButton, LookView } from './QuizLook';
import type { WriteAsk } from '@shared/quiz/score';
import type { PenRule } from '@shared/quran/writeAyah';
import { num } from '@shared/quran/arabicNumber';
import { CARD, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';

const AYAH_NUMBER = /^[٠-٩]+$/;

/** A question's own line over its choices: tall enough lines and room above for the marks of a vowelled verse (the Tuhfa's). */
export const QuizPrompt = ({ text, palette }: { text: string; palette: Palette }) =>
  <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 32, textAlign: 'right', paddingHorizontal: 16, paddingTop: 8 }}>{text}</Text>;

function Words({ words, marked, palette }: { words: string[]; marked?: number[]; palette: Palette }) {
  // A run of ayat carries each ayah's number between them, drawn as the end mark after the last one is.
  return <>{words.map((word, at) => <AyahWords key={at} look={marked?.includes(at) || AYAH_NUMBER.test(word) ? { color: palette.accent } : undefined}>{`${word}${at < words.length - 1 ? ' ' : ''}`}</AyahWords>)}</>;
}

/**
 * A choice question (shared/quiz/choiceKinds.ts): a book's passage it asks about, the ayah in the mushaf's font, or for a question asked on the page its whole
 * mushaf page (QuizPage, owner 2026-11-17), where what it asks to write is written in boxes and its grade picks حفظتها or نسيتها; a recited snippet's rest behind a button,
 * then the choices. Once picked, the right one turns green and a wrong one red; a wrong surah with a look-alike shows it,
 * the words where the two part marked in both. A question of several right choices (owner, 2026-11-19; sketch
 * titles-quiz/multi-select-dark.png) ticks boxes and checks: then what was ticked right is green, ticked wrong red, and a right
 * one left unticked is marked «فاتك»; `picked` is the ticks joined (PICKS). Choices to put in order are drawn by OrderRows.
 */
export default function QuizChoice({ question, picked, shown, onPick, onReveal, onOpen, header, palette, scroll = true, pen, onWrite, written, onLook, costs, lookTop, onTicks }: {
  question: ChoiceQuestion; picked?: string; shown: boolean; onPick?: (value: string) => void; onReveal?: () => void;
  /** A party's recited ayah (`question.write`): the host's pen rule, what was written sent with `onWrite`, and once revealed, what was `written` (null for nothing). */
  pen?: PenRule; onWrite?: (answer: string[], done: boolean) => void; written?: string[] | null;
  /** The mushaf button under the answer. A card leaves it out and puts it in its own button row (owner, 2026-11-15). */
  onOpen?: (key: string) => void;
  header?: React.ReactNode; palette: Palette;
  /** «ابحث عن الجواب» was opened (a party counts it); `costs` says under the button what it costs there. */
  onLook?: () => void; costs?: boolean;
  /** A party's ticks of several right choices, sent as a draft on each tick so the time running out grades them. */
  onTicks?: (answer: string) => void;
  /** Kept in sight above the looked-up view (a party's clock). */
  lookTop?: React.ReactNode;
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
  const several = ticks(question);
  // The ticks belong to their question: a screen that keeps this component for the next one starts it empty.
  const [tickState, setTickState] = useState<{ key: string; values: string[] }>({ key: question.key, values: [] });
  const ticked = tickState.key === question.key ? tickState.values : [];
  const joined = (values: string[]) => question.choices.map(choice => choice.value).filter(value => values.includes(value)).join(PICKS);
  const toggle = (value: string) => {
    const values = ticked.includes(value) ? ticked.filter(each => each !== value) : [...ticked, value];
    setTickState({ key: question.key, values });
    onTicks?.(joined(values));
  };
  const picks = several && answered ? picksOf(picked) : [];
  const alike = answered && !several && picked !== question.correctAnswer ? question.alike?.[picked] : undefined;
  const diff = alike && question.quran ? alikeDiff(question.quran, alike.words) : undefined;
  const name = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? '';
  return (
    <Box {...(scroll ? { contentContainerStyle: { paddingBottom: 24, gap: 12 } } : { style: { gap: 12 } })}>
      {header}
      {/* A book's text the question asks about («لأي آية هذا التفسير؟»), its quotes of the ayah hidden: plain text, no card in the card. */}
      {question.passage && (
        <BookRuns text={question.passage} quran={palette.accent} style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right', paddingHorizontal: 16 }} />
      )}
      {question.ayahKey && question.page ? (
        <View style={{ marginHorizontal: 16 }}>
          <QuizPage key={question.key} ayah={question.ayahKey} ask={question.page} palette={palette}
            shown={write ? written !== undefined : shown || answered || pageShown === question.key}
            party={write ? { pen: pen ?? 'whole', asked: write.asked, words: write.words, answer: written, onWrite: onWrite ?? (() => {}) } : undefined}
            onShown={() => { setPageShown(question.key); onReveal?.(); }}
            onWritten={!answered && onPick ? graded => onPick(graded.wrong.length ? FORGOT : RECITED) : undefined} />
        </View>
      ) : question.quran && (
        <Card palette={palette} pad={16} style={{ marginHorizontal: 16 }}>
          <AyahFlow color={palette.ink}>
            <Words words={question.quran} marked={diff?.a ?? question.marked} palette={palette} />
            {question.number !== undefined && <AyahWords look={{ color: palette.accent }}>{` ${num(question.number)}`}</AyahWords>}
            {question.reveal && (revealed ? <Text>{' '}<Words words={question.reveal} marked={question.reveal.map((_, at) => at)} palette={palette} /></Text> : ' …')}
          </AyahFlow>
        </Card>
      )}
      {!revealed && !onPage && onReveal && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button variant="primary" Icon={Eye} label="أظهر الآية" onPress={onReveal} /></View>}
      {/* Choices to put in order («رتّب السور»): dragged into place, then checked; a party's moves go as drafts. */}
      {orders(question) && <OrderRows key={question.key} question={question} picked={picked} palette={palette} onPick={answered ? undefined : onPick} onDraft={onTicks} />}
      {revealed && !write && !orders(question) && (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {question.choices.map(choice => {
            const chosen = several ? (answered ? picks : ticked).includes(choice.value) : choice.value === picked;
            const isRight = answered && isRightChoice(question, choice.value);
            const right = isRight && (!several || chosen);
            const wrong = answered && chosen && !isRight;
            // A right one left unticked: amber, «فاتك».
            const missed = several && isRight && !chosen;
            const color = right ? palette.green : wrong ? palette.accent : missed ? palette.amber : palette.ink;
            const Box = chosen ? SquareCheck : Square;
            return (
              <Pressable key={choice.value} disabled={answered || !onPick}
                onPress={() => (several ? toggle(choice.value) : onPick?.(choice.value))} accessibilityRole="button" accessibilityLabel={answered && question.explains?.[choice.value] ? `${choice.labelArabic} معنى ${question.explains[choice.value].quote}، ${question.explains[choice.value].where}`
                : answered && question.whereOf?.[choice.value] ? `${choice.labelArabic}، ${question.whereOf[choice.value]}` : choice.labelArabic}
                accessibilityState={several ? { checked: chosen, disabled: answered } : { selected: chosen, disabled: answered }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: right || wrong || missed ? 1.5 : 1, borderColor: right || wrong || missed ? color : palette.rule, borderStyle: missed ? 'dashed' : 'solid', ...CARD, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: pressed ? palette.paperDeep : 'transparent' })}>
                <View style={{ flexShrink: 1, flexGrow: question.quranChoices ? 1 : 0, gap: 2 }}>
                  {question.quranChoices
                    ? <AyahFlow color={color}><AyahWords>{choice.labelArabic}</AyahWords></AyahFlow>
                    : <Text style={{ color, fontSize: 19, fontWeight: right ? '700' : '400' }}>{choice.labelArabic}{missed ? ' · فاتك' : ''}</Text>}
                  {/* What a choice is, once answered: an ayah's place, a reading's readers. */}
                  {answered && question.whereOf?.[choice.value] && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{question.whereOf[choice.value]}</Text>}
                  {/* What a choice is, once answered («معنى «فراتا»، المرسلات ٢٧»). */}
                  {answered && question.explains?.[choice.value] && (
                    <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
                      {'معنى «'}<QuranWords>{question.explains[choice.value].quote}</QuranWords>{`»، ${question.explains[choice.value].where}`}
                    </Text>
                  )}
                </View>
                {several ? <Box size={22} color={chosen ? (answered ? color : palette.accent) : palette.rule} />
                  : right ? <Check size={20} color={color} /> : wrong ? <X size={20} color={color} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
      {several && !answered && onPick && (
        <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
          <Button variant="primary" Icon={Check} label="تحقق" disabled={ticked.length === 0}
            onPress={() => onPick(joined(ticked))} />
        </View>
      )}
      {!answered && revealed && question.look && onPick && <View style={{ paddingHorizontal: 16 }}><LookButton look={question.look} onLook={onLook} costs={costs} palette={palette} top={lookTop} /></View>}
      {answered && question.terms && <TermChips names={question.choices.map(choice => question.terms![choice.value]).filter(Boolean)} palette={palette} />}
      {alike && diff && (
        <View style={{ marginHorizontal: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: palette.rule, paddingTop: 10, gap: 4 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`آية ${name(picked!)} التي تشبهها، ${num(Number(alike.key.split(':')[1]))}`}</Text>
          <AyahFlow color={palette.ink}>
            <Words words={alike.words} marked={diff.b} palette={palette} />
          </AyahFlow>
        </View>
      )}
      {answered && question.note && (
        <View style={{ marginHorizontal: 16, gap: 2 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{question.note.label}</Text>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{question.note.text}</Text>
        </View>
      )}
      {/* Where the answer comes from, each book collapsed to its name (owner, 2026-11-19). */}
      {answered && !!question.sources?.length && <View style={{ paddingHorizontal: 16 }}><QuizSources sources={question.sources} palette={palette} /></View>}
      {/* After the answer, the view it was looked up in, the answer lit there, so everyone learns from it (owner, 2026-11-19). */}
      {answered && question.look && <View style={{ paddingHorizontal: 16 }}><LookView look={question.look} shown palette={palette} /></View>}
      {answered && question.ayahKey && onOpen && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button Icon={BookOpen} accessibilityLabel="في المصحف" onPress={() => onOpen(question.ayahKey!)} /></View>}
    </Box>
  );
}
