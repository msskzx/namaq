import { useCallback, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { storySummary } from '@shared/quran/prophets/story';
import StationPager, { type StationPagerHandle } from '@/components/StationPager';
import { phaseColor } from '@/components/StationCard';
import { prophetStory, stationIndex } from '@/lib/prophets';
import { readJson, writeJson } from '@/lib/storage';
import { usePalette, type Palette } from '@/lib/theme';

const PLACE = 'prophets-place';
type Places = Record<string, number>;

const title = (name: string) => `خط ${name} عليه السلام الزمني في القرآن`;

function Pill({ text, palette }: { text: string; palette: Palette }) {
  return <Text style={{ color: palette.ink, fontSize: 13, borderWidth: 1, borderColor: palette.rule, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>{text}</Text>;
}

function StepButton({ label, dir, onPress, palette }: { label: string; dir: 1 | -1; onPress: () => void; palette: Palette }) {
  const Icon = dir === 1 ? ArrowLeft : ArrowRight;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
      {dir === -1 && <Icon size={16} color={palette.ink} />}
      <Text style={{ color: palette.ink, fontSize: 15 }}>{label}</Text>
      {dir === 1 && <Icon size={16} color={palette.ink} />}
    </Pressable>
  );
}

/**
 * The website's /quran/prophets/[slug] page: the intro, the index of stations by phase, and the stations one by one.
 * Shown in the prophets tab under the top bar, and at /prophets/[slug] under a back bar.
 */
export default function ProphetStory({ slug, header, inTab = false }: { slug: string; header: React.ReactNode; inTab?: boolean }) {
  const palette = usePalette();
  const insets = useSafeAreaInsets();
  const prophet = useMemo(() => prophetStory(slug), [slug]);
  const [index, setIndex] = useState(() => (prophet ? stationIndex(prophet.events, readJson<Places>(PLACE)?.[slug]) : 0));
  const [marked, setMarked] = useState<number>();
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const pager = useRef<StationPagerHandle>(null);
  const trackY = useRef(0);

  const arrive = useCallback((next: number) => {
    setIndex(next);
    setMarked(undefined);
    writeJson(PLACE, { ...readJson<Places>(PLACE), [slug]: next + 1 });
  }, [slug]);
  const jump = (next: number) => {
    arrive(next);
    setMarked(next);
    scroll.current?.scrollTo({ y: trackY.current, animated: true });
  };
  const isOpen = useCallback((event: number, segment: number) => open.has(`${event}:${segment}`), [open]);
  const toggle = useCallback((event: number, segment: number) => setOpen(old => {
    const next = new Set(old);
    const key = `${event}:${segment}`;
    if (!next.delete(key)) next.add(key);
    return next;
  }), []);

  if (!prophet) return <View style={{ flex: 1, backgroundColor: palette.paper }}>{header}</View>;

  const { name, story, events } = prophet;
  const summary = storySummary(events);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {header}
      <ScrollView ref={scroll} contentContainerStyle={{ paddingVertical: 20, paddingBottom: (inTab ? 0 : insets.bottom) + 32, gap: 24 }}>
        <View style={{ gap: 10, paddingHorizontal: 16 }}>
          <Text style={{ color: palette.accent, fontSize: 14, fontWeight: '600' }}>قصص الأنبياء في القرآن</Text>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, fontWeight: '700', lineHeight: 38 }}>{title(name)}</Text>
          <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26 }}>{story.intro}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }} accessibilityLabel="ملخص">
            <Pill text={`${num(summary.events)} محطة`} palette={palette} />
            <Pill text={`${num(summary.ayat)} آية`} palette={palette} />
            <Pill text={`${num(summary.surahs)} سورة`} palette={palette} />
          </View>
        </View>

        <View style={{ gap: 10, paddingHorizontal: 16 }} accessibilityLabel="فهرس المحطات">
          {story.phases.map((phase, ph) => {
            const inPhase = events.map((e, at) => ({ e, at })).filter(({ e }) => e.phase === ph);
            const color = phaseColor(palette, ph);
            return (
              <View key={phase} style={{ gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: palette.rule, borderStartWidth: 4, borderStartColor: color, backgroundColor: palette.card }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Text style={{ color, fontSize: 15, fontWeight: '600' }}>{phase}</Text>
                  <Text style={{ color: palette.muted, fontSize: 12 }}>{`${num(inPhase.length)} محطة`}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {inPhase.map(({ e, at }) => {
                    const active = marked === at;
                    return (
                      <Pressable key={e.n} onPress={() => jump(at)} accessibilityRole="button" accessibilityLabel={e.title}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, paddingVertical: 3, paddingStart: 3, paddingEnd: 10,
                          borderColor: active ? palette.accent : palette.rule, backgroundColor: active ? palette.paperDeep : palette.paper }}>
                        <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 4, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: palette.paper, fontSize: 12 }}>{num(e.n)}</Text>
                        </View>
                        <Text style={{ color: palette.ink, fontSize: 14 }}>{e.title}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View onLayout={e => { trackY.current = e.nativeEvent.layout.y; }} style={{ gap: 12 }} accessibilityLabel={`أحداث قصة ${name}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
            <StepButton label="السابق" dir={-1} onPress={() => pager.current?.step(-1)} palette={palette} />
            <Text style={{ color: palette.muted, fontSize: 13 }}>{`${num(index + 1)} / ${num(events.length)}`}</Text>
            <StepButton label="التالي" dir={1} onPress={() => pager.current?.step(1)} palette={palette} />
          </View>
          <StationPager ref={pager} events={events} phases={story.phases} index={index} onIndex={arrive} marked={marked}
            isOpen={isOpen} onToggle={toggle} palette={palette} />
        </View>
      </ScrollView>
    </View>
  );
}
