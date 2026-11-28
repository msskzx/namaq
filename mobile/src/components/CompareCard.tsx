import { memo, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import OpenButton from '@/ui/OpenButton';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Bookmark, Clapperboard, Columns2, GalleryHorizontal, Rows2, Pause, UnfoldHorizontal, Play, RotateCcw, Send, X } from 'lucide-react-native';
import type { CardAyah, CardSide, PairCard } from '@shared/quran/compareCards';
import { ayahStarts, isRefrain, type ReadStep } from '@shared/quran/readPlan';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { aloneNote, aroundOf, besideRows, partLabel, rowSides, runsLabel, savedIdsOf, shownAyat, sideKeys, silentNote, surahName, toggleCardSaved, type AroundAyah } from '@/lib/compare';
import { around as aroundSetting, besideLayout, type BranchView } from '@/lib/settings';
import CompareTree from './CompareTree';
import { Gap, PartRule, Silent, StartRule } from './StoryParts';
import { blend, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import { COMPARE_CARD, sideTitle, sideView, writtenLinks, type SideName } from '@shared/quran/compareCardLook';
import { likenessAt } from '@/lib/branches';
import { nextSpeed, useReadAlong } from './useReadAlong';
import VideoSheet from './VideoSheet';
import { shareCard } from '@/lib/shareImage';
import TreeIcon from './TreeIcon';
import { cardVideoPage } from '@/lib/compareVideo';
import { WEBSITE } from '@/lib/website';
import { surahPairHref } from '@shared/quran/curatedComparisons';
import { compareAnchor } from '@shared/compareBookmarks';
import { toTab } from '@/lib/ways';
import { readAyah } from '@/lib/openReader';
import { compareMatrixOnly } from '@shared/quran/compareViews';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { TANASUB_KIND, tanasubLink, tanasubSource } from '@shared/quran/tanasubCards';
import { FEATURE_ICON } from '@/components/featureIcons';

const DOUBLE_TAP = 280;

type Light = { lit: string | null; reading?: number; onWord?: (link: string) => void; written?: Set<string> };

function cardLink(card: PairCard) {
  const [a, b] = card.sides;
  const href = `${surahPairHref(a.surah, b.surah)}${card.many ? '' : `#${compareAnchor(a, b)}`}`;
  return `${mushafText(a.ayat[0]?.words.slice(0, 6).join(' ') ?? '')} …\n${WEBSITE}${href}`;
}

function ayahTextWords({ ayah, palette, light, plain = false }: { ayah: CardAyah; palette: Palette; light?: Light; plain?: boolean }) {
  return [
    ...ayah.words.map((word, i) => {
      const mark = plain ? undefined : ayah.marks?.[i];
      const lit = !!mark?.link && mark.link === light?.lit;
      const reading = light?.reading === i;
      const written = !!mark?.link && !!light?.written?.has(mark.link);
      const link = mark?.link;
      return (
        <AyahWords key={i} lit={lit} mark={mark?.kind && { kind: written && mark.kind === 'exact' ? 'written' : mark.kind }} onPress={link && light?.onWord ? () => light.onWord!(link) : undefined}
          look={{ ...(reading ? { textDecorationLine: 'underline', textDecorationColor: palette.accent, ...(lit ? null : { backgroundColor: palette.paperDeep }) } : null) }}>
          {`${i > 0 ? ' ' : ''}${word}`}
        </AyahWords>
      );
    }),
    <AyahWords key="n" look={{ color: palette.accent }}>{`\u00A0${num(ayah.number)}`}</AyahWords>,
  ];
}

function AyahText({ ayah, surah, palette, light, plain = false }: { ayah: CardAyah; surah: number; palette: Palette; light?: Light; plain?: boolean }) {
  return <AyahFlow center menu={`${surah}:${ayah.number}`} color={plain ? palette.muted : palette.ink}>{ayahTextWords({ ayah, palette, light, plain })}</AyahFlow>;
}

function neighbourWords(ayah: AroundAyah, palette: Palette) {
  return [
    ...ayah.words.map((word, i) => {
      const kind = likenessAt(ayah, i);
      const color = kind && palette.marks[kind];
      return <AyahWords key={i} look={{ color: color ? blend(color, palette.card, 0.8) : palette.muted }}>{`${i > 0 ? ' ' : ''}${word}`}</AyahWords>;
    }),
    <AyahWords key="n" look={{ color: palette.muted }}>{`\u00A0${num(ayah.number)}`}</AyahWords>,
  ];
}

function RunningAyat({ ayat, surah, before, after, palette, light, lane = false }: { ayat: CardAyah[]; surah: number; before?: AroundAyah | null; after?: AroundAyah | null; palette: Palette; light: (ayah: CardAyah) => Light; lane?: boolean }) {
  return (
    <AyahFlow center screen={lane} menu={[...(before ? [before.key] : []), ...ayat.map(ayah => `${surah}:${ayah.number}`), ...(after ? [after.key] : [])]} color={palette.ink}>
      {before && [...neighbourWords(before, palette), ' ']}
      {ayat.map((ayah, i) => [i > 0 ? ' ' : '', ...ayahTextWords({ ayah, palette, light: light(ayah) })])}
      {after && [' ', ...neighbourWords(after, palette)]}
    </AyahFlow>
  );
}

const readAt = (name: SideName, side: CardSide, selected: number) =>
  (name.listed ? `${side.surah}:${name.numbers[selected] ?? name.numbers[0]}` : sideKeys(side)[0]);

function SideHead({ label, at, palette, group, bare = false }: { label: string; at: string; palette: Palette; group?: string; bare?: boolean }) {
  const read = `اقرأ ${label} في المصحف`;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {!bare && <View style={{ position: 'absolute', right: 0, flexDirection: 'row-reverse', alignItems: 'center', zIndex: 1 }}>
        <IconButton Icon={FEATURE_ICON.mushaf} label={read} onPress={() => readAyah(at)} size="small" />
        {group && <IconButton Icon={TreeIcon} label="افتح في متشابهات القرآن" onPress={() => toTab({ pathname: '/branches', params: { tree: group } })} size="small" />}
      </View>}
      <Text style={{ flex: 1, color: palette.muted, fontSize: COMPARE_CARD.labelSize, textAlign: 'center', paddingHorizontal: bare ? 0 : group ? 64 : 32, minHeight: 30, lineHeight: 30 }}>{label}</Text>
    </View>
  );
}

