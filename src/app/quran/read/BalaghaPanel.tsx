'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KASHSHAF_BOOK, KASHSHAF_EDITION, kashshafCredit, kashshafPage, kashshafRuns, litWords } from '@shared/quran/kashshaf';
import ExternalLink from '@/components/common/ExternalLink';
import type { BalaghaAyah } from './balagha';

const CARD = 'block shrink-0 rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-3.5 py-2.5';
// The reader's neutral band (Mushaf.module.css .marked), seen on a card in both themes.
const LIT = 'bg-[color-mix(in_srgb,var(--home-ink)_10%,var(--home-card))]';
// The sentence whose ayah words are lit: a deeper band.
const PICKED = 'bg-[color-mix(in_srgb,var(--home-ink)_20%,var(--home-card))]';

/**
 * The reader's balagha sheet on the website, the app's BalaghaSheet (mobile/src/components/BalaghaSheet.tsx): al-Zamakhshari's
 * whole passage on the ayah, the sentences where he names a device lit with his word in front; a click on one lights the
 * ayah words it quotes. The book and page fold open under the passage.
 */
export default function BalaghaPanel({ ayah, data }: { ayah: string; data: BalaghaAyah }) {
  const { passage, words } = data;
  const firstLit = passage ? passage.lit.findIndex((_, at) => litWords(passage, at, ayah)) : -1;
  const [picked, setPicked] = useState<number | null>(null);
  const [reference, setReference] = useState(false);
  const lit = picked ?? (firstLit >= 0 ? firstLit : null);
  const span = passage && lit !== null ? litWords(passage, lit, ayah) : null;
  return (
    <>
      <p className={`${CARD} font-quran text-2xl leading-[2]`}>
        {words.map((word, i) => <span key={i} className={span && i >= span[0] && i <= span[1] ? PICKED : undefined}>{`${i ? ' ' : ''}${word}`}</span>)}
      </p>
      {passage ? (
        <div className={CARD}>
          <p className="whitespace-pre-line text-[1.125rem] leading-[1.9]">
            {kashshafRuns(passage).map((run, i) => {
              const text = run.quran ? <span className="font-quran text-[var(--home-accent)]">{run.text}</span> : run.text;
              if (run.lit === null) return <span key={i}>{text}</span>;
              const at = run.lit;
              return (
                <span key={i} role="button" tabIndex={0} aria-pressed={lit === at} onClick={() => setPicked(at)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setPicked(at); } }} className={`${lit === at ? PICKED : LIT} cursor-pointer`}>
                  {run.opens && <span className="text-sm text-[var(--home-muted)]">{` ${run.devices.map(device => `«${device}»`).join(' ')} `}</span>}
                  {text}
                </span>
              );
            })}
          </p>
          <button type="button" onClick={() => setReference(open => !open)} aria-expanded={reference}
            className="mt-2 flex min-h-9 w-full items-center gap-1.5 border-t border-[var(--home-rule)] pt-2 text-sm text-[var(--home-muted)]">
            {reference ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
            {kashshafCredit(passage)}
          </button>
          {reference && (
            <div className="flex flex-col gap-1 text-sm leading-6 text-[var(--home-muted)]">
              <p>{`${KASHSHAF_BOOK}، ${KASHSHAF_EDITION}. نص الموسوعة القرآنية، إصدار ${data.version}، بلا حواشي الكتب المطبوعة معه. تضاء الجملة التي يسمّي فيها الزمخشري فنًّا من فنون البلاغة.`}</p>
              <ExternalLink href={kashshafPage(passage)}>اقرأ الصفحة</ExternalLink>
            </div>
          )}
        </div>
      ) : <p className="py-6 text-center text-sm text-[var(--home-muted)]">لا كلام للكشاف على هذه الآية.</p>}
    </>
  );
}
