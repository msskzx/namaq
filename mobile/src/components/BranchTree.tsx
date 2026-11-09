import { memo } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { keys, type Branch } from '@shared/quran/branches';
import { branchNodes } from '@shared/quiz/branchAnswers';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import type { Matches, Presentation } from '@/lib/branches';
import { QURAN_FONT, type Palette } from '@/lib/theme';

type Tap = (ayahKeys: string[]) => void;
/** Draws a node's own content instead of its words, e.g. a quiz input; `index` counts nodes below the root as `branchNodes` does. */
export type RenderNode = (node: Branch, index: number) => React.ReactNode | undefined;
type Shared = { palette: Palette; names: Record<number, string>; matches: Matches; offsets: Record<string, number>; onTap: Tap; render?: { draw: RenderNode; index: Map<Branch, number> } };

const LINE = 2;
const CURVE = 10;

const isMark = (word: string) => word === '۝' || word.startsWith('﴿');

function References({ ayahKeys, shared, center }: { ayahKeys: string[]; shared: Shared; center?: boolean }) {
  const text = ayahKeys.map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    return shared.names[surah] ? `${shared.names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`;
  }).join(' · ');
  return <Text style={{ fontSize: 12, color: shared.palette.muted, textAlign: center ? 'center' : 'right', marginTop: center ? 0 : 4 }}>{text}</Text>;
}

/** A word is coloured when it is the same (accent) or shares its root (purple) in every ayah through this node. */
function Words({ words, ayahKeys, at, shared, size }: { words: string[]; ayahKeys: string[]; at: number; shared: Shared; size: number }) {
  const { palette, matches, offsets } = shared;
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 1.9, color: palette.ink, textAlign: 'center', writingDirection: 'rtl' }}>
      {words.map((word, i) => {
        const kinds = ayahKeys.map(key => {
          const index = (offsets[key] ?? 0) + at + i;
          const match = matches[key];
          return match?.rooted.has(index) ? 'root' : match?.exact.has(index) ? 'exact' : undefined;
        });
        const kind = !isMark(word) && kinds.length > 0 && kinds.every(Boolean) ? (kinds.includes('root') ? 'root' : 'exact') : undefined;
        const color = kind === 'root' ? palette.root : kind === 'exact' ? palette.accent : undefined;
        return <Text key={i} style={color ? { color } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
      })}
    </Text>
  );
}

function Box({ ayahKeys, leaf, shared, children }: { ayahKeys: string[]; leaf: boolean; shared: Shared; children: React.ReactNode }) {
  const { palette } = shared;
  return (
    <Pressable
      onPress={() => shared.onTap(ayahKeys)}
      accessibilityRole="button"
      style={({ pressed }) => ({
        maxWidth: leaf ? 208 : 192,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: pressed ? palette.accent : palette.rule,
        backgroundColor: palette.paperDeep,
        borderTopStartRadius: 14,
        borderBottomEndRadius: 14,
        borderTopEndRadius: 4,
        borderBottomStartRadius: 4,
      })}>
      {children}
    </Pressable>
  );
}

/** One child's elbow: the vertical spine from its siblings and the line into it, curved at the two ends. */
function Elbow({ first, last, color }: { first: boolean; last: boolean; color: string }) {
  const only = first && last;
  return (
    <View style={{ width: 16, alignSelf: 'stretch' }}>
      <View style={{ flex: 1, borderColor: color, ...(only || first ? {} : last ? { borderStartWidth: LINE, borderBottomWidth: LINE, borderBottomStartRadius: CURVE } : { borderStartWidth: LINE }) }} />
      <View style={{ flex: 1, borderColor: color, ...(only || last ? {} : first ? { borderStartWidth: LINE, borderTopWidth: LINE, borderTopStartRadius: CURVE } : { borderStartWidth: LINE }) }} />
      {(only || (!first && !last)) && <View style={{ position: 'absolute', top: '50%', marginTop: -LINE / 2, start: 0, end: 0, borderTopWidth: LINE, borderColor: color }} />}
    </View>
  );
}

function Fan({ items, color }: { items: React.ReactNode[]; color: string }) {
  return (
    <View style={{ alignItems: 'flex-start' }}>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Elbow first={i === 0} last={i === items.length - 1} color={color} />
          <View style={{ paddingVertical: 5 }}>{item}</View>
        </View>
      ))}
    </View>
  );
}

const Stub = ({ color }: { color: string }) => <View style={{ width: 14, borderTopWidth: LINE, borderColor: color }} />;

function Node({ node, path, shared }: { node: Branch; path: string[]; shared: Shared }) {
  const root = path.length === 0;
  const all = keys(node);
  const words = node.words;
  const boundary = node.ayat.length === 0 && words.length > 0 && words.every(isMark);
  const singleSurah = node.ayat.length > 0 && node.ayat.every(key => key.split(':')[0] === node.ayat[0].split(':')[0]);
  const shown = !boundary && (!root || words.length > 0 || node.ayat.length > 0);
  const own = root ? undefined : shared.render?.draw(node, shared.render.index.get(node) ?? -1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {boundary && <Text style={{ fontFamily: QURAN_FONT, fontSize: 18, color: shared.palette.muted, paddingHorizontal: 4 }}>{mushafText(words.join(' '))}</Text>}
      {shown && (
        <Box ayahKeys={all} leaf={node.children.length === 0} shared={shared}>
          {own !== undefined ? own : <>
          {singleSurah && <View style={{ borderBottomWidth: 1, borderColor: shared.palette.rule, paddingVertical: 2, marginBottom: 2 }}><References ayahKeys={node.ayat} shared={shared} center /></View>}
          <Words words={words} ayahKeys={all} at={path.length} shared={shared} size={root ? 22 : 20} />
          {!singleSurah && node.ayat.length > 0 && <References ayahKeys={node.ayat} shared={shared} />}
          </>}
        </Box>
      )}
      {node.children.length > 0 && <>
        <Stub color={shared.palette.rule} />
        <Fan color={shared.palette.rule} items={node.children.map((child, i) => <Node key={i} node={child} path={[...path, ...words]} shared={shared} />)} />
      </>}
    </View>
  );
}

type Props = { presentation: Presentation; matches: Matches; names: Record<number, string>; palette: Palette; onTap: Tap; onLayout?: (event: LayoutChangeEvent) => void; renderNode?: RenderNode };

/** The website's phrase tree, root on the right and branches growing left; words before the phrase fan out on the right. */
function BranchTree({ presentation, matches, names, palette, onTap, onLayout, renderNode }: Props) {
  const render = renderNode && { draw: renderNode, index: new Map(branchNodes(presentation.tree).map((node, i) => [node, i])) };
  const shared: Shared = { palette, names, matches, offsets: presentation.offsets, onTap, render };
  const before = presentation.prefixes.filter(prefix => prefix.word);
  return (
    <View onLayout={onLayout} style={{ direction: 'rtl', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', padding: 12 }}>
      {before.length > 0 && <>
        <View style={{ transform: [{ scaleX: -1 }] }}>
          <Fan color={palette.rule} items={before.map((prefix, i) => (
            <View key={i} style={{ transform: [{ scaleX: -1 }] }}>
              <Box ayahKeys={prefix.keys} leaf shared={shared}>
                <Words words={prefix.words ?? prefix.word.split(' ')} ayahKeys={prefix.keys} at={0} shared={{ ...shared, offsets: {} }} size={20} />
              </Box>
            </View>
          ))} />
        </View>
        <Stub color={palette.rule} />
      </>}
      <Node node={presentation.tree} path={[]} shared={shared} />
    </View>
  );
}

export default memo(BranchTree);
