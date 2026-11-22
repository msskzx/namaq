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
/** A pinned tray shows three rows of names and scrolls the rest, so the boxes keep most of the screen. */
const TRAY_ROWS = 3;
const CHIP = 44;
const CHIP_GAP = 7;

/**
 * An order filled in numbered boxes from a tray of names (owner, 2026-11-21; sketch surah-order-tray/sketch-dark.png): the
 * long lists («رتّب سور الجزء» and the surah-order page's own practice), where dragging would go back and forth. A name
 * tapped goes into the lit box and the next empty box lights; a filled box tapped sends its name back to the front of the
 * tray; an empty box tapped becomes the lit one, so what is known is filled first. «تحقق» works at any time, an empty box
 * counting as not placed (owner, 2026-11-21). `pinned`: the boxes scroll and the tray stays at the foot of the screen (a
 * whole juz); otherwise the tray sits under the boxes (the home card's six). Once checked, each box shows its surah green,
 * or accent with what was put there struck through, or muted «لم تضعها» when left empty; `onBox` opens a surah's own card.
 * A party sends each change as a draft (`onDraft`), so the time running out grades the boxes as they stand.
 */
export default function OrderTray({ question, picked, palette, onPick, onDraft, onRetry, onLook, onBox, pinned = false, start, header, footer }: {
  question: { key: string; choices: Choice[]; order?: string[] };
  /** The order sent, joined; undefined while it is still being filled. */
  picked: string | undefined;
  palette: Palette;
  onPick?: (value: string) => void;
  onDraft?: (value: string) => void;
  /** «أعد الخطأ فقط»: the wrong and empty boxes emptied again, the right ones kept (the surah-order page's practice). */
  onRetry?: (start: string) => void;
  /** «ابحث عن الجواب» for the lit box: the surah whose place it is, by its number. */
  onLook?: (surah: number) => void;
  /** Once checked, a box tapped opens that surah's card. */
  onBox?: (surah: number) => void;
  pinned?: boolean;
  /** Boxes already filled, as sent (a retry, or a party's draft). */
  start?: string;
  header?: React.ReactNode;
  /** Under the boxes once checked: the question's sources. */
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
  // The list follows the lit box, so the next box to fill is always in sight above the tray.
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
