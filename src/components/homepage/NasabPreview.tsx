'use client';

import { useMemo, type CSSProperties } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { layoutNasab, type NasabPerson } from '@/lib/relationship/nasabLayout';
import NasabPlot, { nasabPlotHeight, nasabRowTop } from '../nasab/NasabPlot';
import { useLanguage } from '../language/LanguageContext';
import { NASAB_SUBJECTS } from './homeLinks';
import styles from './Home.module.css';
import FitDiagram from './FitDiagram';

const FADE_ROWS = 2;
const URL = `/api/nasab?${new URLSearchParams(NASAB_SUBJECTS.map(slug => ['person', slug]))}`;

export default function NasabPreview() {
  const ar = useLanguage().language === 'ar';
  const { data, error, isLoading } = useSWR<{ people: NasabPerson[]; subjects: string[] }>(URL, fetcher, { revalidateOnFocus: false });
  const layout = useMemo(() => data ? layoutNasab(data.people, data.subjects) : null, [data]);
  const crop = useMemo(() => {
    if (!layout || layout.chains.length === 0) return null;
    const shared = layout.chains.map(chain => new Set(chain.slugs)).reduce((a, b) => new Set([...a].filter(slug => b.has(slug))));
    const meeting = Math.max(...layout.nodes.filter(node => shared.has(node.slug)).map(node => node.row));
    const height = nasabPlotHeight(layout);
    const top = Math.max(0, nasabRowTop(meeting - FADE_ROWS));
    return { keep: (height - top) / height, fade: (nasabRowTop(meeting) - top) / (height - top) };
  }, [layout]);
  return (
    <div className={styles.nasab}>
      {isLoading && <p role="status">{ar ? 'جارٍ تحميل النسب…' : 'Loading the lineages…'}</p>}
      {error && <p role="alert">{ar ? 'تعذر تحميل النسب.' : 'Could not load the lineages.'}</p>}
      {layout && layout.nodes.length > 0 && (
        <div className={styles.fadeTop} style={crop ? { '--fade': `${crop.fade * 100}%` } as CSSProperties : undefined}>
          <FitDiagram keepBottom={crop?.keep}><NasabPlot layout={layout} isArabic={ar} /></FitDiagram>
        </div>
      )}
    </div>
  );
}
