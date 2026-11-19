import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import { ayatCount, num } from '@shared/quran/arabicNumber';
import { juzGroups, matchesSurah, parseReference, type IndexSurah } from '@shared/quran/juzIndex';
import { searchAyat, searchable, type AyahSearch } from '@shared/quran/ayahSearch';
import { corpusIndex as ayahIndex } from '@shared/quran/corpusIndex';
import { GESTURES, MODE_ACTIONS, readGestures, serverGestures, setGesture, subscribeGestures, type Gesture, type GestureAction, type ReaderMode } from '@shared/readerGestures';
import Sheet from '@/ui/Sheet';
import { pageOfAyah, surahs } from '@/lib/mushaf';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { quranText } from '@/lib/quranText';
import { surahName } from '@shared/quran/surahNames';
import Tabs from '@/ui/Tabs';
import Chip from '@/ui/Chip';
import { SearchField } from '@/ui/Field';
import Empty from '@/ui/Empty';

/** Where a link in the index goes: a page, the ayah that starts there, and whether to mark that ayah. */
export type Jump = { page: number; key: string; mark: boolean };

const name = (surah: { number: number }) => surahName(surah.number);
/** Words set as one run of text with a space after each, so a long ayah is three spans, not one per word. */
const join = (words: string[]) => words.map(word => `${quranText(word)} `).join('');
const JUZ_ROW = 48;
const SURAH_ROW = 40;


type Row =
  | { kind: 'juz'; juz: number; page: number; key: string }
  | { kind: 'surah'; number: number; name: string; from: number; page: number }
  | { kind: 'ayah'; key: string; page: number; words: string[]; from: number; to: number };

/** The index of surahs and juz', and the search for a surah, an ayah number or words. */
export function IndexSheet({ open, onClose, onJump, palette, page, recite, query: asked }: {
  open: boolean;
  /** Opens searching these words: a selection's «المواضع» (owner, 2026-11-19). */
  query?: string | null;
  /** The page open in the reader: the index opens at its surah. */
  page: number;
  onClose: () => void;
  onJump: (jump: Jump) => void;
  palette: Palette;
  /** Reciting: the index says what a link does now, as the website's recite index. */
  recite?: boolean;
}) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (open && asked) setQuery(asked); }, [open, asked]);
  const groups = useMemo(() => juzGroups(surahs), []);
  const reference = parseReference(query, surahs);
  const words = !reference && searchable(query) ? query.trim() : '';
  const [hits, setHits] = useState<AyahSearch & { query: string }>({ query: '', total: 0, hits: [] });
  useEffect(() => {
    if (!words) return;
    const timer = setTimeout(() => setHits({ ...searchAyat(ayahIndex(), words, Infinity), query: words }), 150);
    return () => clearTimeout(timer);
  }, [words]);
  const found = words && hits.query === words ? hits : null;

  const rows = useMemo<Row[]>(() => {
    const keep = (surah: IndexSurah) => (reference ? surah.number === reference.surah.number : !query.trim() || matchesSurah(surah, query));
    const list: Row[] = groups.flatMap(group => {
      const entries = group.entries.filter(entry => keep(entry.surah));
      if (!entries.length) return [];
      return [
        { kind: 'juz', juz: group.juz, page: group.page, key: `${group.surah}:${group.ayah}` } as Row,
        ...entries.map(entry => ({ kind: 'surah', number: entry.surah.number, name: name(entry.surah), from: entry.from, page: entry.page }) as Row),
      ];
    });
    const surahFound = list.length > 0;
    const ayat = !surahFound && found ? found.hits.map(hit => ({ kind: 'ayah', key: hit.key, page: pageOfAyah(hit.key) ?? hit.page, words: hit.words, from: hit.from, to: hit.to }) as Row) : [];
    return [...ayat, ...list];
  }, [groups, query, reference, found]);

  // With no search, the list is only juz' and surah rows of fixed heights, so it can open scrolled to the surah on the open page.
  const plain = !rows.some(row => row.kind === 'ayah');
  const here = useMemo(() => {
    let at = -1;
    rows.forEach((row, index) => { if (row.kind === 'surah' && row.page <= page) at = index; });
    return at;
  }, [rows, page]);
  const offsets = useMemo(() => {
    let y = 0;
    return rows.map(row => { const at = y; y += row.kind === 'juz' ? JUZ_ROW : SURAH_ROW; return at; });
  }, [rows]);
  const start = plain && !query.trim() && here > 0 ? Math.max(0, here - 2) : 0;

  const go = (jump: Jump) => { onJump(jump); onClose(); };
  const button = { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 } as const;
  return (
    <Sheet open={open} onClose={onClose} palette={palette} tall>
      <View style={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        {recite && <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 22 }}>اختر سورة أو جزءًا أو آية. تُخفى الآيات في مواضعها من الصفحة، وتُظهر كل لمسة الآية التالية.</Text>}
        <SearchField value={query} onChangeText={setQuery} placeholder="سورة، أو آية برقمها (٢:٢٥٥) أو بكلماتها" label="ابحث عن سورة أو آية" palette={palette}
          onSubmitEditing={() => reference && go({ page: pageOfAyah(`${reference.surah.number}:${reference.ayah}`) ?? 1, key: `${reference.surah.number}:${reference.ayah}`, mark: true })} />
        {reference && (
          <Pressable style={[button, { alignSelf: 'flex-start' }]} accessibilityRole="button"
            onPress={() => go({ page: pageOfAyah(`${reference.surah.number}:${reference.ayah}`) ?? 1, key: `${reference.surah.number}:${reference.ayah}`, mark: true })}>
            <Text style={{ color: palette.accent, fontSize: 16 }}>افتح {name(reference.surah)} {num(reference.ayah)}</Text>
          </Pressable>
        )}
        {query.trim() && rows.length === 0 && (!words || found) && <Empty text="لا توجد سورة ولا آية بهذا النص." palette={palette} />}
        {rows[0]?.kind === 'ayah' && <Text style={{ color: palette.muted, fontSize: 14 }}>{ayatCount(rows.length)}</Text>}
      </View>
      <FlatList data={rows} keyExtractor={row => (row.kind === 'juz' ? `j${row.juz}` : row.kind === 'surah' ? `s${row.number}-${row.from}` : `a${row.key}`)}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" initialNumToRender={30} style={{ flex: 1 }}
        initialScrollIndex={start || undefined}
        getItemLayout={plain ? (_, index) => ({ length: rows[index]?.kind === 'juz' ? JUZ_ROW : SURAH_ROW, offset: offsets[index] ?? 0, index }) : undefined}
        renderItem={({ item: row, index }) => {
          if (row.kind === 'juz') return (
            <Pressable onPress={() => go({ page: row.page, key: row.key, mark: false })} accessibilityRole="link"
              style={{ height: JUZ_ROW, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderColor: palette.rule, paddingHorizontal: 16, paddingBottom: 4 }}>
              <Text style={{ color: palette.accent, fontSize: 19 }}>الجزء {num(row.juz)}</Text>
              <Text style={{ color: palette.muted, fontSize: 13 }}>ص {num(row.page)}</Text>
            </Pressable>
          );
          if (row.kind === 'surah') return (
            <Pressable onPress={() => go({ page: row.page, key: `${row.number}:${row.from}`, mark: false })} accessibilityRole="link"
              style={[{ height: SURAH_ROW, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }, index === here && !query.trim() ? { backgroundColor: palette.paperDeep } : null]}>
              <Text style={{ width: 30, color: palette.accent, fontSize: 13 }}>{num(row.number)}</Text>
              <Text style={{ color: palette.ink, fontSize: 17 }}>{surahName(row.number)}</Text>
              {row.from > 1 && <Text style={{ color: palette.muted, fontSize: 13 }}>من الآية {num(row.from)}</Text>}
              <View style={{ flex: 1 }} />
              <Text style={{ color: palette.muted, fontSize: 13 }}>{num(row.page)}</Text>
            </Pressable>
          );
          const [surah, ayah] = row.key.split(':').map(Number);
          return (
            <Pressable onPress={() => go({ page: row.page, key: row.key, mark: true })} accessibilityRole="link"
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: palette.rule, gap: 2 }}>
              <Text style={{ color: palette.accent, fontSize: 13 }}>{name(surahs[surah - 1])} {num(ayah)}</Text>
              <Text style={{ color: palette.ink, fontSize: 20, lineHeight: 36, fontFamily: QURAN_FONT }}>
                {/* The whole ayah, its found words coloured (owner, 2026-11-17). */}
                {join(row.words.slice(0, row.from))}
                <Text style={{ color: palette.accent }}>{join(row.words.slice(row.from, row.to + 1))}</Text>
                {join(row.words.slice(row.to + 1))}
              </Text>
            </Pressable>
          );
        }} />
    </Sheet>
  );
}

