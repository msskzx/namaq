import { Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import { Check } from 'lucide-react-native';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, tintSurfaces, type CardMode } from '@shared/cardTint';
import { cardTints, markMode, themeChoice } from '@/lib/settings';
import { MARK_LEGEND, MARK_MODE_NAMES, MARK_MODES, MARK_SETTING_LABEL, markTones, type Likeness } from '@shared/quran/wordMatch';
import type { Palette } from '@/lib/theme';
import Card from '@/ui/Card';
import { MiniQuran } from './quran/text/AyahFlow';
import { SAMPLE_AYAH, TILE_SHARE } from '@shared/viewPreview';

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

export function LookPreview({ palette }: { palette: Palette }) {
  const [mode] = markMode.use();
  const shown = markTones(mode, { exact: palette.accent, written: palette.amber, root: palette.root });
  const words = MARK_LEGEND.filter((item): item is typeof item & { kind: Likeness } => item.kind !== 'plain');
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} node>
      <Text style={{ color: palette.muted, fontSize: 13 }}>هكذا تبدو البطاقات الآن</Text>
      <MiniQuran share={0.9} look={{ color: palette.ink }}>{SAMPLE_AYAH.start} {SAMPLE_AYAH.end} <Text style={{ color: palette.accent }}>{SAMPLE_AYAH.ending}</Text></MiniQuran>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14 }}>
        {words.map(item => <MiniQuran key={item.kind} share={0.6} look={{ color: shown[item.kind] ?? palette.ink }}>{item.word}</MiniQuran>)}
      </View>
      <Text style={{ color: palette.muted, fontSize: 12 }}>الطور ١٧</Text>
    </Card>
  );
}
