/**
 * Today's date in the Umm al-Qura Hijri calendar, in Arabic («الجمعة، ٣ جمادى الآخرة ١٤٤٨ هـ»),
 * or null where the platform's Intl has no Hijri calendar, so the widget hides instead of showing a Gregorian date.
 */
export function hijriDate(date: Date): string | null {
  try {
    const format = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (!format.resolvedOptions().calendar.startsWith('islamic')) return null;
    return format.format(date);
  } catch {
    return null;
  }
}

/** The day of the Umm al-Qura month (1–30), or null without a Hijri calendar. */
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

/**
 * Today's juz on a juz-a-day plan, one full reading each Hijri month: day 1 is juz 1, day 30 is juz 30.
 * A month of 29 days gives its last day juz 29 and 30 together, so the reading still ends with the month.
 * Null where the platform has no Hijri calendar.
 */
export function todaysJuz(date: Date): number[] | null {
  const day = hijriDay(date);
  if (!day) return null;
  const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12);
  return day === 29 && hijriDay(tomorrow) === 1 ? [29, 30] : [day];
}
