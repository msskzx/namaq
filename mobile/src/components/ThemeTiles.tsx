import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import Svg, { Path } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, type CardMode } from '@shared/cardTint';
import { SAMPLE_AYAH, SAMPLE_TREE, TREE_LAYOUT, TREE_LINES } from '@shared/viewPreview';
import { closeStudio } from '@/lib/growPlayer';
import { branchView, cardTints, themeChoice, type BranchView } from '@/lib/settings';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** A small page with a card on it: the tile's page colour, card tint and the sample ayah, its ending in the accent. */
function Mini({ mode, card, small }: { mode: CardMode; card: string; small?: boolean }) {
  const colours = MODE_PREVIEW[mode];
  const text = { color: colours.ink, fontFamily: QURAN_FONT, fontSize: small ? 8 : 10, lineHeight: small ? 14 : 17, textAlign: 'center' as const };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colours.page }}>
      <View style={{ width: small ? '86%' : '76%', height: '66%', justifyContent: 'center', borderWidth: 1, borderColor: colours.rule, borderRadius: 5, backgroundColor: card, overflow: 'hidden' }}>
        <Text numberOfLines={1} style={text}>{SAMPLE_AYAH.start}</Text>
        <Text numberOfLines={1} style={text}>{SAMPLE_AYAH.end} <Text style={{ color: colours.accent, fontWeight: '700' }}>{SAMPLE_AYAH.ending}</Text></Text>
      </View>
    </View>
  );
}

/** One preview tile: a small picture with a check when chosen, and its name under it. */
function Tile({ name, on, onPress, palette, children, big }: { name: string; on: boolean; onPress: () => void; palette: Palette; children: React.ReactNode; big?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={name}
      style={({ pressed }) => ({ width: big ? '100%' : '31%', flex: big ? 1 : undefined, maxHeight: big ? 260 : undefined, gap: 5, alignItems: 'center', opacity: pressed ? 0.7 : 1 })}>
      {/* Big (the tour): the tiles share the height there is, so both fit a small phone, and carry no name. */}
      <View style={{ width: '100%', ...(big ? { flex: 1 } : { aspectRatio: 3 / 2 }), borderRadius: 12, borderWidth: 2, borderColor: on ? palette.accent : 'transparent', padding: 2 }}>
        <View style={{ flex: 1, flexDirection: 'row', borderRadius: 9, borderWidth: 1, borderColor: palette.rule, overflow: 'hidden' }}>{children}</View>
        {on && <View style={{ position: 'absolute', top: 6, right: 6, width: big ? 24 : 16, height: big ? 24 : 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent }}>
          <Check size={big ? 15 : 10} strokeWidth={3} color={palette.onAccent} />
        </View>}
      </View>
      {!big && <Text style={{ color: on ? palette.ink : palette.muted, fontSize: 13, fontWeight: on ? '600' : '400' }}>{name}</Text>}
    </Pressable>
  );
}

/** The look as preview tiles, as on the website: light paper or lighter, device, dark or black. */
export default function ThemeTiles({ palette }: { palette: Palette }) {
  const [theme, setTheme] = themeChoice.use();
  const [tints, setTints] = cardTints.use();
  const current = currentTile(theme, tints);
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>المظهر</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="المظهر" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {THEME_TILES.map(tile => {
          const on = current === tile.key;
          const choose = () => {
            if (tile.mode !== 'system') setTints({ ...tints, [tile.mode]: tile.key });
            setTheme(tile.mode);
          };
          return (
            <Tile key={tile.key} name={tile.ar} on={on} onPress={choose} palette={palette}>
              {tile.mode === 'system'
                ? <><Mini mode="light" card={cardColour('light', tints.light)} small /><Mini mode="dark" card={cardColour('dark', tints.dark)} small /></>
                : <Mini mode={tile.mode} card={cardColour(tile.mode, tile.key)} />}
            </Tile>
          );
        })}
      </View>
    </View>
  );
}

/** Tree or matrix as preview tiles, drawn in the current colours. */
/** `big`: the two tiles one above the other, full width with readable words (the first-launch tour). */
export function ViewTiles({ palette, onPick, big }: { palette: Palette; onPick?: () => void; big?: boolean }) {
  const [view, setView] = branchView.use();
  const label = 'العرض الافتراضي للمتشابه';
  const options: { key: BranchView; name: string }[] = [{ key: 'tree', name: 'شجرة' }, { key: 'matrix', name: 'مصفوفة' }];
  return (
    <View style={{ gap: 8, flex: big ? 1 : undefined }}>
      {!big && <Text style={{ color: palette.muted, fontSize: 14 }}>{label}</Text>}
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: big ? 'column' : 'row', flexWrap: big ? 'nowrap' : 'wrap', gap: big ? 18 : 10, flex: big ? 1 : undefined, justifyContent: 'center' }}>
        {(big ? [...options].reverse() : options).map(option => {
          return (
            <Tile key={option.key} name={option.name} on={view === option.key} onPress={() => { closeStudio(); setView(option.key); onPick?.(); }} palette={palette} big={big}>
              <ViewPreview view={option.key} palette={palette} big={big} />
            </Tile>
          );
        })}
      </View>
    </View>
  );
}

/** The view drawn small in the current colours, with the إن المتقين في tree as its sample. */
function ViewPreview({ view, palette, big }: { view: BranchView; palette: Palette; big?: boolean }) {
  const text = { color: palette.ink, fontFamily: QURAN_FONT, fontSize: big ? 19 : 9, lineHeight: big ? 28 : 13, textAlign: 'center' as const };
  const box = { position: 'absolute' as const, alignItems: 'center' as const, justifyContent: 'center' as const, borderWidth: 1, borderColor: palette.rule, borderRadius: 4, backgroundColor: palette.card, overflow: 'hidden' as const };
  if (view === 'matrix') return (
    <View style={{ flex: 1, justifyContent: 'center', gap: big ? 8 : 4, paddingHorizontal: '6%', backgroundColor: palette.paper }}>
      {SAMPLE_TREE.endings.map(ending => (
        <View key={ending.words} style={{ borderWidth: 1, borderColor: palette.rule, borderRadius: 4, backgroundColor: palette.card, paddingHorizontal: 3 }}>
          <Text numberOfLines={1} style={text}><Text style={{ color: palette.accent, fontWeight: '700' }}>{SAMPLE_TREE.trunk.join(' ')}</Text> {ending.words}</Text>
        </View>
      ))}
    </View>
  );
  const { trunk, ending } = TREE_LAYOUT;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" style={{ position: 'absolute' }}>
        {TREE_LINES.map(d => <Path key={d} d={d} fill="none" stroke={palette.rule} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
      </Svg>
      <View style={[box, { right: `${trunk.right}%`, top: `${trunk.top}%`, width: `${trunk.width}%`, height: `${trunk.height}%` }]}>
        {SAMPLE_TREE.trunk.map(line => <Text key={line} numberOfLines={1} style={[text, { color: palette.accent, fontWeight: '700' }]}>{line}</Text>)}
      </View>
      {SAMPLE_TREE.endings.map((leaf, index) => (
        <View key={leaf.words} style={[box, { left: `${ending.left}%`, top: `${ending.tops[index]}%`, width: `${ending.width}%`, height: `${ending.height}%` }]}>
          <Text numberOfLines={1} style={text}>{leaf.words}</Text>
        </View>
      ))}
    </View>
  );
}
