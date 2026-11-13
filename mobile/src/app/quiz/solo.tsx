import { useState, useSyncExternalStore } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { router } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import BackBar from '@/components/BackBar';
import Button, { Row } from '@/components/Button';
import LoadingDots from '@/components/LoadingDots';
import QuizExplainer from '@/components/QuizExplainer';
import { LeavesPicker, Section } from '@/components/QuizForm';
import { FilterFields } from '@/components/FilterFields';
import { applyDraft, draftOf, EMPTY_LIST, type FilterDraft } from '@/lib/branchList';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { availability, cleanSolo, startSolo, type SoloSettings } from '@/lib/quiz';
import { readSettings, setRun, useRun, writeSettings } from '@/lib/soloStore';
import { usePalette, CARD } from '@/lib/theme';

/** The solo quiz setup: which trees (the branches tab's filters), how many leaves to type per tree, how many questions. */
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
  // The branches tab's filter fields; a range still being picked keeps the last whole one.
  const [draft, setDraftState] = useState<FilterDraft>(() => draftOf({ ...EMPTY_LIST, ...settings.list }));
  const setDraft = (next: FilterDraft) => {
    setDraftState(next);
    const applied = applyDraft(next);
    if (applied) change({ list: { filters: applied.filters, range: applied.range, saved: applied.saved } });
  };
  useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const { available, lengths } = availability(settings.list);
  // A length the range cannot fill gives way to the first one it can, as on the website.
  const length = lengths.includes(settings.length as never) ? settings.length : lengths[0];
  const start = () => {
    setBuilding(true);
    // Building the trees of a narrow juz range takes a moment; the loader shows first.
    requestAnimationFrame(() => setTimeout(() => {
      setRun(startSolo({ ...settings, length }));
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
          <View style={{ borderWidth: 1, borderColor: palette.accent, ...CARD, padding: 14, gap: 10 }}>
            <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>
              {`لديك اختبار لم تُنهه، وصلت فيه إلى السؤال ${num(resumable.current + 1)} من ${num(resumable.questions.length)}.`}
            </Text>
            <Row>
              <Button variant="primary" Icon={ArrowLeft} label="أكمله" onPress={() => router.push('/quiz/play')} />
              <Button label="اتركه" onPress={() => setRun(null)} />
            </Row>
          </View>
        )}
        <Section title="الأشجار" palette={palette}>
          <FilterFields draft={draft} setDraft={setDraft} palette={palette} sort={false} />
        </Section>
        <Section title="الإجابات" palette={palette}>
          <LeavesPicker value={settings.leaves} onChange={leaves => change({ leaves })} palette={palette} />
          <QuizExplainer leaves={settings.leaves} palette={palette} />
        </Section>
        <Section title="عدد الأسئلة" palette={palette}>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`${num(available)} سؤالًا متاحًا`}</Text>
          {lengths.length > 0
            ? <Row>{lengths.map(value => <Button key={value} label={num(value)} active={length === value} onPress={() => change({ length: value })} />)}</Row>
            : <Text style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>لا توجد خمسة أسئلة لهذا الاختيار. وسّع التصفية.</Text>}
        </Section>
        {lengths.length > 0 && (
          <View style={{ alignItems: 'flex-start', minHeight: 50, justifyContent: 'center' }}>
            {building ? <LoadingDots /> : <Button big variant="primary" Icon={Play} label="ابدأ الاختبار" onPress={start} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
}


export { ErrorBoundary } from '@/components/CrashScreen';
