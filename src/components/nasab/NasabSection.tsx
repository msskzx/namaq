'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import Button from '@/components/common/Button';
import { fetcher } from '@/lib/swr';
import { layoutNasab, type NasabPerson } from '@/lib/relationship/nasabLayout';
import NasabPlot from './NasabPlot';

// See docs/plans/nasab-plot.md.
export default function NasabSection({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { data } = useSWR<{ people: NasabPerson[]; subjects: string[] }>(`/api/nasab?person=${encodeURIComponent(slug)}`, fetcher);
  const layout = useMemo(() => (data ? layoutNasab(data.people, data.subjects) : null), [data]);

  if (!layout || layout.nodes.length < 2) return null;

  return (
    <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-3xl text-gray-900 dark:text-gray-200">{isArabic ? 'شجرة النسب' : 'Nasab tree'}</h2>
        <Button size="sm" href={`/nasab?subject=person:${slug}`}>
          <FontAwesomeIcon icon={faSitemap} />
          {isArabic ? 'قارن مع غيره' : 'Compare with others'}
        </Button>
      </div>
      <NasabPlot layout={layout} isArabic={isArabic} className="max-h-96" />
    </div>
  );
}
