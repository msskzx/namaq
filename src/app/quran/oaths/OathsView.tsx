'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Send } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { OATHS_HELP, oathPlace, oathShareText, oathsWith, type OathChip, type OathKind, type OathView } from '@shared/quran/oaths';

type Built = { oaths: OathView[]; chips: OathChip[] };

export const OATH_KINDS: { kind: OathKind; label: string }[] = [
  { kind: 'allah', label: 'أقسم الله' },
  { kind: 'others', label: 'أقسم غيره' },
];

const HELP = OATHS_HELP.map((text, i) => <p key={i} className={i === OATHS_HELP.length - 1 ? 'text-[var(--home-muted)]' : undefined}>{text}</p>);

/** Shares an oath's text and its link with the phone's share sheet, or copies them where there is none. */
async function shareOath(oath: OathView) {
  const text = oathShareText(oath, num);
  const url = `${location.origin}${ayahHref(oath.id)}`;
  try {
    if (navigator.share) await navigator.share({ text, url });
    else await navigator.clipboard.writeText(`${text}\n${url}`);
  } catch {}
}

const ICON_BUTTON = 'inline-flex size-9 items-center justify-center rounded-full text-[var(--home-muted)] hover:text-[var(--home-accent)] focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]';

function OathCard({ oath }: { oath: OathView }) {
  const place = oathPlace(oath, num);
  return (
    <li className="rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-4 pt-2.5 pb-1">
      <h2 className="flex flex-wrap items-baseline gap-x-3 text-sm text-[var(--home-muted)]">
        <span>{place}</span>
        {oath.who && <span className="text-[var(--home-green)]">{oath.who}</span>}
      </h2>
      <p className="font-quran text-2xl leading-[2.1] [text-align:justify] [text-align-last:right]">
        {oath.lines.map(line => (
          <span key={line.ayah}>
            {line.words.map((word, i) => (
              <span key={i} data-sworn={word.sworn || undefined} className={word.sworn ? 'text-[var(--home-accent)]' : undefined}>{`${mushafText(word.text)} `}</span>
            ))}
            <span className="text-[var(--home-amber)]">{`${num(line.ayah)} `}</span>
          </span>
        ))}
      </p>
      <div className="flex gap-1">
        <Link href={ayahHref(oath.id)} className={ICON_BUTTON} aria-label={`افتح ${place} في المصحف`} title="في المصحف"><BookOpen size={18} aria-hidden /></Link>
        <button type="button" onClick={() => shareOath(oath)} className={ICON_BUTTON} aria-label={`شارك ${place}`} title="شارك"><Send size={18} aria-hidden /></button>
      </div>
    </li>
  );
}

/**
 * Every oath in the Quran, as in the app (owner, 2026-11-13): Allah's oaths or those the Quran quotes from others,
 * in mushaf order, the words sworn by in colour. A chip keeps only the oaths sworn by its word.
 */
export default function OathsView({ allah, others }: { allah: Built; others: Built }) {
  const [kind, setKind] = useState<OathKind>('allah');
  const [word, setWord] = useState<string | null>(null);
  const { oaths, chips } = kind === 'allah' ? allah : others;
  const shown = oathsWith(oaths, word);
  const chip = (label: string, value: string | null) => (
    <li key={label}>
      <button type="button" aria-pressed={word === value} onClick={() => setWord(value)}
        className={`whitespace-nowrap rounded-full border px-3 py-0.5 text-base ${word === value ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-on-action)]' : 'border-[var(--home-rule)] text-[var(--home-ink)] hover:border-[var(--home-accent)]'}`}>
        {label}
      </button>
    </li>
  );
  return (
    <div className="flex flex-col gap-3">
      <SettingsHelp label="ما الأقسام هنا؟">{HELP}</SettingsHelp>
      <h1 className="sr-only">الأقسام في القرآن</h1>
      <Segmented label="من أقسم" className="w-full [&>button]:flex-1" options={OATH_KINDS.map(option => ({
        key: option.kind, label: option.label, current: kind === option.kind, onClick: () => { setKind(option.kind); setWord(null); },
      }))} />
      <ul aria-label="ما أُقسم به" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {chip('الكل', null)}
        {chips.map(c => chip(c.word, c.word))}
      </ul>
      <ol aria-label="الأقسام" className="flex flex-col gap-2.5">
        {shown.map(oath => <OathCard key={oath.id} oath={oath} />)}
      </ol>
    </div>
  );
}
