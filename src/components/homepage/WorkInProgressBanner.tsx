'use client';

import { useEffect, useRef, useState } from 'react';
import { TriangleAlert, X } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';
import Button from '../common/Button';

const SESSION_KEY = 'namaq-review-notice-seen';

export default function WorkInProgressBanner() {
  const { language, languageLoaded } = useLanguage();
  const [visible, setVisible] = useState(false);
  const eligible = useRef<boolean | undefined>(undefined);
  useEffect(() => {
    if (!languageLoaded) return;
    if (eligible.current === undefined) {
      eligible.current = true;
      try {
        eligible.current = !sessionStorage.getItem(SESSION_KEY);
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {}
    }
    if (!eligible.current) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [languageLoaded]);
  if (!visible) return null;
  return (
    <aside role="status" dir={language === 'ar' ? 'rtl' : 'ltr'} className="fixed top-24 inset-x-4 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-sm border border-[var(--home-rule)] bg-[var(--home-paper-deep)] p-4 text-start text-sm leading-relaxed text-[var(--home-ink)] shadow-lg">
      <TriangleAlert aria-hidden className="mt-1 size-4 shrink-0 text-[var(--home-accent)]" />
      <p>{translations[language].workInProgress}</p>
      <Button size="icon" onClick={() => setVisible(false)} aria-label={language === 'ar' ? 'إغلاق التنبيه' : 'Dismiss notice'} className="shrink-0"><X size={16} aria-hidden /></Button>
    </aside>
  );
}
