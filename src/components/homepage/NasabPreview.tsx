'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { layoutNasab, type NasabPerson } from '@/lib/relationship/nasabLayout';
import NasabPlot from '../nasab/NasabPlot';
import { useLanguage } from '../language/LanguageContext';
import { NASAB_SUBJECTS } from './homeLinks';
import styles from './Home.module.css';
import FitDiagram from './FitDiagram';

const URL = `/api/nasab?${new URLSearchParams(NASAB_SUBJECTS.map(slug => ['person', slug]))}`;

export default function NasabPreview() {
  const ar = useLanguage().language === 'ar';
  const { data, error, isLoading } = useSWR<{ people: NasabPerson[]; subjects: string[] }>(URL, fetcher, { revalidateOnFocus: false });
  const layout = useMemo(() => data ? layoutNasab(data.people, data.subjects) : null, [data]);
  return (
    <div className={styles.nasab}>
      {isLoading && <p role="status">{ar ? 'جارٍ تحميل النسب…' : 'Loading the lineages…'}</p>}
      {error && <p role="alert">{ar ? 'تعذر تحميل النسب.' : 'Could not load the lineages.'}</p>}
      {layout && layout.nodes.length > 0 && <FitDiagram><NasabPlot layout={layout} isArabic={ar} /></FitDiagram>}
    </div>
  );
}
