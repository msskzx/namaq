import type { Metadata } from 'next';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/common/Button';
import { buildOrder } from '@/lib/quran/surahOrder';
import data from './ayat.json';
import OrderView from './OrderView';

export const metadata: Metadata = {
  title: 'ترتيب السور: من النبأ إلى الناس',
};

export default function QuranOrderPage() {
  const { chips, hops } = buildOrder(data);
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">ترتيب السور: من النبأ إلى الناس</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. لكل سورة في الجزء الثلاثين صلة بالتي بعدها، وفي حفظ الصلة عون على حفظ الترتيب.
        </p>
        <Button size="sm" variant="outline" href="/quran/iltifat">
          <FontAwesomeIcon icon={faShuffle} />
          التفات: تحولات مختارة
        </Button>
      </header>
      <OrderView chips={chips} hops={hops} />
    </div>
  );
}
