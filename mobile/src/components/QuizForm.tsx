import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { QUIZ_LEAVES } from '@shared/quiz/settings';
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

/** A juz number typed with the number pad; it is kept in 1 to 30 when the field is left. */
export function JuzInput({ label, value, onCommit, palette }: { label: string; value: number; onCommit: (value: number) => void; palette: Palette }) {
  const [text, setText] = useState<string | null>(null);
  const commit = () => {
    const n = Number((text ?? '').replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))));
    if (text !== null && Number.isInteger(n) && n > 0) onCommit(Math.min(30, n));
    setText(null);
  };
  return (
    <View style={{ gap: 4 }}>
      <Text style={{ color: palette.ink, fontSize: 15, textAlign: 'right' }}>{label}</Text>
      <TextInput value={text ?? String(value)} onChangeText={setText} onBlur={commit} onSubmitEditing={commit} keyboardType="number-pad" maxLength={2}
        accessibilityLabel={label} selectTextOnFocus
        style={{ width: 72, height: 44, fontSize: 18, textAlign: 'center', color: palette.ink, borderWidth: 1, borderColor: palette.rule, borderRadius: 8 }} />
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
