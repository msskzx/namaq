'use client';

import { useCallback, useEffect, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { ArrowLeftRight, Bookmark, BookOpen, Check, EyeOff, Feather, Library, LightbulbOff, Users } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { ayahHref, clearForgotten, readAyahMarks, recentlyForgotten, serverAyahMarks, subscribeAyahMarks } from '@shared/ayahMarks';
import { forgottenOrder } from '@shared/quran/recite';
import { bookmarkReferences } from '@/lib/bookmarkReferences';
import { isCompareBookmark } from '@shared/compareBookmarks';
import { BOOKMARK_KIND_LABEL, bookmarkKind, type BookmarkKind } from '@shared/bookmarkKind';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import type { HomepageData } from '@/lib/homepageData';
import styles from './Homepage.module.css';
import HomeQuranWidget from './HomeQuranWidget';
import Tour from './Tour';
import CardMenu, { type MenuItem } from './CardMenu';
import { quranContexts } from '@/lib/quran/quranText';

/** The same icons as the tab bar, so a saved card says which feature it opens in. */
const KIND_ICONS: Record<BookmarkKind, typeof BookOpen | typeof TreeIcon> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: BookOpen };
const reviewHref = (key: string) => `${ayahHref(key)}?recite=${key}&review=1`;
/** The context endpoint takes up to 200 ayat. */
const SHOWN_FORGOTTEN = 200;

type Menu = { x: number; y: number; label: string; items: MenuItem[] };
/** Where the menu opens: over the click, or over the card's top when a key pressed it. */
const menuAt = (event: MouseEvent<HTMLElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  return event.detail ? { x: event.clientX, y: event.clientY } : { x: box.left + box.width / 2, y: box.top };
};

/** The words of the forgotten ayat, fetched once per list. */
function useAyahTexts(keys: string[]) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const wanted = keys.join(',');
  useEffect(() => {
    if (!wanted) return;
    let live = true;
    quranContexts(wanted.split(','))
      .then(contexts => { if (live) setTexts(Object.fromEntries(contexts.map(context => [context.ayah.key, context.ayah.words.join(' ')]))); })
      .catch(() => {});
    return () => { live = false; };
  }, [wanted]);
  return texts;
}

