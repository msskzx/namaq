'use client';

import Link from 'next/link';
import ExternalLink from '@/components/common/ExternalLink';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { WORDS_COUNTING, WORDS_SOURCE } from '@shared/quran/words';
import { sourceById } from '@shared/sources';

const LINK = 'text-[var(--home-accent)]';
const source = sourceById(WORDS_SOURCE)!;

const CONTENT = <>
  <div>
    <p className="font-bold">{source.title.ar}</p>
    {source.author && <p className="text-sm text-[var(--home-muted)]">{source.author.ar}</p>}
    <ExternalLink href={source.link.url} className={LINK}>{source.link.label}</ExternalLink>
  </div>
  {WORDS_COUNTING.map(text => <p key={text}>{text}</p>)}
  <Link href={`/attributions#${WORDS_SOURCE}`} className={LINK}>المصادر والتراخيص</Link>
</>;

/** The words page's source and how it counts, behind the books icon in the top bar, as in the app. */
export default function WordsSource() {
  return <SettingsHelp label="المصدر" refs>{CONTENT}</SettingsHelp>;
}
