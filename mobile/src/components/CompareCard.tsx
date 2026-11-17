import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ArrowLeftRight, Bookmark, BookOpen, Clapperboard, Columns2, GalleryHorizontal, Rows2, Pause, UnfoldHorizontal, Play, RotateCcw, Send, X } from 'lucide-react-native';
import type { CardAyah, CardSide, PairCard } from '@shared/quran/compareCards';
import { ayahStarts, isRefrain, type ReadStep } from '@shared/quran/readPlan';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { aloneNote, aroundOf, besideRows, partLabel, rowSides, runsLabel, savedIdsOf, shownAyat, sideKeys, silentNote, surahName, toggleCardSaved, type AroundAyah } from '@/lib/compare';
import { around as aroundSetting, besideLayout, branchView, type BranchView } from '@/lib/settings';
import CompareTree from './CompareTree';
import { Gap, PartRule, Silent, StartRule } from './StoryParts';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { COMPARE_CARD, markColour, sideTitle, sideView, writtenLinks } from '@shared/quran/compareCardLook';
import { likenessAt } from '@/lib/branches';
import { nextSpeed, useReadAlong } from './useReadAlong';
import VideoSheet from './VideoSheet';
import { shareCard } from '@/lib/shareImage';
import TreeIcon from './TreeIcon';
import { cardVideoPage } from '@/lib/compareVideo';
import { WEBSITE } from '@/lib/branches';
import { surahPairHref } from '@shared/quran/curatedComparisons';
import { compareAnchor } from '@shared/compareBookmarks';
import { toTab } from '@/lib/ways';
import { compareMatrixOnly } from '@shared/quran/compareViews';

const DOUBLE_TAP = 280;

/** `written`: links whose words the sides write differently (writtenLinks). */
type Light = { lit: string | null; reading?: number; onWord?: (link: string) => void; written?: Set<string> };

/** The card's first words and a link to its two passages on the website. */
function cardLink(card: PairCard) {
  const [a, b] = card.sides;
  // The two surahs' page, scrolled to this card; a one-to-many card links to the page alone, since its far side is one of several ayat.
  const href = `${surahPairHref(a.surah, b.surah)}${card.many ? '' : `#${compareAnchor(a, b)}`}`;
  return `${mushafText(a.ayat[0]?.words.slice(0, 6).join(' ') ?? '')} …\n${WEBSITE}${href}`;
}

/** One ayah: same words in the accent, same root in purple, a lit word and its partner on a highlight, the word read underlined. */
function AyahText({ ayah, palette, light, plain = false, inline = false }: { ayah: CardAyah; palette: Palette; light?: Light; plain?: boolean; inline?: boolean }) {
  return (
    <Text style={inline ? { color: plain ? palette.muted : palette.ink } : { ...ayahStyle(palette), color: plain ? palette.muted : palette.ink }}>
      {ayah.words.map((word, i) => {
        const mark = plain ? undefined : ayah.marks?.[i];
        const lit = !!mark?.link && mark.link === light?.lit;
        const reading = light?.reading === i;
        const color = lit ? palette.onHighlight : markColour(mark?.kind, palette, !!mark?.link && !!light?.written?.has(mark.link));
        const link = mark?.link;
        return (
          <Text key={i}>
            {i > 0 ? ' ' : ''}
            <Text onPress={link && light?.onWord ? () => light.onWord!(link) : undefined}
              style={[color ? { color } : null, lit ? { backgroundColor: palette.highlight } : null, reading ? { textDecorationLine: 'underline', textDecorationColor: palette.accent, backgroundColor: lit ? palette.highlight : palette.paperDeep } : null]}>
              {mushafText(word)}
            </Text>
          </Text>
        );
      })}
      <Text style={{ color: palette.accent }}>{"\u00A0"}{num(ayah.number)}</Text>
    </Text>
  );
}

