'use client';

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import { formatInterval } from '@/lib/placement';
import type { DerivedBound, DerivedInterval as Interval } from '@/lib/timeline';

const nameOf = (bound: DerivedBound, ar: boolean) => (ar ? bound.name : bound.nameTransliterated || bound.name);
const pathOf = (bound: DerivedBound) => `/${bound.kind === 'event' ? 'events' : 'battles'}/${bound.slug}`;

export default function DerivedInterval({ interval, language, linked = false }: { interval: Interval; language: string; linked?: boolean }) {
  const ar = language === 'ar';
  const text = formatInterval(interval, language);
  if (!text) return null;
  const premises = [interval.from, interval.to].filter((b): b is DerivedBound => Boolean(b));
  return (
    <div className="flex flex-wrap items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
      <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
      <span>{text}</span>
      <Badge size="sm" color="gray" text={ar ? 'مشتق من النص، وليس تاريخًا' : 'Derived from the text, not a date'} />
      {linked && (
        <ul className="flex flex-wrap gap-3 text-sm font-normal text-gray-700 dark:text-gray-300">
          {premises.map((bound) => (
            <li key={bound.slug}>
              <Link href={pathOf(bound)} className="underline decoration-amber-500">
                {nameOf(bound, ar)}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!linked && premises.length > 0 && (
        <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
          {premises.map((bound) => nameOf(bound, ar)).join(ar ? '، ' : ', ')}
        </span>
      )}
    </div>
  );
}
