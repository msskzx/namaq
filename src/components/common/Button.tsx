import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'outline' | 'highlight' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  ghost: 'text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800',
  highlight: 'bg-amber-400 text-gray-950 hover:bg-amber-300',
  primary: 'bg-amber-400 text-gray-950 hover:bg-amber-300',
  outline: 'border border-amber-400 text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  icon: 'px-2 py-1.5',
};

const BASE_CLASSES = 'inline-flex items-center gap-2 rounded transition disabled:opacity-50';

const ACTIVE_CLASSES = 'bg-amber-400 text-gray-950 hover:bg-amber-300';

function classesFor(variant: ButtonVariant, size: ButtonSize, active: boolean, className?: string) {
  const look = active ? ACTIVE_CLASSES : VARIANT_CLASSES[variant];
  const border = active && variant === 'outline' ? 'border border-amber-400' : '';
  return [BASE_CLASSES, SIZE_CLASSES[size], look, border, className].filter(Boolean).join(' ');
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
