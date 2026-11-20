import type { Metadata } from 'next';
import styles from '@/components/common/PaperPage.module.css';
import Utilities from '@/components/utilities/Utilities';
import { ADHKAR } from '@shared/adhkar';
import { ayatPages } from '@/lib/storyAyat';

export const metadata: Metadata = { title: 'الأدوات: مواقيت الصلاة والقبلة والتقويم الهجري والأذكار' };

/** The adhkar's Quran selections in the mushaf's own lines, each range on its own, as the app's AyatRange draws them. */
async function adhkarQuran() {
  const quran = ADHKAR.flatMap(item => (item.content.kind === 'quran' ? [{ id: item.id, ranges: item.content.ranges }] : []));
  const pages = await Promise.all(quran.map(async ({ id, ranges }) =>
    [id, await Promise.all(ranges.map(range => ayatPages(`${range.surah}:${range.from}`, `${range.surah}:${range.to}`)))] as const));
  return Object.fromEntries(pages);
}

/** The app's utilities tab on the website: prayer times, the qibla, the Hijri calendar and the adhkar. */
export default async function UtilitiesPage() {
  return <main className={`${styles.page} px-4 pt-4 pb-28`}><Utilities quran={await adhkarQuran()} /></main>;
}
