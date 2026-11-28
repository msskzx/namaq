import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { FlatList, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { NotebookPen } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import BarStrip from '@/ui/BarStrip';
import Tabs from '@/ui/Tabs';
import TopBar from '@/ui/TopBar';
import { openIntent, toTab } from '@/lib/ways';
import { markAyah, mostForgotten, readDueMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { readAyahNotes, subscribeAyahNotes } from '@shared/ayahNotes';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { searchPattern } from '@shared/bookReader';
import { journalRows, juzRow, type JournalEntry, type JournalKind, type JournalRow } from '@shared/journal';
import { JUZ_STARTS } from '@shared/quran/juz';
import { surahName } from '@shared/quran/surahNames';
import { dayDigits } from '@shared/prayer';
import { ayahText } from '@/lib/mushaf';
import { NOTE_LABEL, ShelfCard, useHomeCards } from '@/components/HomeCards';
import { ForgottenPost, SavedFeedCard } from '@/components/HomeFeed';
import type { SavedCard } from '@/lib/home';
import { usePalette, type Palette } from '@/lib/theme';
import Empty from '@/ui/Empty';

type Tab = 'all' | 'saved' | 'forgotten' | 'notes';
const TABS: { key: Tab; label: string }[] = [{ key: 'all', label: 'الكل' }, { key: 'saved', label: 'المحفوظات' }, { key: 'forgotten', label: 'ما نسيته' }, { key: 'notes', label: 'تأملاتي' }];
const TAB_KIND: Record<Exclude<Tab, 'all'>, JournalKind> = { saved: 'saved', forgotten: 'forgotten', notes: 'note' };
const SEARCH = 'ابحث في مدونتي';

const SINCE_DATES = Date.UTC(2020, 0, 1);
const day = (at: number) => (at >= SINCE_DATES ? new Date(at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }) : '');
const headLine = (entry: JournalEntry) => {
  const when = day(entry.at);
  if (entry.kind === 'note') return when ? `تأملي · كتبته يوم ${when}` : 'تأملي';
  if (entry.kind === 'forgotten') return when ? `منسيّة · نسيتها يوم ${when}` : 'منسيّة';
  return when ? `محفوظة · ${when}` : 'محفوظة';
};

function useForgottenAyat() {
  const due = useSyncExternalStore(subscribeDueMarks, readDueMarks);
  const kept = useRef<{ key: string; at: number }[]>([]);
  return useMemo(() => {
    const first = new Map<string, { key: string; at: number }>();
    for (const key of mostForgotten(due)) {
      const ayah = markAyah(key);
      first.set(ayah, { key: first.get(ayah)?.key ?? key, at: Math.max(first.get(ayah)?.at ?? 0, due[key].at) });
    }
    kept.current = kept.current.map(item => ({ key: item.key, at: first.get(markAyah(item.key))?.at ?? item.at }));
    for (const [ayah, mark] of first) if (!kept.current.some(item => markAyah(item.key) === ayah)) kept.current.push(mark);
    return kept.current;
  }, [due]);
}

function JuzStrip({ rows, onJuz, palette }: { rows: readonly JournalRow[]; onJuz: (juz: number) => void; palette: Palette }) {
  const [picked, setPicked] = useState<number | null>(null);
  const counts = JUZ_STARTS.map(() => 0);
  for (const row of rows) if (row.row === 'entry' && row.juz) counts[row.juz - 1]++;
  return (
    <BarStrip counts={counts} tone={palette.amber} picked={picked} onPick={setPicked} onLift={i => { setPicked(null); onJuz(i + 1); }} height={56} holdScroll={false}
      name={i => `الجزء ${dayDigits(i + 1)}`} ends={['الجزء ١', 'الجزء ٣٠']} label="الأجزاء، المس واسحب ثم ارفع إصبعك" palette={palette} />
  );
}

const SurahHead = ({ surah, palette }: { surah: number; palette: Palette }) => (
  <View accessibilityRole="header" style={{ alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.rule }}>
    <Text style={{ color: palette.accent, fontSize: 18 }}>سورة {surahName(surah)}</Text>
  </View>
);

export default function LibraryScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(TABS.some(item => item.key === params.tab) ? params.tab as Tab : 'all');
  const [query, setQuery] = useState('');
  const { cards, noteCards, savedItems, noteItems, openOf, openAyah, menus } = useHomeCards(palette);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const notes = useSyncExternalStore(subscribeAyahNotes, readAyahNotes);
  const forgotten = useForgottenAyat();
  const list = useRef<FlatList<JournalRow>>(null);

  const { rows, byId } = useMemo(() => {
    const byId = new Map<string, { card?: SavedCard; text: string }>();
    const entries: JournalEntry[] = [];
    for (const card of cards) {
      const reference = card.references[0];
      const saved = bookmarks.find(item => item.id === card.id);
      entries.push({ id: `saved:${card.id}`, kind: 'saved', at: saved?.savedAt ?? 0, ayah: reference ? `${reference.surah}:${reference.ayat[0]}` : undefined });
      byId.set(`saved:${card.id}`, { card, text: card.text });
    }
    for (const card of noteCards) {
      entries.push({ id: `note:${card.id}`, kind: 'note', at: notes[card.id]?.at ?? 0, ayah: card.id });
      byId.set(`note:${card.id}`, { card, text: card.text });
    }
    for (const mark of forgotten) {
      entries.push({ id: `forgotten:${mark.key}`, kind: 'forgotten', at: mark.at, ayah: markAyah(mark.key) });
      byId.set(`forgotten:${mark.key}`, { text: '' });
    }
    const pattern = searchPattern(query);
    const found = (entry: JournalEntry) => {
      if (!pattern) return true;
      const said = [byId.get(entry.id)?.text, entry.ayah && ayahText(entry.ayah), entry.ayah && surahName(Number(entry.ayah.split(':')[0]))].filter(Boolean).join(' ');
      return new RegExp(pattern.source).test(said);
    };
    const shown = entries.filter(entry => (tab === 'all' || entry.kind === TAB_KIND[tab]) && found(entry));
    return { rows: journalRows(shown), byId };
  }, [cards, noteCards, forgotten, bookmarks, notes, tab, query]);

  const retry = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(retry.current), [rows]);
  const toJuz = (juz: number) => {
    const index = juzRow(rows, juz);
    if (index >= 0) list.current?.scrollToIndex({ index, viewPosition: 0 });
  };

  const entryCard = (entry: JournalEntry) => {
    const id = entry.id.slice(entry.id.indexOf(':') + 1);
    const card = byId.get(entry.id)?.card;
    if (entry.kind === 'forgotten') return <ForgottenPost ayah={id} due palette={palette} head={{ onPress: () => openIntent({ tab: 'read', at: markAyah(id) }), label: 'افتح الآية في المصحف' }} />;
    if (!card) return null;
    if (entry.kind === 'note') return <ShelfCard note card={card} palette={palette} Icon={NotebookPen} label={NOTE_LABEL} items={noteItems(card)} open={openAyah(card)} />;
    if (card.kind === 'card') return <SavedFeedCard id={card.id} palette={palette} />;
    return <ShelfCard card={card} palette={palette} items={savedItems(card)} open={openOf(card)} />;
  };

  const empty = query ? 'لا شيء في مدونتك بهذا.' : tab === 'forgotten' ? 'لا آيات منسية.' : tab === 'notes' ? 'لا تأملات بعد. اضغط مطولًا على آية في المصحف لتكتب تأملك.'
    : 'لا شيء في مدونتك بعد. احفظ آية أو شجرة أو بطاقة مقارنة، أو أي بطاقة في الرئيسية من زر «…» فوقها، لتجدها هنا.';

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={() => (router.canGoBack() ? router.back() : toTab('/'))} search={{ value: query, onChangeText: setQuery, placeholder: SEARCH, label: SEARCH }} />
      <FlatList ref={list} data={rows} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        keyExtractor={row => (row.row === 'entry' ? row.entry.id : row.row === 'surah' ? `surah:${row.surah}` : 'others')}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom + 16, gap: 12 }}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          list.current?.scrollToOffset({ offset: index * averageItemLength });
          clearTimeout(retry.current);
          retry.current = setTimeout(() => list.current?.scrollToIndex({ index, viewPosition: 0 }), 300);
        }}
        ListHeaderComponent={<View style={{ gap: 14, marginBottom: 4 }}>
          <Tabs options={TABS} value={tab} onChange={setTab} label="ما يُعرض" palette={palette} fill />
          <JuzStrip rows={rows} onJuz={toJuz} palette={palette} />
        </View>}
        renderItem={({ item: row }) => row.row === 'surah'
          ? <SurahHead surah={row.surah} palette={palette} />
          : row.row === 'others'
          ? <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 16, marginTop: 8 }}>خارج المصحف</Text>
          : <View style={{ gap: 6 }}>
            <Text style={{ color: palette.muted, fontSize: 13 }}>{headLine(row.entry)}</Text>
            {entryCard(row.entry)}
          </View>}
        ListEmptyComponent={<Empty palette={palette} text={empty} />} />
      {menus}
    </View>
  );
}
