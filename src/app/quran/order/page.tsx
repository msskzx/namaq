import type { Metadata } from 'next';
import { buildOrder } from '@/lib/quran/surahOrder';
import data from './ayat.json';
import OrderView from './OrderView';

export const metadata: Metadata = {
  title: 'ترتيب السور: من فصلت إلى الناس',
};

export default function QuranOrderPage() {
  const { chips, hops } = buildOrder(data);
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">ترتيب السور: من فصلت إلى الناس</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. نقترح لكل سورة من الجزء الخامس والعشرين إلى الثلاثين صلة بالتي بعدها، ولعل حفظ الصلة يعين على حفظ الترتيب. يبدأ الجزء الخامس والعشرون من فصلت ٤٧، والقائمة تذكر فصلت كلها. محور السورة من مصدر لسور الجزء الثلاثين وحده، وصلات سور الأجزاء قبله بلا مصدر. وللأقسام صفحة في «الأقسام في القرآن» تصلها بألفاظها.
        </p>
      </header>
      <OrderView chips={chips} hops={hops} />
    </div>
  );
}
