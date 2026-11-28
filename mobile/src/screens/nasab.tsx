import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { chainOf, foldTop, lineOf, meetingOf, nasabTree, type NasabNode } from '@shared/tarajimLine';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card, { CardWithRow, useInsideCard } from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import Tabs from '@/ui/Tabs';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import { usePalette, type Palette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, PEOPLE, personName, PROPHET, searchPeople } from '@/lib/tarajim';
import { Credit } from '@/components/Credit';

const LINE = 1.5;
const MIN_SCALE = 0.5;


function Box({ node, palette, linked, scale }: { node: NasabNode; palette: Palette; linked: boolean; scale: number }) {
  const slug = node.people[0];
  const name = node.name + (slug === PROPHET ? ' ﷺ' : '');
  return (
    <Card palette={palette} node pad={[6 * scale, 12 * scale]} picked={!!slug} accessibilityRole={slug && linked ? 'link' : undefined} accessibilityLabel={slug ? name : undefined}
      onPress={slug && linked ? () => toTab({ pathname: '/person', params: { slug } }) : undefined}>
      <Text numberOfLines={1} style={{ color: slug ? palette.accent : palette.ink, fontSize: 16 * scale, textAlign: 'center' }}>{name}</Text>
    </Card>
  );
}

type Tree = { palette: Palette; linked: boolean; scale: number };