/** The ayah before or after a side in the matrix: muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, palette }: { ayah: AroundAyah; palette: Palette }) {
  return (
    <Text style={{ fontSize: 18, color: palette.muted }}>
      {ayah.words.map((word, i) => {
        const kind = likenessAt(ayah, i);
        const color = kind && palette.marks[kind];
        return <Text key={i} style={color ? { color, opacity: 0.8 } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
      })}
      <Text>{"\u00A0"}{num(ayah.number)}</Text>
    </Text>
  );
}

/** A side's ayat as one running text, with the ayah before and after (muted) when the surrounding switch is on. */
function RunningAyat({ ayat, before, after, palette, light, lane = false }: { ayat: CardAyah[]; before?: AroundAyah | null; after?: AroundAyah | null; palette: Palette; light: (ayah: CardAyah) => Light; /** Half the card wide, side by side. */ lane?: boolean }) {
  return (
    <Text style={lane ? { ...ayahStyle(palette), fontSize: COMPARE_CARD.laneSize, lineHeight: COMPARE_CARD.laneLine } : ayahStyle(palette)}>
      {before && <><Neighbour ayah={before} palette={palette} />{' '}</>}
      {ayat.map((ayah, i) => <Text key={ayah.number}>{i > 0 ? ' ' : ''}<AyahText ayah={ayah} palette={palette} light={light(ayah)} inline /></Text>)}
      {after && <>{' '}<Neighbour ayah={after} palette={palette} /></>}
    </Text>
  );
}

/** The ayat's type, as the video draws it too (shared/quran/compareCardLook.ts). */
const ayahStyle = (palette: Palette) => ({ fontFamily: QURAN_FONT, fontSize: COMPARE_CARD.ayahSize, lineHeight: COMPARE_CARD.ayahLine, color: palette.ink, writingDirection: 'rtl', textAlign: 'center' }) as const;

function SideHead({ label, keys, palette, group }: { label: string; keys: string[]; palette: Palette; group?: string }) {
  const read = `اقرأ ${label} في المصحف`;
  return (
    // The buttons at the right edge, in the thumb's reach, and the surah's name and number in the middle (owner, 2026-11-15).
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ position: 'absolute', right: 0, flexDirection: 'row-reverse', alignItems: 'center', zIndex: 1 }}>
        <Pressable onPress={() => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } })} hitSlop={8} accessibilityRole="button" accessibilityLabel={read} style={{ padding: 6 }}>
          <BookOpen size={18} color={palette.muted} />
        </Pressable>
        {group && <Pressable onPress={() => toTab({ pathname: '/branches', params: { tree: group } })} hitSlop={8} accessibilityRole="button" accessibilityLabel="افتح في متشابهات القرآن" style={{ padding: 6 }}>
          <TreeIcon size={18} color={palette.muted} />
        </Pressable>}
      </View>
      <Text style={{ flex: 1, color: palette.muted, fontSize: COMPARE_CARD.labelSize, textAlign: 'center', paddingHorizontal: group ? 64 : 32, minHeight: 30, lineHeight: 30 }}>{label}</Text>
    </View>
  );
}

/** A lane's head side by side: the surah and its ayat, then its buttons, all on one line to fit half the card. */
function LaneHead({ label, keys, palette, group }: { label: string; keys: string[]; palette: Palette; group?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 30 }}>
      <Text style={{ color: palette.muted, fontSize: COMPARE_CARD.labelSize, textAlign: 'center', flexShrink: 1 }}>{label}</Text>
      <Pressable onPress={() => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } })} hitSlop={8} accessibilityRole="button" accessibilityLabel={`اقرأ ${label} في المصحف`} style={{ padding: 4 }}>
        <BookOpen size={16} color={palette.muted} />
      </Pressable>
      {group && <Pressable onPress={() => toTab({ pathname: '/branches', params: { tree: group } })} hitSlop={8} accessibilityRole="button" accessibilityLabel="افتح في متشابهات القرآن" style={{ padding: 4 }}>
        <TreeIcon size={16} color={palette.muted} />
      </Pressable>}
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
          <Pressable key={start} onPress={() => read.play(start)} accessibilityRole="button" accessibilityLabel={`من الآية ${num(i + 1)}`} style={{ flex: 1, height: 22, justifyContent: 'center' }}>
            <View style={{ height: COMPARE_CARD.bar.height, borderRadius: COMPARE_CARD.bar.radius, backgroundColor: i < reached ? palette.green : palette.rule }} />
          </Pressable>
        ))}
      </View>}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={nextSpeed} accessibilityRole="button" accessibilityLabel={`السرعة ${read.speed}×`} style={[button, { minWidth: 44, alignItems: 'center' }]}>
          <Text style={{ color: palette.muted, fontSize: 15 }}>{read.speed}×</Text>
        </Pressable>
        <Pressable onPress={() => (playing ? read.pause() : read.play())} accessibilityRole="button" accessibilityLabel={label} style={button}>
          {playing ? <Pause size={22} color={palette.accent} /> : <Play size={22} color={active ? palette.accent : palette.muted} />}
        </Pressable>
        <Pressable onPress={read.reset} accessibilityRole="button" accessibilityLabel="إعادة ضبط" style={button}><RotateCcw size={22} color={palette.muted} /></Pressable>
        <Pressable onPress={record} accessibilityRole="button" accessibilityLabel="مشاركة كفيديو" style={button}><Send size={22} color={palette.muted} /></Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={read.close} accessibilityRole="button" accessibilityLabel="إغلاق الاستوديو" style={button}><X size={22} color={palette.muted} /></Pressable>
      </View>
    </View>
  );
}

