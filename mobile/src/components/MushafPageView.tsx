import { memo, useCallback, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import Svg, { Ellipse } from 'react-native-svg';
import { Pressable, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import type { MushafPage, WordGroup } from '@shared/quran/readerPage';
import { isSajda, juzName, quarterLabel } from '@shared/quran/mushafMarks';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import type { PageModel, reciteView } from '@shared/quran/recitePage';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { breakLines, FLOW_LINE, flowSize } from '@/lib/pageZoom';

const BASMALA = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
/** Lines are measured once at this size, then drawn at the size that fits the screen (the website's fit() in MushafPage.tsx). */
const BASE = 40;
/** The end-of-ayah ornament with no number in it (U+06DD in the Hafs font). */
const EMPTY_END = '\u06DD';
const GAP = 0.2;
const SQUEEZE = 0.9;
const STRETCH = 1.15;

/** Natural width of each word group at BASE, by line, per page; the same on every screen, so measured once per page. */
const naturals = new Map<number, Record<number, number[]>>();
/** A line's natural width at BASE: its groups and the gaps between them. */
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
  /** The surah running at the top of the page. */
  top?: number;
  names: Record<number, string>;
  mark?: string | null;
  recite?: Recite | null;
  forgot: Readonly<Record<string, unknown>>;
  saved: ReadonlySet<string>;
  /** A touch on a word gives its ayah and the word's place in it (from 0, the ۞ mark not counted); a touch elsewhere on the page (or on a hidden word) gives null. */
  onTouch: (touch: Touch, key: string | null, x: number, y: number, word?: number) => void;
  /** Write mode: the next ayah's words to write (by place in the ayah, from 0), what each holds, and the box being written; a tap on a box picks it. */
  write?: Write | null;
  /** The last written ayah once shown: its written words, right ones green and wrong ones amber. */
  checked?: Checked | null;
  /** The text size: 1 is the printed page, fitted to `height`; bigger sets the words as flowing lines and the page runs as long as they need. */
  zoom?: number;
  /** The page's drawn height, told whenever it changes (a page with bigger text is taller than the screen). */
  onHeight?: (page: number, height: number) => void;
  /** With bigger text: an ayah to keep in sight (the one selected, or the next to recite), and where its first line is on the screen. */
  focus?: string | null;
  onFocus?: (y: number, height: number) => void;
};

export type Write = { key: string; targets: number[]; typed: Record<number, string>; current: number | null; onBox: (word: number) => void;
  /** Where the box being written is on the screen (its top and height), so the page can scroll it into sight above the keyboard. */
  onActive?: (y: number, height: number) => void };
/** A checked ayah: its right and wrong words, and what was typed for each wrong one (shown struck through above it). */
export type Checked = { key: string; right: number[]; wrong: number[]; typed: Record<number, string> };

const tint = (hex: string, alpha: number) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

function Word({ press, onLayout, children }: { press?: object; onLayout?: (event: LayoutChangeEvent) => void; children: React.ReactNode }) {
  return press ? <Pressable {...press} onLayout={onLayout}>{children}</Pressable> : <View onLayout={onLayout}>{children}</View>;
}

type Box = { x: number; y: number; w: number; h: number };
type Cell = { lit: boolean };

/**
 * A hidden word: a box the word's width and about one line of letters tall, the word itself invisible inside it.
 * A background on the text would cover the font's whole line (the Quran font's is very tall), so boxes overlapped the
 * lines above and below and the surah titles; this box is clipped to the letters.
 */
function Veil({ text, size, palette, next, faint = false }: { text: string; size: number; palette: Palette; next: boolean; faint?: boolean }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden
      style={{ height: size * 1.25, overflow: 'hidden', justifyContent: 'center', borderRadius: 5, opacity: faint ? 0.55 : 1, borderStyle: faint ? 'dashed' : 'solid',
      backgroundColor: faint ? 'transparent' : next ? tint(palette.accent, 0.22) : tint(palette.muted, 0.1), borderWidth: 1, borderColor: next && !faint ? palette.accent : palette.rule }}>
      <Text selectable={false} style={{ fontFamily: QURAN_FONT, fontSize: size, color: 'transparent', marginVertical: -size }}>{text}</Text>
    </View>
  );
}

/**
 * A word to write, in write mode: the hidden word's own box in its place on the line, holding what was typed.
 * The box being written has the accent border.
 */
