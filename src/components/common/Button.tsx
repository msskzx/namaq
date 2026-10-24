import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'outline' | 'highlight' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  ghost: 'text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]',
  highlight: 'bg-[var(--home-highlight)] text-[var(--home-on-highlight)] hover:opacity-90',
  primary: 'bg-[var(--home-accent)] text-[var(--home-paper)] hover:opacity-90',
  outline: 'border border-[var(--home-rule)] text-[var(--home-accent)] hover:bg-[var(--home-paper-deep)]',
};
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  icon: 'p-2',
};
function classesFor(variant: ButtonVariant, size: ButtonSize, active: boolean, className?: string) {
  return ['inline-flex items-center justify-center gap-2 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed', SIZE_CLASSES[size], VARIANT_CLASSES[active ? 'primary' : variant], active && variant === 'outline' ? 'border border-[var(--home-accent)]' : '', className].filter(Boolean).join(' ');
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };

type LinkButtonProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, 'className' | 'children'> & { href: React.ComponentProps<typeof Link>['href'] };

export default function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'outline', size = 'md', active = false, className, children, ...rest } = props;
  const classes = classesFor(variant, size, active, className);
  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkButtonProps;
    return <Link data-button data-variant={variant} data-active={active || undefined} href={href} className={classes} {...linkRest}>{children}</Link>;
  }
  const { type = 'button', ...buttonRest } = rest as ButtonProps;
  return <button data-button data-variant={variant} data-active={active || undefined} type={type} className={classes} {...buttonRest}>{children}</button>;
}
