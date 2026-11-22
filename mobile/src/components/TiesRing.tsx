import { useState } from 'react';
import { Check } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { groupWord, tieGroups, tieWord, type GraphNode, type Tie, type TieGroup, type TieKind } from '@shared/tarajimGraph';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Sheet from '@/ui/Sheet';
import { pageLabel, saidBy } from '@shared/tarajim';
import Saying from '@/ui/Saying';
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

/** The kinds a ring of `room` nodes folds into one node each, the biggest first, until the rest fit. */
export function foldedKinds(groups: readonly TieGroup[], room: number): TieKind[] {
  const folded = new Set<TieKind>();
  const size = () => groups.reduce((sum, g) => sum + (folded.has(g.kind) ? 1 : g.ties.length), 0);
  for (const g of [...groups].sort((a, b) => b.ties.length - a.ties.length)) {
    if (size() <= room) break;
    if (g.ties.length > 1) folded.add(g.kind);
  }
  return [...folded];
}

/** How many nodes a ring holds in a drawing `width` wide. */
export const ringRoom = (width: number) => capacity(width);

/** The nodes of a round ring: one name each, as wide as the name (read off its letters) up to a third of the drawing. */
const ROUND_H = 40;
const MIDDLE_H = 80;
const roundW = (label: string, width: number) => Math.min(width / 3, label.length * 7 + 22);

/**
 * A round ring's places (owner, 2026-11-21; feed-visuals sketch panels 7 and 9): its nodes down both sides of the middle
 * in turn, each lower than the last by more than a node's height so none touch, near the middle at the top and foot and
 * out to the edges beside it, like an oval. It holds no more than fit while it is under half as tall again as it is wide
 * (null then).
 */
export function roundLayout(labels: readonly string[], width: number) {
  const ws = labels.map(label => roundW(label, width));
  const middleW = width * 0.27;
  for (let step = ROUND_H + 6; (labels.length - 1) * step + ROUND_H + 8 <= width * 1.5; step += 4) {
    const height = Math.max((labels.length - 1) * step, MIDDLE_H) + ROUND_H + 8;
    const middle = { x: width / 2, y: height / 2 };
    const half = Math.max(height / 2 - ROUND_H / 2 - 4, 1);
    const places = labels.map((_, i) => {
      const y = ROUND_H / 2 + 4 + i * step + (labels.length === 1 ? half : 0);
      const near = ws[i] / 2 + 8;
      const out = width / 2 - ws[i] / 2 - near;
      const side = i % 2 ? -1 : 1;
      return { x: width / 2 + side * (near + out * Math.sqrt(Math.max(0, 1 - ((y - middle.y) / half) ** 2))), y };
    });
    if (places.every((place, i) => Math.abs(place.x - middle.x) >= (ws[i] + middleW) / 2 + 6 || Math.abs(place.y - middle.y) >= (ROUND_H + MIDDLE_H) / 2 + 6)) {
      return { places, ws, h: ROUND_H, middle, middleW, height };
    }
  }
  return null;
}

export type RoundNode = { key: string; label: string; colour: string; inApp: boolean; onPress: () => void; onLongPress?: () => void;
  /** A tie the book gives «على خلاف»: its line dashed; the person drawn as every other (owner, 2026-11-22). */
  dashed?: boolean };

/**
 * A ring drawn round (owner, 2026-11-21): a middle (a person, a title) with its people on an oval round it, each a line to
 * the middle. The one-kind ring of a person, a title's holders and a hadith's people draw it.
 */
export function RoundRing({ middle, nodes, width, palette }: { middle: string; nodes: readonly RoundNode[]; width: number; palette: Palette }) {
  const layout = roundLayout(nodes.map(node => node.label), width);
  if (!layout) return null;
  const { places, ws, h, middle: centre, middleW, height } = layout;
  return (
    <View style={{ width, height, alignSelf: 'center' }}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        {nodes.map((node, i) => {
          const from = edge(centre, places[i], middleW / 2, 26);
          const to = edge(places[i], centre, ws[i] / 2, h / 2);
          return <Line key={node.key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={node.colour} strokeWidth={2} strokeOpacity={0.8} strokeDasharray={node.dashed ? '6 5' : undefined} />;
        })}
      </Svg>
      <View style={{ position: 'absolute', left: centre.x - middleW / 2, top: centre.y - MIDDLE_H / 2, width: middleW, height: MIDDLE_H, justifyContent: 'center' }}>
        <Card palette={palette} node pad={[8, 10]} picked accessibilityRole="header" accessibilityLabel={middle}>
          <Text numberOfLines={3} style={{ color: palette.accent, fontSize: 15, lineHeight: 20, textAlign: 'center' }}>{middle}</Text>
        </Card>
      </View>
      {nodes.map((node, i) => (
        <View key={node.key} style={{ position: 'absolute', left: places[i].x - ws[i] / 2, top: places[i].y - h / 2, width: ws[i], height: h, justifyContent: 'center' }}>
          <Card palette={palette} node pad={[4, 6]} accessibilityRole={node.inApp ? 'link' : 'button'} accessibilityLabel={node.label}
            onPress={node.onPress} onLongPress={node.onLongPress} style={{ minHeight: h, justifyContent: 'center' }}>
            <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 14, textAlign: 'center' }}>{node.label}</Text>
          </Card>
        </View>
      ))}
    </View>
  );
}

