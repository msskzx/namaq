import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { router } from 'expo-router';
import { stepClause, tieName, type GraphNode, type Step, type Tie, type TieKind } from '@shared/tarajimGraph';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import TieSheet from './TieSheet';
import type { Palette } from '@/lib/theme';
import { GRAPH, personName } from '@/lib/tarajim';

export const kindColor = (palette: Palette, kind: TieKind) =>
  ({ parent: palette.amber, spouse: palette.accent, child: palette.root, sibling: palette.ink, cousin: palette.path, companion: palette.green, accompanied: palette.green })[kind];

export function edge(a: { x: number; y: number }, b: { x: number; y: number }, hw: number, hh: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity, 1);
  return { x: a.x + dx * t, y: a.y + dy * t };
}

const NODE_W = 220;
const GAP = 8;
const NODE_H = 44;
const ROW = 116;
const LABEL_W = 90;
const CROWDED = 48;
const LABEL_H = 28;
const ROW_FAN = 124;
const ARROW = 9;
const ARROW_HALF = 5;
export function arrowHead(tip: { x: number; y: number }, u: { x: number; y: number }) {
  const back = { x: tip.x - u.x * ARROW, y: tip.y - u.y * ARROW };
  const head = [tip, { x: back.x - u.y * ARROW_HALF, y: back.y + u.x * ARROW_HALF }, { x: back.x + u.y * ARROW_HALF, y: back.y - u.x * ARROW_HALF }];
  return { back, head: head.map(pt => `${pt.x},${pt.y}`).join(' ') };
}
const firstName = (node: GraphNode) => personName(node).split(/\s+بنت?\s+/u)[0];

type Place = { x: number; y: number; w: number; h: number };

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
  for (const node of nodes) if (!depth.has(node)) depth.set(node, last + 1);
  const rows = new Map<number, string[]>();
  for (const node of nodes) rows.set(depth.get(node)!, [...(rows.get(depth.get(node)!) ?? []), node]);
  const xs = new Map<string, { x: number; w: number }>();
  for (const members of rows.values()) {
    const w = Math.min(NODE_W, (width - GAP * (members.length - 1)) / members.length);
    members.forEach((node, i) => xs.set(node, { x: width / 2 + (i - (members.length - 1) / 2) * (w + GAP), w }));
  }
  const crowded = new Set<number>();
  const lastRow = Math.max(0, ...rows.keys());
  for (let row = 0; row < lastRow; row++) {
    const mids = steps.filter(step => Math.min(depth.get(step.from)!, depth.get(step.to)!) === row && depth.get(step.from) !== depth.get(step.to))
      .map(step => (xs.get(step.from)!.x + xs.get(step.to)!.x) / 2).sort((a, b) => a - b);
    if (mids.some((x, i) => i > 0 && x - mids[i - 1] < CROWDED)) crowded.add(row);
  }
  const half = (row: number) => Math.max(NODE_H, ...(rows.get(row) ?? []).map(tall)) / 2;
  const top = new Map<number, number>([[0, half(0) + 8]]);
  for (let row = 1; row <= lastRow; row++) top.set(row, top.get(row - 1)! + half(row - 1) + half(row) + (crowded.has(row - 1) ? ROW_FAN : ROW) - NODE_H);
  const place = new Map<string, Place>();
  for (const node of nodes) place.set(node, { ...xs.get(node)!, y: top.get(depth.get(node)!)!, h: Math.max(NODE_H, tall(node)) });
  return { place, height: top.get(lastRow)! + half(lastRow) + 8, fanned: (step: Step) => depth.get(step.from) !== depth.get(step.to) && crowded.has(Math.min(depth.get(step.from)!, depth.get(step.to)!)) };
}

export default function TiesChain({ nodes, steps, first, picked, width, palette, inCard = false }: {
  nodes: readonly string[]; steps: readonly Step[]; first: string; picked: readonly string[]; width: number; palette: Palette;
  inCard?: boolean;
}) {
  const [tall, setTall] = useState<Record<string, number>>({});
  const [shown, setShown] = useState<Tie | undefined>();
  const sentenceOf = (slug: string): Tie | undefined => {
    const step = steps.find(s => s.from === slug || s.to === slug);
    return step && { to: slug, kind: step.kind, link: step.link };
  };
  const { place, height, fanned } = layout(nodes, steps, first, width, slug => tall[slug] ?? NODE_H);
  const ground = inCard ? palette.card : palette.paper;
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
          const { back, head } = arrowHead(tip, u);
          return [
            <Line key={`${step.from}>${step.to}`} x1={a.x} y1={a.y} x2={back.x} y2={back.y} stroke={color} strokeWidth={2} />,
            <Polygon key={`${step.from}>${step.to}^`} points={head} fill={color} />,
          ];
        })}
      </Svg>
      {lines.map(({ step, word, p, q, a, tip, color }, i) => {
        const said = stepClause(GRAPH, step, firstName);
        const style = { position: 'absolute' as const, height: LABEL_H, textAlign: 'center' as const, color, fontSize: 13, lineHeight: LABEL_H, backgroundColor: ground };
        if (fanned(step)) {
          const lower = p.y > q.y ? p : q;
          const clear = lower === q ? ARROW + 2 : 2;
          return (
            <Text key={`l${step.from}>${step.to}`} numberOfLines={1} accessibilityLabel={said} style={{ ...style, left: lower.x - lower.w / 2, top: lower.y - lower.h / 2 - clear - LABEL_H, width: lower.w }}>
              {word}
            </Text>
          );
        }
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
        const open = node.inApp ? () => router.push({ pathname: '/ties', params: { slug } }) : () => setShown(sentenceOf(slug));
        return (
          <View key={slug} onLayout={e => { const h = Math.round(e.nativeEvent.layout.height); if (h !== at.h && (h > NODE_H || tall[slug])) setTall(t => ({ ...t, [slug]: h })); }}
            style={{ position: 'absolute', left: at.x - at.w / 2, top: at.y - at.h / 2, width: at.w, minHeight: NODE_H, justifyContent: 'center', alignItems: inCard ? 'center' : 'stretch' }}>
            {inCard
              ? <Chip label={personName(node)} on={picked.includes(slug)} lit tint={palette.accent} role="button" onPress={open} palette={palette} />
              : (
                <Card palette={palette} pad={[6, 8]} picked={picked.includes(slug)} accessibilityRole={node.inApp ? 'link' : 'button'} accessibilityLabel={personName(node)} onPress={open}>
                  <Text numberOfLines={2} style={{ color: picked.includes(slug) ? palette.accent : palette.ink, fontSize: 14, textAlign: 'center' }}>{personName(node)}</Text>
                </Card>
              )}
          </View>
        );
      })}
      <TieSheet tie={shown} onClose={() => setShown(undefined)} palette={palette} />
    </View>
  );
}
