import Link from 'next/link';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

type Tag = 'div' | 'li' | 'article' | 'section' | 'aside' | 'fieldset' | 'p' | 'button';

/**
 * The one card, as in the app's `ui/Card`: round (--card-radius), the card colour, a rule border; never a card inside a card.
 * `as` picks the element; `href` makes the whole card one link, `as="button"` one button. `spine` is a book's thick start edge (the home shelf). `picked` is the ink border (the one in focus), `dashed`
 * the one to look at first, `faded` one set aside. `className` is for its place and its inner layout (padding, flex, text),
 * never its frame or colour.
 */
export default function Card({ as: Element = 'div', href, spine = false, picked = false, dashed = false, faded = false, node = false, outline, className = '', ref, children, style, ...rest }: HTMLAttributes<HTMLElement> & {
  as?: Tag;
  /** A border in this colour, as the app's Card `outline` (a kind of tie on the ties ring, the answer in green). */
  outline?: string;
  href?: string;
  spine?: boolean;
  picked?: boolean;
  dashed?: boolean;
  faded?: boolean;
  /** A box of a drawing (an isnad's narrator, a book in «من أخرجه»), as the app's Card `node`: keeps its frame inside a card. */
  node?: boolean;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}) {
  const look = `rounded-[var(--card-radius)] border bg-[var(--home-card)] ${picked ? 'border-[var(--home-ink)]' : 'border-[var(--home-rule)]'} ${dashed ? 'border-dashed' : ''} ${spine ? 'border-s-[5px]' : ''} ${faded ? 'opacity-60' : ''}`;
  if (outline) style = { ...style, borderColor: outline };
  // `data-card`: a card inside a card draws flat (globals.css), as the app's Card does: no card in a card (owner, 2026-11-19).
  const press = 'block cursor-pointer text-start transition hover:border-[var(--home-accent)]';
  if (href) return <Link href={href} ref={ref as Ref<HTMLAnchorElement>} data-card="" {...(node ? { "data-node": "" } : {})} {...rest} style={style} className={`${press} ${look} ${className}`}>{children}</Link>;
  if (Element === 'button') return <button type="button" ref={ref as Ref<HTMLButtonElement>} data-card="" {...(node ? { "data-node": "" } : {})} {...rest} style={style} className={`${press} ${look} ${className}`}>{children}</button>;
  const Box = Element as 'div';
  return <Box ref={ref as Ref<HTMLDivElement>} data-card="" {...(node ? { "data-node": "" } : {})} {...rest} style={style} className={`${look} ${className}`}>{children}</Box>;
}
