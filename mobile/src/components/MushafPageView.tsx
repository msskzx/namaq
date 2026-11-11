import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { Text } from '@/components/Text';
import type { MushafPage } from '@shared/quran/readerPage';
import { isSajda, juzName, quarterLabel } from '@shared/quran/mushafMarks';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import type { PageModel, reciteView } from '@/lib/recitePage';
import { QURAN_FONT, type Palette } from '@/lib/theme';

const BASMALA = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
/** Lines are measured once at this size, then drawn at the size that fits the screen (the website's fit() in MushafPage.tsx). */
const BASE = 40;
/** The end-of-ayah ornament with no number in it (U+06DD in the Hafs font). */
const EMPTY_END = '\u06DD';
const GAP = 0.2;
const SQUEEZE = 0.9;
const STRETCH = 1.15;

/** Natural width of each line at BASE, per page; the same on every screen, so measured once per page. */
const naturals = new Map<number, Record<number, number>>();

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
  /** A touch on a word gives its ayah; a touch elsewhere on the page (or on a hidden word) gives null. */
  onTouch: (touch: Touch, key: string | null, x: number, y: number) => void;
};

const tint = (hex: string, alpha: number) => `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;

function Word({ press, onLayout, children }: { press?: object; onLayout?: (event: LayoutChangeEvent) => void; children: React.ReactNode }) {
  return press ? <Pressable {...press} onLayout={onLayout}>{children}</Pressable> : <View onLayout={onLayout}>{children}</View>;
}

type Box = { x: number; y: number; w: number; h: number };
type Cell = { lit: boolean };

const groupText = (word: string, marks: number[]) => `${word}${marks.map(end => `${word ? ' ' : ''}${num(end)}`).join('')}`;

function MushafPageView({ page, data, model, palette, width, height, top, names, mark, recite, forgot, saved, onTouch }: Props) {
  const [body, setBody] = useState<{ width: number; height: number } | null>(null);
  const [measured, setMeasured] = useState(() => naturals.get(page));
  const lineAt = useMemo(() => data.items.flatMap((item, at) => ('line' in item ? [at] : [])), [data]);
  const pending = useMemo<Record<number, number>>(() => ({}), []);
  const measure = useCallback((at: number) => (event: LayoutChangeEvent) => {
    pending[at] = event.nativeEvent.layout.width;
    if (Object.keys(pending).length === lineAt.length) {
      naturals.set(page, { ...pending });
      setMeasured(naturals.get(page));
    }
  }, [page, pending, lineAt]);

  const rows = data.items.length;
  const rowHeight = body ? body.height / rows : 0;
  // A full page has 15 lines; a surah title or basmala takes one of them, even on the short opening pages, and the ayah lines share the rest.
  const oneLine = body ? body.height / 15 : 0;
  const lineHeight = body && lineAt.length ? (body.height - oneLine * (rows - lineAt.length)) / lineAt.length : rowHeight;
  const size = useMemo(() => {
    if (!body || !measured) return 0;
    const widths = lineAt.map(at => measured[at] ?? 1);
    const typical = [...widths].sort((a, b) => a - b)[Math.floor(widths.length * 0.6)] ?? 1;
    const widest = Math.max(1, ...widths);
    return Math.max(1, Math.min((BASE * body.width) / typical, (BASE * body.width) / (widest * (page <= 2 ? 1 : SQUEEZE)), rowHeight * 0.72));
  }, [body, measured, lineAt, page, rowHeight]);

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
  const press = (key: string | null) => ({
    onPress: (event: GestureResponderEvent) => onTouch('tap', key, event.nativeEvent.pageX, event.nativeEvent.pageY),
    onLongPress: (event: GestureResponderEvent) => onTouch('long', key, event.nativeEvent.pageX, event.nativeEvent.pageY),
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
  const bands = (line: number, cells: Cell[]) => {
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
  let surahHere = top;

  return (
    <View style={{ width, height, backgroundColor: palette.card, paddingTop: width * 0.03, paddingHorizontal: width * 0.02, paddingBottom: width * 0.02 }}>
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
          <Pressable {...press(null)} style={{ flex: 1, overflow: 'hidden' }} onLayout={event => setBody({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
            {!measured && (
              <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, width: 10000, opacity: 0 }}>
                {lineAt.map(at => {
                  const item = data.items[at];
                  return 'line' in item && (
                    <View key={at} onLayout={measure(at)} style={{ flexDirection: 'row', alignSelf: 'flex-start', gap: GAP * BASE }}>
                      {(model.lines[at] ?? []).map((group, i) => <Text key={i} style={{ fontFamily: QURAN_FONT, fontSize: BASE }}>{groupText(group.word, group.marks)}</Text>)}
                    </View>
                  );
                })}
              </View>
            )}
            {size > 0 && data.items.map((item, index) => {
              if ('surah' in item) {
                surahHere = item.surah;
                const veil = surahHidden(item.surah);
                return (
                  <View key={index} style={{ height: oneLine, justifyContent: 'center' }}>
                    <View style={{ height: oneLine * 0.94, borderWidth: 1, borderColor: palette.rule, padding: 2 }}>
                      <View style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[{ fontFamily: QURAN_FONT, fontSize: Math.min(size * 0.8, oneLine * 0.46), color: palette.accent }, veil ? veiled : null, veil && next === `${item.surah}:1` ? upcoming : null]}>{names[item.surah]}</Text>
                      </View>
                    </View>
                  </View>
                );
              }
              if ('basmala' in item) {
                const surah = surahHere;
                const veil = surah !== undefined && basmalaHidden(surah);
                return (
                  <View key={index} style={{ height: oneLine, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[{ fontFamily: QURAN_FONT, fontSize: Math.min(size, oneLine * 0.58), color: palette.ink }, veil ? veiled : null, veil && surah !== undefined && !surahHidden(surah) && next === `${surah}:1` ? upcoming : null]}>{BASMALA}</Text>
                  </View>
                );
              }
              const drawn = ((measured?.[index] ?? 0) * size) / BASE;
              const width = body!.width;
              const centred = page <= 2 || drawn < width * 0.7;
              const scale = centred ? 1 : Math.min(STRETCH, Math.max(SQUEEZE, width / drawn));
              const cells = (model.lines[index] ?? []).map(group => {
                const key = `${group.surah}:${group.ayah}`;
                const word = group.word ? (counts[key] = (counts[key] ?? -1) + 1) : 0;
                const wordHidden = !!hidden?.(key, word);
                return { group, key, wordHidden, lit: !wordHidden && !!forgot[key] };
              });
              return (
                <View key={index} style={{ height: lineHeight, flexDirection: 'row', alignItems: 'center', justifyContent: centred ? 'center' : 'flex-start' }}>
                  <View style={centred
                    ? { flexDirection: 'row', gap: GAP * size }
                    : { width: width / scale, flexShrink: 0, flexDirection: 'row', justifyContent: 'space-between', transform: [{ scaleX: scale }], transformOrigin: 'right' }}>
                    {bands(index, cells)}
                    {cells.map(({ group, key, wordHidden, lit }, at) => {
                      const endHidden = (end: number) => !!hidden?.(`${group.surah}:${end}`, Number.MAX_SAFE_INTEGER);
                      const marked = mark === key;
                      return (
                        // A hidden word is no target: a touch on it goes to the page, as on the website.
                        <Word key={at} press={wordHidden ? undefined : press(key)} onLayout={lit ? place(`${index}:${at}`) : undefined}>
                        <Text style={{ fontFamily: QURAN_FONT, fontSize: size, color: marked ? palette.accent : palette.ink }}>
                          {/* While hidden, the word and its ayah number are separate boxes, so an empty page still shows where each ayah ends. */}
                          {wordHidden
                            ? <Text style={[veiled, next === key && !(group.ayah === 1 && group.surah !== undefined && firstHidden(group.surah)) ? upcoming : null]}>{group.word}</Text>
                            : group.word}
                          {group.marks.map(end => (
                            <Text key={end}>
                              {group.word ? ' ' : ''}
                              <Text style={[{ color: !endHidden(end) && saved.has(`${group.surah}:${end}`) ? palette.root : palette.accent },
                                mark === `${group.surah}:${end}` ? { backgroundColor: tint(palette.accent, 0.18), borderRadius: 99 } : null]}>
                                {/* A hidden ayah's end shows the empty ayah ornament, so the reader sees where each ayah ends. */}
                                {endHidden(end) ? EMPTY_END : num(end)}
                              </Text>
                            </Text>
                          ))}
                        </Text>
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
