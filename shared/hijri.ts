import { num } from './quran/arabicNumber';
export function hijriDate(date: Date): string | null {
  try {
    const format = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!format.resolvedOptions().calendar.startsWith('islamic')) return null;
    return format.format(date);
  } catch {
    return null;
  }
}

export function hijriDay(date: Date): number | null {
  try {
    const format = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric' });
    if (!format.resolvedOptions().calendar.startsWith('islamic')) return null;
    const day = Number(format.formatToParts(date).find(part => part.type === 'day')?.value);
    return day >= 1 && day <= 30 ? day : null;
  } catch {
    return null;
  }
}

export function todaysJuz(date: Date): number[] | null {
  const day = hijriDay(date);
  if (!day) return null;
  const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12);
  return day === 29 && hijriDay(tomorrow) === 1 ? [29, 30] : [day];
}

export const juzLabel = (juz: number[]) => (juz.length > 1 ? `الجزءان ${num(juz[0])} و${num(juz[1])}` : `الجزء ${num(juz[0])}`);
