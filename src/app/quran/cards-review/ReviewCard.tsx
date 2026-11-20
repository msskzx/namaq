'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, CircleHelp, X } from 'lucide-react';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { branchesHref } from '@shared/quran/branches';
import Segmented from '@/components/common/Segmented';
import AyahCards from '../branches/AyahCards';
import { CARD_KINDS, OPEN_RULES, rowsChanged, type CardPress, type CardProposal, type CardReviewEntry, type ReviewVersion } from '@/lib/quran/curation/cardReviewIndex';

type Action = Exclude<CardPress['action'], 'undo'>;
type Pressed = { action: Action; version: ReviewVersion } | undefined;

/** Text that may hold Arabic lines: each line takes its own direction, so Arabic never sits inside an English line. */
const Lines = ({ text }: { text: string }) => <>{text.split('\n').map((line, i) => <span key={i} dir="auto" className="block">{line}</span>)}</>;

/** The matrix mounts when its card nears the screen, so a page of a hundred cards loads only what is looked at. */
function LazyMatrix({ rows, names }: { rows: string[][]; names: Record<number, string> }) {
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = box.current;
    if (!element || seen) return;
    if (typeof IntersectionObserver === 'undefined') return setSeen(true);
    const observer = new IntersectionObserver(entries => entries.some(entry => entry.isIntersecting) && setSeen(true), { rootMargin: '600px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen]);
  return <div ref={box} className={seen ? '' : 'min-h-40'}>{seen && <AyahCards ayahKeys={rows.map(row => row[0])} passageKeys={rows} names={names} />}</div>;
}

const keepLabel = (keep: boolean) => (keep ? 'Keep' : 'Drop');

/**
 * One card on the review page: the card as it is, the agents' version behind a switch when they changed its ayat, both verdicts,
 * and the owner's three choices. A press appends to the log for the version on screen; pressing the same choice again undoes it.
 */
export default function ReviewCard({ number, entry, reviewId, proposal, pressed, names }: { number: number; entry: CardReviewEntry; reviewId: string; proposal?: CardProposal; pressed: Pressed; names: Record<number, string> }) {
  const reshaped = rowsChanged(entry, proposal);
  const [version, setVersion] = useState<ReviewVersion>('original');
  const [chosen, setChosen] = useState<Pressed | null>(null);
  const [failed, setFailed] = useState(false);
  const current = chosen === null ? pressed : chosen;
  const send = async (action: Action) => {
    const undo = current?.action === action && current.version === version;
    setChosen(undo ? undefined : { action, version });
    setFailed(false);
    try {
      const response = await fetch('/api/quran/card-review', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: reviewId, action: undo ? 'undo' : action, version }) });
      if (!response.ok) throw new Error(String(response.status));
    } catch {
      setChosen(null);
      setFailed(true);
    }
  };
  const cards = version === 'agents' && proposal?.cards ? proposal.cards : [entry.rows];
  const kind = CARD_KINDS.find(option => option.id === entry.kind)!;
  const choices = [
    { action: 'keep' as const, label: 'إبقاء', Icon: Check },
    { action: 'drop' as const, label: 'حذف', Icon: X },
    { action: 'discuss' as const, label: 'للنقاش', Icon: CircleHelp },
  ];
  // Not a card: the matrix inside is framed already, and a card never holds a card (owner 2026-11-19).
  return <article className="flex flex-col gap-3 border-t border-[var(--home-rule)] pt-4" data-review-card={entry.id}>
    <header className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--home-muted)]">
      <span>{number}</span>
      <span>{kind.ar}</span>
      {entry.books?.map(book => <span key={book}>{book}</span>)}
      {entry.twin && <span>مشتركة مع المقارنة</span>}
      {entry.title && <span className="text-[var(--home-ink)]">{entry.title}</span>}
    </header>
    {reshaped && <Segmented label="أي نسخة" options={[
      { key: 'original', label: 'الأصل', current: version === 'original', onClick: () => setVersion('original') },
      { key: 'agents', label: 'نسخة الوكلاء', current: version === 'agents', onClick: () => setVersion('agents') },
    ]} />}
    {cards.map((rows, i) => <div key={`${version}:${i}`} className="flex flex-col gap-1">
      {cards.length > 1 && <p className="text-sm text-[var(--home-muted)]">البطاقة {i + 1} من {cards.length}</p>}
      <LazyMatrix rows={rows} names={names} />
    </div>)}
    <div dir="ltr" className="flex flex-col gap-2 text-sm">
      <div data-verdict="original">
        <p className="font-semibold">Before: {entry.verdict ? `${keepLabel(entry.verdict.keep)}${entry.verdict.checked ? ' (owner checked)' : ' (draft)'}` : 'no verdict'}</p>
        {entry.verdict && <p className="text-[var(--home-muted)]"><Lines text={entry.verdict.why} /></p>}
      </div>
      {proposal && <div data-verdict="agents">
        <p className={`font-semibold ${proposal.keep ? 'text-[var(--home-green)]' : 'text-[var(--home-accent)]'}`}>Agents: {keepLabel(proposal.keep)}{proposal.search ? ' (search only)' : ''}{proposal.unsure ? ' (unsure)' : ''}</p>
        <p><Lines text={proposal.why} /></p>
        {proposal.same && <p><Link className="underline" href={branchesHref(proposal.same)}>Open the book card</Link></p>}
        {proposal.relation && <p><span className="font-semibold">Relation: </span><Lines text={proposal.relation} /></p>}
        {proposal.changes && <p><span className="font-semibold">Changes: </span><Lines text={proposal.changes} /></p>}
        {proposal.flags?.map(flag => <p key={flag} className="text-[var(--home-muted)]">Open rule: {OPEN_RULES[flag]}</p>)}
        {proposal.check && <p className="text-[var(--home-muted)]">Second agent {proposal.check.agree ? 'agrees' : 'disagrees'}: <Lines text={proposal.check.why} /></p>}
      </div>}
    </div>
    <div className="flex items-center gap-1" data-card-review>
      {choices.map(({ action, label, Icon }) => {
        const on = current?.action === action && current.version === version;
        return <Button key={action} size="lg" variant="muted" active={on} aria-pressed={on} aria-label={label} title={label} onClick={() => send(action)}><Icon aria-hidden /></Button>;
      })}
      {current && current.version !== version && <span className="text-sm text-[var(--home-muted)]">{current.version === 'agents' ? 'قرارك على نسخة الوكلاء' : 'قرارك على الأصل'}</span>}
      {failed && <p role="alert" className="text-sm text-[var(--home-accent)]">تعذّر الحفظ.</p>}
    </div>
  </article>;
}
