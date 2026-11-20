'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import * as adhan from 'adhan';
import { BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Compass, HandHeart, Infinity as InfinityIcon, List, LocateFixed, MapPin } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import { keyStore } from '@shared/storage';
import { hijriDate, juzLabel, todaysJuz } from '@shared/hijri';
import { JUZ_STARTS } from '@shared/quran/juz';
import { ayahHref } from '@shared/ayahMarks';
import Button from '@/components/common/Button';
import type { AyatPage } from '@/lib/storyAyat';
import { ADHKAR_OCCASIONS, type AdhkarOccasion } from '@shared/adhkar';
import Adhkar from './Adhkar';
import {
  ALL, clock, dayDigits, DEFAULT_PRAYER_SETTINGS, FACING, hijriMonth, isPlace, isPrayerSettings, METHODS, MY_LOCATION, nextPrayer,
  prayerDay, PRAYER_NAMES, qiblaBearing, qiblaLabel, searchPlaces, turnTo, type Adhan, type MethodId, type Place, type PrayerSettings,
} from '@shared/prayer';
import styles from './Utilities.module.css';
import Sheet from '@/components/common/Sheet';
import Card from '@/components/common/Card';
import { SearchField } from '@/components/common/Field';

const lib = adhan as unknown as Adhan;
type View = 'times' | 'qibla' | 'calendar' | 'adhkar';

const parse = <T,>(valid: (value: unknown) => value is T, fallback: T) => (raw: string | null): T => {
  try { const value: unknown = raw ? JSON.parse(raw) : null; return valid(value) ? value : fallback; } catch { return fallback; }
};
// The same keys as the app's settings (mobile/src/lib/settings.ts).
export const placeStore = keyStore<Place | null>('prayer-place', parse((value): value is Place | null => value === null || isPlace(value), null));
export const settingsStore = keyStore<PrayerSettings>('prayer-settings', parse(isPrayerSettings, DEFAULT_PRAYER_SETTINGS));
export const viewStore = keyStore<View>('utilities-view', parse((value): value is View => value === 'times' || value === 'qibla' || value === 'calendar' || value === 'adhkar', 'times'));

function useStore<T>(store: { read(): T; subscribe(listener: () => void): () => void; write(raw: string): void }, server: T) {
  const value = useSyncExternalStore(store.subscribe, store.read, () => server);
  return [value, (next: T) => store.write(JSON.stringify(next))] as const;
}

/** The browser's place, asked for only on a tap. Rounded to about a kilometre. */
function locate(): Promise<Place | null> {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      position => {
        const round = (value: number) => Math.round(value * 100) / 100;
        resolve({ name: MY_LOCATION, lat: round(position.coords.latitude), lng: round(position.coords.longitude) });
      },
      () => resolve(null),
      { maximumAge: 6 * 60 * 60 * 1000, timeout: 15000 },
    );
  });
}

/** The time now, moved on twice a minute so the shaded prayer and the day follow the clock. Null on the server. */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

const VIEWS: View[] = ['times', 'qibla', 'calendar', 'adhkar'];

/** A day's prayer times at `place` by the reader's settings (the times page's and the home prayer card's). */
export const prayerTimes = (place: Place, now: Date, settings: PrayerSettings) => prayerDay(lib, place, now, settings);
const noop = () => () => {};

/**
 * The four icons at the top, then prayer times, the qibla, the Hijri calendar and the adhkar side by side: the app's utilities tab.
 * A sideways swipe (or trackpad) follows the finger and snaps to the next one (owner, 2026-11-15); the icons jump to one.
 * In Arabic the first is on the right, so swiping right brings the next from the left, as in the app.
 */
