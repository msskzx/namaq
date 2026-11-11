import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { ExternalLink, ShieldCheck } from 'lucide-react-native';
import Sheet from './Sheet';
import Logo from './Logo';
import ThemeTiles, { ViewTiles } from './ThemeTiles';
import { GestureSettings } from './ReaderSheets';
import { WEBSITE } from '@/lib/branches';
import type { Palette } from '@/lib/theme';

/** The website's settings sheet (src/components/common/TabBar.tsx): the look, the branches view, the mushaf touches, then About and Privacy. */
export default function SettingsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const links = [
    { href: '/about', label: 'عن نمق', icon: <Logo size={22} /> },
    { href: '/privacy', label: 'سياسة الخصوصية', icon: <ShieldCheck size={20} color={palette.ink} /> },
  ];
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>الإعدادات</Text>
        <ThemeTiles palette={palette} />
        <ViewTiles palette={palette} />
        <GestureSettings palette={palette} mode="read" />
        <View style={{ borderTopWidth: 1, borderColor: palette.rule }}>
          {links.map(link => (
            <Pressable key={link.href} onPress={() => void Linking.openURL(`${WEBSITE}${link.href}`)} accessibilityRole="link" accessibilityLabel={link.label}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
              {link.icon}
              <Text style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{link.label}</Text>
              <ExternalLink size={16} color={palette.muted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Sheet>
  );
}
