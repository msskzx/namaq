import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { searchWords, WORDS_COUNTING, WORDS_SOURCE } from '@shared/quran/words';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import WordSheet from '@/components/WordSheet';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { words } from '@/lib/words';
import { usePalette } from '@/lib/theme';
import SourceLine from '@/ui/SourceLine';
import { sourceById } from '@shared/sources';
import { SearchField } from '@/ui/Field';
import { QuranWord } from '@/components/quran/text/AyahFlow';

/** Words listed with no search (the most frequent) and at most with one. */
export const WORDS_SHOWN = 40;

/**
 * The website's /quran/words on the phone, kept small (owner, 2026-11-13): search a word, see how often the Quran uses it,
 * and tap it for its ayat. With no search it lists the most frequent words. docs/plans/word-counts-app.md
 */
/** Where the counts come from, and our page of sources and licences. */
const source = sourceById(WORDS_SOURCE);
const WEBSITE = 'https://namaq.vercel.app';

export default function WordsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number[] | null>(null);
  const top = useRef(0);
  useTabRetap('words', () => { if (top.current > 4) scroll.current?.scrollTo({ y: 0, animated: true }); else setQuery(''); });
  const found = useMemo(() => (query.trim() ? searchWords(words, query, WORDS_SHOWN) : words.lemmas.slice(0, WORDS_SHOWN).map((_, id) => id)), [query]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}>
        <SearchField value={query} onChangeText={setQuery} placeholder="ابحث عن كلمة" label="ابحث عن كلمة في القرآن" palette={palette} />
        {/* The page's book as the line under its search, as the home cards carry theirs (owner, 2026-11-20). */}
        {source && <View style={{ paddingTop: 8 }}>
          <SourceLine palette={palette} sources={[{ line: source.title.ar, quotes: WORDS_COUNTING.map(text => ({ text })),
            links: [{ label: source.link.label, url: source.link.url }, { label: 'المصادر والتراخيص', url: `${WEBSITE}/attributions#${WORDS_SOURCE}` }] }]} />
        </View>}
      </View>
      <ScrollView ref={scroll} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom }}>
        {found.length === 0 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', marginTop: 24 }}>لا كلمة تطابق البحث.</Text>}
        {found.map(id => {
          const [name, count, root] = words.lemmas[id];
          return (
            <Pressable key={id} onPress={() => setOpen([id])} accessibilityRole="button" accessibilityLabel={`${name}، ${num(count)} مرة`}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingHorizontal: 6, borderBottomWidth: 1, borderColor: `${palette.rule}60`, backgroundColor: pressed ? palette.paperDeep : 'transparent' })}>
              <QuranWord look={{ color: palette.ink }}>{name}</QuranWord>
              <Text style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{root}</Text>
              <Text style={{ color: palette.accent, fontSize: 16 }}>{num(count)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <WordSheet lemmas={open} onClose={() => setOpen(null)} palette={palette} />
    </View>
  );
}

