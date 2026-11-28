import { View } from 'react-native';
import { Text } from '@/ui/Text';
import Button, { Row } from '@/ui/Button';
import { penRule, quizPen } from '@/lib/settings';
import type { PenRule } from '@shared/quran/writeAyah';
import type { Palette } from '@/lib/theme';

export const PEN_NAMES: Record<PenRule, string> = { ends: 'أول الآية وآخرها', whole: 'الآية كاملة' };

export function PenSetting({ palette }: { palette: Palette }) {
  const [rule, setRule] = penRule.use();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>الكتابة بالقلم في التسميع</Text>
      <Row>{(Object.keys(PEN_NAMES) as PenRule[]).map(value => <Button key={value} label={PEN_NAMES[value]} active={rule === value} onPress={() => setRule(value)} />)}</Row>
    </View>
  );
}

export function QuizPenSetting({ palette }: { palette: Palette }) {
  const [rule, setRule] = quizPen.use();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>الكتابة بالقلم</Text>
      <Row>
        <Button label="كما في الإعدادات" active={rule === 'same'} onPress={() => setRule('same')} />
        {(Object.keys(PEN_NAMES) as PenRule[]).map(value => <Button key={value} label={PEN_NAMES[value]} active={rule === value} onPress={() => setRule(value)} />)}
      </Row>
    </View>
  );
}