export default function Utilities({ quran }: { /** The adhkar's Quran selections in the mushaf's lines, by card. */ quran: Record<string, AyatPage[][]> }) {
  const [view, setView] = useStore(viewStore, 'times');
  // A link may open one view (the home buttons, ?view=) or the adhkar on a card's tab (a search hit, adhkarHref). The
  // address goes back to plain /utilities after, so a reload opens the view last left, as every visit does.
  const [start, setStart] = useState<{ occasion: AdhkarOccasion; id?: string }>();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const asked = params.get('view');
    const occasion = params.get('adhkar') as AdhkarOccasion | null;
    if (occasion && ADHKAR_OCCASIONS.includes(occasion)) {
      setStart({ occasion, id: params.get('id') ?? undefined });
      viewStore.write(JSON.stringify('adhkar'));
    } else if (asked && (VIEWS as string[]).includes(asked)) viewStore.write(JSON.stringify(asked));
    else return;
    window.history.replaceState(null, '', '/utilities');
  }, []);
  const [place] = useStore(placeStore, null);
  const [picking, setPicking] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const pages = useRef(new Map<View, HTMLElement>());
  // The page the strip rests on, so a swipe that lands does not scroll it again.
  const shown = useRef<View | null>(null);
  // The saved view is known only after hydration; the first one after it jumps without a slide, a tap on an icon slides.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  useEffect(() => {
    const page = pages.current.get(view);
    const element = strip.current;
    if (!hydrated || !page || !element || shown.current === view) return;
    const smooth = shown.current !== null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    shown.current = view;
    element.scrollTo({ left: element.scrollLeft + page.getBoundingClientRect().left - element.getBoundingClientRect().left, behavior: smooth ? 'smooth' : 'auto' });
  }, [view, hydrated]);
  // The strip is as tall as the page on screen, so a short page has no blank space under it.
  useEffect(() => {
    const page = pages.current.get(view);
    const element = strip.current;
    if (!page || !element) return;
    const fit = () => { element.style.height = `${page.offsetHeight}px`; };
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(page);
    return () => watch.disconnect();
  }, [view]);
  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    let quiet: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      const middle = element.getBoundingClientRect().left + element.clientWidth / 2;
      let best: View | null = null;
      let gap = Infinity;
      pages.current.forEach((page, id) => {
        const box = page.getBoundingClientRect();
        const off = Math.abs(box.left + box.width / 2 - middle);
        if (off < gap) { gap = off; best = id; }
      });
      if (best && best !== shown.current && gap < element.clientWidth / 4) { shown.current = best; setView(best); }
    };
    // scrollend is not in every browser yet, so a quiet moment settles too.
    const scrolled = () => { clearTimeout(quiet); quiet = setTimeout(settle, 150); };
    element.addEventListener('scroll', scrolled, { passive: true });
    element.addEventListener('scrollend', settle);
    return () => { clearTimeout(quiet); element.removeEventListener('scroll', scrolled); element.removeEventListener('scrollend', settle); };
  }, [setView]);
  // The highlight on the icons follows the strip as it scrolls (owner, 2026-11-15), moved without a render.
  const picker = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(() => VIEWS.indexOf(view));
  useEffect(() => {
    const element = strip.current;
    const bar = picker.current;
    if (!element || !bar) return;
    const follow = () => {
      const buttons = [...bar.querySelectorAll<HTMLElement>('button')];
      const mark = bar.querySelector<HTMLElement>('[data-mark]');
      if (!mark || buttons.length !== VIEWS.length || !element.clientWidth) return;
      // In Arabic the strip scrolls from 0 towards the negative, so the size of the offset is the place.
      const place = Math.min(VIEWS.length - 1, Math.max(0, Math.abs(element.scrollLeft) / element.clientWidth));
      const from = Math.floor(place);
      const to = Math.min(from + 1, VIEWS.length - 1);
      const x = buttons[from].offsetLeft + (buttons[to].offsetLeft - buttons[from].offsetLeft) * (place - from);
      mark.style.width = `${buttons[from].offsetWidth}px`;
      mark.style.transform = `translateX(${x}px)`;
      mark.style.opacity = '1';
      // While a page slides in, the strip is as tall as the taller of the two, so the incoming one is not cut off.
      const heights = [VIEWS[from], VIEWS[place > from ? to : from]].map(id => pages.current.get(id)?.offsetHeight ?? 0);
      element.style.height = `${Math.max(...heights)}px`;
      setLit(Math.round(place));
    };
    follow();
    element.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', follow);
    return () => { element.removeEventListener('scroll', follow); window.removeEventListener('resize', follow); };
  }, []);
  const pick = () => setPicking(true);
  const options = ([['times', 'مواقيت الصلاة', <Clock key="t" aria-hidden />], ['qibla', 'القبلة', <Compass key="q" aria-hidden />], ['calendar', 'التقويم الهجري', <CalendarDays key="c" aria-hidden />], ['adhkar', 'الأذكار', <HandHeart key="a" aria-hidden />]] as const)
    .map(([key, label, icon]) => ({ key, label, icon }));
  return (
    <div className={styles.wrap} dir="rtl" lang="ar">
      <div ref={picker} role="group" aria-label="الأدوات" className={styles.picker}>
        <span data-mark aria-hidden className={styles.mark} />
        {options.map(({ key, label, icon }, i) => (
          <button key={key} type="button" aria-pressed={view === key} aria-label={label} title={label} onClick={() => setView(key)}
            className={`${styles.pick} ${lit === i ? styles.lit : ''}`}>{icon}</button>
        ))}
      </div>
      <div ref={strip} className={styles.strip} data-testid="utilities-strip">
        {VIEWS.map(id => (
          <section key={id} ref={node => { if (node) pages.current.set(id, node); else pages.current.delete(id); }} className={styles.page}
            aria-label={options.find(option => option.key === id)?.label} inert={id !== view}>
            {id === 'calendar' ? <Calendar />
              : id === 'adhkar' ? <Adhkar key={start ? 'asked' : 'plain'} quran={quran} on={view === 'adhkar'} start={start} />
              : !place ? <FirstUse onPick={pick} />
              : id === 'times' ? <Times place={place} onPlace={pick} />
              : <Qibla place={place} onPlace={pick} on={view === 'qibla'} />}
          </section>
        ))}
      </div>
      <PlaceSheet open={picking} onClose={() => setPicking(false)} />
    </div>
  );
}

