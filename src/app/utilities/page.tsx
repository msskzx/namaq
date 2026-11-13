import type { Metadata } from 'next';
import styles from '@/components/common/PaperPage.module.css';
import Utilities from '@/components/utilities/Utilities';

export const metadata: Metadata = { title: 'الأدوات: مواقيت الصلاة والقبلة والتقويم الهجري' };

/** The app's utilities tab on the website: prayer times, the qibla and the Hijri calendar. */
export default function UtilitiesPage() {
  return <main className={`${styles.page} px-4 pt-4 pb-28`}><Utilities /></main>;
}
