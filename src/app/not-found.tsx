"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import ErrorMessage from '@/components/common/ErrorMessage';
import Button from '@/components/common/Button';

export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-white dark:bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-16">
        <ErrorMessage title={t.notFound.title} description={t.notFound.description} />
        <div className="flex justify-center mt-6">
          <Button href="/" variant="primary">
            <FontAwesomeIcon icon={faHouse} />
            {t.notFound.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
