import { useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { chainSentence, joining, stepClause, type GraphNode, type Step } from '@shared/tarajimGraph';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { SearchField } from '@/ui/Field';
import { usePalette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, GRAPH, personName, searchPeople } from '@/lib/tarajim';
import { Credit } from './person';
import { edge, kindColor } from './ties';

const NODE_W = 220;
const GAP = 8;
const NODE_H = 44;
const ROW = 92;
const LABEL_W = 170;
/** The name before «بن» or «بنت», for the short clause on a line: «الزبير ابنُ صفية». */
const firstName = (node: GraphNode) => personName(node).split(/\s+بنت?\s+/u)[0];

/**
 * Rows for the joining graph: each person on the row of his distance from the first one picked, so the chains read top
 * down like the nasab tree, and the people of a row spread across.
 */
function layout(nodes: string[], steps: Step[], first: string, width: number) {
  const depth = new Map<string, number>([[first, 0]]);
  for (let changed = true; changed;) {
    changed = false;
    for (const step of steps) {
      for (const [a, b] of [[step.from, step.to], [step.to, step.from]]) {
        if (depth.has(a) && !depth.has(b)) { depth.set(b, depth.get(a)! + 1); changed = true; }
      }
    }
  }
  const last = Math.max(0, ...depth.values());
  // Someone with no chain to the first goes on a row of his own at the foot.
  for (const node of nodes) if (!depth.has(node)) depth.set(node, last + 1);
  const rows = new Map<number, string[]>();
  for (const node of nodes) rows.set(depth.get(node)!, [...(rows.get(depth.get(node)!) ?? []), node]);
  // A row of few people gives each a wide box, so a name stays on one line and the tie's word between rows stays clear.
  const place = new Map<string, { x: number; y: number; w: number }>();
  for (const [row, members] of rows) {
    const w = Math.min(NODE_W, (width - GAP * (members.length - 1)) / members.length);
    members.forEach((node, i) => place.set(node, { x: width / 2 + (i - (members.length - 1) / 2) * (w + GAP), y: NODE_H / 2 + 8 + row * ROW, w }));
  }
  return { place, height: (Math.max(...rows.keys()) + 1) * ROW };
}

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
  const { nodes, steps, apart } = useMemo(() => joining(GRAPH, picked), [picked]);
  const drawW = Math.min(width - 32, 480);
  const { place, height } = useMemo(() => (picked.length ? layout(nodes, steps, picked[0], drawW) : { place: new Map<string, { x: number; y: number; w: number }>(), height: 0 }), [nodes, steps, picked, drawW]);
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
          <Button Icon={Plus} label="أضف" onPress={() => setAdding(true)} />
        </View>
        {picked.length < 2 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اختر شخصين أو أكثر لترى أقرب الصلات بينهم.</Text>}
        {picked.length > 1 && <>
          {sentence ? <Card palette={palette}><Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{sentence}.</Text></Card> : null}
          {apart.length > 0 && (
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
              لا صلة معروفة بعد بين {name(picked[0])} و{apart.map(name).join(' و')} في التراجم المضافة.
            </Text>
          )}
          <View style={{ width: drawW, height, alignSelf: 'center' }}>
            <Svg width={drawW} height={height} style={{ position: 'absolute' }}>
              {steps.map(step => {
                const a = edge(place.get(step.from)!, place.get(step.to)!, place.get(step.from)!.w / 2, NODE_H / 2);
                const b = edge(place.get(step.to)!, place.get(step.from)!, place.get(step.to)!.w / 2, NODE_H / 2);
                return <Line key={`${step.from}>${step.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={kindColor(palette, step.kind)} strokeWidth={2} />;
              })}
            </Svg>
            {steps.map((step, i) => {
              const a = place.get(step.from)!;
              const b = place.get(step.to)!;
              // Lines between the same two rows have their words side by side: each takes the room to its neighbour.
              const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
              const room = Math.min(LABEL_W, ...steps.filter((_, j) => j !== i).map(other => {
                const p = place.get(other.from)!;
                const q = place.get(other.to)!;
                return Math.abs((p.y + q.y) / 2 - mid.y) < 24 ? Math.abs((p.x + q.x) / 2 - mid.x) - 6 : Infinity;
              }));
              // The whole tie on its line, both names in it, so «ابنُ» says who is whose son (owner, 2026-11-19).
              return (
                <Text key={`l${step.from}>${step.to}`} numberOfLines={2} style={{ position: 'absolute', left: Math.max(0, Math.min(drawW - room, mid.x - room / 2)), top: mid.y - (room < LABEL_W ? 18 : 10), width: room, textAlign: 'center', color: kindColor(palette, step.kind), fontSize: 13, backgroundColor: palette.paper }}>
                  {stepClause(GRAPH, step, firstName)}
                </Text>
              );
            })}
            {nodes.map(slug => {
              const node = GRAPH.nodes.get(slug)!;
              const at = place.get(slug)!;
              const chosen = picked.includes(slug);
              return (
                <View key={slug} style={{ position: 'absolute', left: at.x - at.w / 2, top: at.y - NODE_H / 2, width: at.w }}>
                  <Card palette={palette} pad={[6, 8]} picked={chosen} faded={!node.inApp} accessibilityRole={node.inApp ? 'link' : undefined} accessibilityLabel={personName(node)}
                    onPress={node.inApp ? () => router.push({ pathname: '/ties', params: { slug } }) : undefined}>
                    <Text numberOfLines={2} style={{ color: node.inApp ? palette.accent : palette.muted, fontSize: 14, textAlign: 'center' }}>{personName(node)}</Text>
                  </Card>
                </View>
              );
            })}
          </View>
          <Credit facts={steps.map(step => step.link)} palette={palette} quotes />
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
