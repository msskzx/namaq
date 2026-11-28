import { useState } from 'react';
import TapRow from '@/ui/TapRow';
import QuoteBar, { type QuotePiece } from '@/ui/QuoteBar';
import Card, { UnderCard, useCardRow } from '@/ui/Card';
import { Pressable, ScrollView, View } from 'react-native';
import { Check, ChevronDown, ChevronUp, Eye, Square, SquareCheck, X } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import { alikeDiff, BOX_ASKED, FORGOT, isRightChoice, orders, PICKS, picksOf, recited, RECITED, ticks, type ChoiceQuestion } from '@shared/quiz/choiceKinds';
import OrderTray from '@/ui/OrderTray';
import { SurahSheet } from './OrderSurah';
import Chip from '@/ui/Chip';
import QuizPage from './QuizPage';
import QuranWords from './quran/text/QuranWords';
import BookRuns from './quran/text/BookRuns';
import TermChips from './TermSheet';
import QuizSources from './QuizSources';
import { LookButton, PlaceButton } from './QuizLook';
import type { WriteAsk } from '@shared/quiz/score';
import type { PenRule } from '@shared/quran/writeAyah';
import { num } from '@shared/quran/arabicNumber';
import { CARD, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import { FEATURE_ICON } from '@/components/featureIcons';
import AtlasQuizMap from './battles/AtlasQuizMap';

const AYAH_NUMBER = /^[٠-٩]+$/;

const FOLD_OVER = 160;
const FOLD_LINES = 3;

export function QuizPrompt({ text, palette }: { text: string; palette: Palette }) {
  const cut = text.lastIndexOf('\n');
  const about = cut > 0 ? text.slice(0, cut) : '';
  const ask = cut > 0 ? text.slice(cut + 1) : text;
  const style = { color: palette.ink, fontSize: 16, lineHeight: 32, textAlign: 'right' as const };
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 6 }}>
      {about ? <Fold long={about.length > FOLD_OVER} palette={palette}>{lines => <Text numberOfLines={lines} style={{ ...style, fontSize: 18, lineHeight: 34 }}>{about}</Text>}</Fold> : null}
      <Text style={style}>{ask}</Text>
    </View>
  );
}

