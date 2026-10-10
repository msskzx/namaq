import type { Metadata } from 'next';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { buildCurated, USED_MODES } from '@/lib/quran/curatedShifts';
import data from './ayat.json';
import IltifatView from './IltifatView';

export const metadata: Metadata = {
  title: 'التفات: تحولات مختارة (تجريبي)',
};

export default function QuranIltifatPage() {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl">التفات: تحولات مختارة</h1>
          <Badge text="تجريبي" color="amber" size="sm" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          عرض تجريبي لم يراجعه أحد من أهل العلم. النص برواية حفص. كل لون نوع من الضمير، واللون نفسه للنوع نفسه في كل الأمثلة.
        </p>
        <Button size="sm" variant="outline" href="/quran/shifts">
          <FontAwesomeIcon icon={faRepeat} />
          تحولات داخل السورة
        </Button>
      </header>
      <IltifatView curated={buildCurated(data)} modes={USED_MODES} />
    </div>
  );
}
