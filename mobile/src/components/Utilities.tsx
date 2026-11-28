import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Bell, BellOff, CalendarDays, Check, HandHeart, ChevronDown, ChevronLeft, ChevronRight, Compass, Infinity as InfinityIcon, List, LocateFixed, MapPin, type LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import { hijriDate, todaysJuz } from '@shared/hijri';
import { readQiblaAsks, subscribeQiblaAsks, takeQiblaAsk } from '@/lib/ways';
import { juzLabel, openJuz } from '@/lib/juz';
import Button from '@/ui/Button';
import { dayDigits, FACING, hijriMonth, METHODS, MY_LOCATION, nextPrayer, PRAYER_NAMES, qiblaLabel, searchPlaces, turnTo, type Place, type PrayerKey } from '@shared/prayer';
import { locate, qiblaFor, timesFor, useHeading, useMinute } from '@/lib/prayer';
import { adhanAlerts, prayerPlace, prayerView, type PrayerView, prayerSettings, utilityView, type UtilityView } from '@/lib/settings';
import { buzz } from '@/lib/haptics';
import { ALERTS_SUPPORTED, allowAlerts, openPhoneSettings, useForeground } from '@/lib/adhan';
import { useAlertsBlocked } from '@/lib/alertsBlocked';
import { anyAlert } from '@shared/adhanAlerts';
import { type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Card from '@/ui/Card';
import { SearchField } from '@/ui/Field';
import Empty from '@/ui/Empty';
import Adhkar from './Adhkar';
import Tabs from '@/ui/Tabs';
import { DayDial, DayLine, MonthMoons, TimeCells } from './DayView';
import { Tap } from '@/ui/Tap';
import TapRow from '@/ui/TapRow';
import { FEATURE_ICON } from '@/components/featureIcons';

const DAY_VIEWS = [{ key: 'dial', label: 'دائرة' }, { key: 'line', label: 'خط' }] as const satisfies readonly { key: PrayerView; label: string }[];

const VIEWS: { id: UtilityView; Icon: (props: LucideProps) => React.ReactNode; label: string }[] = [
  { id: 'tools', Icon: Compass, label: 'الأدوات' },
  { id: 'adhkar', Icon: HandHeart, label: 'الأذكار' },
];

export function UtilityPicker({ palette, progress }: { palette: Palette; progress?: Animated.Value }) {
  const [view, setView] = utilityView.use();
  const [spots, setSpots] = useState<{ x: number; width: number }[]>([]);
  const [lit, setLit] = useState(() => Math.max(0, VIEWS.findIndex(item => item.id === view)));
  useEffect(() => {
    if (!progress) { setLit(Math.max(0, VIEWS.findIndex(item => item.id === view))); return; }
    const id = progress.addListener(({ value }) => setLit(Math.round(value)));
    return () => progress.removeListener(id);
  }, [progress, view]);
  const measured = spots.length === VIEWS.length && spots.every(Boolean);
  const steps = VIEWS.map((_, i) => i);
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="الأدوات"
      style={{ direction: 'ltr', flexDirection: 'row-reverse', borderWidth: 1, borderColor: palette.rule, borderRadius: 12, padding: 2, gap: 2 }}>
      {measured && progress && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 2, bottom: 2, left: -1, width: spots[0].width, borderRadius: 10, backgroundColor: palette.accent,
          transform: [{ translateX: progress.interpolate({ inputRange: steps, outputRange: spots.map(spot => spot.x), extrapolate: 'clamp' }) }],
        }} />
      )}
      {VIEWS.map(({ id, Icon, label }, i) => {
        const on = progress ? lit === i : view === id;
        return (
          <Pressable key={id} onPress={() => setView(id)} accessibilityRole="radio" aria-checked={view === id} accessibilityLabel={label} hitSlop={4}
            onLayout={event => { const { x, width } = event.nativeEvent.layout; setSpots(all => { const next = [...all]; next[i] = { x, width }; return next; }); }}
            style={{ paddingHorizontal: 18, paddingVertical: 7, borderRadius: 10, backgroundColor: on && !(measured && progress) ? palette.accent : 'transparent' }}>
            <Icon size={20} color={on ? palette.onAccent : palette.ink} />
          </Pressable>
        );
      })}
    </View>
  );
}

