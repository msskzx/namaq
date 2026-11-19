import { View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import type { Palette } from '@/lib/theme';

/** A way into a section from its hub: the name, one muted line under it, and a chevron to say it opens (sketch tarajim-hub). */
export default function WayCard({ title, line, palette, onPress }: { title: string; line?: string; palette: Palette; onPress: () => void }) {
  return (
    <Card palette={palette} pad={[11, 14]} accessibilityRole="link" accessibilityLabel={title} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>{title}</Text>
        {line ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{line}</Text> : null}
      </View>
      <ChevronLeft size={20} color={palette.muted} />
    </Card>
  );
}
