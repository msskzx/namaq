import { Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import { Check } from 'lucide-react-native';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, tintSurfaces, type CardMode } from '@shared/cardTint';
import { cardTints, markMode, themeChoice } from '@/lib/settings';
import { MARK_LEGEND, MARK_MODE_NAMES, MARK_MODES, MARK_SETTING_LABEL, markTones, type Likeness } from '@shared/quran/wordMatch';
import type { Palette } from '@/lib/theme';
import { MiniQuran } from './quran/text/AyahFlow';
import { SAMPLE_AYAH, TILE_SHARE } from '@shared/viewPreview';

/** A small page with a card on it: the tile's page colour, card tint and the sample ayah, its ending in the accent. */
function Mini({ mode, tint, small }: { mode: CardMode; tint: string; small?: boolean }) {
  const colours = MODE_PREVIEW[mode];
  const card = cardColour(mode, tint);
  const share = small ? TILE_SHARE.half : TILE_SHARE.tile;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tintSurfaces(mode, tint)?.paper ?? colours.page }}>
      <View style={{ width: small ? '86%' : '76%', height: '66%', justifyContent: 'center', borderWidth: 1, borderColor: colours.rule, borderRadius: 5, backgroundColor: card, overflow: 'hidden' }}>
        <MiniQuran share={share} lines={1} look={{ color: colours.ink }}>{SAMPLE_AYAH.start}</MiniQuran>
        <MiniQuran share={share} lines={1} look={{ color: colours.ink }}>{SAMPLE_AYAH.end} <Text style={{ color: colours.accent, fontWeight: '700' }}>{SAMPLE_AYAH.ending}</Text></MiniQuran>
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
        {on && <View style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.accent }}>
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
                ? <><Mini mode="light" tint={tints.light} small /><Mini mode="dark" tint={tints.dark} small /></>
                : <Mini mode={tile.mode} tint={tile.key} />}
            </Tile>
          );
        })}
      </View>
    </View>
  );
}

/** How words the ayat share are coloured: each tile draws the legend's words as that choice colours them. */
export function MarkTiles({ palette }: { palette: Palette }) {
  const [mode, setMode] = markMode.use();
  const tones = { exact: palette.accent, written: palette.amber, root: palette.root };
  const words = MARK_LEGEND.filter((item): item is typeof item & { kind: Likeness } => item.kind !== 'plain');
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{MARK_SETTING_LABEL.ar}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={MARK_SETTING_LABEL.ar} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {MARK_MODES.map(option => {
          const shown = markTones(option, tones);
          return (
            <Tile key={option} name={MARK_MODE_NAMES[option].ar} on={mode === option} onPress={() => setMode(option)} palette={palette}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.card }}>
                {words.map(item => <MiniQuran key={item.kind} share={TILE_SHARE.words} look={{ color: shown[item.kind] ?? palette.ink }}>{item.word}</MiniQuran>)}
              </View>
            </Tile>
          );
        })}
      </View>
    </View>
  );
}