export const UTILITY_VIEWS = VIEWS.map(view => view.id);

export function UtilityPage({ view, palette, on = true, onPlace, scrollTo, reach = Infinity, query }: { view: UtilityView; palette: Palette; on?: boolean; onPlace: () => void; scrollTo?: (y: number) => void; reach?: number; query?: string }) {
  return view === 'adhkar' ? <Adhkar query={query} palette={palette} onPlace={onPlace} />
    : <Tools palette={palette} on={on} onPlace={onPlace} scrollTo={scrollTo} reach={reach} />;
}

function Tools({ palette, on, onPlace, scrollTo, reach }: { palette: Palette; on: boolean; onPlace: () => void; scrollTo?: (y: number) => void; reach: number }) {
  const [place] = prayerPlace.use();
  const [qiblaY, setQiblaY] = useState(0);
  const asks = useSyncExternalStore(subscribeQiblaAsks, readQiblaAsks);
  useEffect(() => {
    if (!place) takeQiblaAsk();
    else if (qiblaY && takeQiblaAsk()) scrollTo?.(qiblaY - 8);
  }, [asks, place, qiblaY, scrollTo]);
  const reached = qiblaY > 0 && qiblaY + 80 <= reach;
  return (
    <View style={{ gap: 16 }}>
      <Today palette={palette} />
      {!place ? <FirstUse palette={palette} onPick={onPlace} /> : (
        <>
          <Times place={place} palette={palette} onPlace={onPlace} />
          <View onLayout={event => setQiblaY(event.nativeEvent.layout.y)}>
            <Card palette={palette} pad={[18, 14]}>
              <Qibla place={place} palette={palette} on={on && reached} />
              <Text style={{ color: palette.muted, fontSize: 13, borderTopWidth: 1, borderColor: `${palette.rule}55`, paddingTop: 8, marginTop: 12 }}>القبلة على الدائرة العظمى من {place.name} إلى الكعبة</Text>
            </Card>
          </View>
        </>
      )}
      <Month palette={palette} />
    </View>
  );
}

function FirstUse({ palette, onPick }: { palette: Palette; onPick: () => void }) {
  const [busy, setBusy] = useState(false);
  const here = async () => {
    setBusy(true);
    const place = await locate();
    setBusy(false);
    if (place) prayerPlace.set(place); else onPick();
  };
  return (
    <View style={{ alignItems: 'center', gap: 14, paddingVertical: 24 }}>
      <MapPin size={40} color={palette.accent} strokeWidth={1.5} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Wide Icon={LocateFixed} label="موقعي الحالي" onPress={here} palette={palette} primary disabled={busy} />
        <Wide Icon={List} label="اختر مدينة" onPress={onPick} palette={palette} />
      </View>
    </View>
  );
}

function Wide({ Icon, label, onPress, palette, primary, disabled }: { Icon: (props: LucideProps) => React.ReactNode; label: string; onPress: () => void; palette: Palette; primary?: boolean; disabled?: boolean }) {
  const color = primary ? palette.onAccent : palette.ink;
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: primary ? palette.accent : palette.rule, backgroundColor: primary ? palette.accent : 'transparent', opacity: disabled ? 0.6 : pressed ? 0.7 : 1 })}>
      <Icon size={18} color={color} />
      <Text style={{ color, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

function PlaceChip({ place, palette, onPress }: { place: Place; palette: Palette; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`المكان: ${place.name}`} hitSlop={4}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, opacity: pressed ? 0.7 : 1 })}>
      {place.name === MY_LOCATION ? <LocateFixed size={18} color={palette.accent} /> : <MapPin size={18} color={palette.accent} />}
      <Text style={{ color: palette.ink, fontSize: 17 }}>{place.name}</Text>
      <ChevronLeft size={16} color={palette.muted} />
    </Pressable>
  );
}