function LaneHead({ label, at, palette, group, bare = false }: { label: string; at: string; palette: Palette; group?: string; bare?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 30 }}>
      <Text style={{ color: palette.muted, fontSize: COMPARE_CARD.labelSize, textAlign: 'center', flexShrink: 1 }}>{label}</Text>
      {!bare && <IconButton Icon={FEATURE_ICON.mushaf} label={`اقرأ ${label} في المصحف`} onPress={() => readAyah(at)} size="small" />}
      {!bare && group && <IconButton Icon={TreeIcon} label="افتح في متشابهات القرآن" onPress={() => toTab({ pathname: '/branches', params: { tree: group } })} size="small" />}
    </View>
  );
}

const lightFor = (lit: string | null, step: ReadStep | undefined, side: number, number: number, onWord: (link: string) => void, written: Set<string>): Light =>
  ({ lit, reading: step && step.side === side && step.ayah === number ? step.word : undefined, onWord, written });

function Studio({ read, palette, record }: { read: ReturnType<typeof useReadAlong>; palette: Palette; record: () => void }) {
  const starts = ayahStarts(read.plan);
  const playing = read.status === 'playing';
  const active = playing || read.status === 'paused';
  const reached = read.status === 'done' ? starts.length : active ? starts.filter(start => start <= read.at).length : 0;
  const label = playing ? 'إيقاف مؤقت' : read.status === 'paused' ? 'متابعة' : read.status === 'done' ? 'إعادة' : 'اقرأ مع التظليل';
  const button = { padding: 8 };
  return (
    <View style={{ gap: 2 }}>
      {starts.length > 1 && <View style={{ flexDirection: 'row', gap: COMPARE_CARD.bar.gap }} accessibilityLabel="تقدّم القراءة">
        {starts.map((start, i) => (
          <Tap key={start} onPress={() => read.play(start)} accessibilityRole="button" accessibilityLabel={`من الآية ${num(i + 1)}`} style={{ flex: 1, height: 22, justifyContent: 'center' }}>
            <View style={{ height: COMPARE_CARD.bar.height, borderRadius: COMPARE_CARD.bar.radius, backgroundColor: i < reached ? palette.green : palette.rule }} />
          </Tap>
        ))}
      </View>}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Tap onPress={nextSpeed} accessibilityRole="button" accessibilityLabel={`السرعة ${read.speed}×`} style={[button, { minWidth: 44, alignItems: 'center' }]}>
          <Text style={{ color: palette.muted, fontSize: 15 }}>{read.speed}×</Text>
        </Tap>
        <IconButton Icon={playing ? Pause : Play} label={label} onPress={() => (playing ? read.pause() : read.play())} on={active} />
        <IconButton Icon={RotateCcw} label="إعادة ضبط" onPress={read.reset} />
        <IconButton Icon={Send} label="مشاركة كفيديو" onPress={record} />
        <View style={{ flex: 1 }} />
        <IconButton Icon={X} label="إغلاق الاستوديو" onPress={read.close} />
      </View>
    </View>
  );
}

