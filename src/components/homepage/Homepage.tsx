'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Bookmark, EyeOff, Feather, Library, LightbulbOff, Users } from 'lucide-react';
import Button from '@/components/common/Button';
import { NavActions } from '@/components/common/NavBar';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import OpeningSearch from '@/app/quran/branches/OpeningSearch';
import { FilterButton } from '@/app/quran/branches/Filters';
import { readBookmarks, serverBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { ayahHref, readAyahMarks, serverAyahMarks, subscribeAyahMarks } from '@/lib/ayahMarks';
import { forgottenOrder } from '@/lib/quran/recite';
import { bookmarkReferences } from '@/lib/bookmarkReferences';
import { isCompareBookmark } from '@/lib/compareBookmarks';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import type { HomepageData } from '@/lib/homepageData';
import styles from './Homepage.module.css';
import HomeQuranWidget from './HomeQuranWidget';

export default function Homepage({ data }: { data: HomepageData }) {
  const ar = useLanguage().language === 'ar';
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const trees = saved.filter(item => !isCompareBookmark(item) && !item.id.startsWith('ayah:'));
  const forgotten = forgottenOrder(Object.keys(useSyncExternalStore(subscribeAyahMarks, readAyahMarks, serverAyahMarks)));
  const names = new Map(data.surahs.map(surah => [surah.number, plainName(surah.name).replace(/^سورة\s*/, '')]));
  return <div className={styles.page} dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="sr-only">{ar ? 'نمق' : 'Namaq'}</h1>
    <NavActions>
      <div className={styles.search}>
        <OpeningSearch top={[]} remote surahs={data.surahs} />
        <FilterButton range={null} view={{}} allSurahs={data.surahs} />
      </div>
    </NavActions>

    <HomeQuranWidget sections={data.sections} />

    <section aria-labelledby="saved-title">
      <div className={styles.sectionHeading}>
        <h2 id="saved-title"><Bookmark size={18} aria-hidden />{ar ? 'المحفوظات' : 'Saved'}</h2>
        {trees.length > 0 && <Button size="lg" href={`/quran/branches?b=${encodeURIComponent(trees.map(item => item.id).join('|'))}`} aria-label={ar ? 'افتح المحفوظات' : 'Open saved'} title={ar ? 'افتح المحفوظات' : 'Open saved'}><Library aria-hidden /></Button>}
      </div>
      {saved.length ? <div className={styles.shelf}>
        {saved.map(item => {
          const references = bookmarkReferences(item, data.bookmarkAyat);
          return <Link key={item.id} href={item.href} className={styles.book}>
            {references.length > 0 && <span className={styles.bookReferences} lang="ar" dir="rtl">
              {references.map(reference => <span key={reference.surah}>
                {names.get(reference.surah)} <bdi>{reference.ayat.map(ayah => ar ? num(ayah) : ayah).join('range' in reference ? '–' : '، ')}</bdi>
              </span>)}
            </span>}
            <span className={styles.bookText} lang="ar" dir="rtl"><MushafText>{item.text}</MushafText></span>
          </Link>;
        })}
      </div> : <p className={styles.empty}>{ar ? 'احفظ شجرة أو عائلة أو بطاقة مقارنة أو آية بزر' : 'Save a tree, family, compare card or ayah with'} <Bookmark size={18} aria-label={ar ? 'الحفظ' : 'Bookmark'} /> {ar ? 'لتجدها هنا.' : 'to find it here.'}</p>}
    </section>
    <section className={styles.quiz} aria-labelledby="quiz-title">
      <Feather size={26} aria-hidden />
      <div><h2 id="quiz-title">{ar ? 'اختبارات القرآن' : 'Quran quizzes'}</h2><p>{ar ? 'تأمّل الآيات، ثم اختبر مواضع التشابه، أو سمّع حفظك آيةً آية.' : 'Read the ayat, then try a question on their shared wording, or recite from memory ayah by ayah.'}</p></div>
      <div className={styles.quizActions}><Button href="/quizzes"><Feather size={18} aria-hidden />{ar ? 'بمفردك' : 'Solo'}</Button><Button href="/quizzes/party"><Users size={18} aria-hidden />{ar ? 'مع غيرك' : 'Party'}</Button><Button href="/quran/read/recite"><EyeOff size={18} aria-hidden />{ar ? 'تسميع' : 'Recite'}</Button>
        {forgotten.length > 0 && <Button href={`${ayahHref(forgotten[0])}?recite=${forgotten[0]}&review=1`} aria-label={ar ? `راجع ما نسيت (${num(forgotten.length)})` : `Review what you forgot (${forgotten.length})`} title={ar ? `راجع ما نسيت (${num(forgotten.length)})` : `Review what you forgot (${forgotten.length})`}><LightbulbOff size={18} aria-hidden /><span className="tabular-nums">{ar ? num(forgotten.length) : forgotten.length}</span></Button>}</div>
    </section>
  </div>;
}