/** A node's name in a ring: «X بن Y» shortened as the grid ring shortens it. */
export const ringName = (slug: string) => nodeName(GRAPH.nodes.get(slug)!);

/** A person in a round ring: his page when he has one, else the sentence that names him. */
export function personNode(slug: string, colour: string, go: (slug: string) => void, show?: () => void): RoundNode {
  const node = GRAPH.nodes.get(slug)!;
  return { key: slug, label: nodeName(node), colour, inApp: node.inApp, onPress: node.inApp ? () => go(slug) : () => show?.(), onLongPress: show };
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
    const folded = new Set(foldedKinds(groups, room));
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
            <Card palette={palette} node pad={[8, 10]} picked accessibilityRole="header" accessibilityLabel={personName(person)}>
              <Text numberOfLines={2} style={{ color: palette.accent, fontSize: 17, textAlign: 'center' }}>{personName(person)}</Text>
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
                  {/* A kind folded with the marked person in it is framed green: he is a tap away. */}
                  <Card palette={palette} node pad={[6, 8]} outline={groups.find(g => g.kind === spot.group)?.ties.some(tie => tie.to === marked) ? palette.green : kindColor(palette, spot.kind)} accessibilityRole="button" accessibilityLabel={label}
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
                <Card palette={palette} node pad={[6, 8]} outline={node.slug === marked ? palette.green : undefined} accessibilityRole={node.inApp ? 'link' : 'button'} accessibilityLabel={label}
                  onPress={node.inApp ? () => go(node.slug) : () => setShown(spot.tie)} onLongPress={() => setShown(spot.tie)}>
                  {/* What this person is to the one in the middle, on the node itself, so a line's colour is never the only clue. */}
                  <Text style={{ color: kindColor(palette, spot.kind), fontSize: 12, textAlign: 'center' }}>{tieWord(spot.kind, node.sex, person.sex)}</Text>
                  <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 14, textAlign: 'center' }}>{nodeName(node)}</Text>
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
                ? <Button key={tie.to} variant="plain" label={personName(node)} Icon={tie.to === marked ? Check : undefined} onPress={() => go(node.slug)} />
                : <Text key={tie.to} style={{ color: tie.to === marked ? palette.green : palette.muted, fontSize: 16, lineHeight: 34, textAlign: 'right' }}>{personName(node)}</Text>;
            })}
          </Card>
        )}
    </View>
  );
}

/** The sentence that states a tie, with its pages: a long press on the ring, on the «صلاته» screen and the person page. */
/** A tie in the book's own words, with its pages (the ring's sheets). */
function TieWords({ tie, palette }: { tie: Tie; palette: Palette }) {
  return (
    <View style={{ gap: 8 }}>
      <Saying by={tie.link.text ? saidBy(tie.link) : undefined} palette={palette}>
        <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{tie.link.text || personName(GRAPH.nodes.get(tie.to)!)}</Text>
      </Saying>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
        {tie.link.refs.length ? pageLabel(tie.link.refs) : ''}{tie.reversed ? ' · من ترجمة الآخر' : ''}
      </Text>
    </View>
  );
}

export function TieSheet({ tie, onClose, palette }: { tie?: Tie; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!tie} onClose={onClose} palette={palette}>
      {tie && <View style={{ padding: 16 }}><TieWords tie={tie} palette={palette} /></View>}
    </Sheet>
  );
}

/**
 * A ring's ties the book gives «على خلاف», all in one sheet (owner, 2026-11-22): only the book's words and their pages,
 * no words of ours; two ties the book says in the same words show them once.
 */
export function DoubtedSheet({ ties, open, onClose, palette }: { ties: readonly Tie[]; open: boolean; onClose: () => void; palette: Palette }) {
  const once = ties.filter((tie, i) => !tie.link.text || ties.findIndex(other => other.link.text === tie.link.text) === i);
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        {once.map(tie => <TieWords key={tie.to} tie={tie} palette={palette} />)}
      </ScrollView>
    </Sheet>
  );
}
