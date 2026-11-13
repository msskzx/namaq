'use client';

import { Bookmark, EyeOff, Feather, Library, Users } from 'lucide-react';
import Button from '@/components/common/Button';
import { isCompareBookmark } from '@shared/compareBookmarks';
import type { HomepageData } from '@/lib/homepageData';
import styles from './Homepage.module.css';
import Tour from './Tour';
import { SeeAll, useHomeCards } from './HomeCards';
import { ContinueReading, Divider, Feed, PrayerRow, Stories } from './HomeFeed';

/** A shelf shows the latest few cards; «عرض الكل» opens the library page with all of them. */
export const SHELF = 5;

/**
 * Home, as the app's (owner, 2026-11-13): reading and learning first, like a social app's home. Story circles, the page the
 * mushaf was left on, a feed to reflect on that loads more on request, then the tools: prayer times, saved cards, quizzes.
 */
export default function Homepage({ data }: { data: HomepageData }) {
  const { ar, saved, names, savedCard, menu } = useHomeCards(data, 0);
  const trees = saved.filter(item => !isCompareBookmark(item) && !item.id.startsWith('ayah:'));
  return <div className={`${styles.page} ${styles.home}`} dir="rtl">
    <h1 className="sr-only">{ar ? 'نمق' : 'Namaq'}</h1>
    {(data.tour || data.tourStory || data.tourRecite) && <Tour tour={data.tour} story={data.tourStory} recite={data.tourRecite} names={Object.fromEntries(names)} />}

    <Stories />
    <ContinueReading />
    <Feed />

    <Divider label="أدوات" />
    <PrayerRow />

    <section aria-labelledby="saved-title">
      <div className={styles.sectionHeading}>
        <h2 id="saved-title"><Bookmark size={18} aria-hidden />{ar ? 'المحفوظات' : 'Saved'}</h2>
        <div className="flex items-center gap-2">
          {trees.length > 0 && <Button size="lg" href={`/quran/branches?b=${encodeURIComponent(trees.map(item => item.id).join('|'))}`} aria-label={ar ? 'افتح المحفوظات' : 'Open saved'} title={ar ? 'افتح المحفوظات' : 'Open saved'}><Library aria-hidden /></Button>}
          {saved.length > SHELF && <SeeAll tab="saved" />}
        </div>
      </div>
      {saved.length ? <div className={styles.shelf}>
        {saved.slice(0, SHELF).map(item => savedCard(item))}
      </div> : <p className={styles.empty}>{ar ? 'احفظ شجرة أو بطاقة مقارنة أو آية بزر' : 'Save a tree, compare card or ayah with'} <Bookmark size={18} aria-label={ar ? 'الحفظ' : 'Bookmark'} /> {ar ? 'لتجدها هنا.' : 'to find it here.'}</p>}
    </section>
    <section className={styles.quiz} aria-labelledby="quiz-title">
      <Feather size={26} aria-hidden />
      <div><h2 id="quiz-title">{ar ? 'اختبارات القرآن' : 'Quran quizzes'}</h2></div>
      <div className={styles.quizActions}><Button href="/quizzes"><Feather size={18} aria-hidden />{ar ? 'بمفردك' : 'Solo'}</Button><Button href="/quizzes/party"><Users size={18} aria-hidden />{ar ? 'مع غيرك' : 'Party'}</Button><Button href="/quran/read/recite"><EyeOff size={18} aria-hidden />{ar ? 'تسميع' : 'Recite'}</Button></div>
    </section>
    {menu}
  </div>;
}
