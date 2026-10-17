import React from 'react';
import Link from 'next/link';

interface ExplorationCardProps {
  title: string;
  desc: string;
  url: string;
}

export default function ExplorationCard({ title, desc, url }: ExplorationCardProps) {
  return (
    <Link
      href={url}
      className="group block rounded-xl border border-gray-200 bg-white p-6 transition hover:border-amber-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-amber-600 dark:text-gray-100 dark:group-hover:text-amber-300">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
    </Link>
  );
}
