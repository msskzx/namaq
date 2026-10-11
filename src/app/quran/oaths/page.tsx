import type { Metadata } from 'next';
import { buildOaths } from '@/lib/quran/oaths';
import data from './ayat.json';
import OathsView from './OathsView';

export const metadata: Metadata = {
  title: 'الأقسام في القرآن: من الجزء ٢٥ إلى ٣٠',
};

export default function QuranOathsPage() {
  const { oaths, lines } = buildOaths(data);
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">الأقسام في القرآن: من الجزء ٢٥ إلى ٣٠</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. لكل قسم محطة بآياته دون جوابه. وكل خط ملوّن يصل الأقسام التي تكرر فيها لفظ واحد من المقسَم به، فالجمع بالألفاظ لا بمعانٍ نضيفها. وما أقسم الله به بوصف بلا اسم، كالذاريات والمرسلات والنازعات والعاديات، يبقى بألفاظه ولا نقول ما هو، فذلك من التفسير. في «لا أقسم» (القيامة ١) قراءة أخرى لم تدخل هنا.
        </p>
      </header>
      <OathsView oaths={oaths} lines={lines} />
    </div>
  );
}
