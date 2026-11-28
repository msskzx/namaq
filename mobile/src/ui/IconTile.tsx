import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import type { Palette } from '@/lib/theme';

export default function IconTile({ label, Icon, onPress, palette, wide = false, line }: {
  label: string; Icon: (props: LucideProps) => React.ReactNode; onPress: () => void; palette: Palette;
  wide?: boolean;
  line?: string;
}) {
  if (wide) return (
    <Card palette={palette} onPress={onPress} accessibilityRole="link" accessibilityLabel={label}
      style={{ width: '100%', minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <Icon size={30} color={palette.accent} strokeWidth={1.75} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>{label}</Text>
        {line ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{line}</Text> : null}
      </View>
    </Card>
  );
  return (
    <Card palette={palette} gap={10} onPress={onPress} accessibilityRole="link" accessibilityLabel={label}
      style={{ flexBasis: '47%', flexGrow: 1, height: 112, alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={30} color={palette.accent} strokeWidth={1.75} />
      <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'center' }}>{label}</Text>
    </Card>
  );
}
