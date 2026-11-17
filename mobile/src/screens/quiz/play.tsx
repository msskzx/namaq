import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, Eraser, Eye, LogOut, RotateCcw, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { emptyBranchAnswers } from '@shared/quiz/score';
import BackBar from '@/components/BackBar';
import Button, { Row } from '@/components/Button';
import QuestionSwipe from '@/components/QuestionSwipe';
import QuestionDots from '@/components/QuestionDots';
import { QuizFeedback, QuizInputs } from '@/components/QuizTree';
import { CompareFeedback, CompareInputs } from '@/components/QuizCompare';
import { surahNames } from '@/lib/branches';
import { check, cleanSolo, clearAnswers, goTo, hasTyped, isCompare, isTree, pick, questionState, reveal, setHints, showAnswer, soloScore, startSolo, submit, typeAnswer, type SoloRun } from '@/lib/quiz';
import QuizChoice, { QuizPrompt } from '@/components/QuizChoice';
import { readAyah } from '@/lib/openReader';
import { markForgotten } from '@shared/ayahMarks';
import { FORGOT, recited } from '@shared/quiz/choiceKinds';
import { useKeyboardShown } from '@/lib/keyboard';
import { setRun, useRun } from '@/lib/soloStore';
import { usePalette, type Palette } from '@/lib/theme';

const openAyat = (keys: string[]) => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } });

function Results({ run, palette }: { run: SoloRun; palette: Palette }) {
  const insets = useSafeAreaInsets();
  const { points, score, total, percent } = soloScore(run);
  const [review, setReview] = useState<number | null>(null);
  const states = run.questions.map((_, i) => questionState(run, i));
  if (review !== null) {
    const question = run.questions[review];
    return (
      <View style={{ flex: 1 }}>
        <QuestionDots states={states} current={review} onPick={setReview} palette={palette} />
        {isCompare(question) ? <>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', paddingHorizontal: 16 }}>
            {`${num(points[review].earned)} من ${num(points[review].total)} فراغات`}
          </Text>
          <CompareFeedback key={question.key} question={question} typed={run.typed[review]} palette={palette} hints={run.hints?.[review]} />
        </> : isTree(question) ? <>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', paddingHorizontal: 16 }}>
            {`${num(points[review].earned)} من ${num(points[review].total)} أطراف`}
          </Text>
          <QuizFeedback key={question.key} question={question} typed={run.checked[review] ? run.typed[review] : emptyBranchAnswers(question)} palette={palette} names={surahNames} onTap={openAyat} hints={run.hints?.[review]} />
        </> : <View style={{ flex: 1 }}>
          <QuizChoice key={question.key} question={question} picked={run.typed[review][0] ?? ''} shown palette={palette} onOpen={readAyah}
            header={<QuizPrompt text={question.promptArabic} palette={palette} />} />
        </View>}
        <View style={{ padding: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderColor: palette.rule }}>
          <Button label="العودة للنتيجة" onPress={() => setReview(null)} />
        </View>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 24 }}>
      <Text style={{ color: palette.ink, fontSize: 24, fontWeight: '700', textAlign: 'right' }}>{`النتيجة: ${num(score)} من ${num(total)} (${num(percent)}٪)`}</Text>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اضغط سؤالًا لتراجع إجابته.</Text>
      <QuestionDots states={states} current={-1} onPick={setReview} palette={palette} />
      <Row>
        <Button big variant="primary" Icon={RotateCcw} label="اختبار جديد" onPress={() => setRun(startSolo(cleanSolo(run.settings)))} />
        <Button big label="الإعدادات" onPress={() => { setRun(null); router.back(); }} />
      </Row>
    </ScrollView>
  );
}

