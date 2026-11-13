import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, CircleCheck, CircleX, Eraser, Eye, LogOut, RotateCcw, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { emptyBranchAnswers } from '@shared/quiz/score';
import BackBar from '@/components/BackBar';
import Button, { Row } from '@/components/Button';
import QuestionDots from '@/components/QuestionDots';
import { QuizFeedback, QuizInputs } from '@/components/QuizTree';
import { surahNames } from '@/lib/branches';
import { check, cleanSolo, clearAnswers, goTo, hasTyped, questionState, setHints, showAnswer, soloScore, startSolo, submit, typeAnswer, type SoloRun } from '@/lib/quiz';
import { useKeyboardShown } from '@/lib/keyboard';
import { setRun, useRun } from '@/lib/soloStore';
import { usePalette, type Palette } from '@/lib/theme';

const openAyat = (keys: string[]) => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } });

function Results({ run, palette }: { run: SoloRun; palette: Palette }) {
  const insets = useSafeAreaInsets();
  const { points, score, total, percent, passed } = soloScore(run);
  const [review, setReview] = useState<number | null>(null);
  const states = run.questions.map((_, i) => questionState(run, i));
  if (review !== null) {
    const question = run.questions[review];
    return (
      <View style={{ flex: 1 }}>
        <QuestionDots states={states} current={review} onPick={setReview} palette={palette} />
        <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', paddingHorizontal: 16 }}>
          {`${num(points[review].earned)} من ${num(points[review].total)} أطراف`}
        </Text>
        <QuizFeedback key={question.key} question={question} typed={run.checked[review] ? run.typed[review] : emptyBranchAnswers(question)} palette={palette} names={surahNames} onTap={openAyat} hints={run.hints?.[review]} />
        <View style={{ padding: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderColor: palette.rule }}>
          <Button label="العودة للنتيجة" onPress={() => setReview(null)} />
        </View>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: insets.bottom + 24 }}>
      <Text style={{ color: palette.ink, fontSize: 24, fontWeight: '700', textAlign: 'right' }}>{`النتيجة: ${num(score)} من ${num(total)} (${num(percent)}٪)`}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {passed ? <CircleCheck size={22} color={palette.green} /> : <CircleX size={22} color={palette.accent} />}
        <Text style={{ color: passed ? palette.green : palette.accent, fontSize: 18, fontWeight: '600' }}>{passed ? 'ناجح' : 'راسب'}</Text>
      </View>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اضغط سؤالًا لتراجع إجابته في الشجرة.</Text>
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
  // The question strip and prompt scroll away with the tree.
  const top = (
    <>
      <QuestionDots states={run.questions.map((_, i) => questionState(run, i))} current={current} onPick={i => update(goTo(run, i))} palette={palette} />
      <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 24, textAlign: 'right', paddingHorizontal: 16 }}>{question.promptArabic}</Text>
    </>
  );
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackBar title={run.submitted ? 'النتيجة' : `السؤال ${num(current + 1)} من ${num(run.questions.length)}`}>
        <Button variant="plain" Icon={LogOut} accessibilityLabel="الخروج للإعدادات" onPress={() => { setRun(null); router.back(); }} />
      </BackBar>
      {run.submitted ? <Results run={run} palette={palette} /> : (
        <>
          <View style={{ flex: 1 }}>
            {checked
              ? <QuizFeedback key={question.key} question={question} typed={run.typed[current]} palette={palette} names={surahNames} onTap={openAyat} header={top} hints={run.hints?.[current]} />
              : <QuizInputs key={question.key} question={question} typed={run.typed[current]} onType={(node, text) => update(typeAnswer(run, node, text))} palette={palette} names={surahNames} header={top}
                hints={run.hints?.[current] ?? {}} onHints={hints => update(setHints(run, hints))} />}
          </View>
          {/* Check, next and the rest do not matter while typing, so they stay behind the keyboard. */}
          {!typing && <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: insets.bottom + 10, gap: 10, borderTopWidth: 1, borderColor: palette.rule }}>
            {!checked && (
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

export { ErrorBoundary } from '@/components/CrashScreen';
