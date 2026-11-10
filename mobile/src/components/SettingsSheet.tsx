import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { ExternalLink, GalleryHorizontal, Monitor, Moon, ShieldCheck, Sun, type LucideProps } from 'lucide-react-native';
import Sheet from './Sheet';
import Logo from './Logo';
import TreeIcon from './TreeIcon';
import { GestureSettings } from './ReaderSheets';
import { WEBSITE } from '@/lib/branches';
import { closeStudio } from '@/lib/growPlayer';
import { branchView, themeChoice, type BranchView, type ThemeChoice } from '@/lib/settings';
import type { Palette } from '@/lib/theme';

type Option<T extends string> = { value: T; label: string; Icon: (props: LucideProps) => React.ReactNode };

/** The website's segmented control: a word and an icon per choice, the chosen one filled. */
function Segmented<T extends string>({ label, options, value, onChange, palette }: { label: string; options: Option<T>[]; value: T; onChange: (value: T) => void; palette: Palette }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{label}</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: 'row', alignSelf: 'flex-start', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, padding: 3, gap: 3 }}>
        {options.map(option => {
          const on = option.value === value;
          return (
            <Pressable key={option.value} onPress={() => onChange(option.value)} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={option.label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: on ? palette.accent : 'transparent' }}>
              <option.Icon size={18} color={on ? palette.onAccent : palette.ink} />
              <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 15 }}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const THEMES: Option<ThemeChoice>[] = [
  { value: 'light', label: 'فاتح', Icon: Sun },
  { value: 'dark', label: 'داكن', Icon: Moon },
  { value: 'system', label: 'حسب الجهاز', Icon: Monitor },
];
const VIEWS: Option<BranchView>[] = [
  { value: 'tree', label: 'شجرة', Icon: TreeIcon },
  { value: 'matrix', label: 'مصفوفة', Icon: GalleryHorizontal },
];

/** The website's settings sheet (src/components/common/TabBar.tsx): the look, the branches view, the mushaf touches, then About and Privacy. */
export default function SettingsSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const [theme, setTheme] = themeChoice.use();
  const [view, setView] = branchView.use();
  const links = [
    { href: '/about', label: 'عن نمق', icon: <Logo size={22} /> },
    { href: '/privacy', label: 'سياسة الخصوصية', icon: <ShieldCheck size={20} color={palette.ink} /> },
  ];
  return (
    <Sheet open={open} onClose={onClose} palette={palette}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 20 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>الإعدادات</Text>
        <Segmented label="المظهر" options={THEMES} value={theme} onChange={setTheme} palette={palette} />
        <Segmented label="العرض الافتراضي للمتشابه" options={VIEWS} value={view} onChange={next => { closeStudio(); setView(next); }} palette={palette} />
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
