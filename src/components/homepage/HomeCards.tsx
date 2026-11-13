'use client';

import { useCallback, useEffect, useState, useSyncExternalStore, type MouseEvent } from 'react';
import { ArrowLeftRight, Bookmark, BookOpen, Check, ChevronLeft, ChevronRight, EyeOff, LightbulbOff } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark, type Bookmark as Saved } from '@shared/bookmarks';
import { ayahHref, readDueMarks, rememberAyah, mostForgotten, serverAyahMarks, subscribeDueMarks } from '@shared/ayahMarks';
import { forgottenOrder } from '@shared/quran/recite';
import { bookmarkReferences } from '@/lib/bookmarkReferences';
import { BOOKMARK_KIND_LABEL, bookmarkKind, type BookmarkKind } from '@shared/bookmarkKind';
import { num } from '@shared/quran/arabicNumber';
import { plainName } from '@shared/quran/normalize';
import { quranContexts } from '@/lib/quran/quranText';
import CardMenu, { type MenuItem } from './CardMenu';
import styles from './Homepage.module.css';

/** The same icons as the tab bar, so a saved card says which feature it opens in. */
const KIND_ICONS: Record<BookmarkKind, typeof BookOpen | typeof TreeIcon> = { tree: TreeIcon, compare: ArrowLeftRight, ayah: BookOpen };
export const reviewHref = (key: string) => `${ayahHref(key)}?recite=${key}&review=1`;
/** The context endpoint takes up to 200 ayat a call. */
const CHUNK = 200;

export type CardData = { surahs: { number: number; name: string }[]; bookmarkAyat: Record<string, readonly string[]> };
export type LibraryTab = 'saved' | 'forgotten';

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
    const all = wanted.split(',');
    const chunks = Array.from({ length: Math.ceil(all.length / CHUNK) }, (_, at) => all.slice(at * CHUNK, (at + 1) * CHUNK));
    Promise.all(chunks.map(quranContexts))
      .then(parts => { if (live) setTexts(Object.fromEntries(parts.flat().map(context => [context.ayah.key, context.ayah.words.join(' ')]))); })
      .catch(() => {});
    return () => { live = false; };
  }, [wanted]);
  return texts;
}

/**
 * The saved cards and forgotten ayat of this browser, each opening the same icon menu on a tap: the home shelves show
 * the latest few, the library page all of them. `forgottenShown` caps how many forgotten ayat get their words.
 */
export function useHomeCards(data: CardData, forgottenShown = Infinity) {
  const ar = useLanguage().language === 'ar';
  const saved = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const marks = useSyncExternalStore(subscribeDueMarks, readDueMarks, serverAyahMarks);
  const forgotten = forgottenOrder(Object.keys(marks));
  const recent = mostForgotten(marks);
  const texts = useAyahTexts(recent.slice(0, forgottenShown));
  const [menu, setMenu] = useState<Menu | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const names = new Map(data.surahs.map(surah => [surah.number, plainName(surah.name).replace(/^سورة\s*/, '')]));
  const kindLabel = (kind: BookmarkKind) => BOOKMARK_KIND_LABEL[kind][ar ? 'ar' : 'en'];
  const forgottenLabel = ar ? 'آية نسيتها' : 'Forgotten ayah';

  const savedMenu = (item: Saved, event: MouseEvent<HTMLElement>) => {
    const kind = bookmarkKind(item);
    const first = bookmarkReferences(item, data.bookmarkAyat)[0];
    setMenu({ ...menuAt(event), label: kindLabel(kind), items: [
      { id: 'open', Icon: KIND_ICONS[kind], label: ar ? 'افتحها' : 'Open', href: item.href },
      ...(kind !== 'ayah' && first ? [{ id: 'mushaf', Icon: BookOpen, label: ar ? 'في المصحف' : 'In the mushaf', href: ayahHref(`${first.surah}:${first.ayat[0]}`) }] : []),
      { id: 'saved', Icon: Bookmark, label: ar ? 'أزلها من المحفوظات' : 'Remove from saved', on: true, onClick: () => toggleBookmark(item) },
    ] });
  };
  const forgottenMenu = (key: string, event: MouseEvent<HTMLElement>) => setMenu({ ...menuAt(event), label: forgottenLabel, items: [
    { id: 'recite', Icon: EyeOff, label: ar ? 'سمّع من هذه الآية' : 'Recite from this ayah', href: reviewHref(key) },
    { id: 'mushaf', Icon: BookOpen, label: ar ? 'في المصحف' : 'In the mushaf', href: ayahHref(key) },
    { id: 'clear', Icon: Check, label: ar ? 'تذكّرتها' : 'I remember it now', onClick: () => rememberAyah(key) },
  ] });

  const savedCard = (item: Saved, wide = false) => {
    const references = bookmarkReferences(item, data.bookmarkAyat);
    const kind = bookmarkKind(item);
    const KindIcon = KIND_ICONS[kind];
    return <button key={item.id} type="button" className={`${styles.book} ${wide ? styles.wide : ''}`} data-kind={kind} aria-haspopup="dialog" onClick={event => savedMenu(item, event)}>
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
  };
  const forgottenCard = (key: string, wide = false) => {
    const [surah, ayah] = key.split(':').map(Number);
    return <button key={key} type="button" className={`${styles.book} ${wide ? styles.wide : ''}`} aria-haspopup="dialog" onClick={event => forgottenMenu(key, event)}>
      <span className={styles.bookHead}>
        <span className={styles.bookKind} role="img" aria-label={forgottenLabel} title={forgottenLabel}><LightbulbOff size={16} aria-hidden /></span>
        <span className={styles.bookReferences} lang="ar" dir="rtl"><span>{names.get(surah)} <bdi>{ar ? num(ayah) : ayah}</bdi></span></span>
      </span>
      <span className={styles.bookText} lang="ar" dir="rtl">{texts[key] && <MushafText>{texts[key]}</MushafText>}</span>
    </button>;
  };
  const menuElement = menu && <CardMenu x={menu.x} y={menu.y} label={menu.label} items={menu.items} onClose={closeMenu} />;
  return { ar, saved, forgotten, recent, names, savedCard, forgottenCard, menu: menuElement };
}

/** A home shelf's way to the full list on the library page. */
export function SeeAll({ tab }: { tab: LibraryTab }) {
  const ar = useLanguage().language === 'ar';
  const label = ar ? 'عرض الكل' : 'See all';
  const Icon = ar ? ChevronLeft : ChevronRight;
  return <Button size="lg" href={`/library?tab=${tab}`} aria-label={label} title={label}><Icon aria-hidden /></Button>;
}
