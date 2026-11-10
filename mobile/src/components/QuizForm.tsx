import { Text, View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { JUZ_STARTS } from '@shared/quran/juz';
import { QUIZ_LEAVES } from '@shared/quiz/settings';
import NumberPicker from './NumberPicker';
import { surahNames } from '@/lib/branches';
import Button, { Row } from './Button';
import type { Palette } from '@/lib/theme';

const LEVELS: Record<number, string> = { 1: 'سهل', 10: 'صعب' };

export function Section({ title, palette, children }: { title: string; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, borderRadius: 14, padding: 14, gap: 10 }}>
      <Text style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right' }}>{title}</Text>
      {children}
    </View>
  );
}

/** Where a juz starts, shown beside its number. */
function juzStart(juz: number) {
  const [surah, ayah] = JUZ_STARTS[juz - 1].split(':').map(Number);
  return `${surahNames[surah]} ${num(ayah)}`;
}

/** A juz number, 1 to 30, picked from a list so the keyboard never opens. */
export function JuzInput({ label, value, onCommit, palette }: { label: string; value: number; onCommit: (value: number) => void; palette: Palette }) {
  return (
    <View style={{ gap: 4, flex: 1, minWidth: 140, alignSelf: 'flex-start' }}>
      <Text style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>{label}</Text>
      <NumberPicker value={value} onChange={onCommit} max={30} label={label} nameOf={juzStart} palette={palette} />
    </View>
  );
}

/** How many leaves to type in each tree, 1 (easy) to 10 (hard). */
export function LeavesPicker({ value, onChange, palette }: { value: number; onChange: (value: number) => void; palette: Palette }) {
  return (
    <>
      <Text style={{ color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'right', marginTop: 4 }}>عدد الإجابات في كل شجرة</Text>
      <Row>
        {QUIZ_LEAVES.map(leaves => (
          <View key={leaves} style={{ alignItems: 'center', gap: 2 }}>
            <Button label={num(leaves)} active={value === leaves} onPress={() => onChange(leaves)} accessibilityLabel={`${num(leaves)}${LEVELS[leaves] ? ` ${LEVELS[leaves]}` : ''}`} />
            {LEVELS[leaves] ? <Text style={{ color: palette.muted, fontSize: 12 }}>{LEVELS[leaves]}</Text> : null}
          </View>
        ))}
      </Row>
    </>
  );
}
