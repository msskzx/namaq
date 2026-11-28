import { memo, useCallback, useMemo, useRef, useState, type ComponentRef } from 'react';
import Svg, { Ellipse } from 'react-native-svg';
import { Pressable, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/ui/Text';
import type { MushafPage, WordGroup } from '@shared/quran/readerPage';
import { isSajda, juzName, quarterLabel } from '@shared/quran/mushafMarks';
import { num } from '@shared/quran/arabicNumber';
import { wordAtPoint } from '@shared/quran/selection';
import type { PageModel, reciteView } from '@shared/quran/recitePage';
import { Mistyped, tint, Veil, WriteBox } from './quran/text/WriteBoxes';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { breakLines, FLOW_LINE, flowSize } from '@/lib/pageZoom';
import { useOnChange } from '@/lib/hooks/useOnChange';

const BASMALA = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
const BASE = 40;
const EMPTY_END = '\u06DD';
const GAP = 0.2;
const SQUEEZE = 0.9;
const STRETCH = 1.15;
const SLICE_LINE = 1.9;
const TEXT_HEIGHT = 0.55;

const naturals = new Map<number, Record<number, number[]>>();
const lineWidth = (groups: number[] | undefined) => (groups ? groups.reduce((sum, w) => sum + w, 0) + Math.max(0, groups.length - 1) * GAP * BASE : 0);

export type Touch = 'tap' | 'long';
export type Recite = ReturnType<typeof reciteView>;

type Props = {
  page: number;
  data: MushafPage;
  model: PageModel;
  palette: Palette;
  width: number;
  height: number;
  top?: number;
  names: Record<number, string>;
  mark?: string | null;
  playing?: string | null;
  markWords?: { from: number; to: number } | null;
  recite?: Recite | null;
  forgot: Readonly<Record<string, unknown>>;
  saved: ReadonlySet<string>;
  onTouch: (touch: Touch, key: string | null, x: number, y: number, word?: number) => void;
  onSelect?: (key: string, anchor: number, now: number, x: number, y: number, done: boolean) => void;
  write?: Write | null;
  checked?: Checked | null;
  zoom?: number;
  onHeight?: (page: number, height: number) => void;
  focus?: string | null;
  onFocus?: (y: number, height: number) => void;
  slice?: { from: number; to: number };
  anonymous?: boolean;
};


export type Write = { key: string; targets: number[]; typed: Record<number, string>; current: number | null; onBox: (word: number) => void;
  onActive?: (y: number, height: number) => void };
export type Checked = { key: string; right: number[]; wrong: number[]; typed: Record<number, string> };

const HOLD = { top: 4000, bottom: 4000, left: 4000, right: 4000 };

function Word({ press, onLayout, hold, children }: { press?: object; onLayout?: (event: LayoutChangeEvent) => void; hold?: (view: ComponentRef<typeof View> | null) => void; children: React.ReactNode }) {
  return press ? <Pressable ref={hold} {...press} onLayout={onLayout}>{children}</Pressable> : <View onLayout={onLayout}>{children}</View>;
}

type Box = { x: number; y: number; w: number; h: number };
type Body = { width: number; height: number; of?: string };

const smallOf = (width: number) => Math.max(11, width * 0.026);
const headerOf = (width: number) => Math.ceil(Math.max(20, smallOf(width) * 1.6)) + 4;
const footerOf = (width: number) => Math.ceil(smallOf(width) * 1.25) + 4;
const bodyOf = (width: number, height: number): Body => ({
  width: width * (1 - 0.04 - 0.025) - 8,
  height: height - width * (0.03 + 0.02 + 0.015) - headerOf(width) - footerOf(width) - 8,
});
type Band = 'playing' | 'mark' | 'forgot' | null;
const BAND_TINT: Record<NonNullable<Band>, (palette: Palette) => string> = {
  playing: palette => palette.bands.playing,
  mark: palette => palette.bands.mark,
  forgot: palette => palette.bands.forgot,
};
type Cell = { band: Band; word?: boolean };

const groupText = (word: string, marks: number[]) => `${word}${marks.map(end => `${word ? ' ' : ''}${num(end)}`).join('')}`;

const NUMBER_RING = 0.5;

function SurahNumber({ surah, ring, palette }: { surah: number; ring: number; palette: Palette }) {
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" pointerEvents="none"
      style={{ position: 'absolute', right: ring * 0.3, width: ring, height: ring, borderRadius: ring / 2, borderWidth: 1, borderColor: palette.muted, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: palette.muted, fontSize: ring * 0.42, lineHeight: ring * 0.9 }}>{num(surah)}</Text>
    </View>
  );
}

