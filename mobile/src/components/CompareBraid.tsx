import { View } from 'react-native';
import { Text } from '@/components/Text';
import Svg, { Path } from 'react-native-svg';
import type { CardSide } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { normalizeWord } from '@shared/quran/normalize';
import { braidOf, sideLabel, type Around, type AroundAyah, type BraidWord } from '@/lib/compare';
import { QURAN_FONT, blend, type Palette } from '@/lib/theme';

const LINK = 26;

/** The ayah numbers ending at this word: in a shared node both sides' numbers, when they differ. */
const ends = (word: BraidWord, other?: BraidWord) => [...new Set([word.end, other?.end].filter((end): end is number => end !== undefined))];

/** Words of one node: the card's colours (same words accent, same root purple), amber where a shared node's two spellings differ. */
function Words({ words, palette, other, bold }: { words: BraidWord[]; palette: Palette; other?: BraidWord[]; bold?: boolean }) {
  const related = blend(palette.root, palette.muted, 0.45);
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 38, color: palette.ink, writingDirection: 'rtl', textAlign: 'center', fontWeight: bold ? '600' : 'normal' }}>
      {words.map((word, i) => {
        const differs = other && other[i] && mushafText(other[i].text) !== mushafText(word.text) && normalizeWord(other[i].text) === normalizeWord(word.text);
        const color = differs ? palette.amber : other ? undefined : word.mark?.kind === 'root' ? palette.root : word.mark?.kind === 'related' ? related : word.mark ? palette.accent : undefined;
        return (
          <Text key={i}>
            {i > 0 ? ' ' : ''}
            <Text style={color ? { color } : undefined}>{mushafText(word.text)}</Text>
            {ends(word, other?.[i]).length > 0 && <Text style={{ color: palette.accent }}> {ends(word, other?.[i]).map(end => num(end)).join(' · ')}</Text>}
          </Text>
        );
      })}
    </Text>
  );
}

/** Lines between rows: two strands meeting in the middle, one parting into two, or both running straight on. */
function Link({ from, to, palette }: { from: Row['kind']; to: Row['kind']; palette: Palette }) {
  if (from !== 'shared' && to !== 'shared') return (
    <View style={{ flexDirection: 'row', height: LINK }}>
      {[0, 1].map(i => <View key={i} style={{ flex: 1, alignItems: 'center' }}><View style={{ flex: 1, width: 1.5, backgroundColor: palette.muted }} /></View>)}
    </View>
  );
  const d = to === 'shared' ? 'M75 0 C75 16 50 10 50 26 M25 0 C25 16 50 10 50 26' : 'M50 0 C50 16 75 10 75 26 M50 0 C50 16 25 10 25 26';
  return (
    <Svg width="100%" height={LINK} viewBox={`0 0 100 ${LINK}`} preserveAspectRatio="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d={d} stroke={palette.muted} strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke" />
    </Svg>
  );
}

/** The ayah before or after one side, muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, palette }: { ayah: AroundAyah; palette: Palette }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 17, lineHeight: 32, color: palette.muted, writingDirection: 'rtl', textAlign: 'center' }}>
      {ayah.words.map((word, i) => {
        const color = ayah.rooted.has(i) ? palette.root : ayah.exact.has(i) ? palette.accent : undefined;
        return <Text key={i} style={color ? { color, opacity: 0.8 } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
      })}
      <Text> {num(ayah.number)}</Text>
    </Text>
  );
}

type Row = { kind: 'shared' | 'split' | 'around'; a: BraidWord[]; b: BraidWord[]; near?: (AroundAyah | null)[] };

function Node({ children, palette, shared }: { children: React.ReactNode; palette: Palette; shared?: boolean }) {
  return (
    <View style={{ borderWidth: shared ? 2 : 1.5, borderColor: shared ? palette.green : palette.rule, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'center', maxWidth: '100%' }}>
      {children}
    </View>
  );
}

/**
 * The tree of a compare card: a braid. Where the two sides say the same words they run as one node (green frame);
 * where they part, each side has its own node (the first side on the right), and they rejoin on the next common stretch.
 */
export default function CompareBraid({ sides, palette, around, labels }: { sides: [CardSide, CardSide]; palette: Palette; around?: Around; labels?: [string, string] }) {
  const rows: Row[] = [
    ...(around ? [{ kind: 'around' as const, a: [], b: [], near: around.before }] : []),
    ...braidOf(sides),
    ...(around ? [{ kind: 'around' as const, a: [], b: [], near: around.after }] : []),
  ];
  // The page is right to left, so the first side's column sits on the right: the 75% end of the links.
  return (
    <View style={{ gap: 0 }} accessibilityLabel={`${sideLabel(sides[0])} و${sideLabel(sides[1])} شجرةً`}>
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {sides.map((side, i) => <Text key={i} style={{ flex: 1, color: palette.muted, fontSize: 13, textAlign: 'center' }}>{labels?.[i] ?? sideLabel(side)}</Text>)}
      </View>
      {rows.map((row, r) => (
        <View key={r}>
          {r > 0 && <Link from={rows[r - 1].kind} to={row.kind} palette={palette} />}
          {row.kind === 'shared'
            ? <Node palette={palette} shared><Words words={row.a} other={row.b} palette={palette} bold /></Node>
            : (
              // Columns with no gap, so their centres sit exactly at the links' 25% and 75%. Each strand runs on under a
              // shorter node to the row's foot, so the next link starts where the line ends.
              <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                {[0, 1].map(i => {
                  const words = i ? row.b : row.a;
                  const near = row.near?.[i];
                  return (
                    <View key={i} style={{ flex: 1, alignItems: 'center', paddingHorizontal: 4 }}>
                      {row.kind === 'around' && r > 0 && near && <View style={{ height: 8, width: 1.5, backgroundColor: palette.muted }} />}
                      {row.kind === 'around'
                        ? (near ? <Neighbour ayah={near} palette={palette} /> : <View style={{ flex: 1, minHeight: 16 }} />)
                        : words.length ? <Node palette={palette}><Words words={words} palette={palette} /></Node>
                          : <View accessibilityLabel="لا كلمات هنا" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.rule }} />}
                      {r < rows.length - 1 && (row.kind !== 'around' || near) && <View style={{ flex: 1, minHeight: words.length || near ? 8 : 16, width: 1.5, backgroundColor: palette.muted }} />}
                    </View>
                  );
                })}
              </View>
            )}
        </View>
      ))}
    </View>
  );
}
