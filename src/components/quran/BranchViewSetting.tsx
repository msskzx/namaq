'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { BRANCH_VIEW_COOKIE, parseBranchView, type BranchView } from '@shared/quran/branchView';
import { VIEW_PREVIEW } from '@shared/viewPreview';
import styles from '@/components/theme/ThemeTiles.module.css';

/** A small drawing of the view, in the page's own colours. */
function Preview({ view }: { view: 'tree' | 'matrix' }) {
  const { boxes, lines } = VIEW_PREVIEW[view];
  return <svg viewBox="0 0 60 40" className="size-full" style={{ background: 'var(--home-paper)' }}>
    {lines.map(d => <path key={d} d={d} fill="none" stroke="var(--home-rule)" strokeWidth={1} />)}
    {boxes.map((box, index) => <rect key={index} x={box.x} y={box.y} width={box.w} height={box.h} rx={box.tone === 'card' ? 1.5 : 1}
      fill={box.tone === 'card' ? 'var(--home-card)' : 'var(--home-accent)'} stroke={box.tone === 'card' ? 'var(--home-rule)' : 'none'} strokeWidth={0.6} />)}
  </svg>;
}

export default function BranchViewSetting() {
  const router = useRouter();
  const ar = useLanguage().language === 'ar';
  const [view, setView] = useState<BranchView>(() => parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE)) ?? 'tree');
  const choose = (value: BranchView) => {
    Cookies.set(BRANCH_VIEW_COOKIE, value, { expires: 365, sameSite: 'lax', path: '/' });
    setView(value);
    router.refresh();
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
