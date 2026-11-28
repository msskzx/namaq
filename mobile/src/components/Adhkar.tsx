import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Bed, Bell, BellOff, ChevronLeft, ChevronRight, Circle, CircleCheck, Moon, Mosque, Sun, Sunrise } from 'lucide-react-native';
import { ADHKAR, adhkarFor, type AdhkarOccasion, type Dhikr } from '@shared/adhkar';
import { ADHKAR_TABS, ADHKAR_TITLES, gradeLine } from '@shared/adhkarCite';
import { surahName } from '@shared/quran/surahNames';
import { searchPattern } from '@shared/bookReader';
import { num } from '@shared/quran/arabicNumber';
import type { AdhkarTime } from '@shared/adhanAlerts';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import TapRow from '@/ui/TapRow';
import { Text } from '@/ui/Text';
import { AyatRange } from './AyahLines';
import { buzz } from '@/lib/haptics';
import { ALERTS_SUPPORTED, allowAlerts, alertsAllowed, openPhoneSettings, useForeground } from '@/lib/adhan';
import { openDhikr, showAdhkar, useAdhkarPlace, useSaidToday } from '@/lib/adhkar';
import { saidDone, saidKey, type SaidToday } from '@shared/adhkarCount';
import { adhkarAlerts, prayerPlace } from '@/lib/settings';
import type { Palette } from '@/lib/theme';

export const ADHKAR_ICONS = { morning: Sun, evening: Moon, sleep: Bed, waking: Sunrise, 'after-prayer': Mosque } as const;
const GAP = 16;
const REMINDER: Partial<Record<AdhkarOccasion, { time: AdhkarTime; label: string }>> = {
  morning: { time: 'morning', label: 'تذكير بأذكار الصباح بعد الفجر' },
  evening: { time: 'evening', label: 'تذكير بأذكار المساء بعد العصر' },
};

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
    if (!place) { onPlace(); return; }
    const ok = await allowAlerts();
    setBlocked(!ok);
    if (ok) setAlerts({ ...adhkarAlerts.get(), [time]: true });
  };
  return { on, blocked, toggle };
}