function MushafPageView({ page, data, model, palette, width, height, top, names, mark, playing = null, markWords = null, recite, forgot, saved, onTouch, onSelect, write, checked, zoom = 1, onHeight, focus, onFocus, slice, anonymous = false }: Props) {
  const flowing = zoom > 1;
  // see R0058
  const [bodies, setBodies] = useState<{ page?: Body; flow?: Body }>({});
  const estimate = slice ? null : bodyOf(width, height);
  const fresh = (one?: Body) => (one && one.of === `${width}x${height}` && (!estimate || Math.abs(one.width - estimate.width) < 2) ? one : undefined);
  const laid = (flowing ? fresh(bodies.flow) ?? fresh(bodies.page) : fresh(bodies.page)) ?? estimate ?? bodies.page ?? null;
  const body = useMemo(() => (laid && slice ? { width: laid.width, height } : laid), [laid, slice, height]);
  const [measured, setMeasured] = useState(() => naturals.get(page));
  const lineAt = useMemo(() => data.items.flatMap((item, at) => ('line' in item ? [at] : [])), [data]);
  const pending = useMemo<{ widths: Record<number, number[]>; count: number }>(() => ({ widths: {}, count: 0 }), []);
  const groupCount = useMemo(() => lineAt.reduce((sum, at) => sum + (model.lines[at]?.length ?? 0), 0), [lineAt, model]);
  const measure = useCallback((at: number, i: number) => (event: LayoutChangeEvent) => {
    const row = (pending.widths[at] ??= []);
    if (row[i] === undefined) pending.count += 1;
    row[i] = event.nativeEvent.layout.width;
    if (pending.count === groupCount) {
      naturals.set(page, { ...pending.widths });
      setMeasured(naturals.get(page));
    }
  }, [page, pending, groupCount]);

  const itemCount = data.items.length;
  const oneLine = body ? body.height / 15 : 0;
  const rowHeight = body ? (slice ? oneLine : body.height / itemCount) : 0;
  const pageLine = body && lineAt.length ? (body.height - oneLine * (itemCount - lineAt.length)) / lineAt.length : rowHeight;
  const opening = page <= 2;
  const oval = useMemo(() => {
    if (!opening || !body || flowing || slice) return null;
    const count = itemCount - 1;
    const top = (body.height - oneLine * (count + 2.6)) / 2 + oneLine * 2.6;
    const centre = top + (count * oneLine) / 2;
    const ry = (count / 2 + 0.7) * oneLine;
    const rx = body.width / 2 - 2;
    const textRy = ry - 0.3 * oneLine;
    const textRx = rx - 0.05 * body.width;
    const chords: Record<number, number> = {};
    lineAt.forEach(at => {
      const y = top + (at - 1 + 0.5) * oneLine - centre;
      chords[at] = 2 * textRx * Math.sqrt(Math.max(0, 1 - (y / textRy) ** 2));
    });
    return { top, centre, rx, ry, chords };
  }, [opening, body, itemCount, oneLine, lineAt, flowing, slice]);
  const size = useMemo(() => {
    if (!body || !measured) return 0;
    if (flowing) return flowSize(body.width, zoom);
    if (oval) return Math.max(1, Math.min(oneLine * TEXT_HEIGHT, ...lineAt.map(at => (BASE * oval.chords[at]) / (lineWidth(measured[at]) || 1))));
    const widths = lineAt.map(at => lineWidth(measured[at]) || 1);
    const widest = Math.max(1, ...widths);
    const typical = [...widths].sort((a, b) => a - b)[Math.floor(widths.length * 0.6)] ?? 1;
    return Math.max(1, Math.min((BASE * body.width) / typical, (BASE * body.width) / (widest * SQUEEZE), rowHeight * (slice ? 0.72 : TEXT_HEIGHT)));
  }, [body, measured, lineAt, page, rowHeight, oval, oneLine, flowing, zoom, slice]); // eslint-disable-line react-hooks/exhaustive-deps
  const block = useMemo(() => {
    if (!body || !measured || !size || flowing || oval || slice) return body?.width ?? 0;
    const widths = lineAt.map(at => lineWidth(measured[at]) || 1);
    const typical = [...widths].sort((a, b) => a - b)[Math.floor(widths.length * 0.6)] ?? 1;
    return Math.min(body.width, (size * Math.max(typical, Math.max(1, ...widths) * SQUEEZE)) / BASE);
  }, [body, measured, size, flowing, oval, slice, lineAt]);
  const inBlock = block < (body?.width ?? 0) - 0.5 ? { width: block, alignSelf: 'center' as const } : null;
  const sliceLine = (size || rowHeight * 0.72) * SLICE_LINE;
  const lineHeight = slice ? sliceLine : pageLine;
  const titleLine = flowing ? size * FLOW_LINE : slice ? sliceLine : oneLine;
  const sliceHeight = slice ? data.items.slice(slice.from, slice.to + 1).reduce((sum, item) => sum + ('line' in item ? lineHeight : titleLine), 0) : 0;

  type Row = { id: string; item: number } | { id: string; groups: WordGroup[]; natural: number; index?: number; last?: boolean; single?: boolean };
  const rows = useMemo<Row[]>(() => {
    if (!measured) return [];
    if (!flowing) return data.items.flatMap((item, index) => (slice && (index < slice.from || index > slice.to) ? [] : ['line' in item
      ? { id: `${index}`, groups: model.lines[index] ?? [], natural: lineWidth(measured[index]), index }
      : { id: `${index}`, item: index }]));
    if (!body || !size) return [];
    const out: Row[] = [];
    let run: { group: WordGroup; width: number }[] = [];
    const flush = () => {
      const starts = breakLines(run.map(cell => (cell.width * size) / BASE), body.width, GAP * size);
      starts.forEach((start, n) => {
        const part = run.slice(start, starts[n + 1] ?? run.length);
        out.push({ id: `f${zoom}-${out.length}`, groups: part.map(cell => cell.group), natural: lineWidth(part.map(cell => cell.width)), last: n === starts.length - 1, single: part.length === 1 });
      });
      run = [];
    };
    data.items.forEach((item, index) => {
      if ('line' in item) {
        (model.lines[index] ?? []).forEach((group, i) => run.push({ group, width: measured[index]?.[i] ?? 0 }));
        return;
      }
      flush();
      out.push({ id: `i${index}`, item: index });
    });
    flush();
    return out;
  }, [measured, flowing, data, model, body, size, zoom, slice]);

  const focused = { taken: false };
  const focusRow = useRef<ComponentRef<typeof View>>(null);
  const findFocus = useCallback(() => {
    focusRow.current?.measureInWindow((_x: number, y: number, _w: number, h: number) => onFocus?.(y, h));
  }, [onFocus]);
  useOnChange([flowing, focus, findFocus, rows], () => {
    if (flowing && focus) findFocus();
  });

  const first = data.items[0];
  const current = first && 'surah' in first ? first.surah : top;
  const titled = recite?.titled;
  const hidden = recite?.hidden;
  const next = recite?.upcoming;
  const surahHidden = (surah: number) => !!titled?.has(surah) && !!hidden?.(`${surah}:1`, 0);
  const basmalaHidden = (surah: number) => titled?.get(surah) === 2 && !!hidden?.(`${surah}:1`, 1);
  const firstHidden = (surah: number) => surahHidden(surah) || basmalaHidden(surah);
  const badges = data.items.flatMap(item => [...('quarter' in item && item.quarter ? [quarterLabel(item.quarter).join(' ')] : []), ...('line' in item && isSajda(item.line) ? ['سجدة'] : [])]);
  const veiled = { color: 'transparent', backgroundColor: tint(palette.muted, 0.1), borderRadius: 4 } as const;
  const upcoming = { backgroundColor: palette.paper } as const;
  const small = smallOf(width);
  const wordViews = useRef<Record<string, ComponentRef<typeof View> | null>>({});
  const holdWord = (key: string, word: number) => (view: ComponentRef<typeof View> | null) => { wordViews.current[`${key}:${word}`] = view; };
  const dragging = useRef<{ key: string; anchor: number; now: number; boxes: (Box | null)[] } | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);
  const startDrag = (key: string, anchor: number) => {
    setSelecting(key);
    const views = Object.entries(wordViews.current).filter(([id, view]) => view && id.startsWith(`${key}:`) && id.split(':').length === 3);
    const session = { key, anchor, now: anchor, boxes: [] as (Box | null)[] };
    dragging.current = session;
    for (const [id, view] of views) {
      const at = Number(id.split(':')[2]);
      view!.measure((_x: number, _y: number, w: number, h: number, x: number, y: number) => { session.boxes[at] = { x, y, w, h }; });
    }
  };
  const press = (key: string | null, word?: number) => ({
    onPress: (event: GestureResponderEvent) => onTouch('tap', key, event.nativeEvent.pageX, event.nativeEvent.pageY, word),
    onLongPress: (event: GestureResponderEvent) => {
      if (key && word !== undefined && onSelect) startDrag(key, word);
      onTouch('long', key, event.nativeEvent.pageX, event.nativeEvent.pageY, word);
    },
    onPressMove: (event: GestureResponderEvent) => {
      const session = dragging.current;
      if (!session) return;
      const now = wordAtPoint(Array.from(session.boxes, box => box ?? null), event.nativeEvent.pageX, event.nativeEvent.pageY);
      if (now === null || now === session.now) return;
      session.now = now;
      onSelect?.(session.key, session.anchor, now, event.nativeEvent.pageX, event.nativeEvent.pageY, false);
    },
    onPressOut: (event: GestureResponderEvent) => {
      const session = dragging.current;
      if (!session) return;
      dragging.current = null;
      setSelecting(null);
      onSelect?.(session.key, session.anchor, session.now, event.nativeEvent.pageX, event.nativeEvent.pageY, true);
    },
    delayLongPress: 500,
    ...(key && selecting === key ? { pressRetentionOffset: HOLD } : {}),
  });

  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const place = (id: string) => (event: LayoutChangeEvent) => {
    const { x, y, width: w, height: h } = event.nativeEvent.layout;
    setBoxes(prev => {
      const old = prev[id];
      return old && old.x === x && old.y === y && old.w === w && old.h === h ? prev : { ...prev, [id]: { x, y, w, h } };
    });
  };
  const litRuns = (cells: Cell[]) => {
    const runs: number[][] = [];
    cells.forEach((cell, at) => {
      if (!cell.word) return;
      const run = runs[runs.length - 1];
      if (run && run[run.length - 1] === at - 1) run.push(at);
      else runs.push([at]);
    });
    return runs;
  };
  const bands = (line: string, cells: Cell[]) => {
    const runs: number[][] = [];
    cells.forEach((cell, at) => {
      if (!cell.band) return;
      const run = runs[runs.length - 1];
      if (run && run[run.length - 1] === at - 1 && cells[run[0]].band === cell.band) run.push(at);
      else runs.push([at]);
    });
    return runs.map(run => {
      const found = run.map(at => boxes[`${line}:${at}`]).filter(Boolean);
      if (!found.length) return null;
      const left = Math.min(...found.map(box => box.x));
      const right = Math.max(...found.map(box => box.x + box.w));
      const top = Math.min(...found.map(box => box.y));
      const bottom = Math.max(...found.map(box => box.y + box.h));
      return <View key={`b${run[0]}`} pointerEvents="none" style={{ position: 'absolute', left, top, width: right - left, height: bottom - top, borderRadius: 4, backgroundColor: BAND_TINT[cells[run[0]].band!](palette) }} />;
    }).concat(litRuns(cells).map(run => {
      const found = run.map(at => boxes[`${line}:${at}`]).filter(Boolean);
      if (!found.length) return null;
      const left = Math.min(...found.map(box => box.x)), right = Math.max(...found.map(box => box.x + box.w));
      const top = Math.min(...found.map(box => box.y)), bottom = Math.max(...found.map(box => box.y + box.h));
      return <View key={`w${run[0]}`} pointerEvents="none" style={{ position: 'absolute', left, top, width: right - left, height: bottom - top, borderRadius: 4, backgroundColor: palette.bands.word }} />;
    }));
  };

  const counts: Record<string, number> = {};
  titled?.forEach((steps, surah) => { counts[`${surah}:1`] = steps - 1; });
  const plain: Record<string, number> = {};
  let surahHere = top;

  return (
    // see R0058
    <View key={flowing ? 'flow' : 'page'} onLayout={onHeight ? event => onHeight(page, event.nativeEvent.layout.height) : undefined}
      style={slice ? { width } : { width, ...(flowing ? { minHeight: height } : { height }), backgroundColor: palette.card, paddingTop: width * 0.03, paddingHorizontal: width * 0.02, paddingBottom: width * 0.02 }}>
      {!slice && <View style={{ height: headerOf(width), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: width * 0.025, paddingBottom: 4, gap: 6 }}>
        <Text style={{ color: palette.muted, fontSize: small }}>{anonymous ? '' : `الجزء ${juzName(data.juz)}`}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, flexShrink: 1 }}>
          {!anonymous && badges.map(label => (
            <Text key={label} style={{ borderWidth: 1, borderColor: label === 'سجدة' ? palette.accent : palette.rule, color: label === 'سجدة' ? palette.accent : palette.muted, borderRadius: 10, paddingHorizontal: 7, fontSize: 11, lineHeight: 18, backgroundColor: palette.paper }}>{label}</Text>
          ))}
        </View>
        <Text style={[{ color: palette.muted, fontSize: small }, current && surahHidden(current) ? veiled : null]}>{!anonymous && current && names[current] ? names[current] : ''}</Text>
      </View>}
      <View style={slice ? undefined : { ...(flowing ? { flexGrow: 1 } : { flex: 1 }), borderWidth: 1, borderColor: palette.rule }}>
        <View style={slice ? undefined : { ...(flowing ? { flexGrow: 1 } : { flex: 1 }), margin: 2, borderWidth: 1, borderColor: palette.rule, paddingHorizontal: width * 0.0125, paddingTop: width * 0.015 }}>
          <Pressable {...press(null)} style={slice ? { height: sliceHeight, overflow: 'hidden' } : flowing ? { flexGrow: 1 } : { flex: 1, overflow: 'hidden' }} onLayout={event => { const { width: w, height: h } = event.nativeEvent.layout; setBodies(prev => ({ ...prev, [flowing ? 'flow' : 'page']: { width: w, height: h, of: `${width}x${height}` } })); }}>
            {!measured && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, width: 10000, opacity: 0 }}>
                {lineAt.map(at => {
                  const item = data.items[at];
                  return 'line' in item && (
                    <View key={at} style={{ flexDirection: 'row', alignSelf: 'flex-start', gap: GAP * BASE }}>
                      {(model.lines[at] ?? []).map((group, i) => <Text key={i} onLayout={measure(at, i)} style={{ fontFamily: QURAN_FONT, fontSize: BASE }}>{groupText(group.word, group.marks)}</Text>)}
                    </View>
                  );
                })}
              </View>
            )}
            {oval && (
              <Svg pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0 }} width={body!.width} height={body!.height}>
                <Ellipse cx={body!.width / 2} cy={oval.centre} rx={oval.rx} ry={oval.ry} stroke={palette.rule} strokeWidth={1} fill="none" />
                <Ellipse cx={body!.width / 2} cy={oval.centre} rx={oval.rx - 3} ry={oval.ry - 3} stroke={palette.rule} strokeWidth={1} fill="none" />
              </Svg>
            )}
            {oval && <View style={{ height: oval.top - oneLine * 2.6 }} />}
            {size > 0 && rows.map(row => {
              if ('item' in row) {
                const item = data.items[row.item];
                if ('surah' in item) {
                  surahHere = item.surah;
                  const veil = surahHidden(item.surah);
                  return (
                    <View key={row.id} style={[{ height: titleLine * (oval ? 2.6 : 1), justifyContent: oval ? 'flex-start' : 'center' }, inBlock]}>
                      <View style={{ height: titleLine * 0.94, borderWidth: 1, borderColor: palette.rule, padding: 2 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[{ fontFamily: QURAN_FONT, fontSize: Math.min(size * 0.8, titleLine * 0.46), color: palette.accent }, veil ? veiled : null, veil && next === `${item.surah}:1` ? upcoming : null]}>{names[item.surah]}</Text>
                          {!veil && names[item.surah] ? <SurahNumber surah={item.surah} ring={titleLine * NUMBER_RING} palette={palette} /> : null}
                        </View>
                      </View>
                    </View>
                  );
                }
                const surah = surahHere;
                const veil = surah !== undefined && basmalaHidden(surah);
                return (
                  <View key={row.id} style={{ height: titleLine, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[{ fontFamily: QURAN_FONT, fontSize: Math.min(size, titleLine * 0.58), color: palette.ink }, veil ? veiled : null, veil && surah !== undefined && !surahHidden(surah) && next === `${surah}:1` ? upcoming : null]}>{BASMALA}</Text>
                  </View>
                );
              }
              const drawn = (row.natural * size) / BASE;
              const width = oval && row.index !== undefined ? oval.chords[row.index] : block;
              const centred = flowing ? !!row.last && !row.single : drawn < width * (oval ? 1 / STRETCH : 0.7);
              const scale = flowing ? Math.min(1, width / drawn) : centred ? 1 : Math.min(STRETCH, Math.max(oval ? 0 : SQUEEZE, width / drawn));
              const cells = row.groups.map(group => {
                const key = `${group.surah}:${group.ayah}`;
                const word = group.word ? (counts[key] = (counts[key] ?? -1) + 1) : 0;
                const wordHidden = !!hidden?.(key, word);
                const at = group.word && group.word !== '۞' ? (plain[key] = (plain[key] ?? -1) + 1) : undefined;
                const rel = word - (group.ayah === 1 && group.surah !== undefined ? titled?.get(group.surah) ?? 0 : 0);
                const lit = mark === key && !!markWords && at !== undefined && at >= markWords.from && at <= markWords.to;
                const band: Band = wordHidden ? null : playing === key ? 'playing' : mark === key ? 'mark' : forgot[key] || (at !== undefined && forgot[`${key}:${at}`]) ? 'forgot' : null;
                return { group, key, wordHidden, rel, at, band, word: band === 'mark' && lit };
              });
              const holdsFocus = flowing && !!focus && !focused.taken && cells.some(cell => cell.key === focus) && (focused.taken = true);
              return (
                <View key={row.id} ref={holdsFocus ? focusRow : undefined} onLayout={holdsFocus ? findFocus : undefined}
                  style={[{ height: flowing ? size * FLOW_LINE : oval ? oneLine : lineHeight, flexDirection: 'row', alignItems: 'center', justifyContent: (centred && !flowing) || oval || (flowing && opening) ? 'center' : 'flex-start' }, inBlock]}>
                  <View style={centred
                    ? { flexDirection: 'row', alignItems: 'center', gap: GAP * size }
                    : { width: width / scale, flexShrink: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', transform: [{ scaleX: scale }], transformOrigin: oval ? 'center' : 'right' }}>
                    {bands(row.id, cells)}
                    {cells.map(({ group, key, wordHidden, rel, at: wordAt }, at) => {
                      const endHidden = (end: number) => !!hidden?.(`${group.surah}:${end}`, Number.MAX_SAFE_INTEGER);
                      const writing = !!group.word && wordHidden && write?.key === key;
                      const graded = !wordHidden && checked?.key === key ? (checked.right.includes(rel) ? palette.green : checked.wrong.includes(rel) ? palette.amber : null) : null;
                      const mistyped = graded === palette.amber && group.word ? checked!.typed[rel] : '';
                      return (
                        <Word key={at} press={wordHidden ? undefined : press(key, wordAt)} hold={wordHidden || wordAt === undefined ? undefined : holdWord(key, wordAt)} onLayout={place(`${row.id}:${at}`)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {writing && write.targets.includes(rel)
                          ? <WriteBox text={group.word} size={size} palette={palette} typed={write.typed[rel] ?? ''} active={write.current === rel} onPress={() => write.onBox(rel)} onActive={write.onActive} />
                          : wordHidden && group.word ? <Veil text={group.word} size={size} palette={palette} faint={writing} next={next === key && !(group.ayah === 1 && group.surah !== undefined && firstHidden(group.surah))} /> : null}
                        {mistyped ? <Mistyped text={mistyped} size={size} palette={palette} /> : null}
                        <Text style={{ fontFamily: QURAN_FONT, fontSize: size, color: graded ?? palette.ink }}>
                          {wordHidden ? '' : group.word}
                          {group.marks.map(end => (
                            <Text key={end}>
                              {group.word ? ' ' : ''}
                              <Text style={{ color: endHidden(end) ? palette.muted : saved.has(`${group.surah}:${end}`) ? palette.root : forgot[`${group.surah}:${end}`] ? palette.accent : palette.muted }}>
                                {endHidden(end) ? EMPTY_END : num(end)}
                              </Text>
                            </Text>
                          ))}
                        </Text>
                        </View>
                        </Word>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </Pressable>
          {!slice && <View style={{ height: footerOf(width), justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: palette.muted, fontSize: small }}>{anonymous ? ' ' : num(page)}</Text>
          </View>}
        </View>
      </View>
    </View>
  );
}

export default memo(MushafPageView);
