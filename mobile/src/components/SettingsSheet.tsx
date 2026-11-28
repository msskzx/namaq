import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Text } from '@/ui/Text';
import { BookOpen, ChevronLeft, Hand, Palette as PaletteIcon, PenLine, Play, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import Sheet from '@/ui/Sheet';
import Logo from './Logo';
import ThemeTiles, { LookPreview, MarkTiles } from './ThemeTiles';
import Card from '@/ui/Card';
import SettingRow from '@/ui/SettingRow';
import { THEME_TILES, currentTile } from '@shared/cardTint';
import { MARK_MODE_NAMES } from '@shared/quran/wordMatch';
import { GestureSettings } from './ReaderSheets';
import { around, besideLayout, cardTints, connectors, haptics, hintsSeen, markMode, mushafSpread, penRule, themeChoice, tourSeen } from '@/lib/settings';
import { isTablet } from '@/ui/column';
import Toggle from '@/ui/Toggle';
import { MemorizedSetting } from './Memorized';
import { InterestsSetting } from './Interests';
import { PEN_NAMES, PenSetting } from './recite/PenSetting';
import type { Palette } from '@/lib/theme';
import { useLater } from '@/lib/hooks/useLater';

const REPLAY_AFTER = 400;

export default function SettingsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const later = useLater();
  const links = [
    { href: '/about' as const, label: 'عن نمق', icon: <Logo size={22} /> },
    { href: '/attributions' as const, label: 'المصادر والتراخيص', icon: <BookOpen size={20} color={palette.ink} /> },
    { href: '/privacy' as const, label: 'سياسة الخصوصية', icon: <ShieldCheck size={20} color={palette.ink} /> },
  ];
  const [theme] = themeChoice.use();
  const [tints] = cardTints.use();
  const [marks] = markMode.use();
  const [spread] = mushafSpread.use();
  const [beside] = besideLayout.use();
  const [pen] = penRule.use();
  const lookLabel = `${THEME_TILES.find(tile => tile.key === currentTile(theme, tints))?.ar ?? ''} · ${MARK_MODE_NAMES[marks].ar}`;
  const mushafLabel = [spread ? 'صفحتان حين يُمال الجهاز' : 'صفحة واحدة', beside ? 'المقارنة جنبًا إلى جنب' : 'المقارنة بعضها تحت بعض'].join(' · ');
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>الإعدادات</Text>
        <View style={{ backgroundColor: palette.paper, paddingBottom: 4 }}><LookPreview palette={palette} /></View>
        <Card palette={palette} pad={[6, 14]} gap={6}>
          <InterestsSetting palette={palette} />
          <MemorizedSetting palette={palette} />
        </Card>
        <Card palette={palette} pad={[6, 14]} gap={6}>
          <SettingRow Icon={PaletteIcon} title="المظهر" value={lookLabel} palette={palette}>
            <View style={{ gap: 16, paddingBottom: 8 }}>
              <ThemeTiles palette={palette} />
              <MarkTiles palette={palette} />
            </View>
          </SettingRow>
          <SettingRow Icon={BookOpen} title="المصحف والآيات" value={mushafLabel} palette={palette}>
            <View style={{ gap: 12, paddingBottom: 8 }}>
              <AroundSetting palette={palette} />
              <BesideSetting palette={palette} />
              <ConnectorsSetting palette={palette} />
              <SpreadSetting palette={palette} />
            </View>
          </SettingRow>
          <SettingRow Icon={Hand} title="اللمسات في المصحف" value="القراءة والتسميع" palette={palette}>
            <View style={{ paddingBottom: 8 }}><GestureSettings palette={palette} mode="read" /></View>
          </SettingRow>
          <SettingRow Icon={PenLine} title="التسميع بالقلم" value={PEN_NAMES[pen]} palette={palette}>
            <View style={{ paddingBottom: 8 }}><PenSetting palette={palette} /></View>
          </SettingRow>
          <HapticsSetting palette={palette} />
        </Card>
        <Card palette={palette} pad={[0, 14]}>
          <Pressable onPress={() => { onClose(); later.after(REPLAY_AFTER, () => { hintsSeen.set([]); tourSeen.set(false); }); }} accessibilityRole="button" accessibilityLabel="الجولة التعريفية"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: `${palette.rule}55`, opacity: pressed ? 0.6 : 1 })}>
            <Play size={20} color={palette.ink} />
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>الجولة التعريفية</Text>
          </Pressable>
          {links.map((link, i) => (
            <Pressable key={link.href} onPress={() => { onClose(); router.push(link.href); }} accessibilityRole="link" accessibilityLabel={link.label}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: i < links.length - 1 ? 1 : 0, borderColor: `${palette.rule}55`, opacity: pressed ? 0.6 : 1 })}>
              {link.icon}
              <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{link.label}</Text>
              <ChevronLeft size={16} color={palette.muted} />
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </Sheet>
  );
}

function ConnectorsSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = connectors.use();
  return (
    <View style={{ gap: 2 }}>
      <Toggle on={on} onChange={setOn} label="ربط الكلمات المتشابهة بخطوط تلقائيًا" palette={palette} />
      <Text style={{ color: palette.muted, fontSize: 13 }}>إظهار خطوط بين الكلمات المشتركة تلقائيًا عند فتح المصفوفة.</Text>
    </View>
  );
}

function AroundSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = around.use();
  return <Toggle on={on} onChange={setOn} label="إظهار الآيات المحيطة افتراضيًا" palette={palette} />;
}

function BesideSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = besideLayout.use();
  return <Toggle on={on} onChange={setOn} label="عرض آيات المقارنة جنبًا إلى جنب افتراضيًا" palette={palette} />;
}

function SpreadSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = mushafSpread.use();
  const { width, height } = useWindowDimensions();
  if (!isTablet(width, height)) return null;
  return (
    <View style={{ gap: 2 }}>
      <Toggle on={on} onChange={setOn} label="صفحتان متقابلتان في المصحف" palette={palette} />
      <Text style={{ color: palette.muted, fontSize: 13 }}>حين يُمال الجهاز، كالمصحف المطبوع. وإن أُوقفت فصفحة واحدة.</Text>
    </View>
  );
}

function HapticsSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = haptics.use();
  return <Toggle on={on} onChange={setOn} label="اهتزاز خفيف عند فتح أزرار البطاقة أو الآية" palette={palette} />;
}
