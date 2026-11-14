import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Modal, View, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
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
import { ViewTiles } from './ThemeTiles';
import StoryMap from './StoryMap';
import EventPlaces from './EventPlaces';
import { storyMap } from '@shared/quran/prophets/story';
import { prophetStory } from '@/lib/prophets';
import Button from './Button';
import { cardOf } from '@/lib/branches';
import { EMPTY_LIST } from '@/lib/branchList';
import { pageData, surahBefore, surahNames as mushafNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { RECITE_AYAH, RECITE_PAGE, TOUR_STEPS, tourPiece, type TourStep } from '@/lib/tour';
import { branchView } from '@/lib/settings';
import type { Palette } from '@/lib/theme';
import type { RecitePosition } from '@shared/quran/recite';
import { APP_NAME, OPENING, SLOGAN } from '@shared/brand';

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

/** A flick this fast turns the step even when it moved less than a quarter of the width. */
const FLICK = 500;
/** The tree opens at reading size, scrolled to its right edge (the root); TreeCard keeps it inside the card. */
const READING = { s: 1, x: -100000, y: 0 };

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
  const did = (which: TourStep) => setDone(current => (current[which] ? current : { ...current, [which]: true }));
  // The question opens with the matrix chosen, once per tour, so coming back to the step keeps what was tapped.
  const preselected = useRef(false);
  useEffect(() => { if (step === 'view' && !preselected.current) { preselected.current = true; setView('matrix'); } }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // The steps sit side by side, each at its own place (step i at i widths to the left, as the next step comes from the
  // left in Arabic), and the strip slides under the finger: dragging right pulls the next step in. Letting go past a
  // quarter of the width (or with a flick) finishes the turn, else it springs back. Pages never move, so turning a step
  // only moves the strip; nothing is reset and nothing jumps.
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
      // Past the first or last step the page only gives a little.
      offset.value = start.value + ((x > 0 && !hasNext) || (x < 0 && !hasBack) ? x / 4 : x);
    })
    .onEnd(event => {
      const { translationX: x, velocityX: v } = event;
      const target = hasNext && x > 0 && (x > width / 4 || v > FLICK) ? at + 1 : hasBack && x < 0 && (x < -width / 4 || v < -FLICK) ? at - 1 : at;
      if (target === at) offset.value = withSpring(rest, { damping: 20, stiffness: 220 });
      else offset.value = withTiming(target * width, { duration: 200 }, finished => { if (finished) scheduleOnRN(turnTo, target); });
    });
  const strip = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));

  const title: Record<TourStep, string> = { opening: '', matrix: '', tree: '', view: 'أيهما تفضّل؟', timeline: 'قصص الأنبياء', recite: 'سمّع من المصحف' };
  const hint: Partial<Record<TourStep, string>> = { tree: 'اسحب الشجرة واضغط غصنًا', timeline: 'اضغط نقطة لترى آياتها', recite: 'اضغط لتظهر الآية التالية' };

  /** One step's page: its title and its card. Neighbours are drawn too, so they can peek in while dragging. */
  const pageOf = (which: TourStep) => (
    <View style={{ flex: 1 }}>
      {/* No textAlign: in a right-to-left row the title starts on the right by itself. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 44 }}>
        {title[which] ? <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 20, fontWeight: '700' }}>{title[which]}</Text> : null}
      </View>
      <View style={{ flex: 1, paddingHorizontal: which === 'tree' ? 0 : 12, paddingTop: 8 }}>
        {which === 'matrix' && card && (
          <View style={{ flex: 1 }}>
            <Fit>{size => <MatrixCard presentation={card.presentation} palette={palette} view={size} around={false} onTap={noop} onMove={noop} alongside={swipe} />}</Fit>
            {/* More cards wait below: the bottom edge fades out instead of cutting the last card flat. */}
            <Svg pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }} width="100%" height={40}>
              <Defs><LinearGradient id="below" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={palette.paper} stopOpacity={0} /><Stop offset="1" stopColor={palette.paper} stopOpacity={1} /></LinearGradient></Defs>
              <Rect x="0" y="0" width="100%" height="40" fill="url(#below)" />
            </Svg>
          </View>
        )}
        {/* The tree at reading size, dragged around inside its card, its root (right) in view first. Its own drag wins
            here, so on this step a swipe on the title or the buttons' row turns the step. */}
        {which === 'tree' && card && (
          <View style={{ flex: 1, backgroundColor: palette.card, overflow: 'hidden' }}>
            <Fit>{size => <TreeCard piece={card.piece} list={EMPTY_LIST} palette={palette} view={size} around={false} onMove={noop}
              initialCamera={READING} onTap={(keys, lightPath) => { if (!keys) return; lightPath?.(); did('tree'); }} />}</Fit>
          </View>
        )}
        {which === 'view' && (
          <View style={{ flex: 1, paddingBottom: 8 }}>
            <ViewTiles palette={palette} big />
            <Text style={{ marginTop: 14, color: palette.muted, fontSize: 13, textAlign: 'center' }}>تغيّره متى شئت من الإعدادات</Text>
          </View>
        )}
        {which === 'timeline' && <Timeline palette={palette} onPick={() => did('timeline')} />}
        {which === 'recite' && (
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
    </View>
  );
  // The current page and its two neighbours are drawn; the rest wait until they are next to the current one.
  const pages = [at - 1, at, at + 1].filter(index => index >= 1 && index < steps.length);

  return (
    <Modal visible animationType="none" onRequestClose={onDone} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }}>
          {step === 'opening' ? <Opening palette={palette} onStart={next} /> : <GestureDetector gesture={swipe}><View style={{ flex: 1 }}>
            {/* The whole screen takes the swipe, the buttons' row too, so a step turns even where a card keeps its drags. */}
            <View style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setWidth(Math.round(event.nativeEvent.layout.width))}>
                {/* All three pages are keyed siblings, so a page that slides in stays mounted as it becomes the current one. */}
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
