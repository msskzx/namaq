import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { sceneSlots, type ReaderPage } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Tabs from '@/ui/Tabs';
import HadithScene from '@/components/HadithScene';
import { Section } from '@/components/QuizForm';
import Button from '@/ui/Button';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { hadithUnit } from '@/lib/hadith';
import Isnad from '@/components/Isnad';

type Mode = 'scenes' | 'text';
const MODES = [{ key: 'scenes', label: 'الرسم' }, { key: 'text', label: 'النص كاملًا' }] as const;

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right' as const });

/** A commentary's printed pages, one at a time, what it says about the hadith marked. */
function Pages({ pages, palette }: { pages: ReaderPage[]; palette: Palette }) {
  const [index, setIndex] = useState(0);
  const page = pages[index];
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Button label="السابقة" disabled={index === 0} onPress={() => setIndex(index - 1)} />
        <Text style={{ color: palette.muted, fontSize: 15 }}>ص {page.label}</Text>
        <Button label="التالية" disabled={index === pages.length - 1} onPress={() => setIndex(index + 1)} />
      </View>
      <Text style={body(palette)}>
        {page.parts.map((part, i) => <Text key={i} style={part.mark ? { color: palette.onHighlight, backgroundColor: palette.highlight } : undefined}>{part.text}</Text>)}
      </Text>
    </View>
  );
}

/** One hadith (the website's /hadith/[unit]): its isnad and scenes, or its whole text, then the compiler's remark and where else it is. */
export default function HadithUnitScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { unit: id = '' } = useLocalSearchParams<{ unit?: string }>();
  const view = hadithUnit(id);
  const [mode, setMode] = useState<Mode>('scenes');
  const hadith = useMemo(() => view?.reports.filter(report => report.voice !== 'AUTHOR') ?? [], [view]);
  const slots = useMemo(() => new Map(hadith.map(report => [report.id, sceneSlots(report.scenes, palette.slots.length)])), [hadith, palette.slots.length]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!view) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const isSharh = view.explains.length > 0;
  const remarks = view.reports.filter(report => report.voice === 'AUTHOR');
  const open = (unit: string) => router.push({ pathname: '/hadith-unit', params: { unit } });
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={view.book} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{view.book}</Text>
        {view.kitab ? <Text style={{ color: palette.muted, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{view.kitab}، {view.bab}</Text> : null}
        {!isSharh && hadith.length > 0 && (
          <Tabs label="طريقة العرض" options={MODES} value={mode} onChange={setMode} palette={palette} />
        )}
        {!isSharh && hadith.map(report => (
          <Section key={report.id} title="الحديث" palette={palette}>
            {mode === 'text' ? <>
              {report.frame ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{report.frame}</Text> : null}
              {(report.fullText ? [report.fullText] : report.statements).map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
            </> : <>
              {view.isnad[report.id] && <Isnad isnad={view.isnad[report.id]} palette={palette} />}
              {report.scenes.length === 0 && report.statements.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
              {report.scenes.map((scene, i) => (
                <View key={scene.ordinal} style={{ gap: 8 }}>
                  <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>المشهد {num(scene.ordinal)}</Text>
                  <HadithScene lines={scene.lines} slots={slots.get(report.id)![i]} palette={palette} />
                </View>
              ))}
            </>}
          </Section>
        ))}
        {!isSharh && remarks.map(report => (
          <Section key={report.id} title="تعليق المصنف" palette={palette}>
            {report.frame ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{report.frame}</Text> : null}
            {report.statements.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
          </Section>
        ))}
        {view.reader && view.reader.length > 0 && <Section title="نص الكتاب كما طُبع" palette={palette}><Pages pages={view.reader} palette={palette} /></Section>}
        {view.notes.length > 0 && (
          <Section title="ما يقوله الشارح عن هذا الحديث" palette={palette}>
            {view.notes.map((note, i) => (
              <View key={i}>
                <Text style={body(palette)}>{note.text}</Text>
                {note.narrator ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>التعليق على الراوي: {note.narrator}</Text> : null}
              </View>
            ))}
          </Section>
        )}
        {view.explains.map(item => (
          <Section key={item.unit} title="الحديث الذي يشرحه" palette={palette}>
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>هذا النص شرحٌ لحديث في {item.book}، ويحدده بما طُبع في أوله:</Text>
            <Text style={body(palette)}>{item.basis}</Text>
            <View style={{ flexDirection: 'row' }}><Button Icon={BookOpen} label="اقرأ الحديث" onPress={() => open(item.unit)} /></View>
          </Section>
        ))}
        {view.sameEvent.map(item => (
          <Section key={item.unit} title={`الواقعة نفسها في ${item.book}`} palette={palette}>
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>حسب {item.source}:</Text>
            <Text style={body(palette)}>{item.basis}</Text>
            <View style={{ flexDirection: 'row' }}><Button Icon={BookOpen} label={`اقرأ الحديث في ${item.book}`} onPress={() => open(item.unit)} /></View>
          </Section>
        ))}
        {view.explainedBy.map(item => (
          <Section key={item.unit} title="ما قاله ابن حجر عن هذا الحديث" palette={palette}>
            {item.texts.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
            <View style={{ flexDirection: 'row' }}><Button Icon={BookOpen} label="اقرأ صفحات الشرح" onPress={() => open(item.unit)} /></View>
          </Section>
        ))}
      </ScrollView>
    </View>
  );
}
