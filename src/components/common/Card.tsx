import Link from 'next/link';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

type Tag = 'div' | 'li' | 'article' | 'section' | 'aside' | 'fieldset' | 'p' | 'button';

/**
 * The one card, as in the app's `ui/Card`: round (--card-radius), the card colour, a rule border; never a card inside a card.
 * `as` picks the element; `href` makes the whole card one link, `as="button"` one button. `spine` is a book's thick start edge (the home shelf). `picked` is the ink border (the one in focus), `dashed`
 * the one to look at first, `faded` one set aside. `className` is for its place and its inner layout (padding, flex, text),
 * never its frame or colour.
 */
export default function Card({ as: Element = 'div', href, spine = false, picked = false, dashed = false, faded = false, className = '', ref, children, ...rest }: HTMLAttributes<HTMLElement> & {
  as?: Tag;
  href?: string;
  spine?: boolean;
  picked?: boolean;
  dashed?: boolean;
  faded?: boolean;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}) {
  const look = `rounded-[var(--card-radius)] border bg-[var(--home-card)] ${picked ? 'border-[var(--home-ink)]' : 'border-[var(--home-rule)]'} ${dashed ? 'border-dashed' : ''} ${spine ? 'border-s-[5px]' : ''} ${faded ? 'opacity-60' : ''}`;
  const press = 'block cursor-pointer text-start transition hover:border-[var(--home-accent)]';
  if (href) return <Link href={href} ref={ref as Ref<HTMLAnchorElement>} {...rest} className={`${press} ${look} ${className}`}>{children}</Link>;
  if (Element === 'button') return <button type="button" ref={ref as Ref<HTMLButtonElement>} {...rest} className={`${press} ${look} ${className}`}>{children}</button>;
  const Box = Element as 'div';
  return <Box ref={ref as Ref<HTMLDivElement>} {...rest} className={`${look} ${className}`}>{children}</Box>;
}
