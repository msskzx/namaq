import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Search, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { suggestions, type ListState } from '@/lib/branchList';
import { QURAN_FONT, type Palette } from '@/lib/theme';

type Props = { state: ListState; palette: Palette; onClose: () => void;
  /** A phrase picked from the list: its trees open there. Enter searches the typed text. */
  onPhrase: (text: string, id: string) => void; onSearch: (query: string) => void; onSurah: (surah: number) => void };

/** The website's phone search: the box takes the whole top bar, surahs and phrases are suggested below while typing. */
export default function BranchSearch({ state, palette, onClose, onPhrase, onSearch, onSurah }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(state.query);
  const found = useMemo(() => suggestions(state, query), [state, query]);
  const typed = !!query.trim();
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
              accessibilityLabel="ابحث عن عبارة مشتركة بين آيتين أو أكثر" onSubmitEditing={() => typed ? onSearch(query.trim()) : onSearch('')}
              style={{ flex: 1, fontSize: 16, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 8, height: 40 }} />
            {typed && <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="مسح" hitSlop={8}><X size={18} color={palette.muted} /></Pressable>}
          </View>
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        {found.surahs.length > 0 && <Text style={{ color: palette.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 10 }}>السور</Text>}
        {found.surahs.map(surah => (
          <Pressable key={`s${surah.number}`} onPress={() => onSurah(surah.number)} accessibilityRole="button" style={row}>
            <Text style={{ color: palette.muted, width: 28 }}>{num(surah.number)}</Text>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{surah.name}</Text>
            <Text style={{ color: palette.accent }}>{num(surah.count)}</Text>
          </Pressable>
        ))}
        {found.surahs.length > 0 && found.phrases.length > 0 && <Text style={{ color: palette.muted, fontSize: 12, paddingHorizontal: 16, paddingTop: 10 }}>العبارات</Text>}
        {found.phrases.map(piece => (
          <Pressable key={piece.id} onPress={() => onPhrase(piece.text, piece.id)} accessibilityRole="button" style={row}>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 20, fontFamily: QURAN_FONT, lineHeight: 38, textAlign: 'right' }}>{mushafText(piece.text)}</Text>
            <Text style={{ color: palette.accent }}>{num(piece.count)}</Text>
          </Pressable>
        ))}
        {typed && !found.surahs.length && !found.phrases.length && <Text style={{ color: palette.muted, padding: 16 }}>لا عبارة مشتركة تطابق البحث.</Text>}
      </ScrollView>
    </View>
  );
}
