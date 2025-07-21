import React from 'react';
import Link from 'next/link';

interface BadgeProps {
  text: string;
  href?: string;
  color?: string; // Tailwind color, e.g., 'bg-indigo-900'
  className?: string;
}

function getHoverClass(color: string) {
  if (color.includes('bg-indigo-900')) return 'hover:bg-indigo-800 dark:hover:bg-indigo-800';
  if (color.includes('bg-gray-900')) return 'hover:bg-gray-800 dark:hover:bg-gray-800';
  if (color.includes('bg-amber-900')) return 'hover:bg-amber-800 dark:hover:bg-amber-800';
  if (color.includes('bg-blue-900')) return 'hover:bg-blue-800 dark:hover:bg-blue-800';
  return '';
}

const Badge: React.FC<BadgeProps> = ({ text, href, color = 'bg-gray-200 dark:bg-gray-700', className = '' }) => {
  const hoverClass = getHoverClass(color);
  const baseClasses = `${color} ${hoverClass} rounded px-3 py-1 text-sm text-gray-800 dark:text-gray-200 transition ${className}`;
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