function Times({ place, palette, onPlace }: { place: Place; palette: Palette; onPlace: () => void }) {
  const now = useMinute();
  const [settings, setSettings] = prayerSettings.use();
  const [open, setOpen] = useState(false);
  const [methods, setMethods] = useState(false);
  const dayKey = now.toDateString();
  const times = useMemo(() => timesFor(place, now, settings), [place, settings, dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const tomorrow = useMemo(() => timesFor(place, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12), settings), [place, settings, dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = nextPrayer(times, now);
  const nextAt = next ? times[next] : tomorrow.fajr;
  const left = Math.ceil((nextAt.getTime() - now.getTime()) / 60_000);
  const method = METHODS.find(item => item.id === settings.method)!;
  const [alerts, setAlerts] = adhanAlerts.use();
  const [view, setView] = prayerView.use();
  const upcoming = { key: next ?? 'fajr', at: nextAt, left } as const;
  const back = useForeground();
  const [blocked, setBlocked] = useAlertsBlocked(ALERTS_SUPPORTED && anyAlert(alerts), [alerts, dayKey, back]);
  const toggle = async (key: PrayerKey) => {
    buzz();
    if (alerts[key]) { setAlerts({ ...adhanAlerts.get(), [key]: false }); return; }
    const ok = await allowAlerts();
    setBlocked(!ok);
    if (ok) setAlerts({ ...adhanAlerts.get(), [key]: true });
  };
  const bell = (key: PrayerKey) => ALERTS_SUPPORTED
    ? <BellButton on={!!alerts[key]} color={alerts[key] ? palette.accent : palette.muted} name={PRAYER_NAMES[key]} sunrise={key === 'sunrise'} onPress={() => toggle(key)} />
    : null;
  return (
    <>
      <Card palette={palette} pad={[14, 18]} gap={12}>
        <Tabs options={DAY_VIEWS} value={view} onChange={setView} label="شكل الأوقات" palette={palette} />
        {view === 'dial' ? (
          <>
            <DayDial times={times} now={now} next={upcoming} palette={palette} />
            <TimeCells times={times} next={upcoming} palette={palette} bell={bell} />
          </>
        ) : <DayLine times={times} now={now} next={upcoming} palette={palette} bell={bell} />}
        <TapRow onPress={() => setOpen(true)} label={`المكان وطريقة الحساب: ${place.name}، ${method.label}`} style={{ alignItems: 'center', gap: 6, borderTopWidth: 1, borderColor: `${palette.rule}55`, paddingTop: 8 }}>
          {place.name === MY_LOCATION ? <LocateFixed size={16} color={palette.muted} /> : <MapPin size={16} color={palette.muted} />}
          <Text numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: 14 }}>{place.name} · الحساب: {method.label} · العصر: {settings.hanafi ? 'الحنفي' : 'الجمهور'}</Text>
          <ChevronLeft size={16} color={palette.muted} />
        </TapRow>
      </Card>
      {blocked && (
        <Tap onPress={openPhoneSettings} accessibilityRole="button" accessibilityLabel="التنبيهات موقوفة، افتح إعدادات الجوال"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}>
          <BellOff size={16} color={palette.muted} />
          <Text style={{ color: palette.muted, fontSize: 15 }}>التنبيهات موقوفة، فاسمح بها من إعدادات الجوال</Text>
        </Tap>
      )}
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 20, gap: 8 }}>
          <Text style={{ color: palette.muted, fontSize: 14 }}>المكان</Text>
          <PlaceChip place={place} palette={palette} onPress={() => { setOpen(false); onPlace(); }} />
          <Text style={{ color: palette.muted, fontSize: 14, marginTop: 6 }}>طريقة الحساب</Text>
          <Pressable onPress={() => { setOpen(false); setMethods(true); }} accessibilityRole="button" accessibilityLabel={`طريقة الحساب: ${method.label}`}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, minHeight: 44, backgroundColor: palette.paper, opacity: pressed ? 0.7 : 1 })}>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 16 }}>{method.label}</Text>
            <ChevronDown size={18} color={palette.muted} />
          </Pressable>
          <Text style={{ color: palette.muted, fontSize: 14, marginTop: 6 }}>العصر</Text>
          <View accessibilityRole="radiogroup" accessibilityLabel="العصر" style={{ flexDirection: 'row', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, padding: 2, gap: 2 }}>
            {([[false, 'الجمهور'], [true, 'الحنفي']] as const).map(([hanafi, label]) => {
              const on = settings.hanafi === hanafi;
              return (
                <Pressable key={label} onPress={() => setSettings({ ...settings, hanafi })} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={label}
                  style={{ flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: 8, backgroundColor: on ? palette.accent : 'transparent' }}>
                  <Text style={{ color: on ? palette.onAccent : palette.ink, fontSize: 16 }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Sheet>
      <Sheet open={methods} onClose={() => setMethods(false)} palette={palette}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {METHODS.map(item => (
            <Radio key={item.id} label={item.label} on={item.id === settings.method} palette={palette}
              onPress={() => { setSettings({ ...settings, method: item.id }); setMethods(false); }} />
          ))}
        </ScrollView>
      </Sheet>
    </>
  );
}

const BELL = 20;

function BellButton({ on, color, name, sunrise = false, onPress }: { on: boolean; color: string; name: string; sunrise?: boolean; onPress: () => void }) {
  const Icon = on ? Bell : BellOff;
  return (
    <Pressable onPress={onPress} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={sunrise ? `تنبيه ${name}` : `تنبيه أذان ${name}`} hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      <Icon size={BELL} color={color} strokeWidth={on ? 2 : 1.6} />
    </Pressable>
  );
}

function Radio({ label, on, onPress, palette }: { label: string; on: boolean; onPress: () => void; palette: Palette }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={label}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 1, borderColor: palette.paperDeep, backgroundColor: on ? palette.paperDeep : pressed ? `${palette.paperDeep}88` : 'transparent' })}>
      <Text style={{ flex: 1, color: palette.ink, fontSize: 17 }}>{label}</Text>
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: on ? 5 : 1.5, borderColor: on ? palette.accent : palette.rule }} />
    </Pressable>
  );
}

