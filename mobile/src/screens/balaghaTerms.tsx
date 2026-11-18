import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { back, toTab } from '@/lib/ways';
import terms from '@shared/data/quran/balaghaTerms';
import itqan from '@shared/data/quran/itqanBalagha';
import { counted } from '@shared/quran/arabicNumber';
import { chapterTitle, plainName, searchTerms, examplesOf, termsByChapter } from '@shared/quran/balaghaTerms';

/**
 * «مصطلحات البلاغة» (owner, 2026-11-18): every balagha term the app's cards and quizzes use, under al-Suyuti's chapters in
 * al-Itqan and his own headings, each with the first line of its definition and how many examples he gives. A tap opens
 * the term's page.
 */
export default function BalaghaTermsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [query, setQuery] = useState('');
  useTabRetap('terms', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const chapters = useMemo(() => {
    const found = new Set(searchTerms(terms, query));
    return termsByChapter(terms).map(([kind, list]) => [kind, list.filter(term => found.has(term))] as const).filter(([, list]) => list.length);
  }, [query]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>مصطلحات البلاغة</Text>
        <SearchField palette={palette} label="ابحث عن مصطلح" placeholder="ابحث عن مصطلح" value={query} onChangeText={setQuery} />
        {!chapters.length && <Empty text="لا مصطلح بهذا الاسم. جرّب كلمة أقصر." palette={palette} />}
        {chapters.map(([kind, list]) => (
          <View key={kind} style={{ gap: 8 }}>
            <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: 6 }}>{chapterTitle(itqan, kind)}</Text>
            {list.map(term => {
              const count = examplesOf(itqan, term).length;
              const name = plainName(term.name);
              return (
                <Card key={term.name} palette={palette} pad={[10, 14]} accessibilityRole="link" accessibilityLabel={name}
                  onPress={() => toTab({ pathname: '/term', params: { name: term.name } })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: palette.ink, fontSize: 19, textAlign: 'right' }}>{name}</Text>
                    <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{plainName(term.quotes[0].text)}</Text>
                  </View>
                  <Text style={{ color: palette.muted, fontSize: 13 }}>{counted(count, ['مثال', 'مثالان', 'أمثلة'])}</Text>
                  <ChevronLeft size={18} color={palette.muted} />
                </Card>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
