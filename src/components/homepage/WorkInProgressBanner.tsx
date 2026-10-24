import { TriangleAlert } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';

export default function WorkInProgressBanner() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div
      role="note"
      className="mb-8 flex items-start gap-3 border-s-2 border-[var(--home-rule)] ps-3 text-start text-sm leading-relaxed text-[var(--home-muted)]"
    >
      <TriangleAlert
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-[var(--home-accent)]"
      />
      <p className="font-Cairo">{t.workInProgress}</p>
    </div>
  );
}