import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import { BATTLES } from '@/lib/battles';
import { STORY_TAGS } from '@/lib/stories';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { personLine, personName, searchPeople, titleFilters } from '@/lib/tarajim';

/**
 * The tarajim tab (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screen 1): the sira stories and the battles, a search, the book's
 * own titles as filters, then a card for each person whose entry is converted. A person not converted yet is not listed.
 */
export default function TarajimScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('tarajim', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const params = useLocalSearchParams<{ title?: string; at?: string }>();
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState<string | undefined>(params.title);
  // The list stays mounted under the person's page, so a title tapped there arrives as new params, not a new screen;
  // `at` changes on every tap, so the same title tapped again after clearing the filter still sets it.
  useEffect(() => { if (params.title) setTitle(params.title); }, [params.title, params.at]);
  const filters = useMemo(() => titleFilters(), []);
  const people = useMemo(() => searchPeople(query, title), [query, title]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>التراجم</Text>
        <Card palette={palette} pad={16} gap={4} accessibilityRole="link" accessibilityLabel="قصص السيرة" onPress={() => router.push('/stories')}>
          <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>قصص السيرة</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{STORY_TAGS.join(' · ')}</Text>
        </Card>
        <Card palette={palette} pad={16} gap={4} accessibilityRole="link" accessibilityLabel="الغزوات والمعارك" onPress={() => router.push('/battles')}>
          <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>الغزوات والمعارك</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`${BATTLES[0].name} … ${BATTLES[BATTLES.length - 1].name}`}</Text>
        </Card>
        <Card palette={palette} pad={16} gap={4} accessibilityRole="link" accessibilityLabel="بين عدة أشخاص" onPress={() => router.push('/between')}>
          <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>بين عدة أشخاص</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اختر شخصين أو أكثر لترى أقرب الصلات بينهم</Text>
        </Card>
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
