'use client';

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import { useLanguage } from '@/components/language/LanguageContext';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

export default function JumpForm({ page }: { page?: number }) {
  const router = useNavigatingRouter();
  const { language, languageLoaded } = useLanguage();
  const ar = !languageLoaded || language === 'ar';
  return (
    <form
      className="flex items-center justify-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const page = Number(new FormData(event.currentTarget).get('page'));
        if (Number.isInteger(page) && page >= 1 && page <= 604) router.push(`/quran/read/${page}`);
      }}
    >
      <NumberInput key={page} name="page" label={ar ? 'رقم الصفحة' : 'Page number'} min={1} max={604} defaultValue={page} />
      <Button size="sm" type="submit">
        <FontAwesomeIcon icon={faLocationArrow} aria-hidden />
        <span className="max-sm:sr-only">{ar ? 'اذهب إلى الصفحة' : 'Go to page'}</span>
      </Button>
    </form>
  );
}
