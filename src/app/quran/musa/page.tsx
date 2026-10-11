import type { Metadata } from 'next';
import { buildMusa } from '@/lib/quran/musa';
import data from './ayat.json';
import MusaView from './MusaView';

export const metadata: Metadata = {
  title: 'خط موسى عليه السلام الزمني في القرآن',
};

export default function QuranMusaPage() {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">خط موسى عليه السلام الزمني في القرآن</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. لكل حدث محطة على الخط، تبدأ من اليمين، وفيها آياته من كل السور. المحطات في خمس مجموعات: النشأة، والرسالة، والخروج، وقومه بنو إسرائيل، وعلمه وكتابه. وفيها كل آية ذُكر فيها موسى أو فرعون أو هامان. وترتيب المحطات في كل مجموعة، وما لا تحدد الآيات موضعه كالبقرة وقارون، من عملنا. وكذلك تقسيم الآيات على الأحداث، وقد تدخل آية في حدث ولها صلة بغيره.
        </p>
      </header>
      <MusaView events={buildMusa(data)} />
    </div>
  );
}