export function GradeLine({ item, palette }: { item: Dhikr; palette: Palette }) {
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

export const adhkarCount = (n: number) => (n === 1 ? 'ذكر واحد' : n === 2 ? 'ذكران' : n <= 10 ? `${num(n)} أذكار` : `${num(n)} ذكرًا`);

export function dhikrLine(item: Dhikr) {
  if (item.content.kind === 'quran') return item.content.ranges.map(range => `${surahName(range.surah)} ${num(range.from)}${range.to > range.from ? `–${num(range.to)}` : ''}`).join('، ');
  const words = item.content.text.split(/\s+/);
  return words.length > 6 ? `${words.slice(0, 6).join(' ')}…` : item.content.text;
}

const saidOf = (counts: SaidToday['counts'], occasion: AdhkarOccasion) => adhkarFor(occasion).filter(item => saidDone(counts, saidKey(occasion, item.id))).length;

const BOOK_NOTE = 'جمعها النووي في «الأذكار»، والحكم على كل حديث باسم قائله.';

function DhikrRow({ item, occasion, said, first, palette }: { item: Dhikr; occasion: AdhkarOccasion; said: boolean; first: boolean; palette: Palette }) {
  const grade = gradeLine(item).grades[0]?.rank;
  const line = dhikrLine(item);
  return (
    <TapRow onPress={() => openDhikr(occasion, item.id)} label={`${line}${said ? '، قلته اليوم' : ''}`}
      style={{ alignItems: 'center', gap: 10, paddingVertical: 10, ...(first ? {} : { borderTopWidth: 1, borderColor: `${palette.rule}66` }) }}>
      {said ? <CircleCheck size={22} color={palette.green} /> : <Circle size={22} color={palette.rule} />}
      <Text numberOfLines={1} style={{ flex: 1, color: said ? palette.muted : palette.ink, fontSize: 17 }}>{line}</Text>
      {item.repeat && <Chip small on={false} role="text" label={`×${num(item.repeat.count)}`} palette={palette} />}
      {grade && <Text style={{ color: palette.muted, fontSize: 13 }}>{grade}</Text>}
    </TapRow>
  );
}

function Times({ query, palette }: { query: string; palette: Palette }) {
  const [count] = useSaidToday();
  const found = useMemo(() => {
    const pattern = searchPattern(query);
    if (!pattern) return null;
    const match = (text: string) => new RegExp(pattern.source).test(text);
    return ADHKAR.filter(item => match([item.content.kind === 'text' ? item.content.text : dhikrLine(item), item.occasionQuote, item.virtueQuote ?? ''].join(' ')));
  }, [query]);
  return (
    <View style={{ gap: GAP }}>
      {found
        ? <Card palette={palette} pad={[4, 14]} gap={0}>
          {found.length
            ? found.map((item, i) => {
              const occasion = ADHKAR_TABS.find(tab => item.occasions.includes(tab))!;
              return <DhikrRow key={item.id} item={item} occasion={occasion} said={saidDone(count, saidKey(occasion, item.id))} first={i === 0} palette={palette} />;
            })
            : <Text style={{ color: palette.muted, fontSize: 15, paddingVertical: 12 }}>لا ذكر بهذه الكلمات.</Text>}
        </Card>
        : <Card palette={palette} pad={[4, 14]} gap={0}>
          {ADHKAR_TABS.map((occasion, i) => {
            const Icon = ADHKAR_ICONS[occasion];
            const all = adhkarFor(occasion).length;
            const said = saidOf(count, occasion);
            const sub = said ? `${adhkarCount(all)} · قلت ${num(said)} اليوم` : adhkarCount(all);
            return (
              <TapRow key={occasion} onPress={() => showAdhkar(occasion)} label={`أذكار ${ADHKAR_TITLES[occasion]}، ${sub}`}
                style={{ alignItems: 'center', gap: 12, paddingVertical: 12, ...(i ? { borderTopWidth: 1, borderColor: `${palette.rule}66` } : {}) }}>
                <Icon size={22} color={said === all ? palette.green : palette.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.ink, fontSize: 19 }}>أذكار {ADHKAR_TITLES[occasion]}</Text>
                  <Text style={{ color: palette.muted, fontSize: 14 }}>{sub}</Text>
                </View>
                <ChevronLeft size={18} color={palette.muted} />
              </TapRow>
            );
          })}
        </Card>}
      <Text style={{ color: palette.muted, fontSize: 13 }}>{BOOK_NOTE}</Text>
    </View>
  );
}

function TimeList({ occasion, palette, onPlace }: { occasion: AdhkarOccasion; palette: Palette; onPlace: () => void }) {
  const [count] = useSaidToday();
  const items = adhkarFor(occasion);
  const said = saidOf(count, occasion);
  const reminder = ALERTS_SUPPORTED ? REMINDER[occasion] : undefined;
  const bell = useReminder(reminder?.time, onPlace);
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button variant="plain" Icon={ChevronRight} label="الأذكار" onPress={() => showAdhkar(null)} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 }}>
        <View style={{ flex: 1 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 21 }}>أذكار {ADHKAR_TITLES[occasion]}</Text>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{adhkarCount(items.length)}{said ? ` · قلت ${num(said)} اليوم` : ''}</Text>
        </View>
        {reminder && <IconButton Icon={bell.on ? Bell : BellOff} label={reminder.label} onPress={bell.toggle} on={bell.on} />}
      </View>
      {bell.blocked && <Button variant="plain" Icon={BellOff} label="التنبيهات موقوفة، فاسمح بها من إعدادات الجوال" onPress={openPhoneSettings} />}
      <Card palette={palette} pad={[4, 14]} gap={0}>
        {items.map((item, i) => <DhikrRow key={item.id} item={item} occasion={occasion} said={saidDone(count, saidKey(occasion, item.id))} first={i === 0} palette={palette} />)}
      </Card>
      <Text style={{ color: palette.muted, fontSize: 13 }}>{BOOK_NOTE}</Text>
    </View>
  );
}

export default function Adhkar({ query = '', palette, onPlace }: { query?: string; palette: Palette; onPlace: () => void }) {
  const occasion = useAdhkarPlace();
  return occasion && !query.trim() ? <TimeList occasion={occasion} palette={palette} onPlace={onPlace} /> : <Times query={query} palette={palette} />;
}
