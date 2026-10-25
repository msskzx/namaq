"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import Button from '@/components/common/Button';
import NotFoundMark from '@/components/common/NotFoundMark';

export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[var(--home-paper)] text-[var(--home-ink)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full px-4 py-16 flex flex-col items-center gap-3 text-center">
        <NotFoundMark className="w-72 max-w-full h-auto" />
        <h1 className="mt-4 text-3xl font-bold">{t.notFound.title}</h1>
        <p className="text-lg text-[var(--home-muted)]">{t.notFound.description}</p>
        <div className="mt-3">
          <Button href="/" variant="primary">
            <FontAwesomeIcon icon={faHouse} />
            {t.notFound.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
