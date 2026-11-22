import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { router } from 'expo-router';
import { stepClause, tieName, type GraphNode, type Step, type TieKind } from '@shared/tarajimGraph';
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
/** Rows far enough apart that a line between them holds its tie's name and its arrow with room round both. */
const ROW = 116;
const LABEL_W = 90;
/** Two lines whose names would touch at their middles, and the row gap when their names go above the people instead. */
const CROWDED = 48;
const LABEL_H = 28;
const ROW_FAN = 124;
/** The arrow's length and half width at the end of a line. */
const ARROW = 9;
const ARROW_HALF = 5;
/** The name before «بن» or «بنت», for the clause a screen reader says for a line: «الزبير ابنُ صفية». */
const firstName = (node: GraphNode) => personName(node).split(/\s+بنت?\s+/u)[0];

type Place = { x: number; y: number; w: number; h: number };

/**
 * Rows for the joining graph: each person on the row of his distance from the first one, so the chains read top down
 * like the nasab tree, and the people of a row spread across.
 */
function layout(nodes: readonly string[], steps: readonly Step[], first: string, width: number, tall: (slug: string) => number) {
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
  const xs = new Map<string, { x: number; w: number }>();
  for (const members of rows.values()) {
    const w = Math.min(NODE_W, (width - GAP * (members.length - 1)) / members.length);
    members.forEach((node, i) => xs.set(node, { x: width / 2 + (i - (members.length - 1) / 2) * (w + GAP), w }));
  }
  // Lines fanning out from one person to a full row put their words too close at the middle: those words go just above
  // the person each line reaches, as wide as his box, and the rows move apart to leave the lines room (the in-laws card).
  const crowded = new Set<number>();
  const lastRow = Math.max(0, ...rows.keys());
  for (let row = 0; row < lastRow; row++) {
    const mids = steps.filter(step => Math.min(depth.get(step.from)!, depth.get(step.to)!) === row && depth.get(step.from) !== depth.get(step.to))
      .map(step => (xs.get(step.from)!.x + xs.get(step.to)!.x) / 2).sort((a, b) => a - b);
    if (mids.some((x, i) => i > 0 && x - mids[i - 1] < CROWDED)) crowded.add(row);
  }
  // A name that takes two lines makes its box taller: the rows keep the same length of line between the boxes.
  const half = (row: number) => Math.max(NODE_H, ...(rows.get(row) ?? []).map(tall)) / 2;
  const top = new Map<number, number>([[0, half(0) + 8]]);
  for (let row = 1; row <= lastRow; row++) top.set(row, top.get(row - 1)! + half(row - 1) + half(row) + (crowded.has(row - 1) ? ROW_FAN : ROW) - NODE_H);
  const place = new Map<string, Place>();
  for (const node of nodes) place.set(node, { ...xs.get(node)!, y: top.get(depth.get(node)!)!, h: Math.max(NODE_H, tall(node)) });
  return { place, height: top.get(lastRow)! + half(lastRow) + 8, fanned: (step: Step) => depth.get(step.from) !== depth.get(step.to) && crowded.has(Math.min(depth.get(step.from)!, depth.get(step.to)!)) };
}

/**
 * The one drawing of a chain of ties (owner, 2026-11-18/19): «بينه وبين…» and the «صلة» feed card draw the same thing.
 * Each line says only the tie's name, and its arrow runs from the one the name describes to the one he is it to: «أم»
 * on the line from صفية to الزبير (owner, 2026-11-22). A screen reader hears the whole clause with both names, and the
 * «النص» view writes it out. Only the people picked are in the accent (owner, 2026-11-22). Anyone with a page opens his ties. Inside a feed card the people are chips, since a card
 * holds no card.
 */
