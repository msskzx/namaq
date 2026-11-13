import { Linking, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { ExternalLink, Play, ShieldCheck } from 'lucide-react-native';
import Sheet from './Sheet';
import Logo from './Logo';
import ThemeTiles, { ViewTiles } from './ThemeTiles';
import { GestureSettings } from './ReaderSheets';
import { WEBSITE } from '@/lib/branches';
import { connectors, haptics, tourSeen } from '@/lib/settings';
import Toggle from './Toggle';
import type { Palette } from '@/lib/theme';

/** The tour opens once the sheet has slid away: iOS cannot show it over a sheet that is still closing. */
const REPLAY_AFTER = 400;

/** The website's settings sheet (src/components/common/TabBar.tsx): the look, the branches view, the mushaf touches, then About and Privacy. */
export default function SettingsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const links = [
    { href: '/about', label: 'عن نمق', icon: <Logo size={22} /> },
    { href: '/privacy', label: 'سياسة الخصوصية', icon: <ShieldCheck size={20} color={palette.ink} /> },
  ];
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>الإعدادات</Text>
        <ThemeTiles palette={palette} />
        <ViewTiles palette={palette} />
        <ConnectorsSetting palette={palette} />
        <GestureSettings palette={palette} mode="read" />
        <HapticsSetting palette={palette} />
        <View style={{ borderTopWidth: 1, borderColor: palette.rule }}>
          <Pressable onPress={() => { onClose(); setTimeout(() => tourSeen.set(false), REPLAY_AFTER); }} accessibilityRole="button" accessibilityLabel="الجولة التعريفية"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
            <Play size={20} color={palette.ink} />
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>الجولة التعريفية</Text>
          </Pressable>
          {links.map(link => (
            <Pressable key={link.href} onPress={() => void Linking.openURL(`${WEBSITE}${link.href}`)} accessibilityRole="link" accessibilityLabel={link.label}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
              {link.icon}
              <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{link.label}</Text>
              <ExternalLink size={16} color={palette.muted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Sheet>
  );
}

/** The website's BranchConnectorSetting. */
function ConnectorsSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = connectors.use();
  return (
    <View style={{ gap: 2 }}>
      <Toggle on={on} onChange={setOn} label="ربط الكلمات المتشابهة بخطوط تلقائيًا" palette={palette} />
      <Text style={{ color: palette.muted, fontSize: 13 }}>إظهار خطوط بين الكلمات المشتركة تلقائيًا عند فتح المصفوفة.</Text>
    </View>
  );
}

function HapticsSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = haptics.use();
  return <Toggle on={on} onChange={setOn} label="اهتزاز خفيف عند فتح أزرار البطاقة أو الآية" palette={palette} />;
}
