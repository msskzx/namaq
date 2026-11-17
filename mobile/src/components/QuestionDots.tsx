import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/Text';
import { Check, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import type { QuestionState } from '@/lib/quiz';
import type { Palette } from '@/lib/theme';

const LABELS: Record<QuestionState, string> = { correct: 'صحيح', partial: 'صحيح جزئيًا', incorrect: 'خطأ', unanswered: 'بدون إجابة' };

/** One round button per question, coloured by its state: green right, amber half right, terracotta wrong. */
export default function QuestionDots({ states, current, onPick, palette, inBar }: { states: QuestionState[]; current: number; onPick: (index: number) => void; palette: Palette;
  /** In the top bar, in place of the title (owner, 2026-11-17): a little smaller, no padding of its own. */
  inBar?: boolean }) {
  const size = inBar ? 34 : 40;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: inBar ? 6 : 8, paddingHorizontal: inBar ? 4 : 12, paddingVertical: inBar ? 0 : 8, alignItems: 'center' }}>
      {states.map((state, i) => {
        const active = i === current;
        const color = state === 'correct' ? palette.green : state === 'partial' ? palette.amber : state === 'incorrect' ? palette.accent : palette.muted;
        return (
          <Pressable key={i} onPress={() => onPick(i)} accessibilityRole="button" accessibilityState={{ selected: active }}
            accessibilityLabel={`السؤال ${num(i + 1)} - ${LABELS[state]}`}
            style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', borderWidth: active ? 2 : 1, borderColor: active ? palette.ink : color, overflow: 'hidden' }}>
            {state === 'partial' && <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: size / 2, backgroundColor: palette.amber, opacity: 0.35 }} />}
            {state === 'correct' ? <Check size={20} color={color} />
              : state === 'incorrect' ? <X size={20} color={color} />
              : <Text style={{ color: active || state === 'partial' ? palette.ink : palette.muted, fontWeight: active ? '700' : '400' }}>{num(i + 1)}</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
