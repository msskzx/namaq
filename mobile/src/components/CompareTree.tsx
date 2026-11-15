import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import type { CardSide } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { compareTree, endMark, type BraidWord } from '@shared/quran/braid';
import { likeness } from '@shared/quran/wordMatch';
import { markColour, writtenLinks } from '@shared/quran/compareCardLook';
import { litPaths, togglePath } from '@shared/quran/pathHighlight';
import { likenessAt, surahNames } from '@/lib/branches';
import { sideLabel, type Around, type AroundAyah } from '@/lib/compare';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import BranchTree, { type NodeContent, type Paths } from './BranchTree';
import { Silent } from './StoryParts';

const SIZE = 20;

/** The ayah numbers ending at this word: on a node both sides share, both sides' numbers, when they differ. */
const ends = (word: BraidWord, other?: BraidWord) => [...new Set([word.end, other?.end].filter((end): end is number => end !== undefined))];

/** A word's colour: on a node both sides share, the exact colour, or the written colour where the two write it differently; else its mark on the card. */
function colourOf(word: BraidWord, palette: Palette, other: BraidWord | undefined, written: Set<string>) {
  if (other) return markColour('exact', palette, likeness([other.text, word.text]) === 'written');
  // On a node of one side, a word the other side writes differently (writtenLinks) takes the written colour, as on the card.
  return markColour(word.mark?.kind, palette, !!word.mark?.link && written.has(word.mark.link));
}

function Words({ words, other, palette, written }: { words: BraidWord[]; other?: BraidWord[]; palette: Palette; written: Set<string> }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: SIZE, lineHeight: SIZE * 1.9, color: palette.ink, writingDirection: 'rtl', textAlign: 'center' }}>
      {words.map((word, i) => {
        const color = colourOf(word, palette, other?.[i], written);
        const end = ends(word, other?.[i]);
        return (
          <Text key={i}>
            {i > 0 ? ' ' : ''}
            {word.skip ? <Text accessibilityLabel={`آيات محذوفة، ثم الآية ${num(word.skip)}`} style={{ color: palette.muted }}>⋯ </Text> : null}
            <Text style={color ? { color } : undefined}>{mushafText(word.text)}</Text>
            {end.length > 0 && <Text style={{ color: palette.accent }}> {endMark(end, true)}</Text>}
          </Text>
        );
      })}
    </Text>
  );
}

/** The ayah before or after one side, muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, palette }: { ayah: AroundAyah; palette: Palette }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 17, lineHeight: 32, color: palette.muted, writingDirection: 'rtl', textAlign: 'center' }}>
      {ayah.words.map((word, i) => {
        const kind = likenessAt(ayah, i);
        const color = kind && palette.marks[kind];
        return <Text key={i} style={color ? { color, opacity: 0.8 } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
      })}
      <Text> {num(ayah.number)}</Text>
    </Text>
  );
}

/** The ayat before or after both sides, the first side on the right. */
function Neighbours({ near, palette }: { near: (AroundAyah | null)[]; palette: Palette }) {
  if (!near.some(Boolean)) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {near.map((ayah, i) => <View key={i} style={{ flex: 1 }}>{ayah && <Neighbour ayah={ayah} palette={palette} />}</View>)}
    </View>
  );
}

/**
 * A compare card's tree, drawn by the branches tree (shared/quran/braid.ts `compareTree`): where the two sides say the same words
 * one box, where they part a box for each side (the first on the right), meeting again on the next common stretch. Tapping a box
 * lights its side's path. The first boxes where the sides part carry the sides' names on their tabs.
 */
export default function CompareTree({ sides, palette, around, labels, empty }: { sides: [CardSide, CardSide]; palette: Palette; around?: Around; labels?: [string, string];
  /** A note for each side in a story part that side does not tell. */
  empty?: [string, string] }) {
  const { tree, nodes } = useMemo(() => compareTree(sides), [sides]);
  const written = useMemo(() => writtenLinks({ sides }), [sides]);
  // Two boxes side by side share the card's width: the tree's padding (12 each side) and each box's (5 each side) come off it.
  const [room, setRoom] = useState(0);
  const [pinned, setPinned] = useState(() => new Map<string, string[]>());
  const paths = useMemo<Paths>(() => ({ lit: litPaths(pinned), pinned, pin: (id, ayahKeys) => setPinned(current => togglePath(current, id, ayahKeys)) }), [pinned]);
  const names = labels ?? [sideLabel(sides[0]), sideLabel(sides[1])];
  // The sides' names go on the first boxes where they part; a card that never parts names both on its one box.
  const first = useMemo(() => {
    let node = tree;
    while (node.children.length === 0 && node.rejoin) node = node.rejoin;
    return node.children;
  }, [tree]);
  const content: NodeContent = node => {
    const item = nodes.get(node);
    if (!item) return undefined;
    const side = item.side;
    const tab = side !== undefined ? (first.includes(node) ? names[side] : undefined) : first.length === 0 && node === tree ? names.join(' · ') : undefined;
    const text = { size: SIZE, words: item.words.map((word, i) => ({ text: mushafText(word.text), color: colourOf(word, palette, item.other?.[i], written) ?? palette.ink })), ...(tab ? { header: tab } : {}) };
    const silent = side !== undefined && item.words.length === 0 && empty && !sides[side].ayat.length;
    return {
      tab, text, ...(room ? { width: side === undefined ? room - 34 : (room - 44) / 2 } : {}),
      content: item.words.length ? <Words words={item.words} other={item.other} palette={palette} written={written} />
        : silent ? <Silent note={empty[side]} palette={palette} />
        : <View accessibilityLabel="لا كلمات هنا" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.rule, margin: 8 }} />,
    };
  };
  return (
    <View style={{ gap: 4 }} onLayout={event => setRoom(event.nativeEvent.layout.width)} accessibilityLabel={`${names[0]} و${names[1]} شجرةً`}>
      {around && <Neighbours near={around.before} palette={palette} />}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <BranchTree presentation={{ tree, prefixes: [], offsets: {}, ayat: [] }} matches={{}} names={surahNames} palette={palette}
          onTap={(_keys, light) => light?.()} paths={paths} direction="down" nodeContent={content} />
      </ScrollView>
      {around && <Neighbours near={around.after} palette={palette} />}
    </View>
  );
}
