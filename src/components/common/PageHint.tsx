"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Pointer, X } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import { HINTS, HINTS_SEEN, hintOfPath, parseHintsSeen, type HintId } from '@shared/tabHints';
import styles from './PageHint.module.css';

function readSeen(): HintId[] {
  try { return parseHintsSeen(localStorage.getItem(HINTS_SEEN)); } catch { return [...Object.keys(HINTS)] as HintId[]; }
}

/** Replaying the tour (the settings sheet's «الجولة التعريفية») brings every page's tip back. */
export function resetHints() {
  try { localStorage.removeItem(HINTS_SEEN); } catch { /* nothing kept, nothing to clear */ }
}

/**
 * The app's first-visit tip (mobile/src/components/TabHint.tsx): one line on a see-through card just above the phone
 * tab bar, or at the foot of the page beside the desktop rail. A click on it or its × puts it away for good.
 * Hidden while reciting, since the mushaf's tip names the reading touches.
 */
export default function PageHint() {
  const path = usePathname() ?? '/';
  const { language } = useLanguage();
  const id = hintOfPath(path);
  // Read after mounting: the server has no storage, so it renders no tip.
  const [seen, setSeen] = useState<HintId[] | null>(null);
  useEffect(() => setSeen(readSeen()), [path]);
  if (!id || !seen || seen.includes(id)) return null;
  const text = HINTS[id][language === 'en' ? 'en' : 'ar'];
  const close = () => {
    const next = [...readSeen().filter(item => item !== id), id];
    try { localStorage.setItem(HINTS_SEEN, JSON.stringify(next)); } catch { /* shows again next visit */ }
    setSeen(next);
  };
  return (
    <button type="button" className={styles.hint} onClick={close} dir={language === 'en' ? 'ltr' : 'rtl'}
      aria-label={`${text} ${language === 'en' ? 'Click to hide this tip.' : 'اضغط لإخفاء التلميح.'}`}>
      <Pointer size={22} className={styles.icon} aria-hidden />
      <span className={styles.text}>{text}</span>
      <X size={18} className={styles.close} aria-hidden />
    </button>
  );
}
