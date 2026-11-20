import { useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { chainSentence, joining } from '@shared/tarajimGraph';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { CardWithRow } from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import Tabs from '@/ui/Tabs';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import { SearchField } from '@/ui/Field';
import { usePalette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, GRAPH, personName, searchPeople } from '@/lib/tarajim';
import { Credit } from './person';
import TiesChain from '@/components/TiesChain';

/**
 * «بينه وبين…» (owner, 2026-11-18; sketch tarajim-app/graph/sketch2-dark.png, screen 7): the reader picks two people or
 * more, and a small graph draws them and the nearest ties that join them, family before companionship, said in one
 * sentence with the pages that state each tie. Anyone in it with a page opens his ties.
 */
export default function BetweenScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { width } = useWindowDimensions();
  const { slugs = '' } = useLocalSearchParams<{ slugs?: string }>();
  const [picked, setPicked] = useState(() => slugs.split(',').filter(s => findPerson(s)));
  const [adding, setAdding] = useState(picked.length < 2);
  const [query, setQuery] = useState('');
  // The chain drawn or said in one sentence: one at a time, the drawing first (owner, 2026-11-20).
  const [shown, setShown] = useState<DrawingOrText>('drawing');
  const { nodes, steps, apart } = useMemo(() => joining(GRAPH, picked), [picked]);
  // The page's side room and the card's padding and frame.
  const drawW = Math.min(width - 32 - 30, 480);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  const name = (slug: string) => personName(GRAPH.nodes.get(slug)!);
  const sentence = steps.length ? chainSentence(GRAPH, steps, node => personName(node)) : '';
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="بين عدة أشخاص" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {picked.map(s => (
            <Chip key={s} label={name(s)} on palette={palette} onClear={() => setPicked(picked.filter(p => p !== s))} />
          ))}
          <Chip Icon={Plus} label="أضف" on={false} small palette={palette} onPress={() => setAdding(true)} />
        </View>
        {picked.length < 2 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اختر شخصين أو أكثر لترى أقرب الصلات بينهم.</Text>}
        {picked.length > 1 && <>
          {apart.length > 0 && (
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
              لا صلة معروفة بعد بين {name(picked[0])} و{apart.map(name).join(' و')} في التراجم المضافة.
            </Text>
          )}
          {sentence ? <Tabs palette={palette} label="كيف تُعرض الصلة" value={shown} onChange={setShown} options={DRAWING_OR_TEXT} /> : null}
          {/* The chain in the home card's shape, its pages on the book line under it (owner 2026-11-20). */}
          <CardWithRow palette={palette}>
            {shown === 'text' && sentence
              ? <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{sentence}.</Text>
              : <TiesChain nodes={nodes} steps={steps} first={picked[0]} picked={picked} width={drawW} palette={palette} inCard />}
            <Credit facts={steps.map(step => step.link)} palette={palette} quotes />
          </CardWithRow>
        </>}
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
    </View>
  );
}