/** A solo quiz in progress: the question strip, the tree to complete, and check / next at the bottom within thumb reach. */
export default function QuizPlay() {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const run = useRun();
  const typing = useKeyboardShown();
  if (!run || run.questions.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.paper }}>
        <BackBar />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
          <Text style={{ color: palette.muted, fontSize: 17, textAlign: 'center' }}>{run ? 'لا توجد أسئلة كافية لهذا الاختيار.' : 'لا يوجد اختبار مفتوح.'}</Text>
          <Button label="العودة للإعداد" onPress={() => { setRun(null); router.back(); }} />
        </View>
      </View>
    );
  }
  const { current } = run;
  const question = run.questions[current];
  const checked = run.checked[current];
  const last = current === run.questions.length - 1;
  const update = (next: SoloRun) => setRun(next);
  // The prompt scrolls away with the tree; the question circles sit in the top bar.
  const top = <QuizPrompt text={question.promptArabic} palette={palette} />;
  const dots = <QuestionDots inBar states={run.questions.map((_, i) => questionState(run, i))} current={current} onPick={i => update(goTo(run, i))} palette={palette} />;
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackBar title={run.submitted ? 'النتيجة' : undefined} middle={run.submitted ? undefined : dots}>
        <Button variant="plain" Icon={LogOut} accessibilityLabel="الخروج للإعدادات" onPress={() => { setRun(null); router.back(); }} />
      </BackBar>
      {run.submitted ? <Results run={run} palette={palette} /> : (
        <>
          <QuestionSwipe onNext={last ? undefined : () => update(goTo(run, current + 1))} onPrevious={current === 0 ? undefined : () => update(goTo(run, current - 1))}>
            {isCompare(question)
              ? checked
                ? <CompareFeedback key={question.key} question={question} typed={run.typed[current]} palette={palette} header={top} hints={run.hints?.[current]} />
                : <CompareInputs key={question.key} question={question} typed={run.typed[current]} onType={(blank, text) => update(typeAnswer(run, blank, text))} palette={palette} header={top}
                  hints={run.hints?.[current] ?? {}} onHints={hints => update(setHints(run, hints))} />
              : !isTree(question)
              ? <QuizChoice key={question.key} question={question} picked={run.typed[current][0]} shown={!!run.shown?.[current]} palette={palette} header={top} onOpen={readAyah}
                onReveal={() => update(reveal(run))}
                onPick={value => {
                  if (recited(question) && value === FORGOT && question.ayahKey) markForgotten(question.ayahKey);
                  update(pick(run, value));
                }} />
              : checked
              ? <QuizFeedback key={question.key} question={question} typed={run.typed[current]} palette={palette} names={surahNames} onTap={openAyat} header={top} hints={run.hints?.[current]} />
              : <QuizInputs key={question.key} question={question} typed={run.typed[current]} onType={(node, text) => update(typeAnswer(run, node, text))} palette={palette} names={surahNames} header={top}
                hints={run.hints?.[current] ?? {}} onHints={hints => update(setHints(run, hints))} />}
          </QuestionSwipe>
          {/* Check, next and the rest do not matter while typing, so they stay behind the keyboard. */}
          {!typing && <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: insets.bottom + 10, gap: 10, borderTopWidth: 1, borderColor: palette.rule }}>
            {!checked && (isTree(question) || isCompare(question)) && (
              <Row>
                <Button variant="primary" Icon={Check} label="تحقق" disabled={!hasTyped(run)} onPress={() => update(check(run))} />
                <Button Icon={Eraser} accessibilityLabel="مسح الإجابات" disabled={!hasTyped(run)} onPress={() => update(clearAnswers(run))} />
                <Button Icon={Eye} label="إظهار الإجابة" onPress={() => update(showAnswer(run))} />
              </Row>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button Icon={ArrowRight} accessibilityLabel="السابق" disabled={current === 0} onPress={() => update(goTo(run, current - 1))} />
              {last
                ? <Button variant="primary" Icon={Send} label="إرسال" onPress={() => update(submit(run))} />
                : <Button Icon={ArrowLeft} accessibilityLabel="التالي" onPress={() => update(goTo(run, current + 1))} />}
            </View>
          </View>}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

