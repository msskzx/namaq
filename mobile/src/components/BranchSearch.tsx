import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Search, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import type { Bookmark } from '@shared/bookmarks';
import { quranText } from '@/lib/quranText';
import { ALL_KINDS_LIST, applyDraft, draftOf, EMPTY_LIST, suggestions, type FilterDraft, type ListState } from '@/lib/branchList';
import { draftValid, FilterActions, FilterFields } from './FilterFields';
import { QURAN_FONT, type Palette } from '@/lib/theme';

type Props = { state: ListState; bookmarks: Bookmark[]; palette: Palette; onClose: () => void;
  /** The new list, and where it opens: a picked phrase, else the search's best tree. */
  onApply: (next: ListState, opening?: { id?: string; query?: string }) => void };

/**
 * Search and filter in one screen: the box takes the whole top bar; under it the filters, or, while typing,
 * the surahs and phrases inside them. Enter or the apply button opens the list.
 */
export default function BranchSearch({ state, bookmarks, palette, onClose, onApply }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(state.query);
  const [draft, setDraft] = useState<FilterDraft>(() => draftOf(state));
  const valid = draftValid(draft);
  const filtered = useMemo(() => applyDraft(draft) ?? state, [draft, state]);
  const found = useMemo(() => suggestions(filtered, query, bookmarks), [filtered, query, bookmarks]);
  const typed = !!query.trim();
  // Suggestions while the text is being changed; the filters otherwise (also when the screen opens on an earlier search).
  const suggesting = typed && query.trim() !== state.query;
  const apply = (next: Partial<ListState>, opening?: { id?: string; query?: string }) => {
    if (!valid) return;
    onApply({ ...filtered, query: query.trim(), ...next }, opening);
  };
  const row = { flexDirection: 'row' as const, alignItems: 'baseline' as const, gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: palette.rule };
  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: palette.paper, zIndex: 10 }}>
      <View style={{ paddingTop: insets.top, borderBottomWidth: 1, borderColor: palette.rule }}>
        <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 6 }}>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="رجوع" hitSlop={8} style={{ padding: 6 }}>
            <ChevronRight size={26} color={palette.ink} />
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: palette.rule, borderRadius: 20, paddingHorizontal: 10, height: 40 }}>
            <Search size={18} color={palette.muted} />
            <TextInput autoFocus value={query} onChangeText={setQuery} placeholder="ابحث" placeholderTextColor={palette.muted} returnKeyType="search"
              accessibilityLabel="ابحث عن عبارة مشتركة بين آيتين أو أكثر" onSubmitEditing={() => apply({}, { query: query.trim() })}
              style={{ flex: 1, fontSize: 16, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 8, height: 40 }} />
            {typed && <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="مسح" hitSlop={8}><X size={18} color={palette.muted} /></Pressable>}
          </View>
        </View>
      </View>
      {!suggesting && <>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 18 }}>
          <FilterFields draft={draft} setDraft={setDraft} palette={palette} />
        </ScrollView>
        <View style={{ paddingBottom: insets.bottom + 8 }}>
          <FilterActions onReset={() => { setDraft(draftOf(EMPTY_LIST)); setQuery(''); }} onApply={() => apply({}, { query: query.trim() })} valid={valid} palette={palette} />
        </View>
      </>}
      {suggesting && <ScrollView keyboardShouldPersistTaps="handled">
        {found.surahs.length > 0 && <Text style={{ color: palette.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 10 }}>السور</Text>}
        {found.surahs.map(surah => (
          <Pressable key={`s${surah.number}`} onPress={() => apply({ query: '', surah: surah.number })} accessibilityRole="button" style={row}>
            <Text style={{ color: palette.muted, width: 28 }}>{num(surah.number)}</Text>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{surah.name}</Text>
            <Text style={{ color: palette.accent }}>{num(surah.count)}</Text>
          </Pressable>
        ))}
        {found.surahs.length > 0 && found.phrases.length > 0 && <Text style={{ color: palette.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 10 }}>العبارات</Text>}
        {found.phrases.map(piece => (
          <Pressable key={piece.id} onPress={() => apply({ query: piece.text }, { id: piece.id, query: piece.text })} accessibilityRole="button" style={row}>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 20, fontFamily: QURAN_FONT, lineHeight: 38, textAlign: 'right' }}>{quranText(piece.text)}</Text>
            <Text style={{ color: palette.accent }}>{num(piece.count)}</Text>
          </Pressable>
        ))}
        {found.outside.length > 0 && <Text style={{ color: palette.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 10 }}>خارج التصفية الحالية، فتحها يمسح التصفية</Text>}
        {found.outside.map(piece => (
          <Pressable key={`o${piece.id}`} onPress={() => onApply({ ...ALL_KINDS_LIST, query: piece.text }, { id: piece.id, query: piece.text })} accessibilityRole="button" style={row}>
            <Text style={{ flex: 1, color: palette.muted, fontSize: 20, fontFamily: QURAN_FONT, lineHeight: 38, textAlign: 'right' }}>{quranText(piece.text)}</Text>
            <Text style={{ color: palette.muted }}>{num(piece.count)}</Text>
          </Pressable>
        ))}
        {!found.surahs.length && !found.phrases.length && !found.outside.length && <Text style={{ color: palette.muted, padding: 16 }}>لا عبارة مشتركة تطابق البحث.</Text>}
      </ScrollView>}
    </View>
  );
}