function FirstUse({ onPick }: { onPick: () => void }) {
  const [busy, setBusy] = useState(false);
  const here = async () => {
    setBusy(true);
    const place = await locate();
    setBusy(false);
    if (place) placeStore.write(JSON.stringify(place)); else onPick();
  };
  return (
    <div className={styles.first}>
      <MapPin size={40} strokeWidth={1.5} aria-hidden />
      <div className={styles.buttons}>
        <button type="button" className={`${styles.wide} ${styles.primary}`} onClick={here} disabled={busy}><LocateFixed size={18} aria-hidden />موقعي الحالي</button>
        <button type="button" className={styles.wide} onClick={onPick}><List size={18} aria-hidden />اختر مدينة</button>
      </div>
    </div>
  );
}

function PlaceChip({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <button type="button" className={styles.chip} onClick={onPress} aria-label={`المكان: ${place.name}`}>
      {place.name === MY_LOCATION ? <LocateFixed size={18} aria-hidden /> : <MapPin size={18} aria-hidden />}
      {place.name}
      <ChevronLeft size={16} aria-hidden />
    </button>
  );
}

function Times({ place, onPlace }: { place: Place; onPlace: () => void }) {
  const now = useNow();
  const [settings, setSettings] = useStore(settingsStore, DEFAULT_PRAYER_SETTINGS);
  const dayKey = now?.toDateString();
  const times = useMemo(() => now && prayerDay(lib, place, now, settings), [place, settings, dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const date = useMemo(() => now && hijriDate(now), [dayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const next = times && now ? nextPrayer(times, now) : null;
  return (
    <>
      <div className={styles.row}>
        <PlaceChip place={place} onPress={onPlace} />
        {date && <span className={styles.date}>{date}</span>}
      </div>
      {times && (
        <Card className="p-1.5">
          {ALL.map(key => (
            <div key={key} className={`${styles.time} ${key === 'sunrise' ? styles.faint : ''} ${key === next ? styles.next : ''}`} aria-current={key === next ? 'time' : undefined}>
              <span>{PRAYER_NAMES[key]}</span><span>{clock(times[key], true)}</span>
            </div>
          ))}
        </Card>
      )}
      <div>
        <label className={styles.label} htmlFor="prayer-method">طريقة الحساب</label>
        <select id="prayer-method" className={styles.select} value={settings.method} onChange={event => setSettings({ ...settings, method: event.target.value as MethodId })}>
          {METHODS.map(method => <option key={method.id} value={method.id}>{method.label}</option>)}
        </select>
      </div>
      <div>
        <p className={styles.label}>العصر</p>
        <Segmented label="العصر" className="w-full [&>*]:flex-1"
          options={([[false, 'الجمهور'], [true, 'الحنفي']] as const).map(([hanafi, label]) => ({ key: label, label, current: settings.hanafi === hanafi, onClick: () => setSettings({ ...settings, hanafi }) }))} />
      </div>
    </>
  );
}

function PlaceSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [place] = useStore(placeStore, null);
  const [query, setQuery] = useState('');
  const [refused, setRefused] = useState(false);
  const [busy, setBusy] = useState(false);
  const shown = useMemo(() => searchPlaces(query), [query]);
  useEffect(() => { if (!open) { setQuery(''); setRefused(false); } }, [open]);
  const pick = (next: Place) => { placeStore.write(JSON.stringify(next)); onClose(); };
  const here = async () => {
    setBusy(true);
    const found = await locate();
    setBusy(false);
    if (found) pick(found); else setRefused(true);
  };
  return (
    <Sheet open={open} onClose={onClose} label="المكان" className="p-4">
      <div className={styles.sheetBody}>
        <button type="button" className={`${styles.wide} ${styles.primary}`} onClick={here} disabled={busy}><LocateFixed size={18} aria-hidden />موقعي الحالي</button>
        {refused && <p className={styles.note}>تعذّر معرفة الموقع، فاختر مدينة.</p>}
        <SearchField label="ابحث عن مدينة" placeholder="ابحث عن مدينة" value={query} onChangeText={setQuery} />
        <div className={styles.list}>
          {shown.map(city => (
            <button key={city.name} type="button" className={styles.city} aria-pressed={place?.name === city.name} onClick={() => pick(city)}>
              {city.name}<span className={styles.radio} aria-hidden />
            </button>
          ))}
          {!shown.length && <p className={styles.note} style={{ padding: '1rem' }}>لا توجد نتيجة مطابقة.</p>}
        </div>
      </div>
    </Sheet>
  );
}

type Heading = number | null | 'none' | 'ask';
type OrientationEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type AskablePermission = { requestPermission?: () => Promise<'granted' | 'denied'> };

/**
 * Where the phone points, from the browser's orientation events: Safari gives webkitCompassHeading after a tap allows it,
 * Chrome gives an absolute alpha. Both are magnetic north, a few degrees off true north in Egypt and Europe.
 * 'none' on a computer or a browser that never answers.
 */
/** The compass heading; it listens only while `on` (its page is on screen). */
function useHeading(on: boolean): [Heading, () => void] {
  const [heading, setHeading] = useState<Heading>(null);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    // A computer has no compass: say so at once instead of offering a button that does nothing.
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined' || !window.matchMedia('(pointer: coarse)').matches) { setHeading('none'); return; }
    const askable = (DeviceOrientationEvent as unknown as AskablePermission).requestPermission;
    if (askable && !allowed) { setHeading('ask'); return; }
    if (!on) return;
    let heard = false;
    const quiet = setTimeout(() => { if (!heard) setHeading('none'); }, 4000);
    const read = (event: Event) => {
      const orientation = event as OrientationEvent;
      let value: number | null = null;
      if (typeof orientation.webkitCompassHeading === 'number') value = orientation.webkitCompassHeading;
      else if ((orientation.absolute || event.type === 'deviceorientationabsolute') && orientation.alpha !== null) value = 360 - orientation.alpha;
      if (value === null) return;
      heard = true;
      const turned = typeof screen !== 'undefined' && screen.orientation ? screen.orientation.angle : 0;
      setHeading(((value + turned) % 360 + 360) % 360);
    };
    const kind = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(kind, read);
    return () => { clearTimeout(quiet); window.removeEventListener(kind, read); };
  }, [allowed, on]);
  const ask = () => {
    const askable = (DeviceOrientationEvent as unknown as AskablePermission).requestPermission;
    askable?.().then(answer => { if (answer === 'granted') { setHeading(null); setAllowed(true); } else setHeading('none'); }).catch(() => setHeading('none'));
  };
  return [heading, ask];
}

const DIAL = 280;
const R = DIAL / 2 - 10;
const KAABA = '#1d1b19';

function Qibla({ place, onPlace, on }: { place: Place; onPlace: () => void; on: boolean }) {
  const bearing = useMemo(() => qiblaBearing(lib, place), [place]);
  const [heading, ask] = useHeading(on);
  const live = typeof heading === 'number';
  const facing = live && Math.abs(turnTo(heading, bearing)) <= FACING;
  const tone = facing ? 'var(--home-green)' : 'var(--home-accent)';
  return (
    <div className={styles.qibla}>
      <PlaceChip place={place} onPress={onPlace} />
      <svg width={DIAL} height={DIAL} viewBox={`${-DIAL / 2} ${-DIAL / 2} ${DIAL} ${DIAL}`} role="img" aria-label={qiblaLabel(bearing, live ? turnTo(heading, bearing) : null)}>
        <g transform={`rotate(${live ? -heading : 0})`}>
          <circle r={R} fill="var(--home-card)" stroke="var(--home-rule)" strokeWidth={1.5} />
          {Array.from({ length: 72 }, (_, i) => i * 5).map(deg => {
            const long = deg % 90 === 0 ? 14 : deg % 10 === 0 ? 8 : 4;
            const a = (deg * Math.PI) / 180;
            return <line key={deg} x1={Math.sin(a) * (R - 8)} y1={-Math.cos(a) * (R - 8)} x2={Math.sin(a) * (R - 8 - long)} y2={-Math.cos(a) * (R - 8 - long)} stroke="var(--home-rule)" strokeWidth={deg % 90 === 0 ? 2 : 1} />;
          })}
          <text x={0} y={-(R - 38)} fontSize={18} fill="var(--home-muted)" textAnchor="middle">ش</text>
          <g transform={`rotate(${bearing})`}>
            <line x1={0} y1={18} x2={0} y2={-(R - 46)} stroke={tone} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`0,${-(R - 26)} -13,${-(R - 50)} 13,${-(R - 50)}`} fill={tone} />
            <rect x={-12} y={-(R + 2)} width={24} height={22} rx={3} fill={KAABA} stroke="var(--home-rule)" />
            <rect x={-12} y={-(R + 2) + 6} width={24} height={3} fill="#c9a24a" />
          </g>
          <circle r={7} fill={tone} />
        </g>
      </svg>
      {facing && <p className={styles.facing}><Check size={18} aria-hidden />أنت متجه إلى القبلة</p>}
      {heading === 'ask' && <button type="button" className={`${styles.wide} ${styles.primary}`} onClick={ask}><Compass size={18} aria-hidden />شغّل البوصلة</button>}
      {heading === 'none'
        ? <p className={styles.note}>لا بوصلة في هذا الجهاز، فالشمال في أعلى الدائرة.</p>
        : <p className={styles.hint}><InfinityIcon size={18} aria-hidden />إن اضطربت البوصلة فحرّك الجوال على شكل ∞</p>}
    </div>
  );
}