function Branch({ node, path, tree }: { node: NasabNode; path: string; tree: Tree }) {
  const { palette, scale } = tree;
  const stem = { width: LINE, height: 16 * scale, backgroundColor: palette.muted, alignSelf: 'center' as const };
  const run = [node];
  while (run[run.length - 1].children.length === 1) run.push(run[run.length - 1].children[0]);
  const last = run[run.length - 1];
  const at = (i: number) => [path, ...run.slice(1, i + 1).map(n => n.key)].join('/');
  return (
    <View style={{ alignItems: 'center' }}>
      {run.map((father, i) => (
        <View key={`${i}:${father.key}`} style={{ alignItems: 'center' }}>
          <Box node={father} palette={palette} linked={tree.linked} scale={scale} />
          {father.children.length > 0 && <View style={stem} />}
          {father.children.length === 1 && <View style={{ ...stem, height: stem.height + LINE }} />}
        </View>
      ))}
      {last.children.length > 1 && (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {last.children.map((child, i) => (
            <View key={child.key} style={{ alignItems: 'center', paddingHorizontal: 4 * scale }}>
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', height: LINE, marginHorizontal: -4 * scale }}>
                <View style={{ flex: 1, backgroundColor: i === 0 ? 'transparent' : palette.muted }} />
                <View style={{ flex: 1, backgroundColor: i === last.children.length - 1 ? 'transparent' : palette.muted }} />
              </View>
              <View style={stem} />
              <Branch node={child} path={`${at(run.length - 1)}/${child.key}`} tree={tree} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function Fitted({ children }: { children: (scale: number) => React.ReactNode }) {
  const [room, setRoom] = useState(0);
  const [natural, setNatural] = useState(0);
  const scale = room && natural > room ? Math.max(MIN_SCALE, room / (natural * 1.02)) : 1;
  return (
    <ScrollView horizontal onLayout={e => setRoom(e.nativeEvent.layout.width)} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View onLayout={e => {
        const full = e.nativeEvent.layout.width / scale;
        if (full > natural * 1.02) setNatural(full);
      }}>{children(scale)}</View>
    </ScrollView>
  );
}

export function NasabTree({ slugs, palette, meetings: showMeetings = true, linked = true, text: withText = true, start = 'drawing', inCard = false }: { slugs: string[]; palette: Palette; meetings?: boolean;
  inCard?: boolean;
  linked?: boolean;
  text?: boolean;
  start?: DrawingOrText }) {
  const [picked, setShown] = useState<DrawingOrText>(start);
  const single = slugs.length < 2;
  const shown: DrawingOrText = single ? 'text' : picked;
  const [opened, setOpened] = useState<string[]>([]);
  const inside = useInsideCard();
  const lines = useMemo(() => slugs.filter(s => findPerson(s)).map(s => ({ slug: s, line: lineOf(findPerson(s)!, PEOPLE) })), [slugs]);
  const roots = useMemo(() => nasabTree(lines), [lines]);
  if (lines.length === 0) return null;
  const meetings = showMeetings ? lines.slice(1).map(other => {
    const first = lines[0];
    const at = meetingOf(first.line, other.line);
    return { a: first, b: other, at };
  }) : [];
  const chain = (slug: string, line: Parameters<typeof chainOf>[1], to: number) => chainOf(findPerson(slug)!, line, to);
  const sources = [...new Set(lines.flatMap(({ line }) => line.map(n => n.from)))].map(s => findPerson(s)?.fullName).filter(f => !!f);
  const tree = (scale: number): Tree => ({ palette, linked, scale });
  const bodyText = { color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' as const };
  const body = <>
    {shown === 'drawing' || (!withText && !single) ? roots.map((root, r) => {
      const { above, start: top } = lines.length > 1 && !opened.includes(root.key) ? foldTop(root) : { above: [], start: root };
      const id = `${r}:${root.key}`;
      return (
        <Fitted key={`${slugs.join(',')}|${id}`}>{scale => (
          <View style={{ alignItems: 'center' }}>
            {above.length > 0 && <>
              <Card palette={palette} node pad={[6 * scale, 12 * scale]} accessibilityRole="button" accessibilityLabel={`أظهر الآباء فوق ${top.name}: ${above.length}`}
                onPress={() => setOpened([...opened, root.key])}>
                <Text style={{ color: palette.muted, fontSize: 16 * scale, textAlign: 'center' }}>…</Text>
              </Card>
              <View style={{ width: LINE, height: 16 * scale, backgroundColor: palette.muted }} />
            </>}
            <Branch node={top} path={id} tree={tree(scale)} />
          </View>
        )}</Fitted>
      );
    }) : meetings.length > 0 ? meetings.map(({ a, b, at }) => (
      <Card key={b.slug} palette={palette} gap={6}>
        {at ? <>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>يلتقيان في: {chain(a.slug, a.line.slice(at.a), 0)}</Text>
          <Text style={bodyText}>{chain(a.slug, a.line, at.a)}</Text>
          <Text style={bodyText}>{chain(b.slug, b.line, at.b)}</Text>
        </> : (
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
            لا يلتقي {personName(findPerson(a.slug)!)} و{personName(findPerson(b.slug)!)} فيما نقلته التراجم المضافة من نسبيهما.
          </Text>
        )}
      </Card>
    )) : (
      inside ? lines.map(({ slug, line }) => <Text key={slug} style={bodyText}>{chain(slug, line, line.length - 1)}</Text>) : (
      <Card palette={palette} gap={10}>
        {lines.map(({ slug, line }) => <Text key={slug} style={bodyText}>{chain(slug, line, line.length - 1)}</Text>)}
      </Card>)
    )}
    <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
      الأسماء كما في نسب كل علَم في سير أعلام النبلاء؛ وإذا وقف نسبه عند جدٍّ أكمله نسبُ علَمٍ آخر يذكر الآباء أنفسهم.
    </Text>
    {!inCard && <Credit facts={sources} palette={palette} />}
  </>;
  return <>
    {withText && !single && <Tabs palette={palette} label="كيف يُعرض النسب" value={shown} onChange={setShown} options={DRAWING_OR_TEXT} />}
    {inside ? body : <CardWithRow palette={palette} gap={10}>{body}</CardWithRow>}
  </>;
}

export default function NasabScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { slug = '', pick } = useLocalSearchParams<{ slug?: string; pick?: string }>();
  const [picked, setPicked] = useState(() => slug.split(',').filter(s => findPerson(s)));
  const [adding, setAdding] = useState(!!pick || !picked.length);
  const [query, setQuery] = useState('');
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="النسب" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {picked.map(s => (
            <Chip key={s} label={personName(findPerson(s)!)} on palette={palette}
              onClear={picked.length > 1 ? () => setPicked(picked.filter(p => p !== s)) : undefined} />
          ))}
          <Chip Icon={Plus} label="أضف" on={false} small palette={palette} onPress={() => setAdding(true)} />
        </View>
        {picked.length === 0 ? <Empty text="اختر شخصًا لترى نسبه، ثم أضف غيره لترى أين يلتقيان" palette={palette} />
          : <NasabTree slugs={picked} palette={palette} />}
      </ScrollView>
      <Sheet open={adding} onClose={() => setAdding(false)} palette={palette} tall>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchField palette={palette} label="ابحث في التراجم" placeholder="ابحث باسم أو كنية أو لقب" value={query} onChangeText={setQuery} autoFocus />
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
