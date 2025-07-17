import React from 'react';
import Link from 'next/link';

interface BadgeProps {
  text: string;
  href?: string;
  color?: string; // Tailwind color, e.g., 'bg-blue-200'
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, href, color = 'bg-gray-200 dark:bg-gray-700', className = '' }) => {
  const baseClasses = `${color} rounded px-3 py-1 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition ${className}`;
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