export function PlaceSheet({ open, onClose, palette }: { open: boolean; onClose: () => void; palette: Palette }) {
  const [place] = prayerPlace.use();
  const [query, setQuery] = useState('');
  const [refused, setRefused] = useState(false);
  const [busy, setBusy] = useState(false);
  const shown = useMemo(() => searchPlaces(query), [query]);
  useEffect(() => { if (!open) { setQuery(''); setRefused(false); } }, [open]);
  const here = async () => {
    setBusy(true);
    const found = await locate();
    setBusy(false);
    if (found) { prayerPlace.set(found); onClose(); } else setRefused(true);
  };
  return (
    <Sheet open={open} onClose={onClose} palette={palette} tall>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}>
        <Wide Icon={LocateFixed} label="موقعي الحالي" onPress={here} palette={palette} primary disabled={busy} />
        {refused && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'center' }}>تعذّر معرفة الموقع، فاختر مدينة.</Text>}
        <SearchField value={query} onChangeText={setQuery} placeholder="ابحث عن مدينة" label="ابحث عن مدينة" palette={palette} />
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, borderRadius: 10 }}>
          {shown.map(city => (
            <Radio key={city.name} label={city.name} on={place?.name === city.name} palette={palette} onPress={() => { prayerPlace.set(city); onClose(); }} />
          ))}
          {!shown.length && <Empty text="لا توجد نتيجة مطابقة." palette={palette} />}
        </ScrollView>
      </View>
    </Sheet>
  );
}

