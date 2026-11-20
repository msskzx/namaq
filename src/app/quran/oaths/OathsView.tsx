'use client';

import AyahFlow from '@/components/quran/text/AyahFlow';
import { useState } from 'react';
import { BookOpen, Send } from 'lucide-react';
import Segmented from '@/components/common/Segmented';
import Reference from '@/components/common/Reference';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { BY_QUOTES, OATH_BY, OATH_QUOTES, citesOf, kindQuotes, oathSections, sectionQuotes, type OathBy } from '@shared/quran/oathSources';
import { oathPlace, oathShareText, type OathKind, type OathView } from '@shared/quran/oaths';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';

export const OATH_KINDS: { kind: OathKind; label: string }[] = [
  { kind: 'allah', label: 'أقسم الله' },
  { kind: 'others', label: 'أقسم غيره' },
];

/** Shares an oath's text and its link with the phone's share sheet, or copies them where there is none. */
async function shareOath(oath: OathView) {
  const text = oathShareText(oath, num);
  const url = `${location.origin}${ayahHref(oath.id)}`;
  try {
    if (navigator.share) await navigator.share({ text, url });
    else await navigator.clipboard.writeText(`${text}\n${url}`);
  } catch {}
}

function OathCard({ oath }: { oath: OathView }) {
  const place = oathPlace(oath, num);
  const quotes = OATH_QUOTES[oath.id];
  return (
    <li className="flex flex-col gap-1">
      {/* The home feed's head (owner, 2026-11-16): a bold title, a muted line under it, then the card. */}
      <div className="flex flex-col px-1">
        <h3 className="text-base font-bold">{place}</h3>
        {oath.who && <p className="text-sm text-[var(--home-muted)]">{oath.who}</p>}
        {quotes && <Reference title={citesOf(quotes)} quotes={quotes} />}
      </div>
      <Card as="article" className="px-4 py-1.5">
        <AyahFlow>
          {oath.lines.map(line => (
            <span key={line.ayah}>
              {line.words.map((word, i) => (
                <span key={i} data-sworn={word.sworn || undefined} className={word.sworn ? 'text-[var(--home-accent)]' : undefined}>{`${word.text} `}</span>
              ))}
              <span className="text-[var(--home-amber)]">{`${num(line.ayah)} `}</span>
            </span>
          ))}
        </AyahFlow>
      </Card>
      <div className="flex items-center gap-1">
        <Button size="round" variant="muted" href={ayahHref(oath.id)} aria-label={`افتح ${place} في المصحف`} title="في المصحف"><BookOpen aria-hidden /></Button>
        <Button size="round" variant="muted" onClick={() => shareOath(oath)} aria-label={`شارك ${place}`} title="شارك"><Send aria-hidden /></Button>
      </div>
    </li>
  );
}

const OathList = ({ label, oaths }: { label: string; oaths: OathView[] }) => (
  <ol aria-label={label} className="flex flex-col gap-2.5">
    {oaths.map(oath => <OathCard key={oath.id} oath={oath} />)}
  </ol>
);

/**
 * Every oath in the Quran, as in the app (owner, 2026-11-13): Allah's oaths or those the Quran quotes from others, the words
 * sworn by in colour. Allah's are grouped by what He swears on, as Ibn al-Qayyim names it, and a chip keeps only those sworn
 * by one of al-Suyuti's kinds (owner, 2026-11-16: "from Ibn al-Qayyim and al-Suyuti").
 */
export default function OathsView({ allah, others }: { allah: OathView[]; others: OathView[] }) {
  const [kind, setKind] = useState<OathKind>('allah');
  const [by, setBy] = useState<OathBy | null>(null);
  const byId = new Map(allah.map(oath => [oath.id, oath]));
  const chip = (label: string, value: OathBy | null) => (
    <li key={label}>
      <Chip label={label} on={by === value} onClick={() => setBy(value)} />
    </li>
  );
  return (
    <div className="flex flex-col gap-3">
      <h1 className="sr-only">الأقسام في القرآن</h1>
      <Segmented label="من أقسم" className="w-full [&>button]:flex-1" options={OATH_KINDS.map(option => ({
        key: option.kind, label: option.label, current: kind === option.kind, onClick: () => { setKind(option.kind); setBy(null); },
      }))} />
      <Reference key={kind} title={citesOf(kindQuotes(kind))} quotes={kindQuotes(kind)} />
      {kind === 'others' ? (
        <section aria-label="أقسم غيره" className="flex flex-col gap-2">
          <h2 className="sr-only">أقسم غيره</h2>
          <OathList label="أقسم غيره" oaths={others} />
        </section>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <ul aria-label="ما أُقسم به" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {chip('الكل', null)}
              {OATH_BY.map(b => chip(b.label, b.by))}
            </ul>
            <Reference title={citesOf(BY_QUOTES)} quotes={BY_QUOTES} />
          </div>
          {oathSections(by).map(section => (
            <section key={section.on} aria-label={section.title} className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5 pt-2">
                <h2 className="text-xl font-bold text-[var(--home-accent)]">{section.title}</h2>
                <Reference title={citesOf(sectionQuotes(section))} quotes={sectionQuotes(section)} />
              </div>
              <OathList label={section.title} oaths={section.oaths.map(id => byId.get(id)!)} />
            </section>
          ))}
        </>
      )}
    </div>
  );
}
