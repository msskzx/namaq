'use client';

import { Bookmark, EyeOff, Feather, Library, LightbulbOff, ScrollText, Users } from 'lucide-react';
import Button from '@/components/common/Button';
import { isCompareBookmark } from '@shared/compareBookmarks';
import type { HomepageData } from '@/lib/homepageData';
import styles from './Homepage.module.css';
import HomeQuranWidget from './HomeQuranWidget';
import Tour from './Tour';
import { reviewHref, SeeAll, useHomeCards } from './HomeCards';

/** A shelf shows the latest few cards; «عرض الكل» opens the library page with all of them. */
export const SHELF = 5;

export default function Homepage({ data }: { data: HomepageData }) {
  const { ar, saved, forgotten, recent, names, savedCard, forgottenCard, menu } = useHomeCards(data, SHELF);
  const trees = saved.filter(item => !isCompareBookmark(item) && !item.id.startsWith('ayah:'));
  const reviewLabel = ar ? 'راجع ما نسيت' : 'Review what you forgot';
  return <div className={styles.page} dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="sr-only">{ar ? 'نمق' : 'Namaq'}</h1>
    {(data.tour || data.tourStory || data.tourRecite) && <Tour tour={data.tour} story={data.tourStory} recite={data.tourRecite} names={Object.fromEntries(names)} />}

    <HomeQuranWidget sections={data.sections} />

    {recent.length > 0 && <section aria-labelledby="forgotten-title">
      <div className={styles.sectionHeading}>
        <h2 id="forgotten-title"><LightbulbOff size={18} aria-hidden />{ar ? 'ما نسيته' : 'Forgotten'}</h2>
        <div className="flex items-center gap-2">
          <Button href={reviewHref(forgotten[0])} aria-label={reviewLabel} title={reviewLabel}><EyeOff size={18} aria-hidden /><span>{ar ? 'راجع' : 'Review'}</span></Button>
          {recent.length > SHELF && <SeeAll tab="forgotten" />}
        </div>
      </div>
      <div className={styles.shelf}>
        {recent.slice(0, SHELF).map(key => forgottenCard(key))}
      </div>
    </section>}

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
    <section className={styles.quiz} aria-labelledby="prophets-title">
      <ScrollText size={26} aria-hidden />
      <div><h2 id="prophets-title">{ar ? 'قصص الأنبياء' : 'Prophets’ stories'}</h2><p>{ar ? 'أحداث كل قصة، وأين ذُكر كل حدث في السور.' : 'The events of each story, and where each one is told in the surahs.'}</p></div>
      <div className={styles.quizActions}><Button href="/quran/prophets"><ScrollText size={18} aria-hidden />{ar ? 'افتح' : 'Open'}</Button></div>
    </section>
    <section className={styles.quiz} aria-labelledby="quiz-title">
      <Feather size={26} aria-hidden />
      <div><h2 id="quiz-title">{ar ? 'اختبارات القرآن' : 'Quran quizzes'}</h2><p>{ar ? 'تأمّل الآيات، ثم اختبر مواضع التشابه، أو سمّع حفظك آيةً آية.' : 'Read the ayat, then try a question on their shared wording, or recite from memory ayah by ayah.'}</p></div>
      <div className={styles.quizActions}><Button href="/quizzes"><Feather size={18} aria-hidden />{ar ? 'بمفردك' : 'Solo'}</Button><Button href="/quizzes/party"><Users size={18} aria-hidden />{ar ? 'مع غيرك' : 'Party'}</Button><Button href="/quran/read/recite"><EyeOff size={18} aria-hidden />{ar ? 'تسميع' : 'Recite'}</Button></div>
    </section>
    {menu}
  </div>;
}
