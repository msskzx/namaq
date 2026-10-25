'use client';

import { useMemo, type CSSProperties } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { layoutNasab, type NasabLayout, type NasabPerson } from '@/lib/relationship/nasabLayout';
import NasabPlot, { nasabPlotHeight, nasabRowTop } from '../nasab/NasabPlot';
import { useLanguage } from '../language/LanguageContext';
import { NASAB_SUBJECTS } from './homeLinks';
import styles from './Home.module.css';
import FitDiagram from './FitDiagram';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FADE_ROWS = 2;
const URL = `/api/nasab?${new URLSearchParams(NASAB_SUBJECTS.map(slug => ['person', slug]))}`;

export function nasabCrop(layout: NasabLayout) {
  if (layout.chains.length < 2) return null;
  const shared = layout.chains.map(chain => new Set(chain.slugs)).reduce((a, b) => new Set([...a].filter(slug => b.has(slug))));
  const rows = layout.nodes.filter(node => shared.has(node.slug)).map(node => node.row);
  if (rows.length === 0) return null;
  const meeting = Math.max(...rows);
  const height = nasabPlotHeight(layout);
  const top = Math.max(0, nasabRowTop(meeting - FADE_ROWS));
  return { keep: (height - top) / height, fade: (nasabRowTop(meeting) - top) / (height - top) };
}

export default function NasabPreview() {
  const ar = useLanguage().language === 'ar';
  const { data, error, isLoading } = useSWR<{ people: NasabPerson[]; subjects: string[] }>(URL, fetcher, { revalidateOnFocus: false });
  const layout = useMemo(() => data ? layoutNasab(data.people, data.subjects) : null, [data]);
  const crop = useMemo(() => layout && nasabCrop(layout), [layout]);
  return (
    <div className={styles.nasab}>
      {isLoading && <LoadingSpinner />}
      {error && <p role="alert">{ar ? 'تعذر تحميل النسب.' : 'Could not load the lineages.'}</p>}
      {layout && layout.nodes.length > 0 && (
        <div className={styles.fadeTop} style={crop ? { '--fade': `${crop.fade * 100}%` } as CSSProperties : undefined}>
          <FitDiagram keepBottom={crop?.keep}><NasabPlot layout={layout} isArabic={ar} /></FitDiagram>
        </div>
      )}
    </div>
  );
}
