import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { sharePages } from '@shared/sharePages';
import { RAHMAN_KEY, rahmanSections, sadiOpening, SADI_OPENING, type RahmanBlock, type RahmanSection } from '@shared/quran/scenes/rahman';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import { tafsirSadiPage } from '@shared/quran/tafsirSadi';
import { MUSHAF_BOOK, type QuizSource } from '@shared/quiz/sources';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import Card from '@/ui/Card';
import IconButton from '@/ui/IconButton';
import OpenButton from '@/ui/OpenButton';
import LoadingDots from '@/ui/LoadingDots';
import { toTab } from '@/lib/ways';
import { shareCard } from '@/lib/shareImage';
import { dark, ForcePalette, RAHMAN_ART, RAHMAN_PAPER, type Palette } from '@/lib/theme';
import { BLOCK_GAP, BLOCK_W, HADITH_SIZES, PAGE_H, PAGE_ROOM, PAGE_W, rahmanAyat, RAHMAN_NAME, RahmanBlockView, RahmanPage, ScaledPage } from './scenes/RahmanPage';

/**
 * «الرحمن», the second scene of «مشاهد» (owner, 2026-11-24; shared/quran/scenes/rahman.ts): still pages, each a 4:5 picture,
 * turned up and down like a short. Each section's blocks are measured out of sight, then flowed over its pages
 * (shared/sharePages.ts), its hadith at the biggest size that needs no more pages. The share button shares the section the
 * page is in, as the very pages shown: the seven of the introduction together, or one hadith's page.
 */
let sections: RahmanSection[] | null = null;
/** The scene's sections, read on first use (they list the ayat from the corpus). */
const SECTIONS = () => (sections ??= rahmanSections(rahmanAyat()));
export const openRahman = () => router.push({ pathname: '/scene', params: { id: RAHMAN_KEY } });

/** How long the measured heights stay the same before the pages are laid out. */
const SETTLE_MS = 600;

type Laid = { section: number; blocks: number[]; size: number };
const sizesOf = (section: number) => (SECTIONS()[section].blocks.some(block => block.kind === 'hadith') ? HADITH_SIZES : HADITH_SIZES.slice(0, 1));
const measureKey = (section: number, block: number, size: number) => `${section}/${block}/${size}`;

/**
 * Every page, once each block is measured: a section's pages at the biggest hadith size whose every block fits a page and
 * that needs no more pages than the smallest size (a block never splits, so one too tall would lose its words off the page).
 */
function layOut(heights: Record<string, number>): Laid[] | null {
  const laid: Laid[] = [];
  for (const [s, section] of SECTIONS().entries()) {
    const options = sizesOf(s).map(size => {
      const hs = section.blocks.map((block, i) => heights[measureKey(s, i, block.kind === 'hadith' ? size : HADITH_SIZES[0])]);
      return hs.some(h => h === undefined) ? null : { size, pages: sharePages({ heights: hs, room: PAGE_ROOM, firstRoom: PAGE_ROOM, gap: BLOCK_GAP }) };
    });
    if (options.some(option => !option)) return null;
    const fewest = Math.min(...options.map(option => option!.pages.length));
    const fits = (size: number) => section.blocks.every((block, i) => heights[measureKey(s, i, block.kind === 'hadith' ? size : HADITH_SIZES[0])] <= PAGE_ROOM);
    const best = options.find(option => option!.pages.length === fewest && fits(option!.size)) ?? options[options.length - 1]!;
    laid.push(...best.pages.map(blocks => ({ section: s, blocks, size: best.size })));
  }
  return laid;
}

/** A block drawn out of sight to be measured; drawn once, whatever other heights come in. */
const MeasuredBlock = memo(function MeasuredBlock({ block, size, onLayout }: { block: RahmanBlock; size: number; onLayout: (event: LayoutChangeEvent) => void }) {
  return (
    <View collapsable={false} style={{ position: 'absolute', top: 0, width: BLOCK_W }} onLayout={onLayout}>
      <RahmanBlockView block={block} size={size} live={false} />
    </View>
  );
});

