import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { BookSearch, Check } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import Button from '@/ui/Button';
import Chip from '@/ui/Chip';
import { num } from '@shared/quran/arabicNumber';
import { boxNumbers, emptyTray, inTray, put, sentTray, tapBox, trayOf, trayResults, type Tray } from '@shared/quiz/orderTray';
import { sentOrder } from '@shared/quiz/orderAnswer';
import { CARD, type Palette } from '@/lib/theme';

type Choice = { value: string; labelArabic: string };
const BOX = 46;
const GAP = 8;
const TRAY_ROWS = 3;
const CHIP = 44;
const CHIP_GAP = 7;

export default function OrderTray({ question, picked, palette, onPick, onDraft, onRetry, onLook, onBox, pinned = false, start, header, footer }: {
  question: { key: string; choices: Choice[]; order?: string[] };
  picked: string | undefined;
  palette: Palette;
  onPick?: (value: string) => void;
  onDraft?: (value: string) => void;
  onRetry?: (start: string) => void;
  onLook?: (surah: number) => void;
  onBox?: (surah: number) => void;
  pinned?: boolean;
  start?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const values = question.choices.map(choice => choice.value);
  const numbers = boxNumbers(values);
  const label = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? value;
  const [tray, setTray] = useState<Tray>(() => (start ? trayOf(start, numbers.length) : emptyTray(numbers.length)));
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const change = (next: Tray) => {
    setTray(next);
    onDraft?.(sentTray(next));
  };
  useEffect(() => {
    if (pinned && tray.at !== null) scroll.current?.scrollTo({ y: Math.max(0, (tray.at - 2) * (BOX + GAP)), animated: true });
  }, [pinned, tray.at]);
  const answered = picked !== undefined && !!question.order?.length;

  const box = (n: number, i: number) => {
    if (answered) {
      const result = trayResults(question.order!, picked)[i];
      const color = result.state === 'right' ? palette.green : result.state === 'wrong' ? palette.accent : palette.rule;
      const name = label(result.right);
      return (
        <Tap key={n} onPress={onBox ? () => onBox(n) : undefined} accessibilityRole={onBox ? 'button' : undefined}
          accessibilityLabel={`${num(n)} ${name}، ${result.state === 'right' ? 'في مكانها' : result.state === 'wrong' ? `وضعت ${label(result.given!)}` : 'لم تضعها'}`}
          style={{ minHeight: BOX, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderWidth: 1.5, borderColor: color, ...CARD }}>
          <Text style={{ color: palette.muted, fontSize: 15, width: 30 }}>{num(n)}</Text>
          <Text style={{ color: result.state === 'empty' ? palette.muted : palette.ink, fontSize: 18, flex: 1 }}>{name}</Text>
          {result.state === 'right' ? <Check size={18} color={color} />
            : result.state === 'wrong' ? <Text style={{ color, fontSize: 14, textDecorationLine: 'line-through' }}>{label(result.given!)}</Text>
            : <Text style={{ color: palette.muted, fontSize: 14 }}>لم تضعها</Text>}
        </Tap>
      );
    }
    const value = tray.boxes[i];
    const lit = tray.at === i;
    return (
      <Tap key={n} onPress={onPick ? () => change(tapBox(tray, i)) : undefined} accessibilityRole="button"
        accessibilityLabel={`${num(n)}، ${value ? `${label(value)}، اضغط لإرجاعها` : lit ? 'المربع التالي' : 'فارغ، اضغط ليكون التالي'}`}
        style={{ height: BOX, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, ...CARD,
          backgroundColor: value ? palette.card : 'transparent', borderWidth: value ? 0 : 1.5, borderStyle: value || lit ? 'solid' : 'dashed',
          borderColor: lit ? palette.accent : palette.rule }}>
        <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: 15, width: 30 }}>{num(n)}</Text>
        {value && <Text style={{ color: palette.ink, fontSize: 18 }}>{label(value)}</Text>}
      </Tap>
    );
  };

  const left = inTray(values, tray);
  const chips = !answered && onPick && (
    <View style={{ gap: 8, paddingTop: 10, paddingHorizontal: pinned ? 14 : 0, paddingBottom: pinned ? 10 : 0, borderTopWidth: 1, borderColor: palette.rule, backgroundColor: pinned ? palette.paper : 'transparent' }}>
      <ScrollView style={pinned ? { maxHeight: TRAY_ROWS * CHIP + (TRAY_ROWS - 1) * CHIP_GAP } : undefined} scrollEnabled={pinned}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: CHIP_GAP }}>
        {left.map(value => <Chip key={value} label={label(value)} on={false} onPress={() => change(put(tray, value))} palette={palette} />)}
      </ScrollView>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Button variant="primary" Icon={Check} label="تحقق" onPress={() => onPick(sentTray(tray))} />
        {onLook && tray.at !== null && <Button Icon={BookSearch} label="تلميح" accessibilityLabel="تلميح: ابحث عن الجواب" onPress={() => onLook(numbers[tray.at!])} />}
      </View>
    </View>
  );
  const results = answered && (() => {
    const all = trayResults(question.order!, picked);
    const missed = all.filter(result => result.state !== 'right').length;
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ color: missed ? palette.accent : palette.green, fontSize: 16, textAlign: 'right' }}>
          {missed ? `${num(all.length - missed)} من ${num(all.length)} في مكانها.` : 'كلها في مكانها.'}
        </Text>
        {onBox && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>اضغط أي سورة لترى بطاقتها.</Text>}
        {onRetry && missed > 0 && <View style={{ alignItems: 'flex-start' }}>
          <Button variant="primary" label="أعد الخطأ فقط" onPress={() => onRetry(sentOrder(all.map(result => result.state === 'right' ? result.right : '')))} />
        </View>}
      </View>
    );
  })();
  const boxes = <View style={{ gap: GAP }}>{numbers.map(box)}</View>;
  const hint = !answered && onPick && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اضغط اسمًا من الأسفل فيوضع في المربع المضيء.</Text>;

  if (!pinned) return <View style={{ paddingHorizontal: 16, gap: 10 }}>{header}{hint}{results}{boxes}{chips}{footer}</View>;
  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }} keyboardShouldPersistTaps="handled">
        {header}{hint}{results}{boxes}{footer}
      </ScrollView>
      {chips}
    </View>
  );
}
