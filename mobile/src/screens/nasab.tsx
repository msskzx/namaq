import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { foldTop, lineOf, meetingOf, nasabTree, type NasabNode } from '@shared/tarajimLine';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { Tap } from '@/ui/Tap';
import { usePalette, type Palette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, PEOPLE, personName, PROPHET, unvowelled } from '@/lib/tarajim';

const LINE = 1.5;

/** A father's name in the tree; a picked person is framed in the accent and opens his page. */
function Box({ node, palette }: { node: NasabNode; palette: Palette }) {
  const slug = node.people[0];
  const name = unvowelled(node.name) + (slug === PROPHET ? ' ﷺ' : '');
  const box = {
    minWidth: 96, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: slug ? 2 : 1,
    borderColor: slug ? palette.accent : palette.rule, backgroundColor: slug ? palette.paperDeep : palette.card, alignItems: 'center' as const,
  };
  const label = <Text style={{ color: palette.ink, fontSize: 17 }}>{name}</Text>;
  return slug
    ? <Tap onPress={() => router.push({ pathname: '/person', params: { slug } })} accessibilityRole="link" accessibilityLabel={name} style={box}>{label}</Tap>
    : <View style={box}>{label}</View>;
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
          <View key={child.key} style={{ alignItems: 'center', paddingHorizontal: 6 }}>
            {node.children.length > 1 && (
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', height: LINE, marginHorizontal: -6 }}>
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
  const [open, setOpen] = useState(false);
  const lines = useMemo(() => picked.map(s => ({ slug: s, line: lineOf(findPerson(s)!, PEOPLE) })), [picked]);
  const roots = useMemo(() => nasabTree(lines), [lines]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  const meetings = lines.slice(1).map(other => {
    const first = lines[0];
    const at = meetingOf(first.line, other.line);
    return { a: first, b: other, at };
  });
  const chain = (line: { name: string }[], to: number) => line.slice(0, to + 1).map(n => unvowelled(n.name)).join(' بن ');
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
        {roots.map(root => {
          // One person: his whole line. Several: from where they part, the shared fathers above folded into a line.
          const { above, start } = picked.length > 1 ? foldTop(root) : { above: [], start: root };
          return (
            <View key={root.key} style={{ gap: 10 }}>
              {above.length > 0 && (
                <Tap onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }}>
                  <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'center' }}>
                    ↑ {(open ? above : above.slice(0, 3)).map(unvowelled).join(' · ')}{!open && above.length > 3 ? ' …' : ''}
                  </Text>
                </Tap>
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
              <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{chain(a.line, at.a)}</Text>
              <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{chain(b.line, at.b)}</Text>
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
      </ScrollView>
      <Sheet open={adding} onClose={() => setAdding(false)} palette={palette}>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          {PEOPLE.filter(p => !picked.includes(p.slug)).map(p => (
            <Tap key={p.slug} onPress={() => { setPicked([...picked, p.slug]); setAdding(false); }} accessibilityRole="button"
              style={{ height: 48, justifyContent: 'center', paddingHorizontal: 12 }}>
              <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{personName(p)}</Text>
            </Tap>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

