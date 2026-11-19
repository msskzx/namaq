import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'outline' | 'highlight' | 'ghost' | 'muted' | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'icon' | 'lg' | 'round';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  ghost: 'text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]',
  muted: 'text-[var(--home-muted)] hover:text-[var(--home-ink)] hover:bg-[var(--home-paper-deep)]',
  neutral: 'border border-[var(--home-rule)] bg-[var(--home-paper-deep)] text-[var(--home-muted)] hover:text-[var(--home-ink)]',
  highlight: 'bg-[var(--home-highlight)] text-[var(--home-on-highlight)] hover:opacity-90',
  primary: 'bg-[var(--button-color,var(--home-action,var(--home-accent)))] text-[var(--button-ink,var(--home-on-action,var(--home-paper)))] hover:opacity-90',
  outline: 'border border-[var(--button-color,var(--home-rule))] text-[var(--button-color,var(--home-accent))] hover:bg-[var(--home-paper-deep)]',
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  icon: 'p-2',
  lg: 'size-11 shrink-0 [&_svg]:size-5',
  /** An icon alone in a circle, beside a title or under a card (close, share, open in the mushaf). */
  round: 'size-9 shrink-0 [&_svg]:size-[18px]',
};
/**
 * Every button gives the finger at least 44 × 44 px (owner, 2026-11-19, as the app's ui/tapSize.ts): an invisible
 * ::after reaches past a smaller box, so the look stays and the icon never grows. The button holds it (relative)
 * unless the page already places the button itself.
 */
export const TAP_FLOOR = "after:absolute after:content-[''] after:inset-[min(0px,calc((100%_-_44px)/2))]";
const placed = (className?: string) => /(^|[\s:])(absolute|fixed|sticky)(\s|$)/.test(className ?? '');
function classesFor(variant: ButtonVariant, size: ButtonSize, active: boolean, className?: string) {
  return ['inline-flex items-center justify-center gap-2 transition', TAP_FLOOR, placed(className) ? '' : 'relative', size === 'round' ? 'rounded-full' : 'rounded-sm', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--home-accent)] disabled:opacity-50 disabled:cursor-not-allowed', SIZE_CLASSES[size], VARIANT_CLASSES[active ? 'primary' : variant], active && (variant === 'outline' || variant === 'neutral') ? 'border border-[var(--button-color,var(--home-accent))]' : '', className].filter(Boolean).join(' ');
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  tone?: string;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

type LinkButtonProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, 'className' | 'children'> & { href: React.ComponentProps<typeof Link>['href'] };

export default function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'outline', size = 'md', active = false, tone, className, children, ...rest } = props;
  const style = tone ? { ...rest.style, '--button-color': tone, '--button-ink': 'var(--home-paper)' } as React.CSSProperties : rest.style;
  const classes = classesFor(variant, size, active, className);
  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkButtonProps;
    return <Link data-button data-variant={variant} data-active={active || undefined} href={href} className={classes} {...linkRest} style={style}>{children}</Link>;
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps;
  return <button data-button data-variant={variant} data-active={active || undefined} type={type} className={classes} {...buttonRest} style={style}>{children}</button>;
}
