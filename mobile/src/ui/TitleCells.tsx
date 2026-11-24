import { View } from 'react-native';
import { Text } from '@/ui/Text';
import FactCells, { type FactCell } from '@/ui/FactCells';
import type { Palette } from '@/lib/theme';

/**
 * A card's identity at its top (owner, 2026-11-24: «بطاقة التعريف», sketch content-cards/sketch-dark.png design أ, as the
 * person card draws it): its name large, a muted line under it, then its short facts in cells (the year and the place, a
 * surah's juz and page). Who tells it is never here: a chain goes with the words it carries, below.
 */
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
