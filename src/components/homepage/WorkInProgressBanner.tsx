import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../language/LanguageContext';
import translations from '../language/translations';

export default function WorkInProgressBanner() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div
      role="note"
      className="mb-8 flex items-start gap-3 rounded-lg border border-amber-400 bg-amber-50 p-4 text-start text-sm leading-relaxed text-amber-900 sm:text-base dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100"
    >
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        aria-hidden="true"
        className="mt-1 shrink-0 text-base text-amber-600 dark:text-amber-400 sm:text-lg"
      />
      <p className="font-Cairo">{t.workInProgress}</p>
    </div>
  );
}