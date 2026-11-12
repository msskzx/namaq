import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Modal, View, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import { Gesture, GestureDetector, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { ChevronsLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { GrowingLogo } from './Logo';
import TreeCard from './TreeCard';
import MatrixCard from './MatrixCard';
import MushafPageView from './MushafPageView';
import { ViewTiles } from './ThemeTiles';
import StoryMap from './StoryMap';
import EventPlaces from './EventPlaces';
import { storyMap } from '@shared/quran/prophets/story';
import { prophetStory } from '@/lib/prophets';
import Button from './Button';
import { cardOf } from '@/lib/branches';
import { EMPTY_LIST } from '@/lib/branchList';
import { pageData, surahBefore, surahNames as mushafNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@/lib/recitePage';
import { RECITE_AYAH, RECITE_PAGE, TOUR_STEPS, tourPiece, type TourStep } from '@/lib/tour';
import { branchView } from '@/lib/settings';
import type { Palette } from '@/lib/theme';
import type { RecitePosition } from '@shared/quran/recite';

type Size = { width: number; height: number };
const noop = () => {};

/** One instruction at a time, where the thumb is: a small pill in the card colour with a thin terracotta edge. */
function Pill({ text, palette }: { text: string; palette: Palette }) {
  return (
    <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(200)} pointerEvents="none"
      style={{ alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5, borderColor: palette.accent, backgroundColor: palette.card }}>
      <Text style={{ color: palette.ink, fontSize: 15 }}>{text}</Text>
    </Animated.View>
  );
}

/** Fills the space it is given and tells its child how big that is, for the cards that draw to a size. */
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <GrowingLogo size={130} />
      <Animated.View entering={FadeIn.delay(1300).duration(600)} style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 34, fontWeight: '700' }}>نمق</Text>
        <Text style={{ color: palette.muted, fontSize: 18 }}>تدبّر القرآن</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(2000).duration(500)} style={{ marginTop: 36 }}>
        <Button variant="primary" big label="ابدأ" onPress={onStart} />
      </Animated.View>
    </View>
  );
}

/** Adam's story map; a tapped dot shows that event's ayat right under it (as the prophets tab does). */
function Timeline({ palette, onPick }: { palette: Palette; onPick: () => void }) {
  const prophet = useMemo(() => prophetStory('adam'), []);
  const map = useMemo(() => (prophet ? storyMap(prophet.events) : undefined), [prophet]);
  const [open, setOpen] = useState<{ event: number; surah: number }>();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const placesY = useRef(0);
  // The ayat sit under the map, below the screen's edge: bring them up once they are drawn.
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

/** A sideways swipe this far, or this fast, turns the step. */
const SWIPE = 60;
const FLICK = 500;

/**
 * The first-launch tour: the opening, then the matrix of «إن المتقين في», the same ayat as a tree (tap a branch), the
 * default view (matrix chosen unless changed), Adam's story map, and recite on the last mushaf page. Swiping sideways or «التالي» turns the
 * step (in Arabic the next one comes from the left, so a swipe to the right moves on); «تخطَّ» ends the tour, and the
 * settings sheet plays it again.
 */
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
  const [, setView] = branchView.use();

  const steps: TourStep[] = piece ? ['opening', ...TOUR_STEPS] : ['opening', 'recite'];
  const at = steps.indexOf(step);
  const last = at === steps.length - 1;
  const next = () => (last ? onDone() : setStep(steps[at + 1]));
  const back = () => { if (at > 1) setStep(steps[at - 1]); };
  const did = (which: TourStep) => setDone(current => (current[which] ? current : { ...current, [which]: true }));
  // The question opens with the matrix chosen, once per tour, so coming back to the step keeps what was tapped.
  const preselected = useRef(false);
  useEffect(() => { if (step === 'view' && !preselected.current) { preselected.current = true; setView('matrix'); } }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Off on the story map, whose own sideways scroll would fight it.
  const swipe = Gesture.Pan().enabled(step !== 'timeline').activeOffsetX([-24, 24]).failOffsetY([-18, 18]).onEnd(event => {
    const { translationX: x, velocityX: v } = event;
    if (x > 0 && (x > SWIPE || v > FLICK)) scheduleOnRN(next);
    else if (x < 0 && (x < -SWIPE || v < -FLICK)) scheduleOnRN(back);
  });

  const title: Record<TourStep, string> = { opening: '', matrix: 'المصفوفة', tree: 'شجرة المتشابهات', view: 'أيهما تفضّل؟', timeline: 'قصص الأنبياء', recite: 'سمّع من المصحف' };
  const hint: Partial<Record<TourStep, string>> = { tree: 'اضغط غصنًا', timeline: 'اضغط نقطة لترى آياتها', recite: 'اضغط لتظهر الآية التالية' };

  return (
    <Modal visible animationType="none" onRequestClose={onDone} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }}>
          {step === 'opening' ? <Opening palette={palette} onStart={next} /> : <GestureDetector gesture={swipe}><View style={{ flex: 1 }}>
            {/* No textAlign: in a right-to-left row the title starts on the right by itself. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 44 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20, fontWeight: '700' }}>{title[step]}</Text>
            </View>
            {/* The tree gets the whole width, so it is drawn as big as it can be while it still fits. */}
            <View key={step} style={{ flex: 1, paddingHorizontal: step === 'tree' ? 0 : 12, paddingTop: 8 }}>
              {step === 'matrix' && card && (
                <Fit>{size => <MatrixCard presentation={card.presentation} palette={palette} view={size} around={false} onTap={noop} onMove={noop} alongside={swipe} />}</Fit>
              )}
              {step === 'tree' && card && (
                <View style={{ flex: 1, backgroundColor: palette.card, overflow: 'hidden' }}>
                  <Fit>{size => <TreeCard piece={card.piece} list={EMPTY_LIST} palette={palette} view={size} around={false} onMove={noop} alongside={swipe}
                    onTap={(keys, lightPath) => { if (!keys) return; lightPath?.(); did('tree'); }} />}</Fit>
                </View>
              )}
              {step === 'view' && (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <ViewTiles palette={palette} big />
                  <Text style={{ marginTop: 14, color: palette.muted, fontSize: 13, textAlign: 'center' }}>تغيّره متى شئت من الإعدادات</Text>
                </View>
              )}
              {step === 'timeline' && <Timeline palette={palette} onPick={() => did('timeline')} />}
              {step === 'recite' && (
                <Fit>{size => (
                  <MushafPageView page={page} data={pageData(page)} model={model} palette={palette} width={size.width} height={size.height}
                    top={surahBefore(page)} names={mushafNames} mark={null} recite={recite} forgot={{}} saved={new Set()}
                    onTouch={touch => {
                      if (touch !== 'tap') return;
                      const shown = recite.nextAyah();
                      if (shown) setPosition(shown);
                      did('recite');
                    }} />
                )}</Fit>
              )}
            </View>
            <View style={{ alignItems: 'center', gap: 12, paddingTop: 12 }}>
              <View style={{ minHeight: 40, justifyContent: 'center' }}>
                {hint[step] && !done[step] ? <Pill text={hint[step]!} palette={palette} /> : null}
              </View>
              {/* Next where the thumb is (right), skip beside it. */}
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
