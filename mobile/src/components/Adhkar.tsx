import { useEffect, useReducer, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { Bed, Bell, BellOff, Check, Moon, Mosque, RotateCcw, Sun, Sunrise } from 'lucide-react-native';
import { ADHKAR_OCCASIONS, adhkarFor, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { ADHKAR_NAMES, ADHKAR_TABS, adhkarQuotes, adhkarTitle, gradeLine } from '@shared/adhkarCite';
import { counted as counted_, num } from '@shared/quran/arabicNumber';
import type { AdhkarTime } from '@shared/adhanAlerts';
import { CardWithRow } from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Chip from '@/ui/Chip';
import SplitBar from '@/ui/SplitBar';
import StepDots from '@/ui/StepDots';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import { Text } from '@/ui/Text';
import { AyatRange } from './AyahLines';
import { buzz } from '@/lib/haptics';
import { ALERTS_SUPPORTED, allowAlerts, alertsAllowed, openPhoneSettings, useForeground } from '@/lib/adhan';
import { reachedAdhkar, showAdhkar, useAdhkarPlace } from '@/lib/adhkar';
import { countOf, counting, isDone } from '@shared/adhkarCount';
import { adhkarAlerts, prayerPlace } from '@/lib/settings';
import type { Palette } from '@/lib/theme';

const ICONS = { morning: Sun, evening: Moon, sleep: Bed, waking: Sunrise, 'after-prayer': Mosque } as const;
const TABS = ADHKAR_TABS.filter(key => ADHKAR_OCCASIONS.includes(key)).map(key => ({ key, label: ADHKAR_NAMES[key], Icon: ICONS[key] }));
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
    {item.virtueQuote && (
      <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>
        <Text style={{ color: palette.accent }}>{item.content.kind === 'quran' ? 'فضلها ' : 'فضله '}</Text>«{item.virtueQuote}»
      </Text>
    )}
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

/** The grade under a dhikr, in its scholar's name, and who recorded it (owner, 2026-11-23: the reference right under it). */
function GradeLine({ item, palette }: { item: Dhikr; palette: Palette }) {
  const { grades, recorded } = gradeLine(item);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingTop: 10, borderTopWidth: 1, borderColor: `${palette.rule}66` }}>
      {grades.map(grade => (
        <View key={grade.by} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Chip small lit on role="text" tint={palette.green} label={grade.rank} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 14 }}>{grade.by}</Text>
        </View>
      ))}
      {recorded ? <Text style={{ color: palette.muted, fontSize: 14 }}>· {recorded}</Text> : null}
    </View>
  );
}

/**
 * The adhkar page in the utilities (owner, 2026-11-17; redesigned 2026-11-23, sketch /mnt/project-files/adhkar-page-redesign):
 * al-Nawawi's al-Adhkar, each item with a named scholar's grade of sahih or hasan. Each card says when it is said and how
 * often, the grade under the words, the virtue; the count button under it, a card done turns green and the page moves to
 * the next. A dot for each card shows how far the reader has come. The count is in this page's state only and never stored.
 */
