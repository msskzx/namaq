import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { LightbulbOff, Play, Search } from 'lucide-react-native';
import corpus from '@shared/data/quran/trees.json';
import type { BranchAyah } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { juzGroups, matchesSurah, parseReference, type IndexSurah } from '@shared/quran/juzIndex';
import { indexAyat, searchAyat, searchable, type AyahSearch, type IndexedAyah } from '@shared/quran/ayahSearch';
import { GESTURES, MODE_ACTIONS, readGestures, serverGestures, setGesture, subscribeGestures, type Gesture, type GestureAction, type ReaderMode } from '@shared/readerGestures';
import Sheet from './Sheet';
import { pageOfAyah, surahs } from '@/lib/mushaf';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** Where a link in the index goes: a page, the ayah that starts there, and whether to mark that ayah. */
export type Jump = { page: number; key: string; mark: boolean };

const name = (surah: { name: string }) => plainName(surah.name).replace(/^سورة\s*/, '');
const AROUND = 6;

let indexed: IndexedAyah[] | undefined;
/** The ayah word search runs on the bundled text, indexed the first time it is used. */
const ayahIndex = () => (indexed ??= indexAyat(corpus.ayat as BranchAyah[]));

type Row =
  | { kind: 'juz'; juz: number; page: number; key: string }
  | { kind: 'surah'; number: number; name: string; from: number; page: number }
  | { kind: 'ayah'; key: string; page: number; words: string[]; from: number; to: number };