function Fold({ long, palette, children }: { long: boolean; palette: Palette; children: (lines?: number) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const Arrow = open ? ChevronUp : ChevronDown;
  return (
    <View style={{ gap: 2 }}>
      {children(long && !open ? FOLD_LINES : undefined)}
      {long ? (
        <TapRow onPress={() => setOpen(was => !was)} expanded={open} label={open ? 'اطوِ النص' : 'النص كاملًا'} style={{ alignItems: 'center', gap: 4, alignSelf: 'flex-start' }}>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{open ? 'اطوِ' : 'النص كاملًا'}</Text>
          <Arrow size={16} color={palette.muted} />
        </TapRow>
      ) : null}
    </View>
  );
}

function witnessPieces(text: string, lit?: string): QuotePiece[] {
  const at = lit ? text.indexOf(lit) : -1;
  return at < 0 ? [{ text: `«${text}»` }] : [{ text: `«${text.slice(0, at)}` }, { text: lit!, name: true }, { text: `${text.slice(at + lit!.length)}»` }];
}

const CHIP_LETTERS = 26;

function ayahWords(words: string[], palette: Palette, marked?: number[]) {
  return words.map((word, at) => <AyahWords key={at} look={marked?.includes(at) || AYAH_NUMBER.test(word) ? { color: palette.accent } : undefined}>{`${word}${at < words.length - 1 ? ' ' : ''}`}</AyahWords>);
}

export default function QuizChoice({ question, picked, shown, onPick, onReveal, onOpen, header, palette, scroll = true, pen, onWrite, written, onLook, costs, lookTop, onTicks }: {
  question: ChoiceQuestion; picked?: string; shown: boolean; onPick?: (value: string) => void; onReveal?: () => void;
  pen?: PenRule; onWrite?: (answer: string[], done: boolean) => void; written?: string[] | null;
  onOpen?: (key: string) => void;
  header?: React.ReactNode; palette: Palette;
  onLook?: () => void; costs?: boolean;
  onTicks?: (answer: string) => void;
  lookTop?: React.ReactNode;
  scroll?: boolean;
}) {
  const Box = scroll ? ScrollView : View;
  const answered = picked !== undefined;
  const inRow = useCardRow();
  const [pageShown, setPageShown] = useState<string | null>(null);
  const onPage = !!question.ayahKey && !!question.page;
  const write = (question as ChoiceQuestion & { write?: WriteAsk }).write;
  const revealed = shown || answered || !recited(question) || pageShown === question.key;
  const several = ticks(question);
  const single = !several && !recited(question) && !orders(question);
  const [tickState, setTickState] = useState<{ key: string; values: string[] }>({ key: question.key, values: [] });
  const ticked = tickState.key === question.key ? tickState.values : [];
  const joined = (values: string[]) => question.choices.map(choice => choice.value).filter(value => values.includes(value)).join(PICKS);
  const toggle = (value: string) => {
    const values = ticked.includes(value) ? ticked.filter(each => each !== value) : [...ticked, value];
    setTickState({ key: question.key, values });
    onTicks?.(joined(values));
  };
  const select = (value: string) => {
    setTickState({ key: question.key, values: [value] });
    onTicks?.(value);
  };
  const picks = several && answered ? picksOf(picked) : [];
  const chipped = single && !question.quranChoices && !question.explains && question.choices.every(choice => choice.labelArabic.length <= CHIP_LETTERS);
  const alike = answered && !several && picked !== question.correctAnswer ? question.alike?.[picked] : undefined;
  const diff = alike && question.quran ? alikeDiff(question.quran, alike.words) : undefined;
  const name = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? '';
  const [card, setCard] = useState<number | null>(null);
  if (orders(question)) return (
    <View style={{ flex: scroll ? 1 : undefined, paddingBottom: scroll ? 0 : 12 }}>
      <OrderTray key={question.key} question={question} picked={picked} palette={palette} pinned={scroll}
        onPick={answered ? undefined : onPick} onDraft={onTicks}
        onLook={answered ? undefined : surah => { setCard(surah); onLook?.(); }} onBox={answered ? setCard : undefined}
        header={<>{header}</>}
        footer={answered && !!question.sources?.length ? <QuizSources sources={question.sources} palette={palette} /> : undefined} />
      <SurahSheet surah={card} onClose={() => setCard(null)} palette={palette} top={lookTop} />
    </View>
  );
  return (
    <Box {...(scroll ? { contentContainerStyle: { paddingBottom: 24, gap: 12 } } : { style: { gap: 12 } })}>
      {header}
      {question.passage && (
        <View style={{ paddingHorizontal: 16 }}>
          <Fold long={question.passage.length > FOLD_OVER} palette={palette}>
            {lines => <BookRuns text={question.passage!} quran={palette.accent} lines={lines} style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right' }} />}
          </Fold>
        </View>
      )}
      {question.boxes && (
        <View accessibilityLabel="النسب" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, paddingHorizontal: 16 }}>
          {question.boxes.map((box, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {i > 0 && <Text style={{ color: palette.muted, fontSize: 15 }}>←</Text>}
              {box === BOX_ASKED
                ? <Chip role="text" label={answered ? name(question.correctAnswer) : box} on={answered} lit dashed={!answered} palette={palette} />
                : <Chip role="text" label={box} on={false} palette={palette} />}
            </View>
          ))}
        </View>
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
          <AyahFlow color={palette.ink} menu={answered && question.ayahKey ? question.ayahKey : false}>
            {ayahWords(question.quran, palette, diff?.a ?? question.marked)}
            {question.number !== undefined && <AyahWords look={{ color: palette.accent }}>{` ${num(question.number)}`}</AyahWords>}
            {question.reveal && (revealed ? [' ', ...ayahWords(question.reveal, palette, question.reveal.map((_, at) => at))] : ' …')}
          </AyahFlow>
        </Card>
      )}
      {!revealed && !onPage && onReveal && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button variant="primary" Icon={Eye} label="أظهر الآية" onPress={onReveal} /></View>}
      {question.map && (
        <AtlasQuizMap layer={question.map.layer} choices={question.choices.map(choice => choice.value)} right={answered ? question.correctAnswer : undefined}
          picked={answered ? picked : ticked[0]} onPick={answered || !onPick ? undefined : select} palette={palette} />
      )}
      {revealed && !write && !orders(question) && !question.map && (
        <View style={chipped ? { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 } : { paddingHorizontal: 16, gap: 10 }}>
          {question.choices.map(choice => {
            const chosen = several ? (answered ? picks : ticked).includes(choice.value) : choice.value === picked;
            const selected = single && !answered && ticked.includes(choice.value);
            const isRight = answered && isRightChoice(question, choice.value);
            const right = isRight && (!several || chosen);
            const wrong = answered && chosen && !isRight;
            const missed = several && isRight && !chosen;
            const color = right ? palette.green : wrong ? palette.accent : missed ? palette.amber : palette.ink;
            const Box = chosen ? SquareCheck : Square;
            return (
              <Pressable key={choice.value} disabled={answered || !onPick}
                onPress={() => (several ? toggle(choice.value) : single ? select(choice.value) : onPick?.(choice.value))} accessibilityRole="button" accessibilityLabel={answered && question.explains?.[choice.value] ? `${choice.labelArabic} معنى ${question.explains[choice.value].quote}، ${question.explains[choice.value].where}`
                : answered && question.whereOf?.[choice.value] ? `${choice.labelArabic}، ${question.whereOf[choice.value]}` : choice.labelArabic}
                accessibilityState={several ? { checked: chosen, disabled: answered } : { selected: chosen || selected, disabled: answered }}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: chipped ? 6 : 0, borderWidth: right || wrong || missed || selected ? 1.5 : 1, borderColor: right || wrong || missed ? color : selected ? palette.accent : palette.rule, borderStyle: missed ? 'dashed' : 'solid',
                  ...(chipped ? { borderRadius: 999, minHeight: 44, paddingHorizontal: 16 } : { ...CARD, paddingVertical: 12, paddingHorizontal: 16 }), backgroundColor: pressed || selected ? palette.paperDeep : 'transparent' })}>
                <View style={{ flexShrink: 1, flexGrow: question.quranChoices ? 1 : 0, gap: 2 }}>
                  {question.quranChoices
                    ? <AyahFlow color={color} menu={false}><AyahWords>{choice.labelArabic}</AyahWords></AyahFlow>
                    : <Text style={{ color, fontSize: chipped ? 17 : 19, fontWeight: right ? '700' : '400' }}>{choice.labelArabic}{missed ? ' · فاتك' : ''}</Text>}
                  {answered && !chipped && question.whereOf?.[choice.value] && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{question.whereOf[choice.value]}</Text>}
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
      {answered && chipped && question.whereOf && (
        <View style={{ paddingHorizontal: 16, gap: 2 }}>
          {question.choices.filter(choice => question.whereOf![choice.value]).map(choice => (
            <Text key={choice.value} style={{ color: palette.muted, fontSize: 14, lineHeight: 22, textAlign: 'right' }}>
              <Text style={{ color: isRightChoice(question, choice.value) ? palette.green : palette.ink }}>{choice.labelArabic}</Text>{`: ${question.whereOf![choice.value]}`}
            </Text>
          ))}
        </View>
      )}
      {answered && question.witness && (
        <View style={{ marginHorizontal: 16, borderTopWidth: 1, borderColor: `${palette.rule}66`, paddingTop: 10, gap: 6 }}>
          <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>الشاهد</Text>
          <QuoteBar by={question.witness.by} pieces={witnessPieces(question.witness.text, question.witness.lit)} size={16} palette={palette} />
        </View>
      )}
      {(several || single) && !answered && onPick && (inRow
        ? <UnderCard><Button variant="primary" pill Icon={Check} label="تحقق" onPress={() => onPick(several ? joined(ticked) : ticked[0] ?? '')} /></UnderCard>
        : <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}>
          <Button variant="primary" Icon={Check} label="تحقق"
            onPress={() => onPick(several ? joined(ticked) : ticked[0] ?? '')} />
        </View>
      )}
      {!answered && revealed && question.look && onPick && <View style={{ paddingHorizontal: 16 }}><LookButton look={question.look} onLook={onLook} costs={costs} palette={palette} top={lookTop} /></View>}
      {answered && question.terms && <TermChips names={question.choices.map(choice => question.terms![choice.value]).filter(Boolean)} palette={palette} />}
      {alike && diff && (
        <View style={{ marginHorizontal: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: palette.rule, paddingTop: 10, gap: 4 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`آية ${name(picked!)} التي تشبهها، ${num(Number(alike.key.split(':')[1]))}`}</Text>
          <AyahFlow color={palette.ink} menu={alike.key}>
            {ayahWords(alike.words, palette, diff.b)}
          </AyahFlow>
        </View>
      )}
      {answered && question.note && (
        <View style={{ marginHorizontal: 16, gap: 2 }}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{question.note.label}</Text>
          <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{question.note.text}</Text>
        </View>
      )}
      {answered && !!question.sources?.length && <View style={{ paddingHorizontal: 16 }}><QuizSources sources={question.sources} palette={palette} /></View>}
      {answered && question.look && <View style={{ paddingHorizontal: 16 }}><PlaceButton look={question.look} palette={palette} /></View>}
      {answered && question.ayahKey && onOpen && <View style={{ paddingHorizontal: 16, alignItems: 'flex-start' }}><Button Icon={FEATURE_ICON.mushaf} accessibilityLabel="في المصحف" onPress={() => onOpen(question.ayahKey!)} /></View>}
    </Box>
  );
}
