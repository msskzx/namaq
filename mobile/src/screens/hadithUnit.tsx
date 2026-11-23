import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen, Send } from 'lucide-react-native';
import { DRAW_MODES, sceneSlots, type DrawMode, type ReaderPage } from '@shared/hadith';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Tabs from '@/ui/Tabs';
import HadithScene, { sceneBlocks } from '@/components/HadithScene';
import { PictureRefs, ShareHead } from '@/ui/CardShare';
import { shareCard } from '@/lib/shareImage';
import { Section } from '@/components/QuizForm';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { sourcesOf } from '@/ui/SourceLine';
import { unitSource } from '@shared/quiz/hadith';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { hadithUnit } from '@/lib/hadith';
import Isnad from '@/components/Isnad';


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
  const [mode, setMode] = useState<DrawMode>('drawing');
  const hadith = useMemo(() => view?.reports.filter(report => report.voice !== 'AUTHOR') ?? [], [view]);
  const slots = useMemo(() => new Map(hadith.map(report => [report.id, sceneSlots(report.scenes, palette.slots.length)])), [hadith, palette.slots.length]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!view) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const isSharh = view.explains.length > 0;
  const remarks = view.reports.filter(report => report.voice === 'AUTHOR');
  const open = (unit: string) => router.push({ pathname: '/hadith-unit', params: { unit } });
  // The book the page's text is printed in, on the line under each of its sections (owner 2026-11-20); the isnad stays drawn.
  const source = sourcesOf([unitSource(view)]);
  const read = (unit: string, label: string) => <IconButton Icon={BookOpen} label={label} onPress={() => open(unit)} />;
  // Every section shares as a picture under the book's name and place, its reference written out in full (release 1).
  const head = <ShareHead title={view.book} sub={[view.kitab, view.bab].filter(Boolean).join('، ') || undefined} palette={palette} />;
  const share = { head };
  // A drawn hadith shares as the story does (#1110): equal 4:5 pictures, its scenes flowing between them, the book at the foot.
  // Its head is the book's name alone: the kitab and bab are in the reference at the foot, and the first picture keeps room.
  const sharePaged = (report: (typeof hadith)[number]) => <IconButton Icon={Send} label="شارك الحديث" onPress={() => shareCard({ content: () => null, paged: () => ({
    head: <ShareHead title={view.book} palette={palette} />,
    blocks: report.scenes.flatMap((scene, i) => sceneBlocks(scene.lines, slots.get(report.id)![i], palette).map(block => block.node)),
    foot: <PictureRefs sources={source} palette={palette} />,
  }) })} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={view.book} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{view.book}</Text>
        {view.kitab ? <Text style={{ color: palette.muted, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{view.kitab}، {view.bab}</Text> : null}
        {!isSharh && hadith.length > 0 && (
          <Tabs label="طريقة العرض" options={DRAW_MODES} value={mode} onChange={setMode} palette={palette} />
        )}
        {!isSharh && hadith.map(report => (
          <Section key={report.id} title="الحديث" palette={palette} source={source}
            {...(mode === 'drawing' && report.scenes.length > 0 ? { row: sharePaged(report) } : { share })}>
            {mode === 'text' ? <>
              {report.frame ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{report.frame}</Text> : null}
              {(report.fullText ? [report.fullText] : report.statements).map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
            </> : <>
              {view.isnad[report.id] && <Isnad isnad={view.isnad[report.id]} palette={palette} />}
              {report.scenes.length === 0 && report.statements.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
              {/* No «المشهد ١» heading of ours (owner, 2026-11-22): the scenes follow one another with space between. */}
              {report.scenes.length > 0 && (
                <View style={{ gap: 28 }}>
                  {report.scenes.map((scene, i) => <HadithScene key={scene.ordinal} lines={scene.lines} slots={slots.get(report.id)![i]} palette={palette} />)}
                </View>
              )}
            </>}
          </Section>
        ))}
        {!isSharh && remarks.map(report => (
          <Section key={report.id} title="تعليق المصنف" palette={palette} source={source} share={share}>
            {report.frame ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{report.frame}</Text> : null}
            {report.statements.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
          </Section>
        ))}
        {view.reader && view.reader.length > 0 && <Section title="نص الكتاب كما طُبع" palette={palette} source={source}><Pages pages={view.reader} palette={palette} /></Section>}
        {view.notes.length > 0 && (
          <Section title="ما يقوله الشارح عن هذا الحديث" palette={palette} source={source} share={share}>
            {view.notes.map((note, i) => (
              <View key={i}>
                <Text style={body(palette)}>{note.text}</Text>
                {note.narrator ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>التعليق على الراوي: {note.narrator}</Text> : null}
              </View>
            ))}
          </Section>
        )}
        {view.explains.map(item => (
          <Section key={item.unit} title="الحديث الذي يشرحه" palette={palette} source={source} row={read(item.unit, 'اقرأ الحديث')} share={share}>
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>هذا النص شرحٌ لحديث في {item.book}، ويحدده بما طُبع في أوله:</Text>
            <Text style={body(palette)}>{item.basis}</Text>
          </Section>
        ))}
        {view.sameEvent.map(item => (
          <Section key={item.unit} title={`الواقعة نفسها في ${item.book}`} palette={palette} row={read(item.unit, `اقرأ الحديث في ${item.book}`)}>
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>حسب {item.source}:</Text>
            <Text style={body(palette)}>{item.basis}</Text>
          </Section>
        ))}
        {view.explainedBy.map(item => (
          <Section key={item.unit} title="ما قاله ابن حجر عن هذا الحديث" palette={palette} row={read(item.unit, 'اقرأ صفحات الشرح')}>
            {item.texts.map((text, i) => <Text key={i} style={body(palette)}>{text}</Text>)}
          </Section>
        ))}
      </ScrollView>
    </View>
  );
}