/** One compare card: both sides stacked, tap a coloured word to light its partner, double tap to save, the studio reads along. */
function CompareCard({ card, palette, onPageVideo, onOpen }: { card: PairCard; palette: Palette; /** Opens the whole pair page's video, offered in the share sheet. */ onPageVideo?: () => void;
  /** Set where the card shows outside the compare tab (the home feed): a button that opens it there. */
  onOpen?: () => void }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = savedIdsOf(card, bookmarks).length > 0;
  const read = useReadAlong(card);
  const step = read.step;
  // Share as video: the card read along in a story frame, from the studio or from the share sheet.
  const [video, setVideo] = useState<((font: string) => string) | null>(null);
  const record = () => { read.reset(); setVideo(() => cardVideoPage(card, read.plan, read.speed, palette)); };
  const [tapped, setTapped] = useState<string | null>(null);
  const [picked, setPicked] = useState(0);
  const lit = step ? step.link ?? null : tapped;
  const selected = step?.option ?? picked;
  const onWord = (link: string) => { if (!step) setTapped(current => (current === link ? null : link)); };
  const [view, setView] = useState<BranchView>(branchView.get);
  const [beside, setBeside] = useState(besideLayout.get);
  // The read-along studio lights words in the matrix, so it shows the matrix while open; a matrix-only card never shows a tree.
  const matrixOnly = compareMatrixOnly(card);
  const tree = view === 'tree' && !read.studio && !matrixOnly;
  const sides = shownAyat(card, selected);
  // The card's own switches, opening on the settings' defaults.
  const [aroundOn, setAround] = useState(aroundSetting.get);
  const around = aroundOn ? aroundOf(sides) : undefined;
  const written = useMemo(() => writtenLinks(card, selected), [card, selected]);
  // A story card lines its parts up in rows; any part folds to its ayah range, both sides at once.
  const parts = card.many ? undefined : card.sides[0].rows;
  const [closed, setFolded] = useState<number[]>([]);
  // The studio reads every part, so it opens them all while it runs.
  const folded = read.studio ? [] : closed;
  const toggle = (row: number) => setFolded(current => (current.includes(row) ? current.filter(other => other !== row) : [...current, row]));
  const partName = (cardSide: CardSide, row: number) => `${surahName(cardSide.surah)} ${runsLabel(cardSide.rows![row])}`.trim();

  const scale = useSharedValue(1);
  const [pop, setPop] = useState(0);
  useEffect(() => { if (pop) scale.value = withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 })); }, [pop, scale]);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const lastTap = useRef(0);
  const tap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!saved) toggleCardSaved(card);
      setPop(value => value + 1);
    } else lastTap.current = now;
  };

  // A side as the shared pieces (shared/quran/compareCardLook.ts), which the video draws too.
  const side = (cardSide: CardSide, i: 0 | 1) => {
    const view = sideView(card, i, selected, folded);
    const keys = view.name.listed ? view.name.numbers.map(n => `${cardSide.surah}:${n}`) : sideKeys(cardSide);
    const light = (ayah: CardAyah) => lightFor(lit, step, i, ayah.number, onWord, written);
    const many = card.many && card.many.side === i && !view.refrain;
    return (
      <View key={i} style={{ gap: many ? COMPARE_CARD.optionsGap : COMPARE_CARD.sideGap }}>
        <SideHead label={sideTitle(view.name, surahName)} keys={keys} palette={palette} group={i === 0 ? card.group : undefined} />
        {/* Story cards run in the first surah's order, so this surah tells this part before the last card's. */}
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
              return ayah ? <RunningAyat key={k} ayat={[]} {...{ [piece.which]: ayah }} palette={palette} light={() => ({ lit: null })} /> : null;
            }
            case 'ayat': {
              if (piece.option === undefined) return <RunningAyat key={k} ayat={piece.ayat} before={piece.before ? around?.before[i] : undefined} after={piece.after ? around?.after[i] : undefined} palette={palette} light={light} />;
              const row = piece.option;
              const ayah = piece.ayat[0];
              return (
                <Pressable key={k} onPress={() => { if (!step && row !== selected) { setPicked(row); setTapped(null); } }} accessibilityRole="button" accessibilityState={{ selected: piece.picked }}
                  accessibilityLabel={`${surahName(cardSide.surah)} ${num(ayah.number)}`}
                  style={{ borderRightWidth: COMPARE_CARD.pickBar, borderRightColor: piece.picked ? palette.accent : 'transparent', paddingRight: COMPARE_CARD.pickPad }}>
                  <AyahText ayah={ayah} palette={palette} plain={piece.plain} light={piece.picked ? light(ayah) : undefined} />
                </Pressable>
              );
            }
          }
        })}
      </View>
    );
  };

  // Side by side: a lane per surah; a story part one surah tells runs across the card, its separator naming the surah that does not (owner, 2026-11-16).
  const besideBody = () => {
    // A lane breaks where its ayat skip, each stretch after the first under a dotted rule naming its ayat, as the stacked sides do.
    const lane = (cardSide: CardSide, i: 0 | 1, wide = false) => {
      const stretches = cardSide.ayat.reduce<CardAyah[][]>((all, ayah) => {
        const last = all[all.length - 1];
        if (last && ayah.number === last[last.length - 1].number + 1) last.push(ayah); else all.push([ayah]);
        return all;
      }, []);
      return stretches.map((stretch, k) => (
        <View key={k}>
          {k > 0 && <Gap label={runsLabel(stretch.map(ayah => ayah.number))} palette={palette} />}
          <RunningAyat lane={!wide} ayat={stretch} before={parts || k > 0 ? undefined : around?.before[i]} after={parts || k < stretches.length - 1 ? undefined : around?.after[i]} palette={palette}
            light={ayah => lightFor(lit, step, i, ayah.number, onWord, written)} />
        </View>
      ));
    };
    const same = card.sides[0].surah === card.sides[1].surah;
    const twoLanes = (render: (i: 0 | 1) => ReactNode) => (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>{render(0)}</View>
        {/* Solid between two surahs, dashed within one, as the stacked rule; iOS draws no dashed border on one edge, so a dashed box is clipped to one edge. */}
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
          const keys = view.name.listed ? view.name.numbers.map(n => `${cardSide.surah}:${n}`) : sideKeys(cardSide);
          return (
            <View key={i} style={{ flex: 1 }}>
              <LaneHead label={sideTitle(view.name, surahName)} keys={keys} palette={palette} group={i === 0 ? card.group : undefined} />
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
        <Pressable key={item.id} onPress={() => setPicked(row)} accessibilityRole="button" accessibilityState={{ selected: row === selected }}
          accessibilityLabel={`${surahName(card.sides[card.many!.side].surah)} ${num(item.ayah.number)}`}
          style={{ minWidth: 44, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: row === selected ? palette.accent : palette.rule, paddingHorizontal: 8 }}>
          <Text style={{ color: row === selected ? palette.accent : palette.muted, fontSize: 14 }}>{num(item.ayah.number)}</Text>
        </Pressable>
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
  // Share as image: the card as it is now (view, folded parts, lit words), drawn afresh for the image.
  const cardBox = { backgroundColor: palette.card, borderWidth: COMPARE_CARD.border, borderColor: palette.rule, borderRadius: COMPARE_CARD.radius, padding: COMPARE_CARD.padding, gap: COMPARE_CARD.gap };
  const share = () => shareCard({ content: width => <View style={{ ...cardBox, width }}>{body}</View>, link: cardLink(card), onVideo: record, onPageVideo });
  return (
    <View style={{ gap: 4 }}>
      {/* A tree stands on the page as the branches trees do, its boxes the cards; the matrix is one card. */}
      <Pressable onPress={tap} accessibilityHint="انقر مرتين للحفظ" style={tree ? { gap: COMPARE_CARD.gap } : cardBox}>
        {body}
      </Pressable>
      {read.studio ? <Studio read={read} palette={palette} record={record} /> : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Pressable onPress={() => toggleCardSaved(card)} hitSlop={6} accessibilityRole="button" accessibilityState={{ selected: saved }} accessibilityLabel={saved ? 'إزالة من المحفوظة' : 'حفظ'} style={{ padding: 8 }}>
            <Animated.View style={popped}><Bookmark size={22} color={saved ? palette.accent : palette.muted} fill={saved ? palette.accent : 'transparent'} /></Animated.View>
          </Pressable>
          <Pressable onPress={read.open} hitSlop={6} accessibilityRole="button" accessibilityLabel="استوديو القراءة" style={{ padding: 8 }}>
            <Clapperboard size={22} color={palette.muted} />
          </Pressable>
          {/* A story card's parts show no surrounding ayat, so it has no switch for them. */}
          {!parts && <Pressable onPress={() => setAround(!aroundOn)} hitSlop={6} accessibilityRole="button" accessibilityState={{ selected: aroundOn }} accessibilityLabel="الآيات المحيطة" style={{ padding: 8 }}>
            <UnfoldHorizontal size={22} color={aroundOn ? palette.accent : palette.muted} />
          </Pressable>}
          {!tree && <Pressable onPress={() => setBeside(!beside)} hitSlop={6} accessibilityRole="button" accessibilityLabel={beside ? 'السورتان بعضهما تحت بعض' : 'السورتان جنبًا إلى جنب'} style={{ padding: 8 }}>
            {beside ? <Rows2 size={22} color={palette.muted} /> : <Columns2 size={22} color={palette.muted} />}
          </Pressable>}
          {!matrixOnly && <Pressable onPress={() => setView(view === 'tree' ? 'matrix' : 'tree')} hitSlop={6} accessibilityRole="button" accessibilityLabel={view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة'} style={{ padding: 8 }}>
            {view === 'tree' ? <GalleryHorizontal size={22} color={palette.muted} /> : <TreeIcon size={22} color={palette.muted} />}
          </Pressable>}
          {/* In matrix view this button sits on the first ayah's line instead, as on the website. */}
          {tree && card.group && <Pressable onPress={() => toTab({ pathname: '/branches', params: { tree: card.group } })} hitSlop={6} accessibilityRole="button" accessibilityLabel="افتح في متشابهات القرآن" style={{ padding: 8 }}>
            <TreeIcon size={22} color={palette.muted} />
          </Pressable>}
          {onOpen && <Pressable onPress={onOpen} hitSlop={6} accessibilityRole="button" accessibilityLabel="افتحها في المقارنة" style={{ padding: 8 }}>
            <ArrowLeftRight size={22} color={palette.muted} />
          </Pressable>}
          {/* Share is always the last button (the left end), as on the branches tab. */}
          <Pressable onPress={() => share()} hitSlop={6} accessibilityRole="button" accessibilityLabel="مشاركة" style={{ padding: 8 }}>
            <Send size={22} color={palette.muted} />
          </Pressable>
        </View>
      )}
      <VideoSheet page={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}

export default memo(CompareCard);

// A line between ayat: solid between two surahs, dashed between ayat of one surah, as on the website.
// iOS draws no dashed border on one edge only, so a dashed box is clipped to its top edge.
function Rule({ dashed, color }: { dashed?: boolean; color: string }) {
  if (!dashed) return <View style={{ height: 1, backgroundColor: color }} />;
  return (
    <View style={{ height: 1, overflow: 'hidden' }}>
      <View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dashed' }} />
    </View>
  );
}
