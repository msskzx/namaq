'use client';

import { useState } from 'react';
import QuranWords from '@/components/quran/text/QuranWords';
import { IRAB_SOURCES, ukbariCredit, ukbariOf, ukbariPage, type UkbariData } from '@shared/quran/irab';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { corpusWords } from '@shared/quran/words';
import ExternalLink from '@/components/common/ExternalLink';
import OpenInBook from '@/components/quran/OpenInBook';
import type { IrabAyah } from './irab';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';

/**
 * The app's i'rab sheet (mobile/src/components/IrabSheet.tsx) on the website, which fetches it and keeps no books: the
 * ayah's words as chips, the pressed one lit and the word its role points at outlined, its short line, then
 * al-'Ukbari's passages on it (or on its ayah when he names no word of it).
 */
export default function IrabPanel({ ayah, data }: { ayah: string; data: IrabAyah }) {
  const [picked, setPicked] = useState(data.word);
  const corpus = corpusWords(ayah, picked);
  const heads = new Set(corpus.map(i => data.lines[i]?.head).filter((head): head is number => head !== null && head !== undefined));
  const headChip = data.words.findIndex((_, i) => corpusWords(ayah, i).some(c => heads.has(c)));
  const passages = ukbariOf({ source: { version: '', book: 309 }, entries: data.ukbari } satisfies UkbariData, ayah, corpus);
  return (
    <>
      <div role="tablist" aria-label="كلمات الآية" className="flex shrink-0 flex-wrap gap-1.5">
        {data.words.map((word, i) => (
          <Chip key={i} role="tab" quran lit label={word} on={i === picked} dashed={i === headChip} onClick={() => setPicked(i)} />
        ))}
      </div>
      <Card className="block shrink-0 px-3.5 py-2.5">
        <p className="font-quran text-[1.875rem] leading-[1.8] text-[var(--home-accent)]">{data.words[picked]}</p>
        {corpus.map(i => data.lines[i] && (
          <div key={i}>
            {data.lines[i].role && <p className="text-[1.3125rem] leading-[1.6]">{data.lines[i].role}</p>}
            <p className="text-[0.9375rem] leading-[1.7] text-[var(--home-muted)]">{data.lines[i].morph}</p>
          </div>
        ))}
      </Card>
      {passages.length ? passages.map((passage, i) => (
        <Card key={i} className="block shrink-0 px-3.5 py-2.5">
          <div className="flex items-center gap-3 text-[0.8125rem]">
            <ExternalLink href={ukbariPage(passage)} className="flex-1 text-[var(--home-muted)]">{passage.from >= 0 ? ukbariCredit(passage) : `${ukbariCredit(passage)}، على الآية`}</ExternalLink>
            <OpenInBook book="ukbari" ayah={ayah} />
          </div>
          <p className="mt-1 whitespace-pre-line text-[1.125rem] leading-[1.9]">
            {tafsirRuns(passage.text).map((run, j) => (run.quran ? <QuranWords key={j} className="text-[var(--home-accent)]">{run.text}</QuranWords> : run.text))}
          </p>
        </Card>
      )) : <p className="px-0.5 text-[0.9375rem] text-[var(--home-muted)]">لم يتكلم العكبري على هذه الكلمة ولا على آيتها.</p>}
      <p className="flex shrink-0 flex-wrap gap-3">
        {IRAB_SOURCES.map(source => <ExternalLink key={source.url} href={source.url} className="text-[0.8125rem] text-[var(--home-muted)]">{source.name}</ExternalLink>)}
      </p>
    </>
  );
}
