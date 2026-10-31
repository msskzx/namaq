'use client';

import { useLanguage } from '@/components/language/LanguageContext';
import RangeFilter from '@/components/quran/RangeFilter';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import { JUZ_STARTS, type JuzRange } from '@/lib/quran/juz';

export default function JuzFilter({ range, phrase, view }: { range: JuzRange | null; phrase: string; view: BranchesView }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return (
    <RangeFilter iconOnly range={range} max={JUZ_STARTS.length} names={['juzFrom', 'juzTo']} href={next => branchesHref(phrase, next, { ...view, page: 1 })}
      labels={{
        from: ar ? 'من الجزء' : 'From juz',
        to: ar ? 'إلى الجزء' : 'To juz',
        all: ar ? 'كل الأجزاء' : 'All juz',
        form: ar ? 'نطاق الأجزاء' : 'Juz range',
        invalid: shown => (ar
          ? `أدخل جزأين من ١ إلى ٣٠، على أن تكون البداية قبل النهاية أو مساوية لها. النتائج المعروضة ما زالت للأجزاء ${shown.from} إلى ${shown.to}.`
          : `Enter whole numbers from 1 to 30, with From no greater than To. Results still show juz ${shown.from} to ${shown.to}.`),
      }} />
  );
}
