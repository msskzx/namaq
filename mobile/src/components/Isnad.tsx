import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import type { AppIsnad } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import Card from '@/ui/Card';
import { HADITH } from '@/lib/hadith';

// The website's isnad (src/components/hadith/IsnadSvg.tsx), drawn for the phone: its places come in the website's steps and
// are drawn in these, each narrator's tabaqa under his name instead of a column of row names, and the whole drawing made
// smaller when it is still wider than the card.
const NODE_W = 104;
const NODE_H = 60;
const GAP = 8;
const ROW = 88;

const rowName = (row: AppIsnad['rows'][number]) => (row.kind === 'collector' ? '' : row.kind === 'unranked' ? 'بلا طبقة' : `الطبقة ${num(row.tabaqa!)}`);

/** A hadith's isnad: the collector on top, each narrator under the one who heard from him, the word he narrated with on the line. */
export default function Isnad({ isnad, palette }: { isnad: AppIsnad; palette: Palette }) {
  const [room, setRoom] = useState(0);
  const { size } = HADITH;
  const fx = (NODE_W + GAP) / (size.width + size.gap);
  const fy = ROW / size.row;
  const placed = isnad.nodes.map(node => ({ ...node, x: node.x * fx, y: node.y * fy, row: isnad.rows.find(row => row.y === node.y) }));
  const width = Math.max(...placed.map(node => node.x)) + NODE_W;
  const height = Math.max(...placed.map(node => node.y)) + NODE_H;
  const k = room && width > room ? room / width : 1;
  const at = new Map(placed.map(node => [node.id, node]));
  const order = [...placed].sort((a, b) => a.y - b.y || a.x - b.x).map(node => node.label);
  const lines = isnad.edges.map((edge, i) => {
    const from = at.get(edge.from)!;
    const to = at.get(edge.to)!;
    const level = from.y === to.y;
    const toward = to.x < from.x ? -1 : 1;
    const x1 = (from.x + NODE_W / 2 + (level ? (toward * NODE_W) / 2 : 0)) * k;
    const y1 = (level ? from.y + NODE_H / 2 : from.y) * k;
    const x2 = (to.x + NODE_W / 2 - (level ? (toward * NODE_W) / 2 : 0)) * k;
    const y2 = (level ? to.y + NODE_H / 2 : to.y + NODE_H) * k;
    return { i, edge, level, x1, y1, x2, y2 };
  });
  // No arrowheads (owner, 2026-11-20): an arrow could read as the chain going the other way; the order down the page and the word on each line say who heard from whom.
  const tabaqat = isnad.rows.filter(row => row.kind === 'tabaqa' && row.name);
  return (
    <View style={{ gap: 10 }} onLayout={event => setRoom(event.nativeEvent.layout.width)}>
      <View accessible accessibilityLabel={`الإسناد: ${order.join('، ')}`} style={{ width: width * k, height: height * k, alignSelf: 'center', direction: 'ltr' }}>
        <Svg width={width * k} height={height * k} style={{ position: 'absolute' }}>
          {lines.map(({ i, level, x1, y1, x2, y2 }) => {
            const colour = level ? palette.amber : palette.rule;
            return <Line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth={1.25} />;
          })}
        </Svg>
        {/* The word on a line; between two narrators of one row the gap is too narrow, so it stands over their row. */}
        {lines.filter(line => line.edge.label).map(({ i, edge, level, x1, y1, x2, y2 }) => (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', left: (x1 + x2) / 2 - 40, top: level ? y1 - (NODE_H / 2 + 20) * k : (y1 + y2) / 2 - 11 * k, width: 80, alignItems: 'center' }}>
            <Text style={{ color: palette.muted, fontSize: 12 * k, backgroundColor: palette.card, paddingHorizontal: 3 }}>{edge.label}</Text>
          </View>
        ))}
        {placed.map(node => (
          <Card key={node.id} palette={palette} pad={[0, 4]} node style={{ position: 'absolute', left: node.x * k, top: node.y * k, width: NODE_W * k, height: NODE_H * k,
            alignItems: 'center', justifyContent: 'center' }}>
            <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 14 * k, lineHeight: 19 * k, textAlign: 'center' }}>{node.label}</Text>
            {node.row && rowName(node.row) ? <Text style={{ color: palette.muted, fontSize: 10 * k, lineHeight: 14 * k }}>{rowName(node.row)}</Text> : null}
          </Card>
        ))}
      </View>
      {/* The tabaqat's names (Ibn Hajar's, in Taqrib al-Tahdhib), once each, under the drawing. */}
      {tabaqat.length > 0 && (
        <View style={{ gap: 2 }}>
          {tabaqat.map(row => <Text key={row.y} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{rowName(row)}: {row.name}</Text>)}
        </View>
      )}
    </View>
  );
}
