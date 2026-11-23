import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { groupName } from '@shared/tarajimGroups';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { byVolume, heldGroups, kunyaLine, personLine, searchPeople, titleFilters } from '@/lib/tarajim';
import PersonRows from '@/components/tarajim/PersonRows';

/**
 * «كل التراجم» (owner, 2026-11-19; sketch tarajim-hub/sketch-dark.png, screens 3 and 4): every converted person, under the
 * part of the book their entry is in, as rows in one card per part; the group chips narrow it to one group the scholars
 * name, and the field to a name. Opened on a group from the hub's tiles or a title on a person's page (`title`).
 */
export default function PeopleScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const params = useLocalSearchParams<{ title?: string; at?: string }>();
  const [title, setTitle] = useState<string | undefined>(params.title);
  // A title tapped on a person's page while this list is open below it arrives as new params; `at` changes on every tap.
  useEffect(() => { if (params.title) setTitle(params.title); }, [params.title, params.at]);
  const [query, setQuery] = useState('');
  // The scholars' groups first, in the hub's order, then any other title several people hold, so every title chip a person's
  // page links to has its chip here.
  const groups = useMemo(() => {
    const held = heldGroups();
    return [...held, ...titleFilters().filter(filter => !held.some(group => group.key === filter.key))];
  }, []);
  const parts = useMemo(() => byVolume(searchPeople(query, title)), [query, title]);
  // Inside a group its own title would repeat on every row, so a row shows the kunya alone there.
  const line = title ? kunyaLine : personLine;
  const heading = (title && (groupName(title) ?? groups.find(group => group.key === title)?.name)) || 'كل التراجم';
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {/* The search in the top bar, as on every page with one (owner, 2026-11-23). */}
      <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: title ? 'ابحث في هذه المجموعة' : 'ابحث في التراجم', label: 'ابحث في التراجم' }} />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{heading}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="الكل" on={!title} onPress={() => setTitle(undefined)} palette={palette} />
          {groups.map(group => (
            <Chip key={group.key} label={group.name} on={title === group.key} onPress={() => setTitle(title === group.key ? undefined : group.key)} palette={palette} />
          ))}
        </ScrollView>
        {parts.length === 0 && <Empty text="لا أحد بهذا الاسم في التراجم المضافة بعد" palette={palette} />}
        {parts.map(part => (
          <View key={part.heading} style={{ gap: 6 }}>
            <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 16, textAlign: 'right', marginTop: 6 }}>{part.heading}</Text>
            <PersonRows people={part.people} palette={palette} line={line} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
