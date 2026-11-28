import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Modal, View, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/ui/Text';
import { Gesture, GestureDetector, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { ChevronsLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { GrowingLogo } from './Logo';
import TreeCard from './TreeCard';
import MatrixCard from './MatrixCard';
import MushafPageView from './MushafPageView';
import StoryMap from './StoryMap';
import EventPlaces from './EventPlaces';
import { storyMap } from '@shared/quran/prophets/story';
import { prophetStory } from '@/lib/prophets';
import Button from '@/ui/Button';
import { cardOf } from '@/lib/branches';
import { EMPTY_LIST } from '@/lib/branchList';
import { pageData, surahBefore } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { RECITE_AYAH, RECITE_PAGE, TOUR_STEPS, tourPiece, type TourStep } from '@/lib/tour';
import type { Palette } from '@/lib/theme';
import type { RecitePosition } from '@shared/quran/recite';
import { APP_NAME, OPENING, SLOGAN } from '@shared/brand';
import { SURAH_TITLES } from '@shared/quran/surahNames';

type Size = { width: number; height: number };
const noop = () => {};

function Pill({ text, palette }: { text: string; palette: Palette }) {
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} pointerEvents="none"
      style={{ alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5, borderColor: palette.accent, backgroundColor: palette.card }}>
      <Text style={{ color: palette.ink, fontSize: 15 }}>{text}</Text>
    </Animated.View>
  );
}

function Fit({ children }: { children: (size: Size) => React.ReactNode }) {
  const [size, setSize] = useState<Size | null>(null);
  const measured = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width && height) setSize({ width: Math.round(width), height: Math.round(height) });
  };
  return <View style={{ flex: 1, overflow: 'hidden' }} onLayout={measured}>{size && children(size)}</View>;
}

function Opening({ palette, onStart }: { palette: Palette; onStart: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: OPENING.gap }}>
      <GrowingLogo size={OPENING.logo} />
      <Animated.View entering={FadeIn.delay(1300).duration(600)} style={{ alignItems: 'center', gap: OPENING.nameGap }}>
        <Text style={{ color: palette.ink, fontSize: OPENING.name, fontWeight: '700' }}>{APP_NAME}</Text>
        <Text style={{ color: palette.muted, fontSize: OPENING.slogan }}>{SLOGAN}</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(2000).duration(500)} style={{ marginTop: 36 }}>
        <Button variant="primary" big label="ابدأ" onPress={onStart} />
      </Animated.View>
    </View>
  );
}

function Timeline({ palette, onPick }: { palette: Palette; onPick: () => void }) {
  const prophet = useMemo(() => prophetStory('adam'), []);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : undefined), [prophet]);
  const [open, setOpen] = useState<{ event: number; surah: number }>();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const placesY = useRef(0);
  useEffect(() => { if (open) setTimeout(() => scroll.current?.scrollTo({ y: placesY.current, animated: true }), 80); }, [open]);
  if (!prophet || !map) return null;
  const { story, events } = prophet;
  const show = (event: number, surah?: number) => { setOpen({ event, surah: surah ?? map.places[event][0].surah }); onPick(); };
  return (
    <ScrollView ref={scroll} contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <StoryMap map={map} events={events} phases={story.phases} picked={open} palette={palette} onPick={show} onTitle={event => show(event)} />
      <View onLayout={event => { placesY.current = event.nativeEvent.layout.y; }}>{open && <EventPlaces event={events[open.event]} places={map.places[open.event]} phase={story.phases[events[open.event].phase]} focus={open.surah} palette={palette}
        hasPrev={open.event > 0} hasNext={open.event < events.length - 1} onStep={dir => show(open.event + dir)} onLayoutPlace={noop} readable={false} />}</View>
    </ScrollView>
  );
}

const FLICK = 500;
const READING = { s: 1, x: -100000, y: 0 };

