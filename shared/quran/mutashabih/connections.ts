import type { Group, Position, Tag } from './types';

export type ConnectionEnd = { words: Position[] } | { gap: Position; edge: 'before' | 'after' };
export type WordConnection = { from: ConnectionEnd; to: ConnectionEnd };

export function wordConnections(group: Group, tag: Tag): WordConnection[] {
  return group.columns.flatMap(pair => {
    const changed = pair.columns.filter(column => tag === 'frame' ? column.tags.length : column.tags.includes(tag));
    const links: WordConnection[] = changed.flatMap(column => column.a && column.b
      ? [{ from: { words: [column.a] }, to: { words: [column.b] } }]
      : []);
    const left = changed.flatMap(column => column.a && !column.b ? [column.a] : []);
    const right = changed.flatMap(column => column.b && !column.a ? [column.b] : []);
    if (left.length && right.length) {
      links.push({ from: { words: left }, to: { words: right } });
      return links;
    }
    const missingSide = (positions: Position[], own: 'a' | 'b', other: 'a' | 'b') => {
      for (const position of positions) {
        const anchors = pair.columns.filter(column => column[own]?.key === position.key && column[other]);
        const before = anchors.filter(column => column[own]!.index < position.index).sort((a, b) => b[own]!.index - a[own]!.index)[0];
        const after = anchors.filter(column => column[own]!.index > position.index).sort((a, b) => a[own]!.index - b[own]!.index)[0];
        const anchor = before ?? after;
        if (!anchor) continue;
        const word: ConnectionEnd = { words: [position] };
        const gap: ConnectionEnd = { gap: anchor[other]!, edge: before ? 'after' : 'before' };
        links.push(own === 'a' ? { from: word, to: gap } : { from: gap, to: word });
      }
    };
    missingSide(left, 'a', 'b');
    missingSide(right, 'b', 'a');
    return links;
  });
}

export type ConnectionTone = 'slot1' | 'slot2' | 'slot3' | 'slot4' | 'root' | 'green' | 'muted';
const TONES: Partial<Record<Tag, ConnectionTone>> = {
  order: 'slot1', inversion: 'slot1',
  word: 'slot3', addition_omission: 'slot2',
  particle: 'root', number: 'green', definiteness: 'slot4',
};

/** Each kind of difference keeps one colour for its lines and its chip. */
export const connectionTone = (tag: Tag): ConnectionTone => TONES[tag] ?? 'muted';
