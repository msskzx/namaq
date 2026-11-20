'use client';

import { useState } from 'react';
import { BookMarked } from 'lucide-react';
import { mergeSources, sourceEntries, type QuizSource } from '@shared/quiz/sources';
import ExternalLink from './ExternalLink';
import Sheet from './Sheet';
import TapRow from './TapRow';
import type { Source } from './sourceSlot';

/** A card's books as source-line entries, one for each book (shared/quiz/sources.ts referenceGroups). */
export const sourcesOf = (sources: QuizSource[]): Source[] => sourceEntries(sources);

/**
 * A home card's source line (owner 2026-11-20, like an Instagram post's line under its buttons): a book icon and the
 * books (`named`), muted, no arrow; a click anywhere on it opens a sheet with each book's places, words and links
 * (`sources`). As the app's ui/SourceLine.tsx.
 */
export default function SourceLine({ named, sources }: {
  /** The books named on the line; all of `sources` when left out (a page heading's line). */
  named?: Source[]; sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;
  const line = [...new Set((named ?? sources).map(source => source.line))].join('، ');
  // A book named on the line with nothing more to say is left out of the sheet when what the card holds says where in it.
  const books = mergeSources(sources);
  const told = books.filter(source => source.quotes.length || source.links?.length);
  return <>
    <div className="flex px-3" data-share-skip>
      <TapRow onClick={() => setOpen(true)} label={`المصدر: ${line}`} className="min-w-0 gap-1.5 text-sm text-[var(--home-muted)]">
        <BookMarked size={15} aria-hidden className="shrink-0" />
        <span className="truncate">{line}</span>
      </TapRow>
    </div>
    <Sheet open={open} onClose={() => setOpen(false)} label="المصدر">
      <div className="flex flex-col gap-3.5 px-4 pb-6 pt-4">
        <h2 className="text-base font-bold">المصدر</h2>
        {(told.length ? told : books).map((source, at) => (
          <div key={`${at}:${source.line}`} className="flex flex-col gap-1 leading-relaxed">
            <p className="font-semibold">{source.line}</p>
            {source.quotes.map((quote, i) => <p key={i} className="text-sm text-[var(--home-muted)]">
              {quote.url ? <>{quote.text && `«${quote.text}» `}<ExternalLink href={quote.url} className="text-[var(--home-muted)]">{quote.cite}</ExternalLink></> : quote.text}
            </p>)}
            {(source.links ?? []).map(link => <ExternalLink key={link.url} href={link.url} className="text-sm text-[var(--home-accent)]">{link.label}</ExternalLink>)}
          </div>
        ))}
      </div>
    </Sheet>
  </>;
}
