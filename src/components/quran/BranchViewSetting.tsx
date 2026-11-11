'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { BRANCH_VIEW_COOKIE, parseBranchView, type BranchView } from '@shared/quran/branchView';
import { SAMPLE_TREE, TREE_LAYOUT, TREE_LINES } from '@shared/viewPreview';
import styles from '@/components/theme/ThemeTiles.module.css';

/** The view drawn small in the page's own colours, with the إن المتقين في tree as its sample; both colour the words every ayah shares, as the real views do. */
function Preview({ view }: { view: 'tree' | 'matrix' }) {
  if (view === 'matrix') return <span className={styles.matrix}>
    {SAMPLE_TREE.endings.map(ending => <span key={ending.words} className={styles.row}>
      <b>{SAMPLE_TREE.trunk.join(' ')}</b> {ending.words}
    </span>)}
  </span>;
  const { trunk, ending } = TREE_LAYOUT;
  return <span className={styles.tree}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
      {TREE_LINES.map(d => <path key={d} d={d} fill="none" stroke="var(--home-rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
    </svg>
    <span className={styles.node} data-shared style={{ right: `${trunk.right}%`, top: `${trunk.top}%`, width: `${trunk.width}%`, height: `${trunk.height}%` }}>
      {SAMPLE_TREE.trunk.map(line => <span key={line}>{line}</span>)}
    </span>
    {SAMPLE_TREE.endings.map((leaf, index) => <span key={leaf.words} className={styles.node}
      style={{ left: `${ending.left}%`, top: `${ending.tops[index]}%`, width: `${ending.width}%`, height: `${ending.height}%` }}>{leaf.words}</span>)}
  </span>;
}

/** `onPick` hears every choice, even of the view already set (the first-visit tour waits for one). */
export default function BranchViewSetting({ onPick }: { onPick?: () => void } = {}) {
  const router = useRouter();
  const ar = useLanguage().language === 'ar';
  const [view, setView] = useState<BranchView>(() => parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE)) ?? 'tree');
  const choose = (value: BranchView) => {
    Cookies.set(BRANCH_VIEW_COOKIE, value, { expires: 365, sameSite: 'lax', path: '/' });
    setView(value);
    router.refresh();
    onPick?.();
  };
  const label = ar ? 'العرض الافتراضي للمتشابه' : 'Default similar-ayat view';
  const options = [
    { key: 'tree' as const, drawing: 'tree' as const, name: ar ? 'شجرة' : 'Tree' },
    { key: 'cards' as const, drawing: 'matrix' as const, name: ar ? 'مصفوفة' : 'Matrix' },
  ];
  return <div className="flex flex-col gap-2">
    <span aria-hidden className="text-sm text-[var(--home-muted)]">{label}</span>
    <div role="group" aria-label={label} className={`${styles.tiles} ${styles.short}`}>
      {options.map(option => {
        const on = view === option.key;
        return <button key={option.key} type="button" aria-pressed={on} title={option.name} onClick={() => choose(option.key)} className={styles.tile}>
          <span className={styles.thumb} aria-hidden>
            <Preview view={option.drawing} />
            {on && <span className={styles.check}><Check size={10} strokeWidth={3} aria-hidden /></span>}
          </span>
          <span>{option.name}</span>
        </button>;
      })}
    </div>
  </div>;
}
