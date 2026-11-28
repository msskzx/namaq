import { useMemo, useState } from 'react';
import { View } from 'react-native';
import type { CardSide } from '@shared/quran/compareCards';
import { compareTree, sideKey } from '@shared/quran/braid';
import { writtenLinks } from '@shared/quran/compareCardLook';
import { litPaths, togglePath } from '@shared/quran/pathHighlight';
import type { Branch } from '@shared/quran/branches';
import { surahNames, type Around as TreeAround, type Beside } from '@/lib/branches';
import { sideLabel, type Around, type AroundAyah } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import BranchTree, { type Paths } from './BranchTree';
import { Silent } from './StoryParts';

const WIDE = 20000;

function treeAround(sides: [CardSide, CardSide], around: Around): TreeAround {
  const by = (near: (AroundAyah | null)[]) => Object.fromEntries(sides.map((side, i) => [sideKey(side), near[i] && ({ ...near[i], page: 0 } as Beside)]));
  return { before: by(around.before), after: by(around.after), earlier: {}, ends: Object.fromEntries(sides.map(side => [sideKey(side), sideKey(side)])) };
}

export default function CompareTree({ sides, palette, around, empty }: { sides: [CardSide, CardSide]; palette: Palette; around?: Around;
  empty?: [string, string] }) {
  const written = useMemo(() => writtenLinks({ sides }), [sides]);
  const { tree, sides: owner } = useMemo(() => compareTree(sides, written), [sides, written]);
  const near = useMemo(() => around && treeAround(sides, around), [sides, around]);
  const [pinned, setPinned] = useState(() => new Map<string, string[]>());
  const paths = useMemo<Paths>(() => ({ lit: litPaths(pinned), pinned, pin: (id, ayahKeys) => setPinned(current => togglePath(current, id, ayahKeys)) }), [pinned]);
  const renderNode = (node: Branch) => {
    const side = owner.get(node);
    if (side === undefined || node.words.length || !empty || sides[side].ayat.length) return undefined;
    return <Silent note={empty[side]} palette={palette} />;
  };
  const [room, setRoom] = useState(0);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const scale = room && size ? Math.min(1, room / size.width) : 1;
  return (
    <View accessibilityLabel={`${sideLabel(sides[0])} و${sideLabel(sides[1])} شجرةً`} onLayout={event => setRoom(event.nativeEvent.layout.width)}
      style={{ height: size ? size.height * scale : 0, opacity: size ? 1 : 0 }}>
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: size ? (room - size.width * scale) / 2 : 0, width: WIDE, alignItems: 'flex-start', direction: 'ltr', transform: [{ scale }], transformOrigin: 'left top' }}>
        <BranchTree presentation={{ tree, prefixes: [], offsets: {}, ayat: [] }} matches={{}} names={surahNames} palette={palette} around={near}
          onTap={(_keys, light) => light?.()} paths={paths} direction="down" renderNode={renderNode} spellings
          onLayout={event => { const { width, height } = event.nativeEvent.layout; setSize(width && height ? { width, height } : null); }} />
      </View>
    </View>
  );
}
