'use client';

import Link from 'next/link';
import { NavActions } from '@/components/common/NavBar';
import { useHomeCards, type CardData, type LibraryTab } from '@/components/homepage/HomeCards';
import styles from '@/components/homepage/Homepage.module.css';

/** Every saved card and every forgotten ayah, one list at a time, picked in the top bar as the app's page does. */
export default function Library({ data, tab }: { data: CardData; tab: LibraryTab }) {
  const { ar, saved, recent, savedCard, forgottenCard, menu } = useHomeCards(data);
  const tabs = [{ tab: 'saved', label: ar ? 'المحفوظات' : 'Saved' }, { tab: 'forgotten', label: ar ? 'ما نسيته' : 'Forgotten' }] as const;
  const empty = tab === 'saved' ? (ar ? 'لا شيء محفوظ بعد.' : 'Nothing saved yet.') : (ar ? 'لا آيات منسية.' : 'No forgotten ayat.');
  const cards = tab === 'saved' ? saved.map(item => savedCard(item, true)) : recent.map(key => forgottenCard(key, true));
  return <div className={styles.page} dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="sr-only">{tabs.find(item => item.tab === tab)!.label}</h1>
    <NavActions>
      <nav className={styles.switch} aria-label={ar ? 'المحفوظات وما نسيته' : 'Saved and forgotten'} dir={ar ? 'rtl' : 'ltr'}>
        {tabs.map(item => <Link key={item.tab} href={`/library?tab=${item.tab}`} replace scroll={false} aria-current={item.tab === tab ? 'page' : undefined}>{item.label}</Link>)}
      </nav>
    </NavActions>
    {cards.length ? <div className={styles.list}>{cards}</div> : <p className={`${styles.empty} justify-center`}>{empty}</p>}
    {menu}
  </div>;
}
