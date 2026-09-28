"use client";

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import ErrorMessage from '@/components/common/ErrorMessage';
import Button from '@/components/common/Button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-16">
        <ErrorMessage title={t.errorPage.title} description={t.errorPage.description} />
        <div className="flex justify-center gap-3 mt-6">
          <Button onClick={reset} variant="primary">
            <FontAwesomeIcon icon={faRotateLeft} />
            {t.errorPage.tryAgain}
          </Button>
          <Button href="/" variant="outline">
            <FontAwesomeIcon icon={faHouse} />
            {t.errorPage.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
