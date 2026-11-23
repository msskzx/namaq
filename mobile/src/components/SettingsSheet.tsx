import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Text } from '@/ui/Text';
import { BookOpen, ChevronLeft, Play, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';
import Sheet from '@/ui/Sheet';
import Logo from './Logo';
import ThemeTiles, { MarkTiles } from './ThemeTiles';
import { GestureSettings } from './ReaderSheets';
import { around, besideLayout, connectors, haptics, hintsSeen, mushafSpread, tourSeen } from '@/lib/settings';
import { isTablet } from '@/ui/column';
import Toggle from '@/ui/Toggle';
import { MemorizedSetting } from './Memorized';
import { InterestsSetting } from './Interests';
import { PenSetting } from './recite/PenSetting';
import type { Palette } from '@/lib/theme';

/** The tour opens once the sheet has slid away: iOS cannot show it over a sheet that is still closing. Each page's first-visit tip comes back with it. */
const REPLAY_AFTER = 400;

/** The website's settings sheet (src/components/common/TabBar.tsx): the look, the branches view, the mushaf touches, the books, then About, the sources and their licences, and Privacy, each a page of the app. */
export default function SettingsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  // The app's own pages (screens/info.tsx), offline, not the website's (owner, 2026-11-18).
  const links = [
    { href: '/about' as const, label: 'عن نمق', icon: <Logo size={22} /> },
    { href: '/attributions' as const, label: 'المصادر والتراخيص', icon: <BookOpen size={20} color={palette.ink} /> },
    { href: '/privacy' as const, label: 'سياسة الخصوصية', icon: <ShieldCheck size={20} color={palette.ink} /> },
  ];
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700' }}>الإعدادات</Text>
        <InterestsSetting palette={palette} />
        <MemorizedSetting palette={palette} />
        <ThemeTiles palette={palette} />
        <MarkTiles palette={palette} />
        <AroundSetting palette={palette} />
        <BesideSetting palette={palette} />
        <ConnectorsSetting palette={palette} />
        <GestureSettings palette={palette} mode="read" />
        <SpreadSetting palette={palette} />
        <PenSetting palette={palette} />
        <HapticsSetting palette={palette} />
        <View style={{ borderTopWidth: 1, borderColor: palette.rule }}>
          <Pressable onPress={() => { onClose(); setTimeout(() => { hintsSeen.set([]); tourSeen.set(false); }, REPLAY_AFTER); }} accessibilityRole="button" accessibilityLabel="الجولة التعريفية"
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
            <Play size={20} color={palette.ink} />
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>الجولة التعريفية</Text>
          </Pressable>
          {links.map(link => (
            <Pressable key={link.href} onPress={() => { onClose(); router.push(link.href); }} accessibilityRole="link" accessibilityLabel={link.label}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
              {link.icon}
              <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{link.label}</Text>
              <ChevronLeft size={16} color={palette.muted} />
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

/** The website's BranchAroundSetting: how a card opens; each card's own button switches it there. */
function AroundSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = around.use();
  return <Toggle on={on} onChange={setOn} label="إظهار الآيات المحيطة افتراضيًا" palette={palette} />;
}

/** How a compare card's matrix opens; each card's own button switches it there. */
function BesideSetting({ palette }: { palette: Palette }) {
  const [on, setOn] = besideLayout.use();
  return <Toggle on={on} onChange={setOn} label="عرض آيات المقارنة جنبًا إلى جنب افتراضيًا" palette={palette} />;
}

/** Only a tablet turns, so only a tablet asks (owner, 2026-11-23). */
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
