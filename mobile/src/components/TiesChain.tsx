import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { router } from 'expo-router';
import { stepClause, type GraphNode, type Step, type TieKind } from '@shared/tarajimGraph';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import type { Palette } from '@/lib/theme';
import { GRAPH, personName } from '@/lib/tarajim';

/** Each kind of tie has its colour, for its lines and its group (sketch tarajim-app/graph/sketch-dark.png). */
export const kindColor = (palette: Palette, kind: TieKind) =>
  ({ parent: palette.amber, spouse: palette.accent, child: palette.root, sibling: palette.ink, cousin: palette.path, companion: palette.green, accompanied: palette.green })[kind];

/** Where the line from `a` to `b` leaves a box of half sizes `hw`×`hh` round `a`, so a faded box shows no line through it. */
export function edge(a: { x: number; y: number }, b: { x: number; y: number }, hw: number, hh: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity, 1);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

const NODE_W = 220;
const GAP = 8;
const NODE_H = 44;
const ROW = 92;
const LABEL_W = 170;
/** The name before «بن» or «بنت», for the short clause on a line: «الزبير ابنُ صفية». */
const firstName = (node: GraphNode) => personName(node).split(/\s+بنت?\s+/u)[0];

type Place = { x: number; y: number; w: number };

/**
 * Rows for the joining graph: each person on the row of his distance from the first one, so the chains read top down
 * like the nasab tree, and the people of a row spread across.
 */
function layout(nodes: readonly string[], steps: readonly Step[], first: string, width: number) {
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
  // A row of few people gives each a wide box, so a name stays on one line and the tie's words between rows stay clear.
  const place = new Map<string, Place>();
  for (const [row, members] of rows) {
    const w = Math.min(NODE_W, (width - GAP * (members.length - 1)) / members.length);
    members.forEach((node, i) => place.set(node, { x: width / 2 + (i - (members.length - 1) / 2) * (w + GAP), y: NODE_H / 2 + 8 + row * ROW, w }));
  }
  return { place, height: (Math.max(0, ...rows.keys()) + 1) * ROW };
}

/**
 * The one drawing of a chain of ties (owner, 2026-11-18/19): «بينه وبين…» and the «صلة» feed card draw the same thing.
 * Each line carries the whole tie with both names («الزبير ابنُ صفية»), so a word such as «ابنُ» never leaves the
 * reader guessing who is whose son. Anyone with a page opens his ties. Inside a feed card the people are chips, since a
 * card holds no card.
 */
export default function TiesChain({ nodes, steps, first, picked, width, palette, inCard = false }: {
  nodes: readonly string[]; steps: readonly Step[]; first: string; picked: readonly string[]; width: number; palette: Palette;
  /** Drawn inside a card (the feed): people as chips on the card's colour. */
  inCard?: boolean;
}) {
  const { place, height } = layout(nodes, steps, first, width);
  const ground = inCard ? palette.card : palette.paper;
  return (
    <View style={{ width, height, alignSelf: 'center' }}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
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
        return (
          <Text key={`l${step.from}>${step.to}`} numberOfLines={2} style={{ position: 'absolute', left: Math.max(0, Math.min(width - room, mid.x - room / 2)), top: mid.y - (room < LABEL_W ? 18 : 10), width: room, textAlign: 'center', color: kindColor(palette, step.kind), fontSize: 13, backgroundColor: ground }}>
            {stepClause(GRAPH, step, firstName)}
          </Text>
        );
      })}
      {nodes.map(slug => {
        const node = GRAPH.nodes.get(slug)!;
        const at = place.get(slug)!;
        const open = node.inApp ? () => router.push({ pathname: '/ties', params: { slug } }) : undefined;
        return (
          <View key={slug} style={{ position: 'absolute', left: at.x - at.w / 2, top: at.y - NODE_H / 2, width: at.w, height: NODE_H, justifyContent: 'center', alignItems: inCard ? 'center' : 'stretch' }}>
            {inCard
              ? <Chip label={personName(node)} on={picked.includes(slug)} lit tint={node.inApp ? palette.accent : palette.muted} role={node.inApp ? 'button' : 'text'} onPress={open} palette={palette} />
              : (
                <Card palette={palette} pad={[6, 8]} picked={picked.includes(slug)} faded={!node.inApp} accessibilityRole={node.inApp ? 'link' : undefined} accessibilityLabel={personName(node)} onPress={open}>
                  <Text numberOfLines={2} style={{ color: node.inApp ? palette.accent : palette.muted, fontSize: 14, textAlign: 'center' }}>{personName(node)}</Text>
                </Card>
              )}
          </View>
        );
      })}
    </View>
  );
}
