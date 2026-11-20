import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react-native';
import { chainOf, foldTop, FOLD_RUN, lineOf, meetingOf, nasabTree, straightRun, type NasabNode } from '@shared/tarajimLine';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
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
import { Credit } from './person';

const LINE = 1.5;
/** The smallest a wide tree is drawn to fit the screen's width; past it, it scrolls sideways. */
const MIN_SCALE = 0.5;

const picked = (node: NasabNode) => node.people.length > 0;

/** A father's name in the tree, in the one card; a picked person's is picked and opens his page. */
function Box({ node, palette, linked, scale }: { node: NasabNode; palette: Palette; linked: boolean; scale: number }) {
  const slug = node.people[0];
  const name = node.name + (slug === PROPHET ? ' ﷺ' : '');
  return (
    <Card palette={palette} pad={[6 * scale, 12 * scale]} picked={!!slug} accessibilityRole={slug && linked ? 'link' : undefined} accessibilityLabel={slug ? name : undefined}
      onPress={slug && linked ? () => router.push({ pathname: '/person', params: { slug } }) : undefined}>
      <Text style={{ color: slug ? palette.accent : palette.ink, fontSize: 16 * scale, textAlign: 'center' }}>{name}</Text>
    </Card>
  );
}

type Tree = { palette: Palette; linked: boolean; scale: number; open: string[]; onOpen: (key: string) => void };

/**
 * A node and his sons under him, joined by lines: a stem down from the father, a bar across the sons, a stem down to
 * each (each son draws his half of the bar, so the bar spans from the first son's middle to the last's). A long straight
 * run of fathers under him is one «…» box that opens in place (owner 2026-11-20).
 */