export default function Homepage({ data }: { data: HomepageData }) {
  const ar = useLanguage().language === 'ar';
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const trees = saved.filter(item => !isCompareBookmark(item) && !item.id.startsWith('ayah:'));
  const marks = useSyncExternalStore(subscribeAyahMarks, readAyahMarks, serverAyahMarks);
  const forgotten = forgottenOrder(Object.keys(marks));
  const recent = recentlyForgotten(marks).slice(0, SHOWN_FORGOTTEN);
  const texts = useAyahTexts(recent);
  const [menu, setMenu] = useState<Menu | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const kindLabel = (kind: BookmarkKind) => BOOKMARK_KIND_LABEL[kind][ar ? 'ar' : 'en'];
  const savedMenu = (item: Saved, event: MouseEvent<HTMLElement>) => {
    const kind = bookmarkKind(item);
    const first = bookmarkReferences(item, data.bookmarkAyat)[0];
    setMenu({ ...menuAt(event), label: kindLabel(kind), items: [
      { id: 'open', Icon: KIND_ICONS[kind], label: ar ? 'افتحها' : 'Open', href: item.href },
      ...(kind !== 'ayah' && first ? [{ id: 'mushaf', Icon: BookOpen, label: ar ? 'في المصحف' : 'In the mushaf', href: ayahHref(`${first.surah}:${first.ayat[0]}`) }] : []),
      { id: 'saved', Icon: Bookmark, label: ar ? 'أزلها من المحفوظات' : 'Remove from saved', on: true, onClick: () => toggleBookmark(item) },
    ] });
  };
  const forgottenMenu = (key: string, event: MouseEvent<HTMLElement>) => setMenu({ ...menuAt(event), label: ar ? 'آية نسيتها' : 'Forgotten ayah', items: [
    { id: 'recite', Icon: EyeOff, label: ar ? 'سمّع من هذه الآية' : 'Recite from this ayah', href: reviewHref(key) },
    { id: 'mushaf', Icon: BookOpen, label: ar ? 'في المصحف' : 'In the mushaf', href: ayahHref(key) },
    { id: 'clear', Icon: Check, label: ar ? 'تذكّرتها، أزلها من المراجعة' : 'I know it now, stop reviewing it', onClick: () => clearForgotten(key) },
  ] });
  const reviewLabel = ar ? `راجع ما نسيت (${num(forgotten.length)})` : `Review what you forgot (${forgotten.length})`;
  const names = new Map(data.surahs.map(surah => [surah.number, plainName(surah.name).replace(/^سورة\s*/, '')]));
  return <div className={styles.page} dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="sr-only">{ar ? 'نمق' : 'Namaq'}</h1>
    {data.tour && <Tour tour={data.tour} names={Object.fromEntries(names)} />}

    <HomeQuranWidget sections={data.sections} />

    {recent.length > 0 && <section aria-labelledby="forgotten-title">
      <div className={styles.sectionHeading}>
        <h2 id="forgotten-title"><LightbulbOff size={18} aria-hidden />{ar ? 'ما نسيته' : 'Forgotten'}</h2>
        <Button href={reviewHref(forgotten[0])} aria-label={reviewLabel} title={reviewLabel}><EyeOff size={18} aria-hidden /><span className="tabular-nums">{ar ? num(forgotten.length) : forgotten.length}</span></Button>
      </div>
      <div className={styles.shelf}>
        {recent.map(key => {
          const [surah, ayah] = key.split(':').map(Number);
          return <button key={key} type="button" className={styles.book} aria-haspopup="dialog" onClick={event => forgottenMenu(key, event)}>
            <span className={styles.bookHead}>
              <span className={styles.bookKind} role="img" aria-label={ar ? 'آية نسيتها' : 'Forgotten ayah'} title={ar ? 'آية نسيتها' : 'Forgotten ayah'}><LightbulbOff size={16} aria-hidden /></span>
              <span className={styles.bookReferences} lang="ar" dir="rtl"><span>{names.get(surah)} <bdi>{ar ? num(ayah) : ayah}</bdi></span></span>
            </span>
            <span className={styles.bookText} lang="ar" dir="rtl">{texts[key] && <MushafText>{texts[key]}</MushafText>}</span>
          </button>;
        })}
      </div>
    </section>}

    <section aria-labelledby="saved-title">
      <div className={styles.sectionHeading}>
        <h2 id="saved-title"><Bookmark size={18} aria-hidden />{ar ? 'المحفوظات' : 'Saved'}</h2>
        {trees.length > 0 && <Button size="lg" href={`/quran/branches?b=${encodeURIComponent(trees.map(item => item.id).join('|'))}`} aria-label={ar ? 'افتح المحفوظات' : 'Open saved'} title={ar ? 'افتح المحفوظات' : 'Open saved'}><Library aria-hidden /></Button>}
      </div>
      {saved.length ? <div className={styles.shelf}>
        {saved.map(item => {
          const references = bookmarkReferences(item, data.bookmarkAyat);
          const kind = bookmarkKind(item);
          const KindIcon = KIND_ICONS[kind];
          return <button key={item.id} type="button" className={styles.book} data-kind={kind} aria-haspopup="dialog" onClick={event => savedMenu(item, event)}>
            <span className={styles.bookHead}>
              <span className={styles.bookKind} role="img" aria-label={kindLabel(kind)} title={kindLabel(kind)}><KindIcon size={16} aria-hidden /></span>
              {references.length > 0 && <span className={styles.bookReferences} lang="ar" dir="rtl">
                {references.map(reference => <span key={reference.surah}>
                  {names.get(reference.surah)} <bdi>{reference.ayat.map(ayah => ar ? num(ayah) : ayah).join('range' in reference ? '–' : '، ')}</bdi>
                </span>)}
              </span>}
            </span>
            <span className={styles.bookText} lang="ar" dir="rtl"><MushafText>{item.text}</MushafText></span>
          </button>;
        })}
      </div> : <p className={styles.empty}>{ar ? 'احفظ شجرة أو بطاقة مقارنة أو آية بزر' : 'Save a tree, compare card or ayah with'} <Bookmark size={18} aria-label={ar ? 'الحفظ' : 'Bookmark'} /> {ar ? 'لتجدها هنا.' : 'to find it here.'}</p>}
    </section>
    <section className={styles.quiz} aria-labelledby="quiz-title">
      <Feather size={26} aria-hidden />
      <div><h2 id="quiz-title">{ar ? 'اختبارات القرآن' : 'Quran quizzes'}</h2><p>{ar ? 'تأمّل الآيات، ثم اختبر مواضع التشابه، أو سمّع حفظك آيةً آية.' : 'Read the ayat, then try a question on their shared wording, or recite from memory ayah by ayah.'}</p></div>
      <div className={styles.quizActions}><Button href="/quizzes"><Feather size={18} aria-hidden />{ar ? 'بمفردك' : 'Solo'}</Button><Button href="/quizzes/party"><Users size={18} aria-hidden />{ar ? 'مع غيرك' : 'Party'}</Button><Button href="/quran/read/recite"><EyeOff size={18} aria-hidden />{ar ? 'تسميع' : 'Recite'}</Button></div>
    </section>
    {menu && <CardMenu x={menu.x} y={menu.y} label={menu.label} items={menu.items} onClose={closeMenu} />}
  </div>;
}
