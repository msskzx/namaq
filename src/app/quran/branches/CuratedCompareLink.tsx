'use client';

import { Columns2 } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';

export default function CuratedCompareLink() {
  const ar = useLanguage().language === 'ar';
  return <Button href="/quran/compare" size="sm"><Columns2 size={16} aria-hidden />{ar ? 'مقارنة المقاطع' : 'Passage comparisons'}</Button>;
}
