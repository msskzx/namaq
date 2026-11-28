import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

export type Reading = { value: string; by?: string };
export type FactCell = { key: string; Icon?: LucideIcon; label: string; readings: Reading[] };

export default function FactCells({ cells, palette, open = false }: { cells: FactCell[]; palette: Palette; open?: boolean }) {
  if (!cells.length) return null;
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: open ? 0 : 1, borderBottomWidth: open ? 0 : 1, borderColor: `${palette.rule}66` }}>
      {cells.map((cell, i) => (
        <View key={cell.key} style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', gap: 6,
          borderRightWidth: i ? 1 : 0, borderColor: `${palette.rule}66` }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {cell.Icon && <cell.Icon size={13} color={palette.muted} />}
            <Text style={{ color: palette.muted, fontSize: 13 }}>{cell.label}</Text>
          </View>
          {cell.readings.map((reading, r) => (
            <View key={r} style={{ alignItems: 'center' }}>
              <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'center' }}>{reading.value}</Text>
              {reading.by ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{reading.by}</Text> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
