'use client';

import SourceLine from '@/components/common/SourceLine';
import { WORDS_COUNTING, WORDS_SOURCE } from '@shared/quran/words';
import { sourceById } from '@shared/sources';

const source = sourceById(WORDS_SOURCE)!;

/** The words page's book as the line under its heading, as the home cards carry theirs (owner 2026-11-20; the app's words page). */
export default function WordsSource() {
  return <SourceLine sources={[{ line: source.title.ar, quotes: WORDS_COUNTING.map(text => ({ text })),
    links: [{ label: source.link.label, url: source.link.url }, { label: 'المصادر والتراخيص', url: `/attributions#${WORDS_SOURCE}` }] }]} />;
}
