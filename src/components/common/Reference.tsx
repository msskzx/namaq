import { ChevronDown } from 'lucide-react';
import ExternalLink from './ExternalLink';

/** A quote from a book: its words, with the page it cites as a link. A quote with no page is our own note on the ones above. */
export type Quote = { text: string; cite?: string; url?: string };

/**
 * A section's reference, collapsed to the book and page it cites (a muted line with a chevron); a tap opens the quotes,
 * the first in ink, the rest smaller. The phone app has the same in mobile/src/ui/Reference.tsx.
 */
export default function Reference({ title, quotes }: { title: string; quotes: Quote[] }) {
  return (
    <details className="group text-[var(--home-muted)]">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-1 text-sm [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={14} aria-hidden className="group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-1 pt-1 leading-relaxed">
        {quotes.map((quote, i) => (
          <p key={quote.text} className={i ? 'text-sm' : 'text-[var(--home-ink)]'}>
            {quote.url ? <>«{quote.text}» <ExternalLink className="whitespace-nowrap text-sm text-[var(--home-muted)]" href={quote.url}>{quote.cite}</ExternalLink></> : quote.text}
          </p>
        ))}
      </div>
    </details>
  );
}