function WriteBox({ text, size, palette, typed, active, onPress, onActive }: { text: string; size: number; palette: Palette; typed: string; active: boolean; onPress: () => void; onActive?: (y: number, height: number) => void }) {
  const box = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    // Again on each change of the page around it (the keyboard rising, a scroll), so the box stays in sight.
    if (active) box.current?.measureInWindow((_x: number, y: number, _w: number, h: number) => onActive?.(y, h));
  }, [active, onActive]);
  return (
    <Pressable ref={box} onPress={onPress} accessibilityRole="button" accessibilityLabel={typed ? `كلمة مكتوبة: ${typed}` : 'اكتب هذه الكلمة'} accessibilityState={{ selected: active }}
      style={{ height: size * 1.25, overflow: 'hidden', justifyContent: 'center', borderRadius: 5, backgroundColor: palette.paper, borderWidth: active ? 2 : 1, borderColor: active ? palette.accent : palette.rule }}>
      <Text selectable={false} style={{ fontFamily: QURAN_FONT, fontSize: size, color: 'transparent', marginVertical: -size }}>{text}</Text>
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ fontSize: size * 0.72, lineHeight: size * 1.1, color: palette.ink }}>{typed}</Text>
      </View>
    </Pressable>
  );
}

const groupText = (word: string, marks: number[]) => `${word}${marks.map(end => `${word ? ' ' : ''}${num(end)}`).join('')}`;

