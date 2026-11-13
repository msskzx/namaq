import type { AnchorHTMLAttributes } from 'react';
import { SquareArrowOutUpLeft } from 'lucide-react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> & { href: string };

/**
 * Every link that leaves Namaq: opens in a new tab and ends with the out-of-site mark, small and in the link's own colour.
 * A word joiner keeps the mark on the last word's line. The arrow points the way the line reads: up-left in Arabic, mirrored up-right in English. Internal links use next/link.
 */
export default function ExternalLink({ href, children, ...props }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
      <span data-external-mark aria-hidden className="whitespace-nowrap">{'\u2060'}<SquareArrowOutUpLeft className="ms-1 inline-block size-[0.8em] align-[-0.05em] [&:dir(ltr)]:-scale-x-100" /></span>
    </a>
  );
}
