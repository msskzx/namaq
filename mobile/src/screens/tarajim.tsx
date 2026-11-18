import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { personLine, personName, searchPeople, titleFilters } from '@/lib/tarajim';

/**
 * The tarajim tab (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screen 1): a search, the book's own titles as
 * filters, then a card for each person whose entry is converted. A person not converted yet is not listed.
 */
export default function TarajimScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('tarajim', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const params = useLocalSearchParams<{ title?: string }>();
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState<string | undefined>(params.title);
  const filters = useMemo(() => titleFilters(), []);
  const people = useMemo(() => searchPeople(query, title), [query, title]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>التراجم</Text>
        <SearchField palette={palette} label="ابحث في التراجم" value={query} onChangeText={setQuery} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="الكل" on={!title} onPress={() => setTitle(undefined)} palette={palette} />
          {filters.map(filter => (
            <Chip key={filter.key} label={filter.name} on={title === filter.key} onPress={() => setTitle(title === filter.key ? undefined : filter.key)} palette={palette} />
          ))}
        </View>
        {people.length === 0 && <Empty text="لا أحد بهذا الاسم في التراجم المضافة بعد" palette={palette} />}
        {people.map(person => {
          const line = personLine(person);
          return (
            <Card key={person.slug} palette={palette} pad={16} gap={4} accessibilityRole="link" accessibilityLabel={personName(person)}
              onPress={() => router.push({ pathname: '/person', params: { slug: person.slug } })}>
              <Text style={{ color: palette.ink, fontSize: 20, fontWeight: '700', textAlign: 'right' }}>{personName(person)}</Text>
              {line ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{line}</Text> : null}
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
