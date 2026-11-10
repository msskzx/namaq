import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { QUIZ_LENGTHS } from '@shared/quiz/settings';
import BackBar from '@/components/BackBar';
import Button, { Row } from '@/components/Button';
import LoadingDots from '@/components/LoadingDots';
import QuizExplainer from '@/components/QuizExplainer';
import { JuzInput, LeavesPicker, Section } from '@/components/QuizForm';
import { cleanSolo, startSolo, type SoloSettings } from '@/lib/quiz';
import { readSettings, setRun, useRun, writeSettings } from '@/lib/soloStore';
import { usePalette } from '@/lib/theme';

/** The solo quiz setup: juz range, how many leaves to type per tree, how many questions. */
export default function SoloSetup() {
  const palette = usePalette();
  const [settings, setSettings] = useState<SoloSettings>(readSettings);
  const [building, setBuilding] = useState(false);
  const unfinished = useRun();
  const change = (next: Partial<SoloSettings>) => {
    const clean = cleanSolo({ ...settings, ...next });
    setSettings(clean);
    writeSettings(clean);
  };
  const juz = (key: 'juzFrom' | 'juzTo', value: number) => {
    // Moving one end past the other moves both, as on the website.
    const other = key === 'juzFrom' ? settings.juzTo : settings.juzFrom;
    const crossed = key === 'juzFrom' ? value > other : value < other;
    change({ [key]: value, ...(crossed && { [key === 'juzFrom' ? 'juzTo' : 'juzFrom']: value }) });
  };
  const start = () => {
    setBuilding(true);
    // Building the trees of a narrow juz range takes a moment; the loader shows first.
    requestAnimationFrame(() => setTimeout(() => {
      setRun(startSolo(settings));
      setBuilding(false);
      router.push('/quiz/play');
    }, 0));
  };
  const resumable = unfinished && !unfinished.submitted && unfinished.questions.length > 0 ? unfinished : null;

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <BackBar title="اختبار فردي" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {resumable && (
          <View style={{ borderWidth: 1, borderColor: palette.accent, borderRadius: 14, padding: 14, gap: 10 }}>
            <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>
              {`لديك اختبار لم تُنهه، وصلت فيه إلى السؤال ${num(resumable.current + 1)} من ${num(resumable.questions.length)}.`}
            </Text>
            <Row>
              <Button variant="primary" Icon={ArrowLeft} label="أكمله" onPress={() => router.push('/quiz/play')} />
              <Button label="اتركه" onPress={() => setRun(null)} />
            </Row>
          </View>
        )}
        <Section title="متشابهات القرآن" palette={palette}>
          <Row gap={16}>
            <JuzInput label="من الجزء" value={settings.juzFrom} onCommit={value => juz('juzFrom', value)} palette={palette} />
            <JuzInput label="إلى الجزء" value={settings.juzTo} onCommit={value => juz('juzTo', value)} palette={palette} />
          </Row>
          <LeavesPicker value={settings.leaves} onChange={leaves => change({ leaves })} palette={palette} />
          <QuizExplainer leaves={settings.leaves} palette={palette} />
        </Section>
        <Section title="عدد الأسئلة" palette={palette}>
          <Row>
            {QUIZ_LENGTHS.map(value => <Button key={value} label={num(value)} active={settings.length === value} onPress={() => change({ length: value })} />)}
          </Row>
        </Section>
        <View style={{ alignItems: 'flex-start', minHeight: 50, justifyContent: 'center' }}>
          {building ? <LoadingDots /> : <Button big variant="primary" Icon={Play} label="ابدأ الاختبار" onPress={start} />}
        </View>
      </ScrollView>
    </View>
  );
}

