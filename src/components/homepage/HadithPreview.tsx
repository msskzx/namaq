'use client';

import { useState } from 'react';
import HadithBody, { sceneColours } from '../hadith/HadithBody';
import HadithModeToggle, { type HadithMode } from '../hadith/HadithModeToggle';
import type { HadithUnitView } from '@/lib/model/hadithView';
import styles from './Home.module.css';

const opening = (report: HadithUnitView['reports'][number]) => ({
  ...report,
  scenes: report.scenes.slice(0, 2).map((scene, index) => index === 0 ? scene : { ...scene, lines: scene.lines.slice(0, 2) }),
});

export default function HadithPreview({ view }: { view: HadithUnitView }) {
  const [mode, setMode] = useState<HadithMode>('bubbles');
  return (
    <div className={styles.hadithExample}>
      <HadithModeToggle mode={mode} onChange={setMode} />
      <div className={mode === 'text' ? `${styles.fadeBottom} ${styles.capped}` : styles.fadeBottom}>
        {view.reports.filter(report => report.voice !== 'AUTHOR').map(report => opening(report)).map(report => <HadithBody key={report.id} report={report} view={view} mode={mode} colours={sceneColours(report.scenes)} />)}
      </div>
    </div>
  );
}
