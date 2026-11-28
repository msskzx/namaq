import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { lifeSources, type LifeItem } from '@shared/events/lifeTimeline';
import { Text } from '@/ui/Text';
import { CardWithRow } from '@/ui/Card';
import { sourcesOf } from '@/ui/SourceLine';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { SearchField } from '@/ui/Field';
import { usePalette } from '@/lib/theme';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, personName, searchPeople } from '@/lib/tarajim';
import { lifeOf, personLife } from '@/lib/life';
import { LifeSheet } from '@/components/LifeTimeline';
import LifeColumns from '@/components/LifeColumns';

/**
 * «حياتهما» (owner, 2026-11-18; sketch timeline-events/sketch-dark.png, screen 4): two lives or more side by side, a
 * column each, by year; what they shared on one row joined by a line, what one did alone in his own column.
 */
export default function LifeScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('life', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { slugs = '' } = useLocalSearchParams<{ slugs?: string }>();
  const [picked, setPicked] = useState(() => slugs.split(',').filter(s => findPerson(s)));
  const [adding, setAdding] = useState(picked.length < 2);
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState<LifeItem | undefined>();
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  const name = (slug: string) => personName(findPerson(slug)!);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={picked.length === 2 ? 'حياتهما' : picked.length > 2 ? 'حياتهم' : findPerson(picked[0] ?? '')?.sex === 'FEMALE' ? 'حياتها' : 'حياته'} />
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {picked.map(s => <Chip key={s} label={name(s)} on palette={palette} onClear={picked.length > 1 ? () => setPicked(picked.filter(p => p !== s)) : undefined} />)}
          <Chip Icon={Plus} label="أضف" on={false} small palette={palette} onPress={() => setAdding(true)} />
        </View>
        {/* The lives in the home card's shape, every sentence they rest on named on the book line (owner 2026-11-20). */}
        {picked.length > 1 && (
          <CardWithRow palette={palette} pad={[14, 8]} gap={6} source={sourcesOf(lifeSources(picked.flatMap(s => personLife(findPerson(s)!))))}>
            <LifeColumns slugs={picked} palette={palette} show={setShown} />
            {picked.filter(s => lifeOf(s).length === 0).map(s => (
              <Text key={s} style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>لا أحداث مؤرخة بعد لـ{name(s)} في التراجم المضافة.</Text>
            ))}
          </CardWithRow>
        )}
        {picked.length < 2 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اختر علمًا آخر لتضع حياتيهما جنبًا إلى جنب.</Text>}
      </ScrollView>
      <Sheet open={adding} onClose={() => setAdding(false)} palette={palette} tall>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchField palette={palette} label="ابحث في التراجم" value={query} onChangeText={setQuery} />
        </View>
        <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {searchPeople(query).filter(p => !picked.includes(p.slug)).map(p => (
            <Button key={p.slug} variant="plain" label={personName(p)} onPress={() => { setPicked([...picked, p.slug]); setAdding(false); setQuery(''); }} />
          ))}
        </ScrollView>
      </Sheet>
      <LifeSheet item={shown} onClose={() => setShown(undefined)} palette={palette} />
    </View>
  );
}
