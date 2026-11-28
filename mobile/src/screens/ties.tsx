import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { router, useLocalSearchParams } from 'expo-router';
import type { Tie } from '@shared/tarajimGraph';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { CardWithRow } from '@/ui/Card';
import { Milestone, Link2, Network } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { battleOf } from '@/lib/battles';
import { findPerson, personName, unvowelled } from '@/lib/tarajim';
import TiesRing, { TieSheet, tiesOf } from '@/components/TiesRing';
import { Credit } from '@/components/Credit';

export default function TiesScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const width = usePageWidth();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const [trail, setTrail] = useState<string[]>(() => (findPerson(slug) ? [slug] : []));
  const [shown, setShown] = useState<Tie | undefined>();
  const at = trail[trail.length - 1];
  const person = at ? findPerson(at) : undefined;
  const groups = useMemo(() => (at ? tiesOf(at) : []), [at]);
  const back = () => (trail.length > 1 ? setTrail(trail.slice(0, -1)) : router.canGoBack() ? router.back() : toTab('/tarajim'));
  const go = (to: string) => setTrail([...trail, to]);
  if (!person) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} title="الصلات" /></View>;

  const drawW = Math.min(width - 32 - 30, 480);
  const battles = [...new Map(person.battles.map(b => [b.slug, b])).values()];

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="الصلات" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {trail.length > 1 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>
            {trail.map((s, i) => (i < trail.length - 1
              ? <Button key={`${s}${i}`} variant="plain" label={`${personName(findPerson(s)!)} ←`} onPress={() => setTrail(trail.slice(0, i + 1))} />
              : <Text key={`${s}${i}`} style={{ color: palette.ink, fontSize: 15 }}>{personName(findPerson(s)!)}</Text>))}
          </View>
        )}
        <CardWithRow palette={palette} gap={12} row={<>
          <IconButton Icon={Milestone} label={person.sex === 'FEMALE' ? 'ترجمتها' : 'ترجمته'} onPress={() => router.push({ pathname: '/person', params: { slug: person.slug } })} />
          <IconButton Icon={Network} label="النسب" onPress={() => router.push({ pathname: '/nasab', params: { slug: person.slug } })} />
          <IconButton Icon={Link2} label={person.sex === 'FEMALE' ? 'بينها وبين…' : 'بينه وبين…'} onPress={() => router.push({ pathname: '/between', params: { slugs: person.slug } })} />
        </>}>
        <TiesRing slug={person.slug} width={drawW} palette={palette} onPick={go} onShow={setShown} />
        {battles.length > 0 && <>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{person.sex === 'FEMALE' ? 'شهدت' : 'شهد'}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {battles.map(b => (
              <Chip key={b.slug} label={unvowelled(b.name).replace(/^(?:غزوة|معركة|وقعة)\s+/u, '')} on={false} palette={palette}
                onPress={battleOf(b.slug) ? () => toTab({ pathname: '/battle', params: { slug: b.slug } }) : undefined} />
            ))}
          </View>
        </>}
        {person.titles.length > 0 && <>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{person.sex === 'FEMALE' ? 'ألقابها وأوصافها' : 'ألقابه وأوصافه'}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {person.titles.map(title => (
              <Chip key={title.title} label={title.name} on={false} palette={palette}
                onPress={title.shared ? () => router.navigate({ pathname: '/people', params: { title: title.title, at: String(Date.now()) } }) : undefined} />
            ))}
          </View>
        </>}
        {groups.length === 0 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>لا صلات مذكورة في الترجمة.</Text>}
        <Credit facts={groups.flatMap(g => g.ties.map(tie => tie.link))} palette={palette} />
        </CardWithRow>
      </ScrollView>
      <TieSheet tie={shown} onClose={() => setShown(undefined)} palette={palette} />
    </View>
  );
}