function CompareCard({ card, palette, onPageVideo, onOpen, aside }: { card: PairCard; palette: Palette; onPageVideo?: () => void;
  onOpen?: () => void;
  aside?: React.ReactNode }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = savedIdsOf(card, bookmarks).length > 0;
  const read = useReadAlong(card);
  const step = read.step;
  const [video, setVideo] = useState<((font: string) => string) | null>(null);
  const record = () => { read.reset(); setVideo(() => cardVideoPage(card, read.plan, read.speed, palette)); };
  const [tapped, setTapped] = useState<string | null>(null);
  const [picked, setPicked] = useState(0);
  const lit = step ? step.link ?? null : tapped;
  const selected = step?.option ?? picked;
  const onWord = (link: string) => { if (!step) setTapped(current => (current === link ? null : link)); };
  const [view, setView] = useState<BranchView>('matrix');
  const [beside, setBeside] = useState(besideLayout.get);
  const matrixOnly = compareMatrixOnly(card);
  const tree = view === 'tree' && !read.studio && !matrixOnly;
  const sides = shownAyat(card, selected);
  const [aroundOn, setAround] = useState(aroundSetting.get);
  const around = aroundOn ? aroundOf(sides) : undefined;
  const written = useMemo(() => writtenLinks(card, selected), [card, selected]);
  const parts = card.many ? undefined : card.sides[0].rows;
  const [closed, setFolded] = useState<number[]>([]);
  const folded = read.studio ? [] : closed;
  const toggle = (row: number) => setFolded(current => (current.includes(row) ? current.filter(other => other !== row) : [...current, row]));
  const partName = (cardSide: CardSide, row: number) => `${surahName(cardSide.surah)} ${runsLabel(cardSide.rows![row])}`.trim();

  const scale = useSharedValue(1);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const lastTap = useRef(0);
  const tap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!saved) toggleCardSaved(card);
      scale.set(withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 })));
    } else lastTap.current = now;
  };

  const side = (cardSide: CardSide, i: 0 | 1) => {
    const view = sideView(card, i, selected, folded);
    const light = (ayah: CardAyah) => lightFor(lit, step, i, ayah.number, onWord, written);
    const many = card.many && card.many.side === i && !view.refrain;
    return (
      <View key={i} style={{ gap: many ? COMPARE_CARD.optionsGap : COMPARE_CARD.sideGap }}>
        <SideHead label={sideTitle(view.name, surahName)} at={readAt(view.name, cardSide, selected)} palette={palette} group={i === 0 ? card.group : undefined} bare={!!onOpen} />
        {view.back && <Text style={{ color: palette.muted, fontSize: COMPARE_CARD.noteSize, textAlign: 'right' }}>قبلُ في السورة</Text>}
        {view.pieces.map((piece, k) => {
          switch (piece.kind) {
            case 'part': return <PartRule key={k} label={piece.label} folded={piece.folded} onToggle={() => toggle(piece.row)} name={partName(cardSide, piece.row)} palette={palette} />;
            case 'gap': return <Gap key={k} label={piece.label} palette={palette} />;
            case 'range': return <Text key={k} style={{ color: palette.muted, fontSize: COMPARE_CARD.noteSize, textAlign: 'center' }}>{piece.label}</Text>;
            case 'dash': return <Rule key={k} dashed color={palette.rule} />;
            case 'silent': return <Silent key={k} note={silentNote(piece.surah)} palette={palette} />;
            case 'around': {
              const ayah = (piece.which === 'before' ? around?.before : around?.after)?.[i];
              return ayah ? <RunningAyat key={k} ayat={[]} surah={cardSide.surah} {...{ [piece.which]: ayah }} palette={palette} light={() => ({ lit: null })} /> : null;
            }
            case 'ayat': {
              if (piece.option === undefined) return <RunningAyat key={k} ayat={piece.ayat} surah={cardSide.surah} before={piece.before ? around?.before[i] : undefined} after={piece.after ? around?.after[i] : undefined} palette={palette} light={light} />;
              const row = piece.option;
              const ayah = piece.ayat[0];
              return (
                <Tap key={k} onPress={() => { if (!step && row !== selected) { setPicked(row); setTapped(null); } }} accessibilityRole="button" accessibilityState={{ selected: piece.picked }}
                  accessibilityLabel={`${surahName(cardSide.surah)} ${num(ayah.number)}`}
                  style={{ borderRightWidth: COMPARE_CARD.pickBar, borderRightColor: piece.picked ? palette.accent : 'transparent', paddingRight: COMPARE_CARD.pickPad }}>
                  <AyahText ayah={ayah} surah={cardSide.surah} palette={palette} plain={piece.plain} light={piece.picked ? light(ayah) : undefined} />
                </Tap>
              );
            }
          }
        })}
      </View>
    );
  };

  const besideBody = () => {
    const lane = (cardSide: CardSide, i: 0 | 1, wide = false) => {
      const stretches = cardSide.ayat.reduce<CardAyah[][]>((all, ayah) => {
        const last = all[all.length - 1];
        if (last && ayah.number === last[last.length - 1].number + 1) last.push(ayah); else all.push([ayah]);
        return all;
      }, []);
      return stretches.map((stretch, k) => (
        <View key={k}>
          {k > 0 && <Gap label={runsLabel(stretch.map(ayah => ayah.number))} palette={palette} />}
          <RunningAyat lane={!wide} ayat={stretch} surah={cardSide.surah} before={parts || k > 0 ? undefined : around?.before[i]} after={parts || k < stretches.length - 1 ? undefined : around?.after[i]} palette={palette}
            light={ayah => lightFor(lit, step, i, ayah.number, onWord, written)} />
        </View>
      ));
    };
    const same = card.sides[0].surah === card.sides[1].surah;
    const twoLanes = (render: (i: 0 | 1) => ReactNode) => (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>{render(0)}</View>
        {same ? <View style={{ width: 1, overflow: 'hidden' }}><View style={{ flex: 1, width: 3, borderWidth: 1, borderColor: palette.rule, borderStyle: 'dashed' }} /></View>
          : <View style={{ width: 1, backgroundColor: palette.rule }} />}
        <View style={{ flex: 1 }}>{render(1)}</View>
      </View>
    );
    return <>
      {pickers}
      <View style={{ flexDirection: 'row', gap: 9 }}>
        {([0, 1] as const).map(i => {
          const view = sideView(card, i, selected, []);
          const cardSide = sides[i];
          return (
            <View key={i} style={{ flex: 1 }}>
              <LaneHead label={sideTitle(view.name, surahName)} at={readAt(view.name, cardSide, selected)} palette={palette} group={i === 0 ? card.group : undefined} bare={!!onOpen} />
              {view.back && <Text style={{ color: palette.muted, fontSize: COMPARE_CARD.noteSize, textAlign: 'center' }}>قبلُ في السورة</Text>}
            </View>
          );
        })}
      </View>
      {besideRows(sides).map((row, r) => {
        const shut = !!parts && folded.includes(r);
        if ('alone' in row) return (
          <View key={r} style={{ gap: 4 }}>
            {parts && <StartRule label={partLabel(row.alone.surah, card.sides[row.side].rows![r])} note={aloneNote(row.silent)} folded={shut} onToggle={() => toggle(r)} palette={palette} />}
            {!shut && lane(row.alone, row.side, true)}
          </View>
        );
        return (
          <View key={r} style={{ gap: 4 }}>
            {parts && <View style={{ flexDirection: 'row', gap: 9 }}>
              {([0, 1] as const).map(i => (
                <View key={i} style={{ flex: 1 }}>
                  <StartRule label={partLabel(row.lanes[i].surah, card.sides[i].rows![r])} folded={shut} onToggle={() => toggle(r)} palette={palette} />
                </View>
              ))}
            </View>}
            {!shut && twoLanes(i => lane(row.lanes[i], i))}
          </View>
        );
      })}
    </>;
  };

  const pickers = card.many && !isRefrain(card.many.options) && (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
      {card.many.options.map((item, row) => (
        <Tap key={item.id} onPress={() => setPicked(row)} accessibilityRole="button" accessibilityState={{ selected: row === selected }}
          accessibilityLabel={`${surahName(card.sides[card.many!.side].surah)} ${num(item.ayah.number)}`}
          style={{ minWidth: 44, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: row === selected ? palette.accent : palette.rule, paddingHorizontal: 8 }}>
          <Text style={{ color: row === selected ? palette.accent : palette.muted, fontSize: 14 }}>{num(item.ayah.number)}</Text>
        </Tap>
      ))}
    </View>
  );

  const body = (
      tree ? <>
        {pickers}
        {parts ? rowSides(sides).map((row, r) => (
          <View key={r} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {sides.map((cardSide, i) => (
                <View key={i} style={{ flex: 1 }}>
                  <PartRule label={folded.includes(r) && row[i].ayat.length ? runsLabel(cardSide.rows![r]) : undefined} folded={folded.includes(r)} onToggle={() => toggle(r)} name={partName(cardSide, r)} palette={palette} />
                </View>
              ))}
            </View>
            {!folded.includes(r) && <CompareTree sides={row} palette={palette} empty={[silentNote(row[0].surah), silentNote(row[1].surah)]} />}
          </View>
        )) : <CompareTree sides={sides} palette={palette} around={around} />}
      </> : beside ? besideBody() : <>
        {side(card.sides[0], 0)}
        <Rule dashed={card.sides[0].surah === card.sides[1].surah} color={palette.rule} />
        {side(card.sides[1], 1)}
      </>
  );
  const cardBox = { backgroundColor: palette.card, borderWidth: COMPARE_CARD.border, borderColor: palette.rule, borderRadius: COMPARE_CARD.radius, padding: COMPARE_CARD.padding, gap: COMPARE_CARD.gap };
  const share = () => shareCard({ content: width => <View style={{ ...cardBox, width }}>{body}{quote}</View>, link: cardLink(card), onVideo: record, onPageVideo });
  const link = card.book ? tanasubLink(card.book) : undefined;
  const sources = useMemo(() => (link ? sourcesOf([tanasubSource(link)]) : []), [link]);
  const quote = link && <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'right', writingDirection: 'rtl', borderTopWidth: tree ? 0 : 1, borderTopColor: palette.rule, paddingTop: 6 }}>«{link.text}»</Text>;
  const saveButton = <IconButton Icon={Bookmark} label={saved ? 'إزالة من المحفوظة' : 'حفظ'} onPress={() => toggleCardSaved(card)} on={saved} fill
    render={icon => <Animated.View style={popped}><Bookmark {...icon} /></Animated.View>} />;
  return (
    <View style={{ gap: 4 }}>
      {link && <Text style={{ color: palette.amber, fontSize: 14, textAlign: 'right', paddingHorizontal: 6 }}>{TANASUB_KIND}</Text>}
      <Tap onPress={tap} accessibilityHint="انقر مرتين للحفظ" style={tree ? { gap: COMPARE_CARD.gap } : cardBox}>
        {body}
        {quote}
      </Tap>
      {read.studio ? <Studio read={read} palette={palette} record={record} /> : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          {onOpen && <OpenButton label="افتحها في المقارنة" onPress={onOpen} />}
          {onOpen && ([0, 1] as const).map(i => {
            const view = sideView(card, i, selected, []);
            const label = sideTitle(view.name, surahName);
            return <IconButton key={i} Icon={FEATURE_ICON.mushaf} label={`اقرأ ${label} في المصحف`} onPress={() => readAyah(readAt(view.name, sides[i], selected))} />;
          })}
          {!onOpen && saveButton}
          <IconButton Icon={Clapperboard} label="استوديو القراءة" onPress={read.open} />
          {!parts && <IconButton Icon={UnfoldHorizontal} label="الآيات المحيطة" onPress={() => setAround(!aroundOn)} on={aroundOn} />}
          {!tree && <IconButton Icon={beside ? Rows2 : Columns2} label={beside ? 'السورتان بعضهما تحت بعض' : 'السورتان جنبًا إلى جنب'} onPress={() => setBeside(!beside)} />}
          {!matrixOnly && <IconButton Icon={view === 'tree' ? GalleryHorizontal : TreeIcon} label={view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة'} onPress={() => setView(view === 'tree' ? 'matrix' : 'tree')} />}
          {(tree || onOpen) && card.group && <IconButton Icon={TreeIcon} label="افتح في متشابهات القرآن" onPress={() => toTab({ pathname: '/branches', params: { tree: card.group } })} />}
          {onOpen && saveButton}
          <IconButton Icon={Send} label="مشاركة" onPress={() => share()} />
          {aside ? <><View style={{ flex: 1 }} />{aside}</> : null}
        </View>
      )}
      {!onOpen && <SourceLine named={sources} sources={sources} palette={palette} />}
      <VideoSheet page={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}

export default memo(CompareCard);

function Rule({ dashed, color }: { dashed?: boolean; color: string }) {
  if (!dashed) return <View style={{ height: 1, backgroundColor: color }} />;
  return (
    <View style={{ height: 1, overflow: 'hidden' }}>
      <View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dashed' }} />
    </View>
  );
}