const KAABA = '#1d1b19';

function Qibla({ place, palette, on }: { place: Place; palette: Palette; on: boolean }) {
  const bearing = useMemo(() => qiblaFor(place), [place]);
  const heading = useHeading(on);
  const live = typeof heading === 'number';
  const turn = live ? turnTo(heading, bearing) : null;
  const facing = turn !== null && Math.abs(turn) <= FACING;
  const was = useRef(false);
  useEffect(() => { if (facing && !was.current) buzz(); was.current = facing; }, [facing]);
  const spin = live ? -heading : 0;
  const tone = facing ? palette.green : palette.accent;
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const [width, setWidth] = useState(0);
  const DIAL = Math.min(width, 360);
  const R = DIAL / 2 - 10;
  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={{ alignItems: 'center', gap: 14 }}>
      {DIAL > 0 && <Svg width={DIAL} height={DIAL} viewBox={`${-DIAL / 2} ${-DIAL / 2} ${DIAL} ${DIAL}`} accessible accessibilityRole="image" accessibilityLabel={qiblaLabel(bearing, turn)}>
        <G rotation={spin}>
          <Circle r={R} fill={palette.card} stroke={palette.rule} strokeWidth={1.5} />
          {ticks.map(deg => {
            const long = deg % 90 === 0 ? 14 : deg % 10 === 0 ? 8 : 4;
            const a = (deg * Math.PI) / 180;
            return <Line key={deg} x1={Math.sin(a) * (R - 8)} y1={-Math.cos(a) * (R - 8)} x2={Math.sin(a) * (R - 8 - long)} y2={-Math.cos(a) * (R - 8 - long)} stroke={palette.rule} strokeWidth={deg % 90 === 0 ? 2 : 1} />;
          })}
          <SvgText x={0} y={-(R - 38)} fontSize={18} fill={palette.muted} textAnchor="middle" fontFamily="Amiri">ش</SvgText>
          <G rotation={bearing}>
            <Line x1={0} y1={18} x2={0} y2={-(R - 46)} stroke={tone} strokeWidth={5} strokeLinecap="round" />
            <Polygon points={`0,${-(R - 26)} -13,${-(R - 50)} 13,${-(R - 50)}`} fill={tone} />
            <Rect x={-12} y={-(R + 2)} width={24} height={22} rx={3} fill={KAABA} stroke={palette.rule} strokeWidth={1} />
            <Rect x={-12} y={-(R + 2) + 6} width={24} height={3} fill="#c9a24a" />
          </G>
          <Circle r={7} fill={tone} />
        </G>
      </Svg>}
      <Text style={{ color: palette.ink, fontSize: 21 }}>{qiblaLabel(bearing, null)}</Text>
      {facing && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Check size={18} color={palette.green} />
          <Text style={{ color: palette.green, fontSize: 18 }}>أنت متجه إلى القبلة</Text>
        </View>
      )}
      {heading === 'denied'
        ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center' }}>تعمل البوصلة بإذن الموقع، فاسمح به من إعدادات الجوال.</Text>
        : heading === 'none'
        ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center' }}>لا بوصلة في هذا الجهاز، فالشمال في أعلى الدائرة.</Text>
        : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 16 }}>
            <InfinityIcon size={18} color={palette.muted} />
            <Text style={{ color: palette.muted, fontSize: 15 }}>إن اضطربت البوصلة فحرّك الجوال على شكل ∞</Text>
          </View>
        )}
    </View>
  );
}

const WEEK = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

function Today({ palette }: { palette: Palette }) {
  const now = useMinute();
  const dayKey = now.toDateString();
  const date = useMemo(() => hijriDate(now), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const gregorian = new Intl.DateTimeFormat('ar-EG-u-ca-gregory-nu-arab', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}>
          {date && <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22 }}>{date}</Text>}
          <Text style={{ color: palette.muted, fontSize: 15 }}>{gregorian}</Text>
        </View>
      </View>
    </View>
  );
}