export default function Tour({ palette, onDone }: { palette: Palette; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<TourStep>('opening');
  const [done, setDone] = useState<Partial<Record<TourStep, boolean>>>({});
  const piece = useMemo(tourPiece, []);
  const card = useMemo(() => piece && cardOf(piece), [piece]);
  const page = RECITE_PAGE;
  const model = useMemo(() => pageModel(pageData(page), surahBefore(page)), [page]);
  const [position, setPosition] = useState<RecitePosition>({ start: RECITE_AYAH, shown: null, words: 0 });
  const recite = useMemo(() => reciteView(model, position), [model, position]);

  const steps: TourStep[] = piece ? ['opening', ...TOUR_STEPS] : ['opening', 'recite'];
  const at = steps.indexOf(step);
  const last = at === steps.length - 1;
  const did = (which: TourStep) => setDone(current => (current[which] ? current : { ...current, [which]: true }));

  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  const start = useSharedValue(0);
  const hasNext = at < steps.length - 1;
  const hasBack = at > 1;
  const rest = at * width;
  useEffect(() => { offset.value = rest; }, [rest]); // eslint-disable-line react-hooks/exhaustive-deps
  const turnTo = (index: number) => setStep(steps[index]);
  const slide = (dir: 1 | -1) => {
    const target = at + dir;
    if (!width) return turnTo(target);
    offset.value = withTiming(target * width, { duration: 260 }, finished => { if (finished) scheduleOnRN(turnTo, target); });
  };
  const next = () => (last ? onDone() : step === 'opening' ? setStep(steps[1]) : slide(1));
  const swipe = Gesture.Pan().enabled(step !== 'timeline').activeOffsetX([-16, 16]).failOffsetY([-14, 14])
    .onStart(() => { start.value = offset.value; })
    .onUpdate(event => {
      const x = event.translationX;
      offset.value = start.value + ((x > 0 && !hasNext) || (x < 0 && !hasBack) ? x / 4 : x);
    })
    .onEnd(event => {
      const { translationX: x, velocityX: v } = event;
      const target = hasNext && x > 0 && (x > width / 4 || v > FLICK) ? at + 1 : hasBack && x < 0 && (x < -width / 4 || v < -FLICK) ? at - 1 : at;
      if (target === at) offset.value = withSpring(rest, { damping: 20, stiffness: 220 });
      else offset.value = withTiming(target * width, { duration: 200 }, finished => { if (finished) scheduleOnRN(turnTo, target); });
    });
  const strip = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  const title: Record<TourStep, string> = { opening: '', matrix: '', tree: '', timeline: 'قصص الأنبياء', recite: 'سمّع من المصحف' };
  const hint: Partial<Record<TourStep, string>> = { tree: 'اسحب الشجرة واضغط غصنًا', timeline: 'اضغط نقطة لترى آياتها', recite: 'اضغط لتظهر الآية التالية' };

  const pageOf = (which: TourStep) => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 44 }}>
        {title[which] ? <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20, fontWeight: '700' }}>{title[which]}</Text> : null}
      </View>
      <View style={{ flex: 1, paddingHorizontal: which === 'tree' ? 0 : 12, paddingTop: 8 }}>
        {which === 'matrix' && card && (
          <View style={{ flex: 1 }}>
            <Fit>{size => <MatrixCard presentation={card.presentation} palette={palette} view={size} around={false} onTap={noop} onMove={noop} alongside={swipe} />}</Fit>
            <Svg pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }} width="100%" height={40}>
              <Defs><LinearGradient id="below" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={palette.paper} stopOpacity={0} /><Stop offset="1" stopColor={palette.paper} stopOpacity={1} /></LinearGradient></Defs>
              <Rect x="0" y="0" width="100%" height="40" fill="url(#below)" />
            </Svg>
          </View>
        )}
        {which === 'tree' && card && (
          <View style={{ flex: 1, backgroundColor: palette.card, overflow: 'hidden' }}>
            <Fit>{size => <TreeCard piece={card.piece} list={EMPTY_LIST} palette={palette} view={size} around={false} onMove={noop}
              initialCamera={READING} onTap={(keys, lightPath) => { if (!keys) return; lightPath?.(); did('tree'); }} />}</Fit>
          </View>
        )}
        {which === 'timeline' && <Timeline palette={palette} onPick={() => did('timeline')} />}
        {which === 'recite' && (
          <Fit>{size => (
            <MushafPageView page={page} data={pageData(page)} model={model} palette={palette} width={size.width} height={size.height}
              top={surahBefore(page)} names={SURAH_TITLES} mark={null} recite={recite} forgot={{}} saved={new Set()}
              onTouch={touch => {
                if (touch !== 'tap') return;
                const shown = recite.nextAyah();
                if (shown) setPosition(shown);
                did('recite');
              }} />
          )}</Fit>
        )}
      </View>
    </View>
  );
  const pages = [at - 1, at, at + 1].filter(index => index >= 1 && index < steps.length);

  return (
    <Modal visible animationType="none" onRequestClose={onDone} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }}>
          {step === 'opening' ? <Opening palette={palette} onStart={next} /> : <GestureDetector gesture={swipe}><View style={{ flex: 1 }}>
            <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setWidth(Math.round(event.nativeEvent.layout.width))}>
                <Animated.View style={[{ flex: 1 }, strip]}>
                  {width > 0 && pages.map(index => (
                    <View key={steps[index]} pointerEvents={index === at ? 'auto' : 'none'} accessibilityElementsHidden={index !== at}
                      importantForAccessibility={index === at ? 'auto' : 'no-hide-descendants'}
                      style={{ position: 'absolute', top: 0, bottom: 0, width, left: -index * width }}>{pageOf(steps[index])}</View>
                  ))}
                </Animated.View>
            </View>
            <View style={{ alignItems: 'center', gap: 12, paddingTop: 12 }}>
              <View style={{ minHeight: 40, justifyContent: 'center' }}>
                {hint[step] && !done[step] ? <Pill text={hint[step]!} palette={palette} /> : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Button variant="primary" label={last ? 'إلى الرئيسية' : 'التالي'} onPress={next} />
                {!last && <Button variant="plain" Icon={ChevronsLeft} label="تخطَّ" accessibilityLabel="تخطَّ" onPress={onDone} />}
              </View>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', direction: 'rtl', gap: 7 }}>
                {steps.slice(1).map(item => <View key={item} style={{ height: 6, width: item === step ? 16 : 6, borderRadius: 3, backgroundColor: item === step ? palette.accent : palette.rule }} />)}
              </View>
            </View>
          </View></GestureDetector>}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
