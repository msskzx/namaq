import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react-native';
import { chainOf, foldTop, lineOf, meetingOf, nasabTree, type NasabNode } from '@shared/tarajimLine';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { usePalette, type Palette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, PEOPLE, personName, PROPHET, unvowelled } from '@/lib/tarajim';
import { Credit } from './person';

const LINE = 1.5;

/** A father's name in the tree, in the one card; a picked person's is picked and opens his page. */
function Box({ node, palette }: { node: NasabNode; palette: Palette }) {
  const slug = node.people[0];
  const name = unvowelled(node.name) + (slug === PROPHET ? ' ﷺ' : '');
  return (
    <Card palette={palette} pad={[6, 12]} picked={!!slug} accessibilityRole={slug ? 'link' : undefined} accessibilityLabel={slug ? name : undefined}
      onPress={slug ? () => router.push({ pathname: '/person', params: { slug } }) : undefined}>
      <Text style={{ color: slug ? palette.accent : palette.ink, fontSize: 16, textAlign: 'center' }}>{name}</Text>
    </Card>
  );
}

/**
 * A node and his sons under him, joined by lines: a stem down from the father, a bar across the sons, a stem down to
 * each (each son draws his half of the bar, so the bar spans from the first son's middle to the last's).
 */
function Branch({ node, palette }: { node: NasabNode; palette: Palette }) {
  const stem = { width: LINE, height: 16, backgroundColor: palette.muted, alignSelf: 'center' as const };
  return (
    <View style={{ alignItems: 'center' }}>
      <Box node={node} palette={palette} />
      {node.children.length > 0 && <View style={stem} />}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {node.children.map((child, i) => (
          <View key={child.key} style={{ alignItems: 'center', paddingHorizontal: 4 }}>
            {node.children.length > 1 && (
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', height: LINE, marginHorizontal: -4 }}>
                <View style={{ flex: 1, backgroundColor: i === 0 ? 'transparent' : palette.muted }} />
                <View style={{ flex: 1, backgroundColor: i === node.children.length - 1 ? 'transparent' : palette.muted }} />
              </View>
            )}
            {node.children.length > 1 && <View style={stem} />}
            <Branch node={child} palette={palette} />
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * The nasab tree (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screen 3): one person's fathers, or several
 * people's lines in one tree that parts where their nasabs part. The long shared line above the parting is one line of
 * names that opens. Under it, where each pair meets and the chain to it, written out.
 */
export default function NasabScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const [picked, setPicked] = useState(() => (findPerson(slug) ? [slug] : []));
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<string[]>([]);
  const lines = useMemo(() => picked.map(s => ({ slug: s, line: lineOf(findPerson(s)!, PEOPLE) })), [picked]);
  const roots = useMemo(() => nasabTree(lines), [lines]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  const meetings = lines.slice(1).map(other => {
    const first = lines[0];
    const at = meetingOf(first.line, other.line);
    return { a: first, b: other, at };
  });
  const chain = (slug: string, line: Parameters<typeof chainOf>[1], to: number) => chainOf(findPerson(slug)!, line, to);
  // Every entry a name on the page comes from: a line carried on through another entry rests on that entry's nasab too.
  const sources = [...new Set(lines.flatMap(({ line }) => line.map(n => n.from)))].map(s => findPerson(s)?.fullName).filter(f => !!f);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="النسب" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {picked.map(s => (
            <Chip key={s} label={personName(findPerson(s)!)} on palette={palette}
              onClear={picked.length > 1 ? () => setPicked(picked.filter(p => p !== s)) : undefined} />
          ))}
          <Button Icon={Plus} label="أضف" onPress={() => setAdding(true)} />
        </View>
        {roots.map((root, r) => {
          // One person: his whole line. Several: from where they part, the shared fathers above folded into a line.
          const { above, start } = picked.length > 1 ? foldTop(root) : { above: [], start: root };
          const id = `${r}:${root.key}`;
          const shown = open.includes(id);
          return (
            <View key={id} style={{ gap: 10 }}>
              {above.length > 0 && (
                <Button variant="plain" Icon={shown ? ChevronUp : ChevronDown}
                  onPress={() => setOpen(shown ? open.filter(k => k !== id) : [...open, id])}
                  label={`${(shown ? above : above.slice(0, 3)).map(unvowelled).join(' · ')}${!shown && above.length > 3 ? ' …' : ''}`} />
              )}
              <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <Branch node={start} palette={palette} />
              </ScrollView>
            </View>
          );
        })}
        {meetings.map(({ a, b, at }) => (
          <Card key={b.slug} palette={palette} gap={6}>
            {at ? <>
              <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>يلتقيان في: {unvowelled(a.line[at.a].name)}</Text>
              <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{chain(a.slug, a.line, at.a)}</Text>
              <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{chain(b.slug, b.line, at.b)}</Text>
            </> : (
              <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
                لا يلتقي {personName(findPerson(a.slug)!)} و{personName(findPerson(b.slug)!)} فيما نقلته التراجم المضافة من نسبيهما.
              </Text>
            )}
          </Card>
        ))}
        <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 22, textAlign: 'right' }}>
          الأسماء كما في نسب كل علَم في سير أعلام النبلاء؛ وإذا وقف نسبه عند جدٍّ أكمله نسبُ علَمٍ آخر يذكر الآباء أنفسهم.
        </Text>
        <Credit facts={sources} palette={palette} />
      </ScrollView>
      <Sheet open={adding} onClose={() => setAdding(false)} palette={palette}>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {PEOPLE.filter(p => !picked.includes(p.slug)).map(p => (
            <Button key={p.slug} variant="plain" label={personName(p)} onPress={() => { setPicked([...picked, p.slug]); setAdding(false); }} />
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

