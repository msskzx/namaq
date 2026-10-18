'use client';

import { useState } from 'react';
import HadithBody, { sceneColours } from '../hadith/HadithBody';
import HadithModeToggle, { type HadithMode } from '../hadith/HadithModeToggle';
import type { HadithUnitView } from '@/lib/model/hadithView';
import styles from './Home.module.css';

export default function HadithPreview({ view }: { view: HadithUnitView }) {
  const [mode, setMode] = useState<HadithMode>('bubbles');
  return (
    <div className={styles.hadithExample}>
      <HadithModeToggle mode={mode} onChange={setMode} />
      {view.reports.filter(report => report.voice !== 'AUTHOR').map(report => <HadithBody key={report.id} report={report} view={view} mode={mode} colours={sceneColours(report.scenes)} />)}
    </div>
  );
}