const pageOf = (page: Laid, live: boolean) => {
  const section = SECTIONS()[page.section];
  return <RahmanPage title={section.title} blocks={page.blocks.map(i => section.blocks[i])} size={page.size} live={live && !section.intro} />;
};

export default function RahmanScene() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [settled, setSettled] = useState<Record<string, number> | null>(null);
  const [at, setAt] = useState(0);
  // An ayah measures twice (it guesses its size from the screen, then takes its own width's): the pages wait until the
  // heights have stopped changing, or a page laid out on the first guess overflows.
  useEffect(() => {
    const timer = setTimeout(() => setSettled(heights), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [heights]);
  const pages = useMemo(() => (settled ? layOut(settled) : null), [settled]);
  // One handler per block, kept, so a new height re-renders no measured block (they are memo'd).
  const handlers = useRef(new Map<string, (event: { nativeEvent: { layout: { height: number } } }) => void>());
  const measured = (key: string) => {
    if (!handlers.current.has(key)) handlers.current.set(key, event => {
      const h = event.nativeEvent.layout.height;
      setHeights(now => (now[key] === h ? now : { ...now, [key]: h }));
    });
    return handlers.current.get(key)!;
  };
  // The pages snap to the list's own height, which is not always the window's (Android edge to edge).
  const [listHeight, setListHeight] = useState(height);
  const BAR = 56;
  const scale = Math.min((width - 24) / PAGE_W, (height - insets.top - insets.bottom - BAR * 2) / PAGE_H);
  const list = useRef<FlatList<Laid>>(null);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => setAt(Math.round(event.nativeEvent.contentOffset.y / listHeight)), [listHeight]);
  const share = () => {
    if (!pages) return;
    const section = pages[at]?.section ?? 0;
    const intro = !!SECTIONS()[section].intro;
    const together = (page: Laid) => (intro ? !!SECTIONS()[page.section].intro : page.section === section);
    const pictures = pages.filter(together).map((page, i) => <View key={i}>{pageOf(page, false)}</View>);
    if (!pictures.length) return;
    shareCard({ content: () => null, paged: () => ({ head: null, blocks: [], pictures }) });
  };
  return (
    <ForcePalette value={RAHMAN_PAPER}>
      <View style={{ flex: 1, backgroundColor: RAHMAN_ART.table }}>
        {!pages ? (
          <>
            {/* Every block of every section, measured out of sight at the width a page gives it. */}
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: BLOCK_W, opacity: 0 }}>
              {SECTIONS().flatMap((section, s) => section.blocks.flatMap((block, i) => (block.kind === 'hadith' ? sizesOf(s) : HADITH_SIZES.slice(0, 1)).map(size => (
                <MeasuredBlock key={measureKey(s, i, size)} block={block} size={size} onLayout={measured(measureKey(s, i, size))} />
              ))))}
            </View>
            <LoadingDots fill label={`جارٍ تجهيز مشهد ${RAHMAN_NAME}`} />
          </>
        ) : (
          <FlatList ref={list} data={pages} keyExtractor={(_, i) => String(i)} pagingEnabled showsVerticalScrollIndicator={false}
            onScroll={scrolled} scrollEventThrottle={64} initialNumToRender={2} windowSize={3}
            onLayout={event => setListHeight(event.nativeEvent.layout.height)}
            getItemLayout={(_, index) => ({ length: listHeight, offset: listHeight * index, index })}
            renderItem={({ item }) => (
              <View style={{ height: listHeight, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <ScaledPage width={PAGE_W * scale}>{pageOf(item, true)}</ScaledPage>
              </View>
            )} />
        )}
        {/* The bar: back on the right, share on the left, off the page so the page shares clean; light on the dark table. */}
        <ForcePalette value={dark}>
        <View style={{ position: 'absolute', top: insets.top + 6, right: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconButton Icon={ChevronRight} label="رجوع" tone="ink" onPress={() => (router.canGoBack() ? router.back() : toTab('/lataif'))} />
          <View style={{ flex: 1 }} />
          <IconButton Icon={Send} label="شارك هذه الصفحات" onPress={share} disabled={!pages} />
        </View>
        </ForcePalette>
        {pages ? (
          <View pointerEvents="none" style={{ position: 'absolute', bottom: insets.bottom + 14, left: 0, right: 0 }}>
            <Text style={{ color: RAHMAN_ART.mark, fontSize: 14, textAlign: 'center' }}>{`${num(at + 1)} من ${num(pages.length)}`}</Text>
          </View>
        ) : null}
      </View>
    </ForcePalette>
  );
}

/** The scene's first page, drawn as it is in the scene, for the list's cover and the feed. */
export const RahmanCover = ({ width }: { width: number }) => <ScaledPage width={width}>{pageOf({ section: 0, blocks: SECTIONS()[0].blocks.map((_, i) => i), size: HADITH_SIZES[0] }, false)}</ScaledPage>;

/** The line under the cover: al-Sa'di on the name the surah opens with, in his words. */
export function rahmanTeaser(): { by: string; text: string; source: string } | null {
  const passage = tafsirSadiOf(SADI_OPENING.key);
  if (!passage) return null;
  const opening = sadiOpening(passage.text);
  const from = opening.indexOf('افتتحها');
  const to = opening.indexOf('سعة رحمته');
  if (from < 0 || to < 0) throw new Error('al-Sa\'di\'s line under the cover is not in his passage');
  return { by: 'السعدي', text: opening.slice(from, to + 'سعة رحمته'.length), source: `تيسير الكريم الرحمن ص ${num(passage.pages[0])}` };
}

/** The scene's card: its first page, then al-Sa'di's line. */
export function RahmanCard({ palette, width, onPress, sources = false }: { palette: Palette; width: number; onPress?: () => void;
  /** The scene's source line under it (the «مشاهد» list; a home card has its own). */
  sources?: boolean }) {
  const teaser = rahmanTeaser();
  const body = (
    <View style={{ gap: 10 }}>
      <View style={{ alignSelf: 'center' }}><Card palette={palette} pad={0} clip><RahmanCover width={width} /></Card></View>
      {teaser ? (
        <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>
          <Text style={{ color: palette.accent }}>{teaser.by}: </Text>«{teaser.text}»
          <Text style={{ color: palette.muted, fontSize: 14 }}> {teaser.source}</Text>
        </Text>
      ) : null}
    </View>
  );
  const card = onPress ? <TapRow onPress={onPress} role="link" label={`افتح مشهد ${RAHMAN_NAME}`} style={{ flexDirection: 'column' }}>{body}</TapRow> : body;
  return sources ? <View style={{ gap: 6 }}>{card}<SourceLine sources={rahmanSourceList()} palette={palette} /></View> : card;
}

/** The books the scene's pages quote: the mushaf, the two Sahihs, al-Sa'di, and the corpus that counts the places. */
export function rahmanSources(): QuizSource[] {
  const passage = tafsirSadiOf(SADI_OPENING.key);
  return [
    { book: MUSHAF_BOOK },
    { book: 'صحيح البخاري', author: 'البخاري', edition: 'الطبعة السلطانية' },
    { book: 'صحيح مسلم', author: 'مسلم', edition: 'تحقيق محمد فؤاد عبد الباقي' },
    ...(passage ? [{ book: 'تيسير الكريم الرحمن', author: 'السعدي', at: `ص ${num(passage.pages[0])}`, url: tafsirSadiPage(passage), quote: sadiOpening(passage.text) }] : []),
    { book: 'المدونة القرآنية العربية', edition: 'التحليل الصرفي، الإصدار ٠٫٤', url: 'https://corpus.quran.com' },
  ];
}
export const rahmanSourceList = () => sourcesOf(rahmanSources());

/** The scene's first page as a picture, for a card's share button. */
export const shareRahman = () => shareCard({ content: () => null, paged: () => ({ head: null, blocks: [], pictures: [<RahmanCover key={0} width={PAGE_W} />] }) });

/** The scene's buttons in a home card's row: the one open button, and share. */
export function RahmanActions({ only }: { only?: 'open' | 'share' }) {
  return <>
    {only !== 'share' && <OpenButton label={`افتح مشهد ${RAHMAN_NAME}`} onPress={openRahman} />}
    {only !== 'open' && <IconButton Icon={Send} label={`شارك مشهد ${RAHMAN_NAME}`} onPress={shareRahman} />}
  </>;
}
