'use client';

import React, { useId, useState } from 'react';
import { TextSearch } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';

// docs/plans/quran-shared-openings.md
export default function Spellings({ children, list }: { children: React.ReactNode; list: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { language } = useLanguage();
  const label = language === 'ar'
    ? (open ? 'إخفاء صيغ الكتابة الأصلية' : 'عرض صيغ الكتابة الأصلية')
    : (open ? 'Hide original spellings' : 'Show original spellings');
  return (
    <>
      {children}
      <span className="mt-1 flex flex-col items-start gap-2">
        <Button size="sm" variant="outline" aria-expanded={open} aria-controls={id} aria-label={label} title={label} onClick={() => setOpen(!open)}>
          <TextSearch size={16} aria-hidden />
        </Button>
        {open && <span id={id}>{list}</span>}
      </span>
    </>
  );
}