export default function TiesChain({ nodes, steps, first, picked, width, palette, inCard = false }: {
  nodes: readonly string[]; steps: readonly Step[]; first: string; picked: readonly string[]; width: number; palette: Palette;
  /** Drawn inside a card (the feed): people as chips on the card's colour. */
  inCard?: boolean;
}) {
  // Each box's height as drawn, so lines end at its edge however many lines its name takes.
  const [tall, setTall] = useState<Record<string, number>>({});
  const { place, height, fanned } = layout(nodes, steps, first, width, slug => tall[slug] ?? NODE_H);
  const ground = inCard ? palette.card : palette.paper;
  // Each line from the edge of the one its name describes to the edge of the other, where the arrow ends.
  const lines = steps.map(step => {
    const { word, who, of } = tieName(GRAPH, step);
    const p = place.get(who)!;
    const q = place.get(of)!;
    const a = edge(p, q, p.w / 2, p.h / 2);
    const tip = edge(q, p, q.w / 2, q.h / 2);
    const long = Math.hypot(tip.x - a.x, tip.y - a.y) || 1;
    const u = { x: (tip.x - a.x) / long, y: (tip.y - a.y) / long };
    return { step, word, p, q, a, tip, u, color: kindColor(palette, step.kind) };
  });
  return (
    <View style={{ width, height, alignSelf: 'center' }}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        {lines.map(({ step, a, tip, u, color }) => {
          const back = { x: tip.x - u.x * ARROW, y: tip.y - u.y * ARROW };
          const head = [tip, { x: back.x - u.y * ARROW_HALF, y: back.y + u.x * ARROW_HALF }, { x: back.x + u.y * ARROW_HALF, y: back.y - u.x * ARROW_HALF }];
          return [
            <Line key={`${step.from}>${step.to}`} x1={a.x} y1={a.y} x2={back.x} y2={back.y} stroke={color} strokeWidth={2} />,
            <Polygon key={`${step.from}>${step.to}^`} points={head.map(pt => `${pt.x},${pt.y}`).join(' ')} fill={color} />,
          ];
        })}
      </Svg>
      {lines.map(({ step, word, p, q, a, tip, color }, i) => {
        const said = stepClause(GRAPH, step, firstName);
        const style = { position: 'absolute' as const, height: LABEL_H, textAlign: 'center' as const, color, fontSize: 13, lineHeight: LABEL_H, backgroundColor: ground };
        if (fanned(step)) {
          // Above the lower one, clear of the arrow when it ends on him.
          const lower = p.y > q.y ? p : q;
          const clear = lower === q ? ARROW + 2 : 2;
          return (
            <Text key={`l${step.from}>${step.to}`} numberOfLines={1} accessibilityLabel={said} style={{ ...style, left: lower.x - lower.w / 2, top: lower.y - lower.h / 2 - clear - LABEL_H, width: lower.w }}>
              {word}
            </Text>
          );
        }
        // Between the line's ends, short of the arrow; lines between the same two rows each take the room to their neighbour.
        const mid = { x: (a.x + tip.x) / 2, y: (a.y + tip.y) / 2 };
        const room = Math.min(LABEL_W, ...lines.filter((_, j) => j !== i).map(other => {
          const m = { x: (other.a.x + other.tip.x) / 2, y: (other.a.y + other.tip.y) / 2 };
          return Math.abs(m.y - mid.y) < LABEL_H ? Math.abs(m.x - mid.x) - 6 : Infinity;
        }));
        return (
          <Text key={`l${step.from}>${step.to}`} numberOfLines={1} accessibilityLabel={said} style={{ ...style, left: Math.max(0, Math.min(width - room, mid.x - room / 2)), top: mid.y - LABEL_H / 2, width: room }}>
            {word}
          </Text>
        );
      })}
      {nodes.map(slug => {
        const node = GRAPH.nodes.get(slug)!;
        const at = place.get(slug)!;
        const open = node.inApp ? () => router.push({ pathname: '/ties', params: { slug } }) : undefined;
        return (
          <View key={slug} onLayout={e => { const h = Math.round(e.nativeEvent.layout.height); if (h !== at.h && (h > NODE_H || tall[slug])) setTall(t => ({ ...t, [slug]: h })); }}
            style={{ position: 'absolute', left: at.x - at.w / 2, top: at.y - at.h / 2, width: at.w, minHeight: NODE_H, justifyContent: 'center', alignItems: inCard ? 'center' : 'stretch' }}>
            {inCard
              ? <Chip label={personName(node)} on={picked.includes(slug)} lit tint={node.inApp ? palette.accent : palette.muted} role={node.inApp ? 'button' : 'text'} onPress={open} palette={palette} />
              : (
                <Card palette={palette} pad={[6, 8]} picked={picked.includes(slug)} faded={!node.inApp} accessibilityRole={node.inApp ? 'link' : undefined} accessibilityLabel={personName(node)} onPress={open}>
                  <Text numberOfLines={2} style={{ color: picked.includes(slug) ? palette.accent : node.inApp ? palette.ink : palette.muted, fontSize: 14, textAlign: 'center' }}>{personName(node)}</Text>
                </Card>
              )}
          </View>
        );
      })}
    </View>
  );
}