const GESTURE_NAMES: Record<Gesture, string> = { tap: 'لمسة', double: 'لمستان', long: 'ضغطة مطوّلة' };
const ACTION_NAMES: Record<GestureAction, string> = {
  tools: 'إظهار الأدوات أو إخفاؤها',
  'next-ayah': 'إظهار الآية التالية',
  'next-word': 'إظهار الكلمة التالية',
  back: 'الرجوع خطوة',
  actions: 'أزرار الآية (نسيتها، احفظ)',
  forgot: 'نسيتها',
  save: 'حفظ الآية',
  none: 'لا شيء',
};

/** What each touch does on the mushaf page, per mode, like a game's controls (the website's settings sheet). */
export function GestureSettings({ palette, mode: shownMode }: { palette: Palette; mode: ReaderMode }) {
  const gestures = useSyncExternalStore(subscribeGestures, readGestures, serverGestures);
  const [mode, setMode] = useState<ReaderMode>(shownMode);
  useEffect(() => { setMode(shownMode); }, [shownMode]);
  return (
    <View style={{ gap: 14 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>اللمسات في المصحف</Text>
      <Tabs options={[{ key: 'read', label: 'قراءة' }, { key: 'recite', label: 'تسميع' }] as const} value={mode} onChange={setMode} palette={palette} />
      {GESTURES.map(gesture => (
        <View key={gesture} style={{ gap: 6 }}>
          <Text style={{ color: palette.ink, fontSize: 15 }}>{GESTURE_NAMES[gesture]}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {MODE_ACTIONS[mode].map(action => {
              const on = gestures[mode][gesture] === action;
              return (
                <Chip key={action} role="radio" label={ACTION_NAMES[action]} on={on} onPress={() => setGesture(mode, gesture, action)} palette={palette} />
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}
