import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Bell, BellOff, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Compass, Infinity as InfinityIcon, List, LocateFixed, MapPin, Search, type LucideProps } from 'lucide-react-native';
import { Text, TextInput } from '@/ui/Text';
import Sheet from '@/ui/Sheet';
import { hijriDate } from '@shared/hijri';
import { ALL, clock, dayDigits, FACING, hijriMonth, METHODS, MY_LOCATION, nextPrayer, PRAYER_NAMES, qiblaLabel, searchPlaces, turnTo, type Place, type PrayerKey } from '@shared/prayer';
import { locate, qiblaFor, timesFor, useHeading, useMinute } from '@/lib/prayer';
import { adhanAlerts, prayerPlace, prayerSettings, utilityView, type UtilityView } from '@/lib/settings';
import { buzz } from '@/lib/haptics';
import { ALERTS_SUPPORTED, allowAlerts, alertsAllowed, openPhoneSettings, useForeground } from '@/lib/adhan';
import { anyAlert } from '@shared/adhanAlerts';
import { type Palette, CARD } from '@/lib/theme';

const VIEWS: { id: UtilityView; Icon: (props: LucideProps) => React.ReactNode; label: string }[] = [
  { id: 'times', Icon: Clock, label: 'مواقيت الصلاة' },
  { id: 'qibla', Icon: Compass, label: 'القبلة' },
  { id: 'calendar', Icon: CalendarDays, label: 'التقويم الهجري' },
];

/**
 * The three icons at the top of the utilities tab. The highlight slides with the pages under it:
 * `progress` is the pager's place, 0 on the first page and 1 on the second (owner, 2026-11-15).
 */
export function UtilityPicker({ palette, progress }: { palette: Palette; progress?: Animated.Value }) {
  const [view, setView] = utilityView.use();
  const [spots, setSpots] = useState<{ x: number; width: number }[]>([]);
  // The icon under most of the highlight is drawn light, so it stays readable while the highlight moves.
  const [lit, setLit] = useState(() => Math.max(0, VIEWS.findIndex(item => item.id === view)));
  useEffect(() => {
    if (!progress) { setLit(Math.max(0, VIEWS.findIndex(item => item.id === view))); return; }
    const id = progress.addListener(({ value }) => setLit(Math.round(value)));
    return () => progress.removeListener(id);
  }, [progress, view]);
  const measured = spots.length === VIEWS.length && spots.every(Boolean);
  const steps = VIEWS.map((_, i) => i);
  // Laid out left to right with the order reversed, so the first sits on the right and the highlight's left is the screen's left in either layout direction.
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

/** One utility's page: prayer times, the qibla or the Hijri calendar. `on` runs the compass only while its page is on screen. */
export function UtilityPage({ view, palette, on = true, onPlace }: { view: UtilityView; palette: Palette; on?: boolean; onPlace: () => void }) {
  const [place] = prayerPlace.use();
  return view === 'calendar' ? <Calendar palette={palette} />
    : !place ? <FirstUse palette={palette} onPick={onPlace} />
    : view === 'times' ? <Times place={place} palette={palette} onPlace={onPlace} />
    : <Qibla place={place} palette={palette} on={on} onPlace={onPlace} />;
}

/** Before any place is known: the two ways to give one. Location is asked for only on a tap. */
function FirstUse({ palette, onPick }: { palette: Palette; onPick: () => void }) {
  const [busy, setBusy] = useState(false);
  const here = async () => {
    setBusy(true);
    const place = await locate();
    setBusy(false);
    if (place) prayerPlace.set(place); else onPick();
  };
  return (
    <View style={{ alignItems: 'center', gap: 14, paddingVertical: 40 }}>
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

/** The place, as a chip that opens the place sheet. */
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
  const [methods, setMethods] = useState(false);
  const dayKey = now.toDateString();
  const times = useMemo(() => timesFor(place, now, settings), [place, settings, dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const date = useMemo(() => hijriDate(now), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = nextPrayer(times, now);
  const method = METHODS.find(item => item.id === settings.method)!;
  const [alerts, setAlerts] = adhanAlerts.use();
  // Switched on but the phone blocks notifications: say so under the card.
  const [blocked, setBlocked] = useState(false);
  const back = useForeground();
  useEffect(() => {
    if (!ALERTS_SUPPORTED || !anyAlert(alerts)) { setBlocked(false); return; }
    let gone = false;
    alertsAllowed().then(ok => { if (!gone) setBlocked(!ok); });
    return () => { gone = true; };
  }, [alerts, dayKey, back]);
  const toggle = async (key: Exclude<PrayerKey, 'sunrise'>) => {
    buzz();
    if (alerts[key]) { setAlerts({ ...adhanAlerts.get(), [key]: false }); return; }
    // The permission is asked for only here, the first time a prayer is switched on.
    const ok = await allowAlerts();
    setBlocked(!ok);
    if (ok) setAlerts({ ...adhanAlerts.get(), [key]: true });
  };
  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <PlaceChip place={place} palette={palette} onPress={onPlace} />
        {date && <Text style={{ color: palette.ink, fontSize: 15 }}>{date}</Text>}
      </View>
      <View style={{ borderWidth: 1, borderColor: palette.rule, ...CARD, backgroundColor: palette.card, padding: 6 }}>
        {ALL.map((key, i) => {
          const on = key === next;
          const faint = key === 'sunrise';
          const color = on ? palette.onAccent : faint ? palette.muted : palette.ink;
          return (
            <View key={key}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: faint ? 8 : 11, borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent', borderTopWidth: i && !on && ALL[i - 1] !== next ? 1 : 0, borderColor: `${palette.rule}55` }}>
              {ALERTS_SUPPORTED && (key === 'sunrise'
                ? <View style={{ width: BELL }} />
                : <BellButton on={alerts[key]} color={on ? palette.onAccent : alerts[key] ? palette.accent : palette.muted} name={PRAYER_NAMES[key]} onPress={() => toggle(key)} />)}
              <View accessible accessibilityState={{ selected: on }} accessibilityLabel={`${PRAYER_NAMES[key]} ${clock(times[key], true)}${on ? '، التالية' : ''}`}
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color, fontSize: faint ? 16 : 20 }}>{PRAYER_NAMES[key]}</Text>
                <Text style={{ color, fontSize: faint ? 16 : 20 }}>{clock(times[key], true)}</Text>
              </View>
            </View>
          );
        })}
      </View>
      {blocked && (
        <Pressable onPress={openPhoneSettings} accessibilityRole="button" accessibilityLabel="التنبيهات موقوفة، افتح إعدادات الجوال"
          style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingVertical: 4, opacity: pressed ? 0.7 : 1 })}>
          <BellOff size={16} color={palette.muted} />
          <Text style={{ color: palette.muted, fontSize: 15 }}>التنبيهات موقوفة، فاسمح بها من إعدادات الجوال</Text>
        </Pressable>
      )}
      <View style={{ gap: 6 }}>
        <Text style={{ color: palette.muted, fontSize: 14 }}>طريقة الحساب</Text>
        <Pressable onPress={() => setMethods(true)} accessibilityRole="button" accessibilityLabel={`طريقة الحساب: ${method.label}`}
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

/** The adhan switch on a prayer's row: a bell when it rings, a struck bell when it doesn't. */
function BellButton({ on, color, name, onPress }: { on: boolean; color: string; name: string; onPress: () => void }) {
  const Icon = on ? Bell : BellOff;
  return (
    <Pressable onPress={onPress} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={`تنبيه أذان ${name}`} hitSlop={12}
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

/** Where the times are for: the phone's place, or a city from the list. */
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 10, backgroundColor: palette.paper }}>
          <Search size={18} color={palette.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن مدينة" placeholderTextColor={palette.muted} accessibilityLabel="ابحث عن مدينة"
            style={{ flex: 1, height: 42, color: palette.ink, fontSize: 16, textAlign: 'right' }} />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1, borderWidth: 1, borderColor: palette.rule, borderRadius: 10 }}>
          {shown.map(city => (
            <Radio key={city.name} label={city.name} on={place?.name === city.name} palette={palette} onPress={() => { prayerPlace.set(city); onClose(); }} />
          ))}
          {!shown.length && <Text style={{ padding: 16, color: palette.muted, fontSize: 15, textAlign: 'center' }}>لا توجد نتيجة مطابقة.</Text>}
        </ScrollView>
      </View>
    </Sheet>
  );
}

