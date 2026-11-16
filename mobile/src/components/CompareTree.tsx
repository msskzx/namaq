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

/** The card's ayat around each side, as the branches tree draws the ayat around its ayat: keyed by each side's path. */
function treeAround(sides: [CardSide, CardSide], around: Around): TreeAround {
  const by = (near: (AroundAyah | null)[]) => Object.fromEntries(sides.map((side, i) => [sideKey(side), near[i] && ({ ...near[i], page: 0 } as Beside)]));
  return { before: by(around.before), after: by(around.after), earlier: {}, ends: Object.fromEntries(sides.map(side => [sideKey(side), sideKey(side)])) };
}

/**
 * A compare card's tree, drawn by the branches tree as every tree is (shared/quran/braid.ts `compareTree`): where the two sides say
 * the same words one box, where they part a box for each side (the first on the right), meeting again on the next common stretch.
 * Tapping a box lights its side's path. With the surrounding switch, each side's ayah before and after joins the tree.
 */
export default function CompareTree({ sides, palette, around, empty }: { sides: [CardSide, CardSide]; palette: Palette; around?: Around;
  /** A note for each side in a story part that side does not tell. */
  empty?: [string, string] }) {
  const written = useMemo(() => writtenLinks({ sides }), [sides]);
  const { tree, sides: owner } = useMemo(() => compareTree(sides, written), [sides, written]);
  const near = useMemo(() => around && treeAround(sides, around), [sides, around]);
  const [pinned, setPinned] = useState(() => new Map<string, string[]>());
  const paths = useMemo<Paths>(() => ({ lit: litPaths(pinned), pinned, pin: (id, ayahKeys) => setPinned(current => togglePath(current, id, ayahKeys)) }), [pinned]);
  // A side with no words where the other has some: a dot, or in a story part that side does not tell, its note.
  const renderNode = (node: Branch) => {
    const side = owner.get(node);
    if (side === undefined || node.words.length) return undefined;
    if (empty && !sides[side].ayat.length) return <Silent note={empty[side]} palette={palette} />;
    return <View accessibilityLabel="لا كلمات هنا" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.rule, margin: 8 }} />;
  };
  // Fitted to the card's width as a branches tree fits its frame (fitCamera): a wider tree is drawn smaller, never cut.
  const [room, setRoom] = useState(0);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const scale = room && size ? Math.min(1, room / size.width) : 1;
  return (
    <View accessibilityLabel={`${sideLabel(sides[0])} و${sideLabel(sides[1])} شجرةً`} onLayout={event => setRoom(event.nativeEvent.layout.width)}
      style={{ height: size ? size.height * scale : 0, opacity: size ? 1 : 0 }}>
      {/* Laid out in a wide room, as TreeCard does, so the tree measures its own width rather than the card's. */}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: size ? (room - size.width * scale) / 2 : 0, width: WIDE, alignItems: 'flex-start', direction: 'ltr', transform: [{ scale }], transformOrigin: 'left top' }}>
        <BranchTree presentation={{ tree, prefixes: [], offsets: {}, ayat: [] }} matches={{}} names={surahNames} palette={palette} around={near}
          onTap={(_keys, light) => light?.()} paths={paths} direction="down" renderNode={renderNode}
          onLayout={event => { const { width, height } = event.nativeEvent.layout; setSize(width && height ? { width, height } : null); }} />
      </View>
    </View>
  );
}
