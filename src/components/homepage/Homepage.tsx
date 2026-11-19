'use client';

import { useState } from 'react';
import type { HomepageData } from '@/lib/homepageData';
import styles from './Homepage.module.css';
import Tour from './Tour';
import { useHomeCards } from './HomeCards';
import { ContinueReading, Feed, Stories } from './HomeFeed';
import { MemorizedPrompt } from './Memorized';
import { InterestChips, InterestsWelcome, onlyOf, usePicked } from './Interests';

/**
 * Home, as the app's (owner, 2026-11-13): reading and learning first, like a social app's home. Story circles, the page the
 * mushaf was left on, then a feed that loads more as it nears its end (owner, 2026-11-14: no tools below; prayer times live on the
 * utilities page, saved cards behind their story circle). A reload (a phone browser's pull to refresh) starts a new visit, as every page load does (shared/feedSeen.ts).
 */
export default function Homepage({ data }: { data: HomepageData }) {
  const { ar, names } = useHomeCards(data, 0);
  // The chip row's pick: one interest's cards alone, or the mixed feed (null).
  const [chosen, setOnly] = useState<string | null>(null);
  const only = onlyOf(chosen, usePicked());
  return <div className={`${styles.page} ${styles.home}`} dir="rtl">
    <h1 className="sr-only">{ar ? 'نمق' : 'Namaq'}</h1>
    {(data.tour || data.tourStory || data.tourRecite) && <Tour tour={data.tour} story={data.tourStory} recite={data.tourRecite} names={Object.fromEntries(names)} />}

    <InterestsWelcome tour={Boolean(data.tour || data.tourStory || data.tourRecite)} />
    <Stories />
    <InterestChips only={only} onOnly={setOnly} />
    {!only && <><ContinueReading /><MemorizedPrompt /></>}
    <Feed only={only} />
  </div>;
}
