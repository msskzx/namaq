import { Pressable, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Check } from 'lucide-react-native';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, type CardMode } from '@shared/cardTint';
import { VIEW_PREVIEW } from '@shared/viewPreview';
import { closeStudio } from '@/lib/growPlayer';
import { branchView, cardTints, themeChoice, type BranchView } from '@/lib/settings';
import { QURAN_FONT, type Palette } from '@/lib/theme';

/** A small page with a card on it: the tile's page colour, card tint and a matched word. */
function Mini({ mode, card, small }: { mode: CardMode; card: string; small?: boolean }) {
  const colours = MODE_PREVIEW[mode];
  const text = { color: colours.ink, fontFamily: QURAN_FONT, fontSize: small ? 8 : 10, lineHeight: small ? 14 : 17, textAlign: 'center' as const };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colours.page }}>
      <View style={{ width: small ? '86%' : '76%', height: '66%', justifyContent: 'center', borderWidth: 1, borderColor: colours.rule, borderRadius: 5, backgroundColor: card, overflow: 'hidden' }}>
        <Text numberOfLines={1} style={text}><Text style={{ color: colours.accent }}>هُدًى</Text> لِّلْمُتَّقِينَ</Text>
        <Text numberOfLines={1} style={text}>ذَٰلِكَ ٱلْكِتَٰبُ</Text>
      </View>
    </View>
  );
}

/** One preview tile: a small picture with a check when chosen, and its name under it. */
function Tile({ name, on, onPress, palette, children }: { name: string; on: boolean; onPress: () => void; palette: Palette; children: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={name}
      style={({ pressed }) => ({ width: '31%', gap: 5, alignItems: 'center', opacity: pressed ? 0.7 : 1 })}>
      <View style={{ width: '100%', aspectRatio: 3 / 2, borderRadius: 12, borderWidth: 2, borderColor: on ? palette.accent : 'transparent', padding: 2 }}>
        <View style={{ flex: 1, flexDirection: 'row', borderRadius: 9, borderWidth: 1, borderColor: palette.rule, overflow: 'hidden' }}>{children}</View>
        {on && <View style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent }}>
          <Check size={10} strokeWidth={3} color={palette.onAccent} />
        </View>}
      </View>
      <Text style={{ color: on ? palette.ink : palette.muted, fontSize: 13, fontWeight: on ? '600' : '400' }}>{name}</Text>
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
export function ViewTiles({ palette, onPick }: { palette: Palette; onPick?: () => void }) {
  const [view, setView] = branchView.use();
  const label = 'العرض الافتراضي للمتشابه';
  const options: { key: BranchView; name: string }[] = [{ key: 'tree', name: 'شجرة' }, { key: 'matrix', name: 'مصفوفة' }];
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{label}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {options.map(option => {
          const { boxes, lines } = VIEW_PREVIEW[option.key];
          return (
            <Tile key={option.key} name={option.name} on={view === option.key} onPress={() => { closeStudio(); setView(option.key); onPick?.(); }} palette={palette}>
              <Svg viewBox="0 0 60 40" width="100%" height="100%" style={{ backgroundColor: palette.paper }}>
                {lines.map(d => <Path key={d} d={d} fill="none" stroke={palette.rule} strokeWidth={1} />)}
                {boxes.map((box, index) => <Rect key={index} x={box.x} y={box.y} width={box.w} height={box.h} rx={box.tone === 'card' ? 1.5 : 1}
                  fill={box.tone === 'card' ? palette.card : palette.accent} stroke={box.tone === 'card' ? palette.rule : 'none'} strokeWidth={0.6} />)}
              </Svg>
            </Tile>
          );
        })}
      </View>
    </View>
  );
}
