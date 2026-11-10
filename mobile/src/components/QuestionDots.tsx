import { Pressable, ScrollView, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import type { QuestionState } from '@/lib/quiz';
import type { Palette } from '@/lib/theme';

const LABELS: Record<QuestionState, string> = { correct: 'صحيح', partial: 'صحيح جزئيًا', incorrect: 'خطأ', unanswered: 'بدون إجابة' };

/** One round button per question, coloured by its state: green right, amber half right, terracotta wrong. */
export default function QuestionDots({ states, current, onPick, palette }: { states: QuestionState[]; current: number; onPick: (index: number) => void; palette: Palette }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
      {states.map((state, i) => {
        const active = i === current;
        const color = state === 'correct' ? palette.green : state === 'partial' ? palette.amber : state === 'incorrect' ? palette.accent : palette.muted;
        return (
          <Pressable key={i} onPress={() => onPick(i)} accessibilityRole="button" accessibilityState={{ selected: active }}
            accessibilityLabel={`السؤال ${num(i + 1)} - ${LABELS[state]}`}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 2 : 1, borderColor: active ? palette.ink : color, overflow: 'hidden' }}>
            {state === 'partial' && <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: 20, backgroundColor: palette.amber, opacity: 0.35 }} />}
            {state === 'correct' ? <Check size={20} color={color} />
              : state === 'incorrect' ? <X size={20} color={color} />
              : <Text style={{ color: active || state === 'partial' ? palette.ink : palette.muted, fontWeight: active ? '700' : '400' }}>{num(i + 1)}</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
