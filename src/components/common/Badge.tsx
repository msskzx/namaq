import React from 'react';
import Link from 'next/link';

interface BadgeProps {
  text: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

const COLORS: Record<string, string> = {
  gray: 'border-[var(--home-rule)] text-[var(--home-ink)]',
  amber: 'border-[var(--home-highlight-border)] text-[var(--home-ink)]',
  indigo: 'border-[var(--home-root)] text-[var(--home-root)]',
  blue: 'border-[var(--home-slot-1)] text-[var(--home-slot-1)]',
  emerald: 'border-[var(--home-green)] text-[var(--home-green)]',
  rose: 'border-[var(--home-accent)] text-[var(--home-accent)]',
};

function Badge({ text, href, onClick, color = 'gray', size = 'lg', className = '' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-sm' : 'px-3 py-1 text-lg';
  const baseClasses = `${COLORS[color] ?? COLORS.gray} border rounded-sm bg-[var(--home-paper-deep)] transition ${sizeClasses} ${className}`;
  if (href) {
    return (
      <Link href={href} className="inline-block">
        <span className={baseClasses}>{text}</span>
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`inline-block ${baseClasses}`}>
        {text}
      </button>
    );
  }
  return <span className={`inline-block ${baseClasses}`}>{text}</span>;
};

export default Badge; 