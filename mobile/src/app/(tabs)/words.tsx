import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { searchWords } from '@shared/quran/words';
import { Text, TextInput } from '@/components/Text';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/components/TopBar';
import WordSheet from '@/components/WordSheet';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toQuranHub } from '@/lib/ways';
import { words } from '@/lib/words';
import { QURAN_FONT, usePalette } from '@/lib/theme';

/** Words listed with no search (the most frequent) and at most with one. */
export const WORDS_SHOWN = 40;

/**
 * The website's /quran/words on the phone, kept small (owner, 2026-11-13): search a word, see how often the Quran uses it,
 * and tap it for its ayat. With no search it lists the most frequent words. docs/plans/word-counts-app.md
 */
export default function WordsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number[] | null>(null);
  const [help, setHelp] = useState(false);
  const top = useRef(0);
  useTabRetap('words', () => { if (top.current > 4) scroll.current?.scrollTo({ y: 0, animated: true }); else setQuery(''); });
  const found = useMemo(() => (query.trim() ? searchWords(words, query, WORDS_SHOWN) : words.lemmas.slice(0, WORDS_SHOWN).map((_, id) => id)), [query]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={toQuranHub} hideOnScroll help={() => setHelp(true)} />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 10, backgroundColor: palette.card }}>
          <Search size={18} color={palette.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن كلمة" placeholderTextColor={palette.muted} returnKeyType="search"
            accessibilityLabel="ابحث عن كلمة في القرآن"
            style={{ flex: 1, fontSize: 16, color: palette.ink, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 8, height: 44 }} />
          {query !== '' && <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="مسح" hitSlop={8}><X size={18} color={palette.muted} /></Pressable>}
        </View>
      </View>
      <ScrollView ref={scroll} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom }}>
        {found.length === 0 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', marginTop: 24 }}>لا كلمة تطابق البحث.</Text>}
        {found.map(id => {
          const [name, count, root] = words.lemmas[id];
          return (
            <Pressable key={id} onPress={() => setOpen([id])} accessibilityRole="button" accessibilityLabel={`${name}، ${num(count)} مرة`}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 6, borderBottomWidth: 1, borderColor: `${palette.rule}60`, backgroundColor: pressed ? palette.paperDeep : 'transparent' })}>
              <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 42, color: palette.ink }}>{mushafText(name)}</Text>
              <Text style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{root}</Text>
              <Text style={{ color: palette.accent, fontSize: 16 }}>{num(count)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <WordSheet lemmas={open} onClose={() => setOpen(null)} palette={palette} />
      <HelpSheet topic={help ? 'words' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}

export { ErrorBoundary } from '@/components/CrashScreen';
