import { useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { pageLabel } from '@shared/tarajim';
import { groupWord, tieGroups, tieWord, type GraphNode, type Tie, type TieKind } from '@shared/tarajimGraph';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button, { Row } from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { usePalette, type Palette } from '@/lib/theme';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { battleOf } from '@/lib/battles';
import { findPerson, GRAPH, personName, unvowelled } from '@/lib/tarajim';
import { Credit } from './person';

/** Each kind of tie has its colour, for its lines and its group (sketch tarajim-app/graph/sketch-dark.png). */
export const kindColor = (palette: Palette, kind: TieKind) =>
  ({ parent: palette.amber, spouse: palette.accent, child: palette.root, sibling: palette.ink, cousin: palette.path, companion: palette.green, accompanied: palette.green })[kind];

const NODE_H = 46;
const GAP = 10;
const ROW = NODE_H + 46;
const nodeName = (node: GraphNode) => personName(node).replace(/\s+بن\s+.*$/u, (rest) => (rest.length > 18 ? '' : rest));

/** A node round the middle: a person (opens his ties if he has a page), or a whole kind folded into one node with its count. */
type Spot = { key: string; x: number; y: number; kind: TieKind } & ({ tie: Tie } | { group: TieKind; count: number });

/** Columns the screen's width holds: three nodes a row on a phone, more on a wider screen. */
const columns = (width: number) => Math.max(2, Math.floor((width + GAP) / (100 + GAP)));
const nodeWidth = (width: number) => (width - (columns(width) - 1) * GAP) / columns(width);

/**
 * How many nodes go round the middle without a line crossing a node: a row above, the two sides of the middle, a row
 * below. The screen's width decides it, not a fixed number.
 */
const capacity = (width: number) => 2 * columns(width) + (columns(width) >= 3 ? 2 : 0);

/**
 * Places the nodes in the drawing's order: the first half above the middle and the rest below, the sides of the middle
 * only once both rows are full. Each row is centred, so the lines fan out from the middle.
 */
function layout(count: number, width: number) {
  const cols = columns(width);
  const w = nodeWidth(width);
  const top = count > 2 * cols ? cols : Math.ceil(count / 2);
  const sides = cols >= 3 ? Math.max(0, count - 2 * cols) : 0;
  const below = count - top - sides;
  const row = (n: number, y: number) => Array.from({ length: n }, (_, i) => ({ x: width / 2 + (i - (n - 1) / 2) * (w + GAP), y }));
  const mid = NODE_H / 2 + (top > 0 ? ROW : 0);
  const side = [{ x: width - w / 2, y: mid }, { x: w / 2, y: mid }].slice(0, sides);
  // The middle card is wider than the others, but never over the sides of its row.
  const middleW = sides > 0 ? Math.min(w * 1.2, width - 2 * (w + GAP)) : Math.min(w * 1.8, width);
  return { places: [...row(top, NODE_H / 2), ...side, ...row(below, mid + ROW)], middle: mid, middleW, height: mid + NODE_H / 2 + (below > 0 ? ROW : 0), w };
}

/** Where the line from `a` to `b` leaves a box of half sizes `hw`×`hh` round `a`, so a faded box shows no line through it. */
export function edge(a: { x: number; y: number }, b: { x: number; y: number }, hw: number, hh: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity, 1);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

/**
 * «صلاته» (owner, 2026-11-18; sketches tarajim-app/graph/sketch-dark.png and sketch2-dark.png): the person in the middle
 * and his ties round him, a line coloured by the kind of tie. A kind with more people than the ring holds is one node
 * with its count, and tapping it opens that kind alone. A person with a page moves to the middle; the trail above goes
 * back. A long press shows the sentence that states the tie. Battles and titles are badges under the drawing.
 */
export default function TiesScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const { width } = useWindowDimensions();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const [trail, setTrail] = useState<string[]>(() => (findPerson(slug) ? [slug] : []));
  const [open, setOpen] = useState<TieKind | undefined>();
  const [shown, setShown] = useState<Tie | undefined>();
  const at = trail[trail.length - 1];
  const person = at ? findPerson(at) : undefined;
  // Each person once, under the nearest kind of tie (al-Zubayr's kin the Prophet ﷺ is not drawn again as his companion).
  const groups = useMemo(() => {
    const seen = new Set<string>();
    return (at ? tieGroups(GRAPH, at) : [])
      .map(g => ({ ...g, ties: g.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
      .filter(g => g.ties.length > 0);
  }, [at]);
  const back = () => (trail.length > 1 ? (setTrail(trail.slice(0, -1)), setOpen(undefined)) : router.canGoBack() ? router.back() : toTab('/tarajim'));
  const go = (to: string) => { setTrail([...trail, to]); setOpen(undefined); };
  if (!person) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} title="الصلات" /></View>;

  const drawW = Math.min(width - 32, 480);
  const room = capacity(drawW);
  // What goes on the ring: every person while they fit; else the biggest kinds fold into one node each until the rest fit.
  type Item = { tie: Tie; kind: TieKind } | { group: TieKind; count: number; kind: TieKind };
  const spots = ((): Item[] => {
    if (open) {
      const group = groups.find(g => g.kind === open);
      return group && group.ties.length <= room ? group.ties.map(tie => ({ tie, kind: tie.kind })) : [];
    }
    const folded = new Set<TieKind>();
    const size = () => groups.reduce((sum, g) => sum + (folded.has(g.kind) ? 1 : g.ties.length), 0);
    for (const g of [...groups].sort((a, b) => b.ties.length - a.ties.length)) {
      if (size() <= room) break;
      if (g.ties.length > 1) folded.add(g.kind);
    }
    return groups.flatMap((g): Item[] => (folded.has(g.kind) ? [{ group: g.kind, count: g.ties.length, kind: g.kind }] : g.ties.map(tie => ({ tie, kind: tie.kind }))));
  })();
  const { places, middle, middleW, height: drawH, w: NODE_W } = layout(spots.length, drawW);
  const centre = { x: drawW / 2, y: middle };
  const placed: Spot[] = spots.map((spot, i) => ({ ...spot, ...places[i], key: 'tie' in spot ? `${spot.kind}:${spot.tie.to}` : `g:${spot.group}` }));
  const openGroup = open ? groups.find(g => g.kind === open) : undefined;
  const listed = openGroup && openGroup.ties.length > room ? openGroup.ties : [];
  const battles = [...new Map(person.battles.map(b => [b.slug, b])).values()];

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title="الصلات" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {trail.length > 1 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>
            {trail.map((s, i) => (i < trail.length - 1
              ? <Button key={`${s}${i}`} variant="plain" label={`${personName(findPerson(s)!)} ←`} onPress={() => { setTrail(trail.slice(0, i + 1)); setOpen(undefined); }} />
              : <Text key={`${s}${i}`} style={{ color: palette.ink, fontSize: 15 }}>{personName(findPerson(s)!)}</Text>))}
          </View>
        )}
        {open && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {groups.map(g => (
              <Chip key={g.kind} small label={`${groupWord(g.kind, person.sex, g.ties.length)} ${num(g.ties.length)}`} on={g.kind === open} palette={palette}
                onPress={() => setOpen(g.kind === open ? undefined : g.kind)} />
            ))}
          </View>
        )}
        <View style={{ width: drawW, height: drawH, alignSelf: 'center' }}>
          <Svg width={drawW} height={drawH} style={{ position: 'absolute' }}>
            {placed.map(spot => {
              const from = edge(centre, spot, middleW / 2, NODE_H / 2);
              const to = edge(spot, centre, NODE_W / 2, NODE_H / 2);
              return <Line key={spot.key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={kindColor(palette, spot.kind)} strokeWidth={2} strokeOpacity={0.8} />;
            })}
          </Svg>
          <View style={{ position: 'absolute', left: drawW / 2 - middleW / 2, top: middle - NODE_H / 2, width: middleW }}>
            <Card palette={palette} pad={[8, 10]} picked accessibilityRole="header" accessibilityLabel={personName(person)}>
              <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 17, textAlign: 'center' }}>{personName(person)}</Text>
            </Card>
          </View>
          {placed.map(spot => {
            const style = { position: 'absolute' as const, left: spot.x - NODE_W / 2, top: spot.y - NODE_H / 2, width: NODE_W };
            if ('group' in spot) {
              const label = `${groupWord(spot.group, person.sex, spot.count)} ${num(spot.count)}`;
              return (
                <View key={spot.key} style={style}>
                  <Card palette={palette} pad={[6, 8]} outline={kindColor(palette, spot.kind)} accessibilityRole="button" accessibilityLabel={label}
                    onPress={() => setOpen(spot.group)}>
                    <Text style={{ color: kindColor(palette, spot.kind), fontSize: 15, textAlign: 'center' }}>{label}</Text>
                  </Card>
                </View>
              );
            }
            const node = GRAPH.nodes.get(spot.tie.to)!;
            const label = `${tieWord(spot.kind, node.sex, person.sex)}: ${personName(node)}`;
            return (
              <View key={spot.key} style={style}>
                <Card palette={palette} pad={[6, 8]} picked={node.inApp} faded={!node.inApp} accessibilityRole={node.inApp ? 'link' : 'button'} accessibilityLabel={label}
                  onPress={node.inApp ? () => go(node.slug) : () => setShown(spot.tie)} onLongPress={() => setShown(spot.tie)}>
                  <Text numberOfLines={2} style={{ color: node.inApp ? palette.accent : palette.muted, fontSize: 14, textAlign: 'center' }}>{nodeName(node)}</Text>
                </Card>
              </View>
            );
          })}
        </View>
        {open === undefined && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 14, rowGap: 4 }}>
            {groups.map(g => (
              <View key={g.kind} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Svg width={14} height={4}><Line x1={0} y1={2} x2={14} y2={2} stroke={kindColor(palette, g.kind)} strokeWidth={3} strokeLinecap="round" /></Svg>
                <Text style={{ color: palette.muted, fontSize: 13 }}>{groupWord(g.kind, person.sex, g.ties.length)}</Text>
              </View>
            ))}
          </View>
        )}
        {listed.length > 0 && (
          <Card palette={palette} pad={[4, 14]}>
            {listed.map(tie => {
              const node = GRAPH.nodes.get(tie.to)!;
              return node.inApp
                ? <Button key={tie.to} variant="plain" label={personName(node)} onPress={() => go(node.slug)} />
                : <Text key={tie.to} style={{ color: palette.muted, fontSize: 16, lineHeight: 34, textAlign: 'right' }}>{personName(node)}</Text>;
            })}
          </Card>
        )}
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
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>من</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {person.titles.map(title => (
              <Chip key={title.title} label={title.name} on={false} palette={palette}
                onPress={() => router.navigate({ pathname: '/tarajim', params: { title: title.title, at: String(Date.now()) } })} />
            ))}
          </View>
        </>}
        <Credit facts={groups.flatMap(g => g.ties.map(tie => tie.link))} palette={palette} />
        <Row>
          <Button label={person.sex === 'FEMALE' ? 'بينها وبين…' : 'بينه وبين…'} onPress={() => router.push({ pathname: '/between', params: { slugs: person.slug } })} />
          <Button label="النسب" onPress={() => router.push({ pathname: '/nasab', params: { slug: person.slug } })} />
          <Button label={person.sex === 'FEMALE' ? 'ترجمتها' : 'ترجمته'} onPress={() => router.push({ pathname: '/person', params: { slug: person.slug } })} />
        </Row>
        {groups.length === 0 && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>لا صلات مذكورة في الترجمة.</Text>}
      </ScrollView>
      <Sheet open={!!shown} onClose={() => setShown(undefined)} palette={palette}>
        {shown && (
          <View style={{ padding: 16, gap: 8 }}>
            <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{shown.link.text || personName(GRAPH.nodes.get(shown.to)!)}</Text>
            <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
              {shown.link.refs.length ? pageLabel(shown.link.refs) : ''}{shown.reversed ? ' · من ترجمة الآخر' : ''}
            </Text>
          </View>
        )}
      </Sheet>
    </View>
  );
}