const WEEK = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];

function Calendar() {
  const now = useNow();
  const [offset, setOffset] = useState(0);
  const dayKey = now?.toDateString();
  const month = useMemo(() => now && hijriMonth(now, offset), [dayKey, offset]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!now) return null;
  if (!month) return <p className={styles.note}>لا يدعم هذا المتصفح التقويم الهجري.</p>;
  const juz = todaysJuz(now);
  return (
    <div className="grid gap-3">
      <div className={styles.monthHead}>
        <button type="button" className={styles.arrow} onClick={() => setOffset(offset - 1)} aria-label="الشهر السابق"><ChevronRight size={22} aria-hidden /></button>
        <div>
          <button type="button" className={styles.title} onClick={() => setOffset(0)} disabled={!offset} aria-label={offset ? 'عودة إلى الشهر الحالي' : undefined}>{month.title}</button>
          <p className={styles.sub}>{month.gregorian}</p>
        </div>
        <button type="button" className={styles.arrow} onClick={() => setOffset(offset + 1)} aria-label="الشهر التالي"><ChevronLeft size={22} aria-hidden /></button>
      </div>
      {/* Today's juz, which follows the Hijri day (the app's: its shortcut lives here and as a card on home). */}
      {juz && <div className="flex justify-center"><Button href={ayahHref(JUZ_STARTS[juz[0] - 1])}><BookOpen aria-hidden />{`اقرأ جزء اليوم: ${juzLabel(juz)}`}</Button></div>}
      <div className={styles.grid}>
        {WEEK.map(day => <span key={day} className={styles.week}>{day}</span>)}
        {Array.from({ length: month.lead }, (_, i) => <span key={`lead-${i}`} />)}
        {month.days.map(day => (
          <span key={day.day} className={`${styles.day} ${day.today ? styles.today : ''}`} aria-current={day.today ? 'date' : undefined}>
            <b aria-hidden>{dayDigits(day.day)}</b><small aria-hidden>{dayDigits(day.gregorian.getDate())}</small>
            <span className="sr-only">{`${dayDigits(day.day)}، ${day.gregorian.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}`}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