function MushafPageView({ page, data, model, palette, width, height, top, names, mark, recite, forgot, saved, onTouch, write, checked, zoom = 1, onHeight, focus, onFocus }: Props) {
  const [body, setBody] = useState<{ width: number; height: number } | null>(null);
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
  const flowing = zoom > 1;

  const itemCount = data.items.length;
  const rowHeight = body ? body.height / itemCount : 0;
  // A full page has 15 lines; a surah title or basmala takes one of them, even on the short opening pages, and the ayah lines share the rest.
  const oneLine = body ? body.height / 15 : 0;
  const lineHeight = body && lineAt.length ? (body.height - oneLine * (itemCount - lineAt.length)) / lineAt.length : rowHeight;
  // Pages 1 and 2 set their lines inside an oval, as the printed mushaf does: each line fills the oval's width at its height (the website's fitOpening()).
  const opening = page <= 2;
  const oval = useMemo(() => {
    if (!opening || !body || flowing) return null;
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
  }, [opening, body, itemCount, oneLine, lineAt, flowing]);
  const size = useMemo(() => {
    if (!body || !measured) return 0;
    if (flowing) return flowSize(body.width, zoom);
    if (oval) return Math.max(1, Math.min(oneLine * 0.72, ...lineAt.map(at => (BASE * oval.chords[at]) / (lineWidth(measured[at]) || 1))));
    const widths = lineAt.map(at => lineWidth(measured[at]) || 1);
    const widest = Math.max(1, ...widths);
    const typical = [...widths].sort((a, b) => a - b)[Math.floor(widths.length * 0.6)] ?? 1;
    return Math.max(1, Math.min((BASE * body.width) / typical, (BASE * body.width) / (widest * SQUEEZE), rowHeight * 0.72));
  }, [body, measured, lineAt, page, rowHeight, oval, oneLine, flowing, zoom]);
  // A surah title or basmala row: one of the page's 15 lines, or with flowing text one flowing line.
  const titleLine = flowing ? size * FLOW_LINE : oneLine;

  // The rows drawn: the page's own lines, or with bigger text its words wrapped again at the page's width, each run
  // of lines between two titles one paragraph.
  type Row = { id: string; item: number } | { id: string; groups: WordGroup[]; natural: number; index?: number; last?: boolean; single?: boolean };
  const rows = useMemo<Row[]>(() => {
    if (!measured) return [];
    if (!flowing) return data.items.map((item, index) => ('line' in item
      ? { id: `${index}`, groups: model.lines[index] ?? [], natural: lineWidth(measured[index]), index }
      : { id: `${index}`, item: index }));
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
  }, [measured, flowing, data, model, body, size, zoom]);

  // With bigger text the page runs past the screen: the row holding the ayah to keep in sight says where it is.
  const focused = { taken: false };
  const focusRow = useRef<ComponentRef<typeof View>>(null);
  const findFocus = useCallback(() => {
    focusRow.current?.measureInWindow((_x: number, y: number, _w: number, h: number) => onFocus?.(y, h));
  }, [onFocus]);
  useEffect(() => {
    if (flowing && focus) findFocus();
  }, [flowing, focus, findFocus, rows]);

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
  const upcoming = { backgroundColor: tint(palette.accent, 0.22) } as const;
  const small = Math.max(11, width * 0.026);
  const press = (key: string | null, word?: number) => ({
    onPress: (event: GestureResponderEvent) => onTouch('tap', key, event.nativeEvent.pageX, event.nativeEvent.pageY, word),
    onLongPress: (event: GestureResponderEvent) => onTouch('long', key, event.nativeEvent.pageX, event.nativeEvent.pageY, word),
    delayLongPress: 500,
  });

  // A highlighted ayah is one band behind its words on each line (the gaps between words included), not a box per word.
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const place = (id: string) => (event: LayoutChangeEvent) => {
    const { x, y, width: w, height: h } = event.nativeEvent.layout;
    setBoxes(prev => {
      const old = prev[id];
      return old && old.x === x && old.y === y && old.w === w && old.h === h ? prev : { ...prev, [id]: { x, y, w, h } };
    });
  };
  const bands = (line: string, cells: Cell[]) => {
    const runs: number[][] = [];
    cells.forEach((cell, at) => {
      if (!cell.lit) return;
      const run = runs[runs.length - 1];
      if (run && run[run.length - 1] === at - 1) run.push(at);
      else runs.push([at]);
    });
    return runs.map(run => {
      const found = run.map(at => boxes[`${line}:${at}`]).filter(Boolean);
      if (!found.length) return null;
      const left = Math.min(...found.map(box => box.x));
      const right = Math.max(...found.map(box => box.x + box.w));
      const top = Math.min(...found.map(box => box.y));
      const bottom = Math.max(...found.map(box => box.y + box.h));
      return <View key={`b${run[0]}`} pointerEvents="none" style={{ position: 'absolute', left, top, width: right - left, height: bottom - top, borderRadius: 4, backgroundColor: tint(palette.accent, 0.16) }} />;
    });
  };

  // A titled surah's title (and basmala) are the first words of its first ayah, so that ayah's own words count after them.
  const counts: Record<string, number> = {};
  titled?.forEach((steps, surah) => { counts[`${surah}:1`] = steps - 1; });
  const plain: Record<string, number> = {};
  let surahHere = top;

  return (
    <View onLayout={onHeight ? event => onHeight(page, event.nativeEvent.layout.height) : undefined}
      style={{ width, ...(flowing ? { minHeight: height } : { height }), backgroundColor: palette.card, paddingTop: width * 0.03, paddingHorizontal: width * 0.02, paddingBottom: width * 0.02 }}>
      {/* One height on every page, chip or not, so facing pages' frames line up. */}
      <View style={{ height: Math.ceil(Math.max(20, small * 1.6)) + 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: width * 0.025, paddingBottom: 4, gap: 6 }}>
        <Text style={{ color: palette.muted, fontSize: small }}>الجزء {juzName(data.juz)}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, flexShrink: 1 }}>
          {badges.map(label => (
            <Text key={label} style={{ borderWidth: 1, borderColor: label === 'سجدة' ? palette.accent : palette.rule, color: label === 'سجدة' ? palette.accent : palette.muted, borderRadius: 10, paddingHorizontal: 7, fontSize: 11, lineHeight: 18, backgroundColor: palette.paper }}>{label}</Text>
          ))}
        </View>
        <Text style={[{ color: palette.muted, fontSize: small }, current && surahHidden(current) ? veiled : null]}>{current && names[current] ? plainName(names[current]) : ''}</Text>
      </View>
      {/* The double rule around the text. */}
      <View style={{ flex: 1, borderWidth: 1, borderColor: palette.rule }}>
        <View style={{ flex: 1, margin: 2, borderWidth: 1, borderColor: palette.rule, paddingHorizontal: width * 0.0125, paddingTop: width * 0.015 }}>
          <Pressable {...press(null)} style={flowing ? { flexGrow: 1 } : { flex: 1, overflow: 'hidden' }} onLayout={event => setBody({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
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
                    <View key={row.id} style={{ height: titleLine * (oval ? 2.6 : 1), justifyContent: oval ? 'flex-start' : 'center' }}>
                      <View style={{ height: titleLine * 0.94, borderWidth: 1, borderColor: palette.rule, padding: 2 }}>
                        <View style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[{ fontFamily: QURAN_FONT, fontSize: Math.min(size * 0.8, titleLine * 0.46), color: palette.accent }, veil ? veiled : null, veil && next === `${item.surah}:1` ? upcoming : null]}>{names[item.surah]}</Text>
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
              // A printed line is fitted to the page's width, squeezed or stretched a little; a flowing line spreads its
              // words across the page's width, all but a paragraph's last line, which starts at the right.
              const drawn = (row.natural * size) / BASE;
              const width = oval && row.index !== undefined ? oval.chords[row.index] : body!.width;
              const centred = flowing ? !!row.last && !row.single : drawn < width * 0.7;
              const scale = flowing ? Math.min(1, width / drawn) : centred ? 1 : Math.min(STRETCH, Math.max(oval ? 0 : SQUEEZE, width / drawn));
              const cells = row.groups.map(group => {
                const key = `${group.surah}:${group.ayah}`;
                const word = group.word ? (counts[key] = (counts[key] ?? -1) + 1) : 0;
                const wordHidden = !!hidden?.(key, word);
                const at = group.word && group.word !== '۞' ? (plain[key] = (plain[key] ?? -1) + 1) : undefined;
                // The word's place in its ayah, past a titled surah's title and basmala steps (write mode counts words only).
                const rel = word - (group.ayah === 1 && group.surah !== undefined ? titled?.get(group.surah) ?? 0 : 0);
                return { group, key, wordHidden, rel, at, lit: !wordHidden && !!forgot[key] };
              });
              const holdsFocus = flowing && !!focus && !focused.taken && cells.some(cell => cell.key === focus) && (focused.taken = true);
              return (
                <View key={row.id} ref={holdsFocus ? focusRow : undefined} onLayout={holdsFocus ? findFocus : undefined}
                  style={{ height: flowing ? size * FLOW_LINE : oval ? oneLine : lineHeight, flexDirection: 'row', alignItems: 'center', justifyContent: (centred && !flowing) || oval || (flowing && opening) ? 'center' : 'flex-start' }}>
                  <View style={centred
                    ? { flexDirection: 'row', alignItems: 'center', gap: GAP * size }
                    : { width: width / scale, flexShrink: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', transform: [{ scaleX: scale }], transformOrigin: oval ? 'center' : 'right' }}>
                    {bands(row.id, cells)}
                    {cells.map(({ group, key, wordHidden, rel, at: wordAt, lit }, at) => {
                      const endHidden = (end: number) => !!hidden?.(`${group.surah}:${end}`, Number.MAX_SAFE_INTEGER);
                      const marked = mark === key;
                      const writing = !!group.word && wordHidden && write?.key === key;
                      const graded = !wordHidden && checked?.key === key ? (checked.right.includes(rel) ? palette.green : checked.wrong.includes(rel) ? palette.amber : null) : null;
                      const mistyped = graded === palette.amber && group.word ? checked!.typed[rel] : '';
                      return (
                        // A hidden word is no target: a touch on it goes to the page, as on the website.
                        <Word key={at} press={wordHidden ? undefined : press(key, wordAt)} onLayout={lit ? place(`${row.id}:${at}`) : undefined}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* While hidden, the word and its ayah number are separate boxes, so an empty page still shows where each ayah ends. */}
                        {writing && write.targets.includes(rel)
                          ? <WriteBox text={group.word} size={size} palette={palette} typed={write.typed[rel] ?? ''} active={write.current === rel} onPress={() => write.onBox(rel)} onActive={write.onActive} />
                          : wordHidden && group.word ? <Veil text={group.word} size={size} palette={palette} faint={writing} next={next === key && !(group.ayah === 1 && group.surah !== undefined && firstHidden(group.surah))} /> : null}
                        {/* A wrong word keeps what was typed, struck through above it, so the reader sees the mistake. */}
                        {mistyped ? (
                          <View pointerEvents="none" style={{ position: 'absolute', bottom: '100%', left: -size, right: -size, alignItems: 'center' }}>
                            <Text numberOfLines={1} accessibilityLabel={`كتبت: ${mistyped}`} style={{ fontSize: size * 0.6, lineHeight: size * 0.85, color: palette.amber, textDecorationLine: 'line-through' }}>{mistyped}</Text>
                          </View>
                        ) : null}
                        <Text style={{ fontFamily: QURAN_FONT, fontSize: size, color: graded ?? (marked ? palette.accent : palette.ink) }}>
                          {wordHidden ? '' : group.word}
                          {group.marks.map(end => (
                            <Text key={end}>
                              {group.word ? ' ' : ''}
                              <Text style={{ color: !endHidden(end) && saved.has(`${group.surah}:${end}`) ? palette.root : palette.accent }}>
                                {/* A hidden ayah's end shows the empty ayah ornament, so the reader sees where each ayah ends. */}
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
          <View style={{ paddingVertical: 2 }}>
            <Text style={{ textAlign: 'center', color: palette.muted, fontSize: small }}>{num(page)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(MushafPageView);
