import { View } from 'react-native';
import { router } from 'expo-router';
import { Compass, LibraryBig, NotebookPen, Presentation, SunMoon, type LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import { openUtility, toTab } from '@/lib/ways';
import type { Palette } from '@/lib/theme';

/**
 * The few buttons at the top of home (owner, 2026-11-18), in the story circles' place: what is not one of the four sections
 * of the tab bar and still needs a way in from home. The qibla opens the utilities on the qibla (the prayer times and the
 * date come as a card in the feed); «مدونتي» holds what the reader kept: saved, forgotten and notes.
 */
const BUTTONS: { label: string; Icon: (props: LucideProps) => React.ReactNode; open: () => void }[] = [
  { label: 'القبلة', Icon: Compass, open: () => openUtility('tools', 'qibla') },
  { label: 'الأذكار', Icon: SunMoon, open: () => openUtility('adhkar') },
  { label: 'المكتبة', Icon: LibraryBig, open: () => toTab('/books') },
  { label: 'مشاهد', Icon: Presentation, open: () => toTab('/lataif') },
  { label: 'مدونتي', Icon: NotebookPen, open: () => router.push('/library') },
];

export default function HomeButtons({ palette }: { palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {BUTTONS.map(({ label, Icon, open }) => (
        <Card key={label} palette={palette} pad={[8, 2]} gap={4} onPress={open} accessibilityRole="button" accessibilityLabel={label}
          style={{ flex: 1, alignItems: 'center' }}>
          <Icon size={22} color={palette.accent} strokeWidth={1.75} />
          <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 13 }}>{label}</Text>
        </Card>
      ))}
    </View>
  );
}