function Month({ palette }: { palette: Palette }) {
  const now = useMinute();
  const [open, setOpen] = useState(false);
  const dayKey = now.toDateString();
  const month = useMemo(() => hijriMonth(now, 0), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const juz = useMemo(() => todaysJuz(now), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!month) return null;
  const today = month.days.find(day => day.today)?.day ?? 0;
  return (
    <Card palette={palette} pad={[12, 14]} gap={10}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 18 }}>{month.title}</Text>
        <IconButton Icon={CalendarDays} label="التقويم الهجري" onPress={() => setOpen(true)} tone="ink" />
      </View>
      <MonthMoons days={month.days.length} today={today} palette={palette} />
      {juz && <View style={{ alignItems: 'center' }}><Button Icon={FEATURE_ICON.mushaf} label={`اقرأ جزء اليوم: ${juzLabel(juz)}`} onPress={() => openJuz(juz[0])} /></View>}
      <Text style={{ color: palette.muted, fontSize: 13, borderTopWidth: 1, borderColor: `${palette.rule}55`, paddingTop: 8 }}>تقويم أم القرى</Text>
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}><Calendar palette={palette} /></View>
      </Sheet>
    </Card>
  );
}

function Calendar({ palette }: { palette: Palette }) {
  const now = useMinute();
  const [offset, setOffset] = useState(0);
  const dayKey = now.toDateString();
  const month = useMemo(() => hijriMonth(now, offset), [dayKey, offset]); // eslint-disable-line react-hooks/exhaustive-deps
  const juz = useMemo(() => todaysJuz(now), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!month) return <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 40 }}>لا يدعم هذا الجهاز التقويم الهجري.</Text>;
  const cells: (typeof month.days[number] | null)[] = [...Array(month.lead).fill(null), ...month.days];
  const arrow = (Icon: (props: LucideProps) => React.ReactNode, step: number, label: string) => (
    <IconButton Icon={Icon} label={label} onPress={() => setOffset(offset + step)} tone="ink" />
  );
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {arrow(ChevronRight, -1, 'الشهر السابق')}
        <Pressable onPress={() => setOffset(0)} disabled={!offset} accessibilityRole="button" accessibilityLabel={offset ? 'عودة إلى الشهر الحالي' : month.title} style={{ alignItems: 'center' }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 19, fontWeight: '700' }}>{month.title}</Text>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{month.gregorian}</Text>
        </Pressable>
        {arrow(ChevronLeft, 1, 'الشهر التالي')}
      </View>
      {juz && <View style={{ alignItems: 'center' }}><Button Icon={FEATURE_ICON.mushaf} label={`اقرأ جزء اليوم: ${juzLabel(juz)}`} onPress={() => openJuz(juz[0])} /></View>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 6 }}>
        {WEEK.map(day => <Text key={day} style={{ width: `${100 / 7}%`, color: palette.muted, fontSize: 14, textAlign: 'center' }}>{day}</Text>)}
        {cells.map((cell, i) => (
          <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
            {cell && (
              <View accessible accessibilityState={{ selected: cell.today }} accessibilityLabel={`${dayDigits(cell.day)}، ${cell.gregorian.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}`}
                style={{ alignItems: 'center', minWidth: 40, paddingVertical: 3, borderRadius: 10, backgroundColor: cell.today ? palette.accent : 'transparent' }}>
                <Text style={{ color: cell.today ? palette.onAccent : palette.ink, fontSize: 18, lineHeight: 26 }}>{dayDigits(cell.day)}</Text>
                <Text style={{ color: cell.today ? palette.onAccent : palette.muted, fontSize: 11, lineHeight: 14 }}>{dayDigits(cell.gregorian.getDate())}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
