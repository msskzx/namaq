import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName, type CompareTarget } from '@/lib/compare';
import type { Palette } from '@/lib/theme';
import Sheet from './Sheet';

/** A tree across three or more surahs: the surah pairs compare holds a card of, to pick the one to open. */
export default function CompareTargetsSheet({ targets, onPick, onClose, palette }: { targets: CompareTarget[] | null; onPick: (target: CompareTarget) => void; onClose: () => void; palette: Palette }) {
  return (
    <Sheet open={!!targets} onClose={onClose} palette={palette}>
      {targets && <View style={{ paddingHorizontal: 16, paddingBottom: 20, gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '600', textAlign: 'right', marginBottom: 4 }}>افتح في المقارنة</Text>
        {targets.map(target => {
          const label = `${surahName(target.lead)} مع ${surahName(target.other)}`;
          const ayat = `${num(target.ayat[0])} · ${num(target.ayat[1])}`;
          return (
            <Pressable key={`${target.lead}:${target.other}`} onPress={() => onPick(target)} accessibilityRole="button" accessibilityLabel={`${label} ${ayat}`}
              style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: palette.rule }}>
              <Text style={{ flex: 1, color: palette.ink, fontSize: 15, textAlign: 'right' }}>{label}</Text>
              <Text style={{ color: palette.muted, fontSize: 13 }}>{ayat}</Text>
              <ChevronLeft size={18} color={palette.muted} />
            </Pressable>
          );
        })}
      </View>}
    </Sheet>
  );
}