export default function Adhkar({ palette, on, onPlace, scrollTo }: { palette: Palette; on: boolean; onPlace: () => void; scrollTo?: (y: number) => void }) {
  const { occasion, id: wanted } = useAdhkarPlace();
  const items = adhkarFor(occasion);
  const [count, dispatch] = useReducer(counting, null);
  // Leaving the card's tab, the page or the app ends the count.
  useEffect(() => { dispatch({ type: 'leave' }); clearTimeout(next.current); }, [occasion, on]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state === 'background') dispatch({ type: 'leave' }); });
    return () => listener.remove();
  }, []);
  // A search asked for one card: follow it while the cards above it are laid out (the Quran page draws once its width is
  // known, and the web reports a card's new size but not its new place), then let it go, so a later visit starts at the top.
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boxes = useRef(new Map<string, { y: number; height: number }>());
  const next = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => { clearTimeout(settle.current); clearTimeout(next.current); }, []);
  const topOf = (at: number) => {
    const first = boxes.current.get(items[0].id);
    const above = items.slice(0, at).map(item => boxes.current.get(item.id));
    return first && !above.some(box => !box) ? first.y + above.reduce((sum, box) => sum + box!.height + GAP, 0) : null;
  };
  const laid = (id: string, box: { y: number; height: number }) => {
    boxes.current.set(id, box);
    const at = items.findIndex(item => item.id === wanted);
    if (at < 0) return;
    const y = topOf(at);
    if (y === null) return;
    scrollTo?.(y + 8);
    clearTimeout(settle.current);
    settle.current = setTimeout(reachedAdhkar, 600);
  };
  const tap = (item: Dhikr, at: number) => {
    buzz();
    const target = item.repeat?.count ?? 1;
    dispatch({ type: 'tap', id: item.id, target });
    // The last count of a card brings the next one up.
    // Measured once the finished card has dropped its bar and laid out again, not before the tap.
    if (countOf(count, item.id) + 1 >= target && at + 1 < items.length) {
      clearTimeout(next.current);
      next.current = setTimeout(() => { const y = topOf(at + 1); if (y !== null) scrollTo?.(y + 8); }, 250);
    }
  };
  const reminder = ALERTS_SUPPORTED ? REMINDER[occasion] : undefined;
  const bell = useReminder(reminder?.time, onPlace);
  return (
    <View style={{ gap: GAP }}>
      <Tabs label="وقت الذكر" options={TABS} value={occasion} onChange={key => showAdhkar(key)} palette={palette} fill />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }}>
        <StepDots names={items.map(item => item.id)} at={items.findIndex(item => count?.id === item.id)} done={items.map(item => isDone(count, item.id))} palette={palette}
          label={`أتممت ${num(items.filter(item => isDone(count, item.id)).length)} من ${num(items.length)}`} />
        {reminder && <IconButton Icon={bell.on ? Bell : BellOff} label={reminder.label} onPress={bell.toggle} on={bell.on} />}
      </View>
      {bell.blocked && <Button variant="plain" Icon={BellOff} label="التنبيهات موقوفة، فاسمح بها من إعدادات الجوال" onPress={openPhoneSettings} />}
      {items.map((item, at) => {
        const counted = countOf(count, item.id);
        const target = item.repeat?.count ?? 1;
        const done = isDone(count, item.id);
        // The counter is the card's own tool, first in the row under it; the book on the line (owner 2026-11-20).
        return (
          <View key={item.id} onLayout={event => laid(item.id, event.nativeEvent.layout)}>
            <CardWithRow palette={palette} pad={18} gap={12} outline={done ? palette.green : undefined} source={[{ line: adhkarTitle(item), quotes: adhkarQuotes(item) }]}
              lead={<>
                <Button big pill variant={done ? 'outline' : 'primary'} disabled={done} Icon={Check}
                  label={item.repeat ? `${num(counted)} / ${num(target)}` : 'قلته'}
                  accessibilityLabel={item.repeat ? `عُدَّ مرة، ${num(counted)} من ${num(target)}` : 'قلته'}
                  onPress={() => tap(item, at)} />
                {counted > 0 && <IconButton Icon={RotateCcw} label="من جديد" onPress={() => dispatch({ type: 'reset', id: item.id })} />}
              </>}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <Text style={{ flex: 1, color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>«{item.occasionQuote}»</Text>
                {item.repeat && <Chip small on={false} role="text" label={counted_(item.repeat.count, ['مرة', 'مرتين', 'مرات'])} palette={palette} />}
              </View>
              <DhikrBody item={item} palette={palette} />
              <GradeLine item={item} palette={palette} />
              {item.repeat && !done && counted > 0 && (
                <View style={{ flexDirection: 'row' }}><SplitBar first={counted} second={target - counted} palette={palette} /></View>
              )}
            </CardWithRow>
          </View>
        );
      })}
    </View>
  );
}
