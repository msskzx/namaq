import { useState } from 'react';
import { Check } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { settledTies } from '@shared/peopleCards';
import { groupWord, lineWord, tieGroups, tieWord, type GraphNode, type Tie, type TieGroup, type TieKind } from '@shared/tarajimGraph';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card, { useInsideCard } from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import type { Palette } from '@/lib/theme';
import { findPerson, GRAPH, personName } from '@/lib/tarajim';
import { arrowHead, edge, kindColor } from './TiesChain';

const NODE_H = 62;
const GROW = 26;
const GAP = 10;
const ROW = NODE_H + 46;
const LABEL_H = 18;
const LABEL_W = 70;
const nodeName = (node: GraphNode, middle?: string) => {
  const name = personName(node);
  const father = middle && GRAPH.nodes.get(middle)?.name.replace(/\s*ﷺ/u, '').split(/\s+(?:بن|بنت)\s+/u)[0].trim().split(/\s+/u);
  const word = (w: string) => (/^أب[وياى]$/u.test(w) ? 'أب(?:و|ي|ا)' : w);
  for (let n = father ? father.length : 0; father && n >= (/^أب[وي]$/u.test(father[0]) ? 2 : 1); n--) {
    const own = name.replace(new RegExp(`\\s+(?:بن|بنت)\\s+${father.slice(0, n).map(word).join('\\s+')}$`, 'u'), '');
    if (own !== name) return own;
  }
  return name.replace(/\s+بن\s+.*$/u, (rest) => (rest.length > 18 ? '' : rest));
};

type Spot = { key: string; x: number; y: number; kind: TieKind } & ({ tie: Tie } | { group: TieKind; count: number });

const columns = (width: number) => Math.max(2, Math.floor((width + GAP) / (100 + GAP)));
const nodeWidth = (width: number) => (width - (columns(width) - 1) * GAP) / columns(width);

const capacity = (width: number) => 2 * columns(width) + (columns(width) >= 3 ? 2 : 0);

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
  const middleW = sides > 0 ? Math.min(w * 1.2, width - 2 * (w + GAP)) : Math.min(w * 1.8, width);
  return { places: [...row(top, first), ...side, ...row(below, mid + ROW)], middle: mid, middleW, height: mid + NODE_H / 2 + GROW + (below > 0 ? ROW : 0), w };
}

export function foldedKinds(groups: readonly TieGroup[], room: number): TieKind[] {
  const folded = new Set<TieKind>();
  const size = () => groups.reduce((sum, g) => sum + (folded.has(g.kind) ? 1 : g.ties.length), 0);
  for (const g of [...groups].sort((a, b) => b.ties.length - a.ties.length)) {
    if (size() <= room) break;
    if (g.ties.length > 1) folded.add(g.kind);
  }
  return [...folded];
}

export const ringRoom = (width: number) => capacity(width);

const ROUND_H = 40;
const MIDDLE_H = 80;
const roundW = (label: string, width: number) => Math.min(width / 3, label.length * 7 + 22);

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
  dashed?: boolean };

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

export const ringName = (slug: string, middle?: string) => nodeName(GRAPH.nodes.get(slug)!, middle);

export function personNode(slug: string, colour: string, go: (slug: string) => void, show?: () => void, middle?: string): RoundNode {
  const node = GRAPH.nodes.get(slug)!;
  return { key: slug, label: nodeName(node, middle), colour, inApp: node.inApp, onPress: node.inApp ? () => go(slug) : () => show?.(), onLongPress: show };
}

export function tiesOf(slug: string): TieGroup[] {
  const seen = new Set<string>();
  return tieGroups(GRAPH, slug)
    .map(g => ({ ...g, ties: settledTies(slug, g.kind, g.ties).filter(tie => !seen.has(tie.to) && seen.add(tie.to)) }))
    .filter(g => g.ties.length > 0);
}

