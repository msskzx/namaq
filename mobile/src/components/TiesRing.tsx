import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { groupWord, tieGroups, tieWord, type GraphNode, type Tie, type TieGroup, type TieKind } from '@shared/tarajimGraph';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import type { Palette } from '@/lib/theme';
import { findPerson, GRAPH, personName } from '@/lib/tarajim';
import { edge, kindColor } from './TiesChain';

const NODE_H = 62;
/** Room a node has to grow away from the middle when its name takes another line, so its line still meets its edge. */
const GROW = 26;
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
  const first = GROW + NODE_H / 2;
  const mid = top > 0 ? first + ROW : first;
  const side = [{ x: width - w / 2, y: mid }, { x: w / 2, y: mid }].slice(0, sides);
  // The middle card is wider than the others, but never over the sides of its row.
  const middleW = sides > 0 ? Math.min(w * 1.2, width - 2 * (w + GAP)) : Math.min(w * 1.8, width);
  return { places: [...row(top, first), ...side, ...row(below, mid + ROW)], middle: mid, middleW, height: mid + NODE_H / 2 + GROW + (below > 0 ? ROW : 0), w };
}

/** A person's ties by kind, each person once, under the nearest kind (al-Zubayr's kin the Prophet ﷺ is not drawn again as his companion). */
export function tiesOf(slug: string): TieGroup[] {
  const seen = new Set<string>();
  return tieGroups(GRAPH, slug)
    .map(g => ({ ...g, ties: g.ties.filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
    .filter(g => g.ties.length > 0);
}

/**
 * The one drawing of a person's ties (owner, 2026-11-18; sketches tarajim-app/graph/sketch-dark.png and sketch2-dark.png):
 * the person in the middle and his ties round him, a line coloured by the kind of tie, each node naming what it is to
 * him. A kind with more people than the drawing holds is one node with its count; tapping it opens that kind alone (a
 * list when even that does not fit). The «صلاته» screen draws it, and so may a quiz or a card: `onPick` gets a person
 * with a page, `onShow` a tie to show its sentence.
 */
export default function TiesRing({ slug, width, palette, onPick, onShow, marked }: {
  slug: string; width: number; palette: Palette;
  /** A person whose node is framed in green: the answer a quiz asked about, once it is shown. */
  marked?: string;
  /** A person with a page was tapped. */
  onPick: (slug: string) => void;
  /** A tie to show the sentence that states it (a long press, or a tap on someone with no page). */
  onShow?: (tie: Tie) => void;
}) {
  const [opened, setOpen] = useState<{ slug: string; kind: TieKind } | undefined>();
  const open = opened?.slug === slug ? opened.kind : undefined;
  const person = findPerson(slug);
  if (!person) return null;
  const groups = tiesOf(slug);
  const drawW = width;
  const go = onPick;
  const setShown = (tie: Tie) => onShow?.(tie);
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
      // The marked person's kind stays open, so the answer is a node of its own.
      if (g.ties.length > 1 && !g.ties.some(tie => tie.to === marked)) folded.add(g.kind);
    }
    return groups.flatMap((g): Item[] => (folded.has(g.kind) ? [{ group: g.kind, count: g.ties.length, kind: g.kind }] : g.ties.map(tie => ({ tie, kind: tie.kind }))));
  })();
  const { places, middle, middleW, height: drawH, w: NODE_W } = layout(spots.length, drawW);
  const centre = { x: drawW / 2, y: middle };
  const placed: Spot[] = spots.map((spot, i) => ({ ...spot, ...places[i], key: 'tie' in spot ? `${spot.kind}:${spot.tie.to}` : `g:${spot.group}` }));
  const openGroup = open ? groups.find(g => g.kind === open) : undefined;
  const listed = openGroup && openGroup.ties.length > room ? openGroup.ties : [];

  return (
    <View style={{ gap: 12 }}>
        {open && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {groups.map(g => (
              <Chip key={g.kind} small label={`${groupWord(g.kind, person.sex, g.ties.length)} ${num(g.ties.length)}`} on={g.kind === open} palette={palette}
                onPress={() => setOpen(g.kind === open ? undefined : { slug, kind: g.kind })} />
            ))}
          </View>
        )}
        <View style={{ width: drawW, height: drawH, alignSelf: 'center' }}>
          <Svg width={drawW} height={drawH} style={{ position: 'absolute' }}>
            {placed.map(spot => {
              const from = edge(centre, spot, middleW / 2, 26);
              const to = edge(spot, centre, NODE_W / 2, NODE_H / 2);
              return <Line key={spot.key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={kindColor(palette, spot.kind)} strokeWidth={2} strokeOpacity={0.8} />;
            })}
          </Svg>
          <View style={{ position: 'absolute', left: drawW / 2 - middleW / 2, top: middle - (NODE_H + GROW) / 2, height: NODE_H + GROW, width: middleW, justifyContent: 'center' }}>
            <Card palette={palette} pad={[8, 10]} picked accessibilityRole="header" accessibilityLabel={personName(person)}>
              <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 17, textAlign: 'center' }}>{personName(person)}</Text>
            </Card>
          </View>
          {placed.map(spot => {
            // Above the middle a node grows upwards, below it downwards, beside it both ways: its inner edge stays where its line ends.
            const grows = spot.y < middle ? 'flex-end' as const : spot.y > middle ? 'flex-start' as const : 'center' as const;
            const style = {
              position: 'absolute' as const, left: spot.x - NODE_W / 2, width: NODE_W, height: NODE_H + GROW, justifyContent: grows,
              top: grows === 'flex-end' ? spot.y + NODE_H / 2 - NODE_H - GROW : grows === 'flex-start' ? spot.y - NODE_H / 2 : spot.y - (NODE_H + GROW) / 2,
            };
            if ('group' in spot) {
              const label = `${groupWord(spot.group, person.sex, spot.count)} ${num(spot.count)}`;
              return (
                <View key={spot.key} style={style}>
                  <Card palette={palette} pad={[6, 8]} outline={kindColor(palette, spot.kind)} accessibilityRole="button" accessibilityLabel={label}
                    onPress={() => setOpen({ slug, kind: spot.group })}>
                    <Text style={{ color: kindColor(palette, spot.kind), fontSize: 15, textAlign: 'center' }}>{label}</Text>
                  </Card>
                </View>
              );
            }
            const node = GRAPH.nodes.get(spot.tie.to)!;
            const label = `${tieWord(spot.kind, node.sex, person.sex)}: ${personName(node)}`;
            return (
              <View key={spot.key} style={style}>
                <Card palette={palette} pad={[6, 8]} picked={node.inApp && node.slug !== marked} faded={!node.inApp} outline={node.slug === marked ? palette.green : undefined} accessibilityRole={node.inApp ? 'link' : 'button'} accessibilityLabel={label}
                  onPress={node.inApp ? () => go(node.slug) : () => setShown(spot.tie)} onLongPress={() => setShown(spot.tie)}>
                  {/* What this person is to the one in the middle, on the node itself, so a line's colour is never the only clue. */}
                  <Text style={{ color: kindColor(palette, spot.kind), fontSize: 12, textAlign: 'center' }}>{tieWord(spot.kind, node.sex, person.sex)}</Text>
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
    </View>
  );
}
