import { num } from './arabicNumber';

// see docs/audits/2026-11-17-audio-playback.md
export type Reciter = { id: number; name: string; style?: string; base: string };

const VERSES = 'https://verses.quran.com/';
const MIRROR = 'https://mirrors.quranicaudio.com/everyayah/';

export const RECITERS: Reciter[] = [
  { id: 7, name: 'مشاري راشد العفاسي', base: `${VERSES}Alafasy/mp3/` },
  { id: 6, name: 'محمود خليل الحصري', base: `${MIRROR}Husary_64kbps/` },
  { id: 12, name: 'محمود خليل الحصري', style: 'المعلّم', base: `${MIRROR}Husary_Muallim_128kbps/` },
  { id: 9, name: 'محمد صديق المنشاوي', style: 'مرتّل', base: `${VERSES}Minshawi/Murattal/mp3/` },
  { id: 8, name: 'محمد صديق المنشاوي', style: 'مجوّد', base: `${VERSES}Minshawi/Mujawwad/mp3/` },
  { id: 2, name: 'عبد الباسط عبد الصمد', style: 'مرتّل', base: `${VERSES}AbdulBaset/Murattal/mp3/` },
  { id: 1, name: 'عبد الباسط عبد الصمد', style: 'مجوّد', base: `${VERSES}AbdulBaset/Mujawwad/mp3/` },
  { id: 3, name: 'عبد الرحمن السديس', base: `${VERSES}Sudais/mp3/` },
  { id: 10, name: 'سعود الشريم', base: `${VERSES}Shuraym/mp3/` },
  { id: 4, name: 'أبو بكر الشاطري', base: `${VERSES}Shatri/mp3/` },
  { id: 5, name: 'هاني الرفاعي', base: `${VERSES}Rifai/mp3/` },
  { id: 11, name: 'محمد الطبلاوي', base: `${MIRROR}Mohammad_al_Tablaway_128kbps/` },
];
export const DEFAULT_RECITER = 7;
export const RIWAYA = 'حفص عن عاصم';

export const reciterOf = (id: number) => RECITERS.find(reciter => reciter.id === id) ?? RECITERS[0];
export const reciterName = (reciter: Reciter) => (reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name);

const three = (n: number) => String(n).padStart(3, '0');
export const ayahFile = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${three(surah)}${three(ayah)}.mp3`; };
export const ayahAudioUrl = (reciter: Reciter, key: string) => reciter.base + ayahFile(key);

export type Pause = 'none' | 'ayah' | 5 | 10;
export type RepeatPlan = { eachAyah: number; rangeTimes: number; pause: Pause; speed: number };
export const ONCE: RepeatPlan = { eachAyah: 1, rangeTimes: 1, pause: 'none', speed: 1 };
export const EACH_AYAH = [1, 3, 5, 10, 20, 0];
export const RANGE_TIMES = [1, 3, 5, 0];
export const PAUSES: Pause[] = ['none', 'ayah', 5, 10];
export const SPEEDS = [0.75, 1, 1.25];

const count = (value: unknown, choices: number[]) => typeof value === 'number' && choices.includes(value);
export const isRepeatPlan = (value: unknown): value is RepeatPlan => {
  const plan = value as RepeatPlan;
  return !!plan && typeof plan === 'object' && count(plan.eachAyah, EACH_AYAH) && count(plan.rangeTimes, RANGE_TIMES)
    && PAUSES.includes(plan.pause) && count(plan.speed, SPEEDS);
};

export type Range = { from: string; to: string };
export type Counts = ReadonlyMap<number, number>;

const parts = (key: string) => key.split(':').map(Number) as [number, number];
export const compareAyat = (a: string, b: string) => { const [sa, aa] = parts(a); const [sb, ab] = parts(b); return sa - sb || aa - ab; };

export function ayatOf(range: Range, counts: Counts): string[] {
  const [from, to] = compareAyat(range.from, range.to) <= 0 ? [range.from, range.to] : [range.to, range.from];
  const [toSurah, toAyah] = parts(to);
  let [surah, ayah] = parts(from);
  const keys: string[] = [];
  while (surah < toSurah || (surah === toSurah && ayah <= toAyah)) {
    if (ayah > (counts.get(surah) ?? 0)) { surah += 1; ayah = 1; continue; }
    keys.push(`${surah}:${ayah}`);
    ayah += 1;
  }
  return keys;
}

export const surahEnd = (key: string, counts: Counts) => { const [surah] = parts(key); return `${surah}:${counts.get(surah) ?? 1}`; };

export type Step = { at: number; repeat: number; pass: number };
export const FIRST: Step = { at: 0, repeat: 0, pass: 0 };

export function nextStep(step: Step, length: number, plan: RepeatPlan): Step | null {
  if (plan.eachAyah === 0 || step.repeat + 1 < plan.eachAyah) return { ...step, repeat: step.repeat + 1 };
  if (step.at + 1 < length) return { at: step.at + 1, repeat: 0, pass: step.pass };
  if (plan.rangeTimes === 0 || step.pass + 1 < plan.rangeTimes) return { at: 0, repeat: 0, pass: step.pass + 1 };
  return null;
}

export const stepTo = (step: Step, by: 1 | -1, length: number): Step | null => {
  const at = step.at + by;
  return at < 0 || at >= length ? null : { at, repeat: 0, pass: step.pass };
};

export function pauseAfter(plan: RepeatPlan, heard: number, next: Step | null): number {
  if (!next || plan.pause === 'none') return 0;
  return plan.pause === 'ayah' ? Math.max(1, Math.round(heard / plan.speed)) : plan.pause;
}

export const timesLabel = (n: number) => (n === 0 ? '∞' : num(n));
export const speedLabel = (speed: number) => num(speed).replace('.', '٫');
export const pauseLabel = (pause: Pause) => (pause === 'none' ? 'بلا' : pause === 'ayah' ? 'بطول الآية' : `${num(pause)} ث`);
export const sizeLabel = (bytes: number) => (bytes >= 1e9 ? `${speedLabel(Math.round(bytes / 1e8) / 10)} ج.ب` : `${num(Math.max(1, Math.round(bytes / 1e6)))} م.ب`);

export const LISTEN_REFERENCE = {
  title: 'المصدر: مؤسسة القرآن (Quran Foundation)',
  quotes: [
    { text: 'QF Content is not sold, sublicensed, or redistributed, except as expressly permitted below.', cite: 'شروط المطورين §2.2', url: 'https://api-docs.quran.com/legal/developer-terms/' },
    { text: 'تلاوة كل آية من واجهة Quran.com البرمجية، تُسمع داخل التطبيق والموقع ولا تُنشر خارجهما.' },
  ],
};
