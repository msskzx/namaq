import { useMemo, useState } from 'react';
import { Modal, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { num } from '@shared/quran/arabicNumber';
import Logo from './Logo';
import TreeCard from './TreeCard';
import MatrixCard from './MatrixCard';
import MushafPageView from './MushafPageView';
import { ViewTiles } from './ThemeTiles';
import Button from './Button';
import { ayahOf, cardOf, surahNames } from '@/lib/branches';
import { EMPTY_LIST } from '@/lib/branchList';
import { pageData, surahBefore, surahNames as mushafNames } from '@/lib/mushaf';
import { pageModel, reciteView } from '@/lib/recitePage';
import { quranText } from '@/lib/quranText';
import { TOUR_AYAH, TOUR_PAGE, TOUR_STEPS, tourPiece, type TourStep } from '@/lib/tour';
import { QURAN_FONT, type Palette } from '@/lib/theme';
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

/** The ayat a tapped node holds: the first in full, and where each is. */
function AyahCard({ keys, palette }: { keys: string[]; palette: Palette }) {
  const first = ayahOf(keys[0]);
  if (!first) return null;
  const where = keys.map(key => { const [surah, ayah] = key.split(':').map(Number); return `${surahNames[surah]} ${num(ayah)}`; }).join(' · ');
  return (
    <Animated.View entering={FadeIn.duration(400)} style={{ marginTop: 12, padding: 14, gap: 4, borderRadius: 14, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card }}>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 42, color: palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>{quranText(first.words.join(' '))}</Text>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{where}</Text>
    </Animated.View>
  );
}

function Opening({ palette, onStart }: { palette: Palette; onStart: () => void }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Animated.View entering={FadeIn.duration(900)}><Logo size={130} /></Animated.View>
      <Animated.View entering={FadeIn.delay(600).duration(600)} style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ color: palette.ink, fontSize: 34, fontWeight: '700' }}>نمق</Text>
        <Text style={{ color: palette.muted, fontSize: 18 }}>تدبّر القرآن</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(1400).duration(500)} style={{ marginTop: 36 }}>
        <Button variant="primary" big label="ابدأ" onPress={onStart} />
      </Animated.View>
    </View>
  );
}

/**
 * The first-launch tour: the opening, then four steps the user does with the real cards (light a path in a tree, swipe
 * the matrix, pick the default view, reveal an ayah in recite mode). «تخطَّ» ends the tour; the settings sheet plays it again.
 */
export default function Tour({ palette, onDone }: { palette: Palette; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<TourStep>('opening');
  const [done, setDone] = useState<Partial<Record<TourStep, boolean>>>({});
  const [tapped, setTapped] = useState<string[] | null>(null);
  const piece = useMemo(tourPiece, []);
  const card = useMemo(() => piece && cardOf(piece), [piece]);
  const page = TOUR_PAGE;
  const model = useMemo(() => pageModel(pageData(page), surahBefore(page)), [page]);
  const [position, setPosition] = useState<RecitePosition>({ start: TOUR_AYAH, shown: null, words: 0 });
  const recite = useMemo(() => reciteView(model, position), [model, position]);

  const steps: TourStep[] = piece ? ['opening', ...TOUR_STEPS] : ['opening', 'recite'];
  const at = steps.indexOf(step);
  const last = at === steps.length - 1;
  const next = () => (last ? onDone() : setStep(steps[at + 1]));
  const did = (which: TourStep) => setDone(current => (current[which] ? current : { ...current, [which]: true }));

  const title: Record<TourStep, string> = { opening: '', tree: 'شجرة المتشابهات', matrix: 'المصفوفة', view: 'أيهما تفضّل؟', recite: 'سمّع من المصحف' };
  const hint: Record<TourStep, string> = { opening: '', tree: 'اضغط غصنًا', matrix: 'اسحب لترى ما قبل الآية وما بعدها', view: 'اختر أحدهما', recite: 'اضغط لتظهر الآية التالية' };

  return (
    <Modal visible animationType="fade" onRequestClose={onDone} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, direction: 'rtl', backgroundColor: palette.paper, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }}>
          {step === 'opening' ? <Opening palette={palette} onStart={next} /> : <>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 44 }}>
              <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{title[step]}</Text>
              <Pressable onPress={onDone} accessibilityRole="button" accessibilityLabel="تخطَّ" hitSlop={10}>
                <Text style={{ color: palette.muted, fontSize: 15 }}>تخطَّ</Text>
              </Pressable>
            </View>
            <View key={step} style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
              {step === 'tree' && card && <>
                <View style={{ flex: 1, borderRadius: 16, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, overflow: 'hidden' }}>
                  <Fit>{size => <TreeCard piece={card.piece} list={EMPTY_LIST} palette={palette} view={size} around={false} onMove={noop} fillHeight
                    onTap={(keys, lightPath) => { if (!keys) return; lightPath?.(); setTapped(keys); did('tree'); }} />}</Fit>
                </View>
                {/* Room kept for the ayah from the start, so the tree does not shrink when it shows. */}
                <View style={{ height: 132 }}>{tapped && <AyahCard keys={tapped} palette={palette} />}</View>
              </>}
              {step === 'matrix' && card && (
                <Fit>{size => <MatrixCard presentation={card.presentation} palette={palette} view={size} around onTap={noop} onMove={noop} onColumn={() => did('matrix')} />}</Fit>
              )}
              {step === 'view' && (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <ViewTiles palette={palette} onPick={() => did('view')} />
                  <Text style={{ marginTop: 14, color: palette.muted, fontSize: 13, textAlign: 'center' }}>تغيّره متى شئت من الإعدادات</Text>
                </View>
              )}
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
            <View style={{ alignItems: 'center', gap: 14, paddingTop: 12, minHeight: 104 }}>
              {done[step]
                ? <Animated.View entering={FadeIn.duration(300)}><Button variant={last ? 'primary' : 'outline'} label={last ? 'إلى الرئيسية' : 'التالي'} onPress={next} /></Animated.View>
                : <Pill text={hint[step]} palette={palette} />}
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', direction: 'rtl', gap: 7 }}>
                {steps.slice(1).map(item => <View key={item} style={{ height: 6, width: item === step ? 16 : 6, borderRadius: 3, backgroundColor: item === step ? palette.accent : palette.rule }} />)}
              </View>
            </View>
          </>}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
