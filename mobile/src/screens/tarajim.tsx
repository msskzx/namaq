import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { counted } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { searchPeople } from '@/lib/tarajim';
import PersonRows from '@/components/tarajim/PersonRows';
import IconTile from '@/ui/IconTile';
import { FEATURE_ICON } from '@/components/featureIcons';

export function HubHeading({ text, palette }: { text: string; palette: Palette }) {
  return <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16, textAlign: 'right', marginTop: 8 }}>{text}</Text>;
}

export default function TarajimScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('tarajim', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [query, setQuery] = useState('');
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
            <IconTile wide label="كل التراجم" line="بترتيب الكتاب، ومعها المجموعات كما جمعهم العلماء" Icon={FEATURE_ICON.person} palette={palette} onPress={() => router.push('/people')} />
            <HubHeading text="السيرة والأحداث" palette={palette} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <IconTile label="قصص السيرة" Icon={FEATURE_ICON.stories} palette={palette} onPress={() => router.push('/stories')} />
              <IconTile label="الغزوات والمعارك" Icon={FEATURE_ICON.battles} palette={palette} onPress={() => router.push('/battles')} />
              <IconTile label="الأطلس" Icon={FEATURE_ICON.atlas} palette={palette} onPress={() => router.push('/atlas')} />
            </View>
            <HubHeading text="الصلات بينهم" palette={palette} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <IconTile label="النسب" Icon={FEATURE_ICON.nasab} palette={palette} onPress={() => router.push({ pathname: '/nasab', params: { pick: '1' } })} />
              <IconTile label="بين عدة أشخاص" Icon={FEATURE_ICON.ties} palette={palette} onPress={() => router.push('/between')} />
              <IconTile wide label="حياتهم جنبًا إلى جنب" line="قارن حياة اثنين أو أكثر عامًا بعام" Icon={FEATURE_ICON.life} palette={palette} onPress={() => router.push('/life')} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
