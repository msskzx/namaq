import { View } from 'react-native';
import { Text } from '@/ui/Text';
import FactCells, { type FactCell } from '@/ui/FactCells';
import type { Palette } from '@/lib/theme';

export default function TitleCells({ title, line, cells = [], palette }: { title: string; line?: string; cells?: FactCell[]; palette: Palette }) {
  return (
    <View>
      <View style={{ padding: 16, paddingBottom: cells.length ? 12 : 4, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 26, lineHeight: 36, textAlign: 'right' }}>{title}</Text>
        {line ? <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>{line}</Text> : null}
      </View>
      <FactCells cells={cells} palette={palette} />
    </View>
  );
}
