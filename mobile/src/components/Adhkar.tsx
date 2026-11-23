import { useEffect, useReducer, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { Bell, BellOff, Check, RotateCcw } from 'lucide-react-native';
import { ADHKAR_OCCASIONS, adhkarFor, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { ADHKAR_LABELS, ADHKAR_TABS, adhkarQuotes, adhkarTitle } from '@shared/adhkarCite';
import { num } from '@shared/quran/arabicNumber';
import type { AdhkarTime } from '@shared/adhanAlerts';
import { CardWithRow } from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import { AyatRange } from './AyahLines';
import { buzz } from '@/lib/haptics';
import { ALERTS_SUPPORTED, allowAlerts, alertsAllowed, openPhoneSettings, useForeground } from '@/lib/adhan';
import { reachedAdhkar, showAdhkar, useAdhkarPlace } from '@/lib/adhkar';
import { countOf, counting } from '@shared/adhkarCount';
import { adhkarAlerts, prayerPlace } from '@/lib/settings';
import type { Palette } from '@/lib/theme';

const TABS = ADHKAR_TABS.filter(key => ADHKAR_OCCASIONS.includes(key)).map(key => ({ key, label: ADHKAR_LABELS[key] }));
/** Room between the cards. */
const GAP = 16;
const REMINDER: Partial<Record<AdhkarOccasion, { time: AdhkarTime; label: string }>> = {
  morning: { time: 'morning', label: 'تذكير بأذكار الصباح بعد الفجر' },
  evening: { time: 'evening', label: 'تذكير بأذكار المساء بعد العصر' },
};

/**
 * The Quran selection in the mushaf's own lines, each passage as the reader draws its ayat (آية الكرسي, the end of
 * al-Baqara; al-Falaq and al-Nas each from its title, so al-Ikhlas shows only where it is chosen).
 */
function QuranPage({ item, palette }: { item: Dhikr; palette: Palette }) {
  if (item.content.kind !== 'quran') return null;
  return (
    <View>
      {item.content.ranges.map(range => (
        <AyatRange key={range.surah} from={`${range.surah}:${range.from}`} to={`${range.surah}:${range.to}`} palette={palette} />
      ))}
    </View>
  );
}

/** A dhikr's words (the Quran passages in the mushaf's lines) and its virtue under them: the page's card and the feed's. */
export function DhikrBody({ item, palette }: { item: Dhikr; palette: Palette }) {
  return <>
    {item.content.kind === 'text'
      ? <Text style={{ color: palette.ink, fontSize: 21, lineHeight: 40, textAlign: 'justify' }}>{item.content.text}</Text>
      : <QuranPage item={item} palette={palette} />}
    {item.virtueQuote && <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>«{item.virtueQuote}»</Text>}
  </>;
}

/** The fajr or asr reminder for the open tab, if it has one; switching it on asks for notifications the first time. */
function useReminder(time: AdhkarTime | undefined, onPlace: () => void) {
  const [alerts, setAlerts] = adhkarAlerts.use();
  const [place] = prayerPlace.use();
  const [blocked, setBlocked] = useState(false);
  const back = useForeground();
  const on = !!time && alerts[time];
  useEffect(() => {
    if (!on) { setBlocked(false); return; }
    let gone = false;
    alertsAllowed().then(ok => { if (!gone) setBlocked(!ok); });
    return () => { gone = true; };
  }, [on, back]);
  const toggle = async () => {
    if (!time) return;
    buzz();
    if (on) { setAlerts({ ...adhkarAlerts.get(), [time]: false }); return; }
    // The reminder follows fajr and asr, so it needs the place the prayer times are for.
    if (!place) { onPlace(); return; }
    const ok = await allowAlerts();
    setBlocked(!ok);
    if (ok) setAlerts({ ...adhkarAlerts.get(), [time]: true });
  };
  return { on, blocked, toggle };
}

/**
 * The adhkar page in the utilities (owner, 2026-11-17): al-Nawawi's al-Adhkar, each item with a named scholar's grade of
 * sahih or hasan. docs/plans/adhkar-content-and-sketch.md. The counter is in this page's state only and never stored.
 */
export default function Adhkar({ palette, on, onPlace, scrollTo }: { palette: Palette; on: boolean; onPlace: () => void; scrollTo?: (y: number) => void }) {
  const { occasion, id: wanted } = useAdhkarPlace();
  const items = adhkarFor(occasion);
  const [count, dispatch] = useReducer(counting, null);
  // Leaving the card's tab, the page or the app ends the count.
  useEffect(() => { dispatch({ type: 'leave' }); }, [occasion, on]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'background') dispatch({ type: 'leave' }); });
    return () => listener.remove();
  }, []);
  // A search asked for one card: follow it while the cards above it are laid out (the Quran page draws once its width is
  // known, and the web reports a card's new size but not its new place), then let it go, so a later visit starts at the top.
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boxes = useRef(new Map<string, { y: number; height: number }>());
  useEffect(() => () => clearTimeout(settle.current), []);
  const laid = (id: string, box: { y: number; height: number }) => {
    boxes.current.set(id, box);
    const at = items.findIndex(item => item.id === wanted);
    if (at < 0) return;
    const above = items.slice(0, at).map(item => boxes.current.get(item.id));
    const first = boxes.current.get(items[0].id);
    if (!first || above.some(box => !box)) return;
    scrollTo?.(first.y + above.reduce((sum, box) => sum + box!.height + GAP, 0) + 8);
    clearTimeout(settle.current);
    settle.current = setTimeout(reachedAdhkar, 600);
  };
  const reminder = ALERTS_SUPPORTED ? REMINDER[occasion] : undefined;
  const bell = useReminder(reminder?.time, onPlace);
  return (
    <View style={{ gap: GAP }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}><Tabs label="وقت الذكر" options={TABS} value={occasion} onChange={key => showAdhkar(key)} palette={palette} fill /></View>
        {reminder && <IconButton Icon={bell.on ? Bell : BellOff} label={reminder.label} onPress={bell.toggle} on={bell.on} />}
      </View>
      {bell.blocked && <Button variant="plain" Icon={BellOff} label="التنبيهات موقوفة، فاسمح بها من إعدادات الجوال" onPress={openPhoneSettings} />}
      {items.map(item => {
        const counted = countOf(count, item.id);
        // The counter is the card's own tool, first in the row under it; the book on the line (owner 2026-11-20).
        return (
          <View key={item.id} onLayout={event => laid(item.id, event.nativeEvent.layout)}>
            <CardWithRow palette={palette} pad={18} gap={14} source={[{ line: adhkarTitle(item), quotes: adhkarQuotes(item) }]}
              lead={item.repeat && <>
                <IconButton round Icon={Check} render={({ size, color }) => <Check size={size} color={color} strokeWidth={2.5} />} label={`عُدَّ مرة، ${num(counted)} من ${num(item.repeat.count)}`}
                  disabled={counted >= item.repeat.count}
                  onPress={() => { buzz(); dispatch({ type: 'tap', id: item.id, target: item.repeat!.count }); }} />
                <Text accessibilityElementsHidden importantForAccessibility="no" style={{ color: palette.ink, fontSize: 20, writingDirection: 'ltr', paddingHorizontal: 12 }}>
                  {num(counted)} / {num(item.repeat.count)}
                </Text>
                {counted > 0 && <Button Icon={RotateCcw} variant="plain" accessibilityLabel="من جديد" onPress={() => dispatch({ type: 'reset' })} />}
              </>}>
              <DhikrBody item={item} palette={palette} />
            </CardWithRow>
          </View>
        );
      })}
    </View>
  );
}