/** The index of surahs and juz', the search for a surah, an ayah number or words, and the recite shortcuts. */
export function IndexSheet({ open, onClose, onJump, palette, last, forgotten }: {
  open: boolean;
  onClose: () => void;
  onJump: (jump: Jump, recite?: 'review') => void;
  palette: Palette;
  /** Where the last recitation stopped. */
  last: (() => void) | null;
  forgotten: string[];
}) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => juzGroups(surahs), []);
  const reference = parseReference(query, surahs);
  const words = !reference && searchable(query) ? query.trim() : '';
  const [hits, setHits] = useState<AyahSearch & { query: string }>({ query: '', total: 0, hits: [] });
  useEffect(() => {
    if (!words) return;
    const timer = setTimeout(() => setHits({ ...searchAyat(ayahIndex(), words), query: words }), 150);
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

  const go = (jump: Jump, recite?: 'review') => { onJump(jump, recite); onClose(); };
  const button = { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 } as const;
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <View style={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        {(last || forgotten.length > 0) && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {last && <Pressable style={button} accessibilityRole="button" onPress={() => { last(); onClose(); }}>
              <Play size={18} color={palette.accent} /><Text style={{ color: palette.ink, fontSize: 15 }}>تابع التسميع من حيث توقفت</Text>
            </Pressable>}
            {forgotten.length > 0 && <Pressable style={button} accessibilityRole="button"
              onPress={() => go({ page: pageOfAyah(forgotten[0]) ?? 1, key: forgotten[0], mark: false }, 'review')}>
              <LightbulbOff size={18} color={palette.accent} /><Text style={{ color: palette.ink, fontSize: 15 }}>راجع ما نسيت ({num(forgotten.length)})</Text>
            </Pressable>}
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: palette.rule }}>
          <Search size={18} color={palette.accent} />
          <TextInput value={query} onChangeText={setQuery} placeholder="سورة، أو آية برقمها (٢:٢٥٥) أو بكلماتها"
            placeholderTextColor={palette.muted} accessibilityLabel="ابحث عن سورة أو آية" returnKeyType="search"
            onSubmitEditing={() => reference && go({ page: pageOfAyah(`${reference.surah.number}:${reference.ayah}`) ?? 1, key: `${reference.surah.number}:${reference.ayah}`, mark: true })}
            style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: palette.ink, textAlign: 'right' }} />
        </View>
        {reference && (
          <Pressable style={[button, { alignSelf: 'flex-start' }]} accessibilityRole="button"
            onPress={() => go({ page: pageOfAyah(`${reference.surah.number}:${reference.ayah}`) ?? 1, key: `${reference.surah.number}:${reference.ayah}`, mark: true })}>
            <Text style={{ color: palette.accent, fontSize: 16 }}>افتح {name(reference.surah)} {num(reference.ayah)}</Text>
          </Pressable>
        )}
        {query.trim() && rows.length === 0 && (!words || found) && <Text style={{ color: palette.muted, fontSize: 14 }}>لا توجد سورة ولا آية بهذا النص.</Text>}
        {found && found.total > found.hits.length && rows[0]?.kind === 'ayah' && <Text style={{ color: palette.muted, fontSize: 14 }}>{num(found.total)} آية، أول {num(found.hits.length)} منها</Text>}
      </View>
      <FlatList data={rows} keyExtractor={row => (row.kind === 'juz' ? `j${row.juz}` : row.kind === 'surah' ? `s${row.number}-${row.from}` : `a${row.key}`)}
        keyboardShouldPersistTaps="handled" initialNumToRender={30}
        renderItem={({ item: row }) => {
          if (row.kind === 'juz') return (
            <Pressable onPress={() => go({ page: row.page, key: row.key, mark: false })} accessibilityRole="link"
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', borderBottomWidth: 1, borderColor: palette.rule, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 }}>
              <Text style={{ color: palette.accent, fontSize: 19 }}>الجزء {num(row.juz)}</Text>
              <Text style={{ color: palette.muted, fontSize: 13 }}>ص {num(row.page)}</Text>
            </Pressable>
          );
          if (row.kind === 'surah') return (
            <Pressable onPress={() => go({ page: row.page, key: `${row.number}:${row.from}`, mark: false })} accessibilityRole="link"
              style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingHorizontal: 16, paddingVertical: 7 }}>
              <Text style={{ width: 30, color: palette.accent, fontSize: 13 }}>{num(row.number)}</Text>
              <Text style={{ color: palette.ink, fontSize: 17 }}>{row.name}</Text>
              {row.from > 1 && <Text style={{ color: palette.muted, fontSize: 13 }}>من الآية {num(row.from)}</Text>}
              <View style={{ flex: 1 }} />
              <Text style={{ color: palette.muted, fontSize: 13 }}>{num(row.page)}</Text>
            </Pressable>
          );
          const [surah, ayah] = row.key.split(':').map(Number);
          const start = Math.max(0, row.from - AROUND);
          const end = Math.min(row.words.length, row.to + 1 + AROUND);
          return (
            <Pressable onPress={() => go({ page: row.page, key: row.key, mark: true })} accessibilityRole="link"
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: palette.rule, gap: 2 }}>
              <Text style={{ color: palette.accent, fontSize: 13 }}>{name(surahs[surah - 1])} {num(ayah)}</Text>
              <Text style={{ color: palette.ink, fontSize: 20, lineHeight: 36, fontFamily: QURAN_FONT }}>
                {start > 0 ? '… ' : ''}
                {row.words.slice(start, end).map((word, at) => {
                  const inside = start + at >= row.from && start + at <= row.to;
                  return <Text key={at} style={inside ? { color: palette.accent } : undefined}>{word} </Text>;
                })}
                {end < row.words.length ? '…' : ''}
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
  const chip = (on: boolean) => ({ borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 });
  return (
    <View style={{ gap: 14 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>اللمسات في المصحف</Text>
      <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="tablist">
        {(['read', 'recite'] as const).map(option => (
          <Pressable key={option} onPress={() => setMode(option)} accessibilityRole="tab" accessibilityState={{ selected: mode === option }} style={chip(mode === option)}>
            <Text style={{ color: mode === option ? palette.onAccent : palette.ink, fontSize: 15 }}>{option === 'read' ? 'قراءة' : 'تسميع'}</Text>
          </Pressable>
        ))}
      </View>
      {GESTURES.map(gesture => (
        <View key={gesture} style={{ gap: 6 }}>
          <Text style={{ color: palette.ink, fontSize: 15 }}>{GESTURE_NAMES[gesture]}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {MODE_ACTIONS[mode].map(action => {
              const on = gestures[mode][gesture] === action;
              return (
                <Pressable key={action} onPress={() => setGesture(mode, gesture, action)} accessibilityRole="radio" accessibilityState={{ checked: on }} style={chip(on)}>
                  <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 13 }}>{ACTION_NAMES[action]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

export function GestureSheet({ open, onClose, palette, mode }: { open: boolean; onClose: () => void; palette: Palette; mode: ReaderMode }) {
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <GestureSettings key={String(open)} palette={palette} mode={mode} />
      </View>
    </Sheet>
  );
}
