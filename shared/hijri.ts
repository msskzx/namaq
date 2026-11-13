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
