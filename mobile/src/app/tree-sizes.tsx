import { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View, type LayoutChangeEvent } from 'react-native';
import BranchTree, { type Direction } from '@/components/BranchTree';
import { aroundOf, cardOf, surahNames, treeList } from '@/lib/branches';
import { sizeKey, type Shipped } from '@/lib/treeSizes';
import { light } from '@/lib/theme';

const BATCH = 8;
const DIRECTIONS: Direction[] = ['side', 'down'];

/**
 * Not linked from the app: `npm run tree-sizes` opens it in the web build. It draws every tree both ways, with and
 * without the surrounding ayat, and the script reads the sizes and each tree's ayah count off `window.treeSizes`
 * into src/lib/treeSizes.json.
 */
export default function TreeSizesScreen() {
  const pieces = useMemo(() => treeList(), []);
  const [at, setAt] = useState(0);
  const sizes = useRef<Record<string, Shipped>>({});
  const left = useRef(0);
  const batch = pieces.slice(at, at + BATCH);
  left.current = batch.length * 4;

  const measured = (key: string, direction: Direction, ayat: number) => (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const entry = sizes.current[key] ?? [0, 0, 0, 0, ayat];
    const slot = direction === 'side' ? 0 : 2;
    if (entry[slot]) return;
    entry[slot] = Math.round(width);
    entry[slot + 1] = Math.round(height);
    sizes.current[key] = entry;
    left.current -= 1;
    if (left.current > 0) return;
    if (at + BATCH < pieces.length) setTimeout(() => setAt(at + BATCH), 0);
    else (globalThis as { treeSizes?: Record<string, Shipped> }).treeSizes = sizes.current;
  };

  return (
    <ScrollView>
      <Text>{Math.min(at + BATCH, pieces.length)} / {pieces.length}</Text>
      {batch.map(piece => {
        const card = cardOf(piece);
        return [false, true].map(around => DIRECTIONS.map(direction => {
          const key = sizeKey(piece.id, around);
          return (
            <View key={`${at}:${key}:${direction}`} style={{ width: 20000, alignItems: 'flex-start', direction: 'ltr' }}>
              <BranchTree presentation={card.presentation} matches={card.matches} names={surahNames} palette={light} onTap={() => {}}
                direction={direction} around={around ? aroundOf(card.presentation) : undefined} onLayout={measured(key, direction, card.presentation.ayat.length)} />
            </View>
          );
        }));
      })}
    </ScrollView>
  );
}