function Branch({ node, path, tree }: { node: NasabNode; path: string; tree: Tree }) {
  const { palette, scale, open, onOpen } = tree;
  const stem = { width: LINE, height: 16 * scale, backgroundColor: palette.muted, alignSelf: 'center' as const };
  const below = (child: NasabNode) => {
    const key = `${path}/${child.key}`;
    const run = straightRun(child, picked);
    if (run.length < FOLD_RUN || open.includes(key)) return <Branch node={child} path={key} tree={tree} />;
    const names = run.map(n => n.name).join('، ');
    return (
      <View style={{ alignItems: 'center' }}>
        <Card palette={palette} pad={[6 * scale, 12 * scale]} dashed accessibilityRole="button" accessibilityLabel={`أظهر ${num(run.length)} آباء: ${names}`} onPress={() => onOpen(key)}>
          <Text style={{ color: palette.muted, fontSize: 16 * scale, textAlign: 'center' }}>… {num(run.length)}</Text>
        </Card>
        <View style={stem} />
        <Branch node={run[run.length - 1].children[0]} path={`${key}…`} tree={tree} />
      </View>
    );
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <Box node={node} palette={palette} linked={tree.linked} scale={scale} />
      {node.children.length > 0 && <View style={stem} />}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {node.children.map((child, i) => (
          <View key={child.key} style={{ alignItems: 'center', paddingHorizontal: 4 * scale }}>
            {node.children.length > 1 && (
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', height: LINE, marginHorizontal: -4 * scale }}>
                <View style={{ flex: 1, backgroundColor: i === 0 ? 'transparent' : palette.muted }} />
                <View style={{ flex: 1, backgroundColor: i === node.children.length - 1 ? 'transparent' : palette.muted }} />
              </View>
            )}
            {node.children.length > 1 && <View style={stem} />}
            {below(child)}
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * The tree drawn to the screen's width (owner: a wide tree opens fitted): measured as drawn, then drawn again smaller until
 * it fits, down to MIN_SCALE; past that it scrolls sideways.
 */
function Fitted({ children }: { children: (scale: number) => React.ReactNode }) {
  const [room, setRoom] = useState(0);
  const [scale, setScale] = useState(1);
  return (
    <ScrollView horizontal onLayout={e => setRoom(e.nativeEvent.layout.width)} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View onLayout={e => {
        const width = e.nativeEvent.layout.width;
        if (!room || !width) return;
        const next = Math.max(MIN_SCALE, Math.min(1, (scale * room) / width));
        if (Math.abs(next - scale) > 0.02 && (width > room || scale < 1)) setScale(next);
      }}>{children(scale)}</View>
    </ScrollView>
  );
}

/**
 * The nasab tree (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screen 3): the tree of `slugs`' fathers (one person's line, or several that part where their nasabs part), the shared line above
 * folded into one line of names that opens. «الرسم | النص» shows the tree or the text (owner 2026-11-20, the drawing
 * first): each one's chain of fathers written out, or with `meetings`, where each pair meets and the chain to it. The
 * «النسب» screen draws it, and so does a quiz that asks where two nasabs meet (the meetings only after the answer).
 */
export function NasabTree({ slugs, palette, meetings: showMeetings = true, linked = true, text: withText = true, start = 'drawing' }: { slugs: string[]; palette: Palette; meetings?: boolean;
  /** A picked person's name opens his page; not inside a quiz, which would close under it. */
  linked?: boolean;
  /** The «الرسم | النص» switch; without it only the tree (the person page has its own switch, the text being the book's). */
  text?: boolean;
  /** Which of the two shows first: a quiz on the nasab's words opens on the text. */
  start?: DrawingOrText }) {
  const [open, setOpen] = useState<string[]>([]);
  const [runs, setRuns] = useState<string[]>([]);
  const [shown, setShown] = useState<DrawingOrText>(start);
  const lines = useMemo(() => slugs.filter(s => findPerson(s)).map(s => ({ slug: s, line: lineOf(findPerson(s)!, PEOPLE) })), [slugs]);
  const roots = useMemo(() => nasabTree(lines), [lines]);
  if (lines.length === 0) return null;
  const meetings = showMeetings ? lines.slice(1).map(other => {
    const first = lines[0];
    const at = meetingOf(first.line, other.line);
    return { a: first, b: other, at };
  }) : [];
  const chain = (slug: string, line: Parameters<typeof chainOf>[1], to: number) => chainOf(findPerson(slug)!, line, to);
  // Every entry a name on the page comes from: a line carried on through another entry rests on that entry's nasab too.
  const sources = [...new Set(lines.flatMap(({ line }) => line.map(n => n.from)))].map(s => findPerson(s)?.fullName).filter(f => !!f);
  const tree = (scale: number): Tree => ({ palette, linked, scale, open: runs, onOpen: key => setRuns([...runs, key]) });
  const bodyText = { color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' as const };
  return <>
    {withText && <Tabs palette={palette} label="كيف يُعرض النسب" value={shown} onChange={setShown} options={DRAWING_OR_TEXT} />}
    {shown === 'drawing' || !withText ? roots.map((root, r) => {
      // One person: his whole line. Several: from where they part, the shared fathers above folded into a line.
      const { above, start: top } = lines.length > 1 ? foldTop(root) : { above: [], start: root };
      const id = `${r}:${root.key}`;
      const aboveShown = open.includes(id);
      return (
        <View key={id} style={{ gap: 10 }}>
          {above.length > 0 && (
            <Button variant="plain" Icon={aboveShown ? ChevronUp : ChevronDown}
              onPress={() => setOpen(aboveShown ? open.filter(k => k !== id) : [...open, id])}
              label={`${(aboveShown ? above : above.slice(0, 3)).join(' · ')}${!aboveShown && above.length > 3 ? ' …' : ''}`} />
          )}
          <Fitted>{scale => <Branch node={top} path={id} tree={tree(scale)} />}</Fitted>
        </View>
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
      <Card palette={palette} gap={10}>
        {lines.map(({ slug, line }) => <Text key={slug} style={bodyText}>{chain(slug, line, line.length - 1)}</Text>)}
      </Card>
    )}
    <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
      الأسماء كما في نسب كل علَم في سير أعلام النبلاء؛ وإذا وقف نسبه عند جدٍّ أكمله نسبُ علَمٍ آخر يذكر الآباء أنفسهم.
    </Text>
    <Credit facts={sources} palette={palette} />
  </>;
}

/**
 * The «النسب» screen: the people picked (one to start, more added) and their tree. Opened from the tarajim hub (`pick`), it
 * starts with the search of people open (owner 2026-11-20).
 */
export default function NasabScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { slug = '', pick } = useLocalSearchParams<{ slug?: string; pick?: string }>();
  const [picked, setPicked] = useState(() => (findPerson(slug) ? [slug] : []));
  const [adding, setAdding] = useState(!!pick || !findPerson(slug));
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
