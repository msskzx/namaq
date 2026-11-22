import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { counted } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Empty from '@/ui/Empty';
import { BATTLES } from '@/lib/battles';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { heldGroups, searchPeople } from '@/lib/tarajim';
import PersonRows from '@/components/tarajim/PersonRows';
import WayCard from '@/components/tarajim/WayCard';

/** A hub section's heading: short and muted, as on the hadith hub. */
export function HubHeading({ text, palette }: { text: string; palette: Palette }) {
  return <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16, textAlign: 'right', marginTop: 8 }}>{text}</Text>;
}

/**
 * The tarajim tab (owner, 2026-11-19; sketch tarajim-hub/sketch-dark.png): a hub, not a list. Search in the top bar and no page title, as on every tab (owner, 2026-11-22); typing shows the
 * people found as rows in one card in place of the sections. Then the groups the scholars name, the sira and its battles,
 * the ties between people and the nasab search, and the whole list on its own page in the book's order (nothing capped, nothing dumped here).
 */
export default function TarajimScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('tarajim', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [query, setQuery] = useState('');
  const groups = useMemo(() => heldGroups(), []);
  const found = useMemo(() => (query.trim() ? searchPeople(query) : []), [query]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث باسم أو كنية أو لقب', label: 'ابحث في التراجم' }} />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}>
        {query.trim() ? (
          found.length === 0
            ? <Empty text="لا أحد بهذا الاسم في التراجم المضافة بعد" palette={palette} />
            : <>
                <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{counted(found.length, ['ترجمة', 'ترجمتان', 'تراجم'])}</Text>
                <PersonRows people={found} palette={palette} />
              </>
        ) : (
          <>
            <HubHeading text="كما جمعهم العلماء" palette={palette} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {groups.map(group => (
                <Card key={group.key} palette={palette} pad={[10, 14]} accessibilityRole="link" accessibilityLabel={group.name}
                  onPress={() => router.push({ pathname: '/people', params: { title: group.key } })}
                  style={{ flexBasis: '47%', flexGrow: 1, minHeight: 52, justifyContent: 'center' }}>
                  <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{group.name}</Text>
                </Card>
              ))}
            </View>
            <HubHeading text="السيرة والأحداث" palette={palette} />
            <WayCard title="قصص السيرة" line="كل قصة كما يرويها الكتاب بإسنادها" palette={palette} onPress={() => router.push('/stories')} />
            <WayCard title="الغزوات والمعارك" line={`من ${BATTLES[0].name} إلى ${BATTLES[BATTLES.length - 1].name}، ومن شهد كل واحدة`} palette={palette} onPress={() => router.push('/battles')} />
            <HubHeading text="الصلات" palette={palette} />
            <WayCard title="بين عدة أشخاص" line="اختر شخصين أو أكثر لترى أقرب الصلات بينهم" palette={palette} onPress={() => router.push('/between')} />
            <WayCard title="النسب" line="ابحث عن شخص لترى شجرة نسبه، وأين يلتقي بغيره" palette={palette} onPress={() => router.push({ pathname: '/nasab', params: { pick: '1' } })} />
            <WayCard title="حياتهم جنبًا إلى جنب" line="قارن حياة اثنين أو أكثر عامًا بعام" palette={palette} onPress={() => router.push('/life')} />
            <HubHeading text="كل التراجم" palette={palette} />
            <WayCard title="كل التراجم بترتيب الكتاب" line="السيرة النبوية، ثم الخلفاء الراشدون، ثم أجزاء السير" palette={palette} onPress={() => router.push('/people')} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