const DIAL = 280;
/** The Kaaba's black cloth and gold band, the same in both themes. */
const KAABA = '#1d1b19';
const R = DIAL / 2 - 10;

/** The qibla: a dial that turns with the phone, north marked «ش», and the Kaaba on the qibla's bearing. */
function Qibla({ place, palette, on, onPlace }: { place: Place; palette: Palette; on: boolean; onPlace: () => void }) {
  const bearing = useMemo(() => qiblaFor(place), [place]);
  const heading = useHeading(on);
  const live = typeof heading === 'number';
  const turn = live ? turnTo(heading, bearing) : null;
  const facing = turn !== null && Math.abs(turn) <= FACING;
  const was = useRef(false);
  useEffect(() => { if (facing && !was.current) buzz(); was.current = facing; }, [facing]);
  // Without a compass the dial stays north up, so the arrow still shows the direction against a map.
  const spin = live ? -heading : 0;
  const tone = facing ? palette.green : palette.accent;
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <View style={{ alignItems: 'center', gap: 14 }}>
      <View style={{ alignSelf: 'stretch' }}><PlaceChip place={place} palette={palette} onPress={onPlace} /></View>
      <Svg width={DIAL} height={DIAL} viewBox={`${-DIAL / 2} ${-DIAL / 2} ${DIAL} ${DIAL}`} accessible accessibilityRole="image" accessibilityLabel={qiblaLabel(bearing, turn)}>
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
      </Svg>
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

/** The Hijri month, Saturday first, with the Gregorian day under each day. */
function Calendar({ palette }: { palette: Palette }) {
  const now = useMinute();
  const [offset, setOffset] = useState(0);
  const dayKey = now.toDateString();
  const month = useMemo(() => hijriMonth(now, offset), [dayKey, offset]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!month) return <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 40 }}>لا يدعم هذا الجهاز التقويم الهجري.</Text>;
  const cells: (typeof month.days[number] | null)[] = [...Array(month.lead).fill(null), ...month.days];
  const arrow = (Icon: (props: LucideProps) => React.ReactNode, step: number, label: string) => (
    <Pressable onPress={() => setOffset(offset + step)} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={{ padding: 8 }}>
      <Icon size={22} color={palette.ink} />
    </Pressable>
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