export default function TiesRing({ slug, width, palette, onPick, onShow, marked }: {
  slug: string; width: number; palette: Palette;
  marked?: string;
  onPick: (slug: string) => void;
  onShow?: (tie: Tie) => void;
}) {
  const [opened, setOpen] = useState<{ slug: string; kind: TieKind } | undefined>();
  const ground = useInsideCard() ? palette.card : palette.paper;
  const open = opened?.slug === slug ? opened.kind : undefined;
  const person = findPerson(slug);
  if (!person) return null;
  const groups = tiesOf(slug);
  const drawW = width;
  const go = onPick;
  const setShown = (tie: Tie) => onShow?.(tie);
  const room = capacity(drawW);
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
  const big = openGroup && openGroup.ties.length > room ? openGroup : undefined;
  const oval = big && roundLayout(big.ties.map(tie => ringName(tie.to, slug)), drawW)
    ? big.ties.map(tie => ({ ...personNode(tie.to, kindColor(palette, tie.kind), go, () => setShown(tie), slug), dashed: tie.link.disputed })) : undefined;
  const listed = big && !oval ? big.ties : [];

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
        {oval ? <RoundRing middle={personName(person)} nodes={oval} width={drawW} palette={palette} /> : (
        <View style={{ width: drawW, height: drawH, alignSelf: 'center' }}>
          <Svg width={drawW} height={drawH} style={{ position: 'absolute' }}>
            {placed.map(spot => {
              const inner = edge(centre, spot, middleW / 2, 26);
              const outer = edge(spot, centre, NODE_W / 2, NODE_H / 2);
              const [a, tip] = spot.kind === 'accompanied' ? [inner, outer] : [outer, inner];
              const long = Math.hypot(tip.x - a.x, tip.y - a.y) || 1;
              const { back, head } = arrowHead(tip, { x: (tip.x - a.x) / long, y: (tip.y - a.y) / long });
              const colour = kindColor(palette, spot.kind);
              return [
                <Line key={spot.key} x1={a.x} y1={a.y} x2={back.x} y2={back.y} stroke={colour} strokeWidth={2} strokeOpacity={0.8} />,
                <Polygon key={`${spot.key}^`} points={head} fill={colour} />,
              ];
            })}
          </Svg>
          {placed.map((spot, i) => {
            if (!('tie' in spot)) return null;
            const mid = (at: Spot) => {
              const a = edge(centre, at, middleW / 2, 26), b = edge(at, centre, NODE_W / 2, NODE_H / 2);
              return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            };
            const m = spot.y === middle ? { x: spot.x, y: spot.y - (NODE_H + GROW) / 2 - LABEL_H / 2 + 6 } : mid(spot);
            const room = Math.min(LABEL_W, ...placed.filter((_, j) => j !== i && placed[j].y !== middle).map(other => {
              const o = mid(other);
              return Math.abs(o.y - m.y) < LABEL_H ? Math.abs(o.x - m.x) - 4 : Infinity;
            }));
            const node = GRAPH.nodes.get(spot.tie.to)!;
            return (
              <View key={`w${spot.key}`} pointerEvents="none" style={{ position: 'absolute', left: Math.max(0, Math.min(drawW - room, m.x - room / 2)), top: m.y - LABEL_H / 2, width: room, height: LABEL_H, alignItems: 'center' }}>
                <Text numberOfLines={1} style={{ color: kindColor(palette, spot.kind), fontSize: 12, lineHeight: LABEL_H, paddingHorizontal: 3, backgroundColor: ground }}>{lineWord(spot.kind, node.sex, person.sex)}</Text>
              </View>
            );
          })}
          <View style={{ position: 'absolute', left: drawW / 2 - middleW / 2, top: middle - (NODE_H + GROW) / 2, height: NODE_H + GROW, width: middleW, justifyContent: 'center' }}>
            <Card palette={palette} node pad={[8, 10]} picked accessibilityRole="header" accessibilityLabel={personName(person)}>
              <Text numberOfLines={2} style={{ color: palette.accent, fontSize: 17, textAlign: 'center' }}>{personName(person)}</Text>
            </Card>
          </View>
          {placed.map(spot => {
            const grows = spot.y < middle ? 'flex-end' as const : spot.y > middle ? 'flex-start' as const : 'center' as const;
            const style = {
              position: 'absolute' as const, left: spot.x - NODE_W / 2, width: NODE_W, height: NODE_H + GROW, justifyContent: grows,
              top: grows === 'flex-end' ? spot.y + NODE_H / 2 - NODE_H - GROW : grows === 'flex-start' ? spot.y - NODE_H / 2 : spot.y - (NODE_H + GROW) / 2,
            };
            if ('group' in spot) {
              const label = `${groupWord(spot.group, person.sex, spot.count)} ${num(spot.count)}`;
              return (
                <View key={spot.key} style={style}>
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
                  <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 14, textAlign: 'center' }}>{nodeName(node, slug)}</Text>
                </Card>
              </View>
            );
          })}
        </View>
        )}
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
              return <Button key={tie.to} variant="plain" label={personName(node)} Icon={tie.to === marked ? Check : undefined} onPress={node.inApp ? () => go(node.slug) : () => setShown(tie)} />;
            })}
          </Card>
        )}
    </View>
  );
}

export { default as TieSheet, DoubtedSheet } from './TieSheet';
