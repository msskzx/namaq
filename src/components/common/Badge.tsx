import React from 'react';
import Link from 'next/link';

interface BadgeProps {
  text: string;
  href?: string;
  color?: string; // Tailwind color, e.g., 'bg-indigo-900'
  size?: 'sm' | 'lg';
}

function getColorClass(color: string) {
  if (color.includes('indigo')) return 'bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 border-indigo-400';
  if (color.includes('gray')) return 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-400';
  if (color.includes('amber')) return 'bg-amber-50 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 border-amber-400';
  if (color.includes('blue')) return 'bg-blue-50 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 border-blue-400';
  return '';
}

function Badge({ text, href, color = 'indigo', size = 'lg' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-sm' : 'px-3 py-1 text-lg';
  const baseClasses = `${getColorClass(color)} border rounded text-gray-800 dark:text-gray-200 transition ${sizeClasses}`;
  if (href) {
    return (
      <Link href={href} className="inline-block">
        <span className={baseClasses}>{text}</span>
      </Link>
    );
  }
  return <span className={`inline-block ${baseClasses}`}>{text}</span>;
};

export default Badge; 